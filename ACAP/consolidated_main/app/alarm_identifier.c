/**
 * Subscriber Application for Consolidated Track Messages
 *
 * This application listens to consolidated track messages from an MDB (Message Database)
 * system, processes them, and sends relevant data to an external server. It also configures
 * camera-specific settings such as enabling "best snapshot" mode.
 *
 * Functionality includes:
 *   - JSON payload parsing for alarm data.
 *   - Posting alarm information to an external server.
 *   - Managing VAPIX credentials for secure communication with Axis devices.
 *   - Graceful signal handling for process termination.
 */

#include <signal.h>
#include <stdio.h>
#include <string.h>
#include <sys/syslog.h>
#include <syslog.h>
#include <time.h>
#include <unistd.h>
#include <mdb/connection.h>
#include <mdb/error.h>
#include <mdb/subscriber.h>
#include <jansson.h>   // For JSON handling
#include <curl/curl.h> // For HTTP requests
#include <gio/gio.h>   // For D-Bus credentials

// Define constants
// #define CAMERA_ID "B8A44F9EEE36" // Serial number for camera at IP 121
#define CAMERA_ID "B8A44F9EEFE0" // Serial number for camera at IP 116
#define SERVER_URL "http://192.168.1.145:5100/alarms/redirect" // RUNNING LOCALLY: URL for sending alarms to local LAN server
// #define SERVER_URL "http://192.168.1.144:5100/alarms/redirect" // RUNNING IN CLOUD: URL for sending alarms to deployed LAN server with a static ip

#define ENABLE_SNAPSHOT_URL "http://127.0.0.12/config/rest/best-snapshot/v1/enabled" // Endpoint for enabling snapshots

/**
 * Structure to hold channel topic and source information.
 */
typedef struct channel_identifier
{
    char *topic;  ///< Message topic to subscribe to.
    char *source; ///< Source identifier for the message.
} channel_identifier_t;

/**
 * Callback for handling connection errors.
 *
 * Logs the error message and aborts the program.
 *
 * Parameters:
 *   error (mdb_error_t*): MDB error information.
 *   user_data (void*): User-specific data (unused in this callback).
 */
static void on_connection_error(mdb_error_t *error, void *user_data)
{
    (void)user_data; // Suppress unused parameter warning
    syslog(LOG_ERR, "Got connection error: %s, Aborting...", error->message);
    abort();
}

/**
 * Callback for writing HTTP response data.
 *
 * Logs the HTTP response received from the camera.
 *
 * Parameters:
 *   contents (void*): Response data buffer.
 *   size (size_t): Size of each data element.
 *   nmemb (size_t): Number of data elements.
 *   userp (void*): User data (unused here).
 *
 * Returns:
 *   size_t: Total size of processed data.
 */
static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp)
{
    (void)userp;
    size_t total_size = size * nmemb;
    syslog(LOG_INFO, "Response from camera: %.*s", (int)total_size, (char *)contents);
    return total_size;
}

/**
 * Sends JSON data to an external server.
 *
 * Utilizes cURL for sending HTTP POST requests.
 *
 * Parameters:
 *   data (const char*): JSON-formatted data to send.
 */
static void post_alarms(const char *data)
{
    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();
    if (curl)
    {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Accept: application/json");
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, SERVER_URL);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        // curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L); // detailed logging

        res = curl_easy_perform(curl);
        if (res != CURLE_OK)
            syslog(LOG_ERR, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

        curl_easy_cleanup(curl);
    }
}

/**
 * Parses JSON class data for type and confidence score.
 *
 * Parameters:
 *   first_class (const json_t*): JSON object representing the first class in the payload.
 *   type_value (char**): Pointer to store the detected type value.
 *   score_value (double*): Pointer to store the confidence score.
 *
 * Returns:
 *   bool: True if parsing is successful, false otherwise.
 */
static bool parse_class_data(const json_t *first_class, char **type_value, double *score_value)
{
    json_t *score = json_object_get(first_class, "score");
    if (!json_is_real(score))
    {
        syslog(LOG_ERR, "No valid score found.");
        return false;
    }
    *score_value = json_real_value(score);

    json_t *type = json_object_get(first_class, "type");
    if (!json_is_string(type))
    {
        syslog(LOG_ERR, "No valid type found.");
        return false;
    }
    *type_value = strdup(json_string_value(type));
    return true;
}

/**
 * Parses JSON image data to extract the image's base64 representation.
 *
 * Parameters:
 *   image (const json_t*): JSON object containing image data.
 *   image_value (char**): Pointer to store the base64-encoded image.
 *
 * Returns:
 *   bool: True if parsing is successful, false otherwise.
 */
static bool parse_image_data(const json_t *image, char **image_value)
{
    json_t *data = json_object_get(image, "data");

    if (!json_is_string(data))
    {
        syslog(LOG_ERR, "Missing image data.");
        return false;
    }

    *image_value = strdup(json_string_value(data));
    return true;
}

/**
 * Parses the JSON payload from an MDB message.
 *
 * Extracts type, confidence score, and image data.
 *
 * Parameters:
 *   payload (const mdb_message_payload_t*): The payload to parse.
 *   type_value (char**): Pointer to store the detected type.
 *   score_value (double*): Pointer to store the confidence score.
 *   image_value (char**): Pointer to store the base64-encoded image.
 *
 * Returns:
 *   bool: True if parsing is successful, false otherwise.
 */
static bool parse_json_payload(const mdb_message_payload_t *payload, char **type_value, double *score_value, char **image_value)
{
    json_error_t error;
    json_t *root = json_loadb((const char *)payload->data, payload->size, 0, &error);
    if (!root)
    {
        syslog(LOG_ERR, "JSON parsing error: %s", error.text);
        return false;
    }
    json_t *classes = json_object_get(root, "classes");
    if (!json_is_array(classes) || json_array_size(classes) == 0)
    {
        syslog(LOG_INFO, "No classes object in alarm data");
        json_decref(root);
        return false;
    }

    json_t *first_class = json_array_get(classes, 0);
    if (!first_class || !parse_class_data(first_class, type_value, score_value))
    {
        syslog(LOG_ERR, "Failed to parse class data.");
        json_decref(root);
        return false;
    }

    json_t *image = json_object_get(root, "image");
    if (!json_is_object(image) || !parse_image_data(image, image_value))
    {
        syslog(LOG_ERR, "Failed to parse image data.");
        json_decref(root);
        return false;
    }

    json_decref(root);
    return true;
}

/**
 * Callback for processing incoming MDB messages.
 *
 * Parses the payload, checks for relevant object types (e.g., "Face" or "Human"),
 * logs detected data, and sends it to an external server.
 *
 * Parameters:
 *   message (const mdb_message_t*): The incoming MDB message.
 *   user_data (void*): User-specific data, in this case, a channel_identifier_t struct.
 */
static void on_message(const mdb_message_t *message, void *user_data)
{
    const mdb_message_payload_t *payload = mdb_message_get_payload(message);
    channel_identifier_t *channel_identifier = (channel_identifier_t *)user_data;

    // Variables for parsed data
    char *type_value = NULL;
    double score_value = 0.0;
    char *image_value = NULL;

    // Parse JSON payload
    if (!parse_json_payload(payload, &type_value, &score_value, &image_value))
    {
        return;
    }

    // Filter out objects that are not of type "Face" or "Human"
    if (strcmp(type_value, "Face") != 0 && strcmp(type_value, "Human") != 0)
    {
        syslog(LOG_INFO, "Detected object of type: %s, no alarm will be raised", type_value);
        free(type_value);
        free(image_value);
        return;
    }

    // Log the detected object information
    syslog(LOG_INFO,
           "Detected object - Topic: %s, Source: %s, Type: %s, Score: %.4f, Image Data: %s, Camera ID: %s",
           channel_identifier->topic,
           channel_identifier->source,
           type_value,
           score_value,
           (strlen(image_value) > 0) ? "true" : "false",
           CAMERA_ID);

    // Create a JSON object to send to the external server
    json_t *json_data = json_pack("{s:f, s:s, s:s, s:s}",
                                  "confidence_score", score_value,
                                  "image_base64", image_value,
                                  "camera_id", CAMERA_ID,
                                  "type", type_value);

    // Convert JSON object to string
    char *json_str = json_dumps(json_data, JSON_ENCODE_ANY);
    post_alarms(json_str);

    // Free allocated resources
    free(json_str);
    json_decref(json_data);
    free(type_value);
    free(image_value);
}

/**
 * Callback for writing HTTP response data from snapshot-related requests.
 *
 * Parameters:
 *   contents (void*): Response data buffer.
 *   size (size_t): Size of each data element.
 *   nmemb (size_t): Number of data elements.
 *   userp (void*): User data (unused here).
 *
 * Returns:
 *   size_t: Total size of processed data.
 */
static size_t write_callback_snapshot(void *contents, size_t size, size_t nmemb, void *userp)
{
    (void)userp;
    size_t total_size = size * nmemb;
    syslog(LOG_INFO, "Enable snapshot callback responded: %.*s", (int)total_size, (char *)contents);
    return total_size;
}

/**
 * Parses D-Bus credentials from the result of a D-Bus call.
 *
 * Extracts and formats the credentials string as "id:password".
 *
 * Parameters:
 *   result (GVariant*): D-Bus call result containing credentials.
 *
 * Returns:
 *   char*: Formatted credentials string (must be freed by the caller).
 */
static char *parse_credentials(GVariant *result)
{
    char *credentials_string = NULL;
    char *id = NULL;
    char *password = NULL;

    g_variant_get(result, "(&s)", &credentials_string);
    char id_buffer[256], password_buffer[256];

    if (sscanf(credentials_string, "%255[^:]:%255s", id_buffer, password_buffer) != 2)
    {
        syslog(LOG_ERR, "Error parsing credential string '%s'", credentials_string);
        return NULL;
    }

    id = strdup(id_buffer);
    password = strdup(password_buffer);
    char *credentials = g_strdup_printf("%s:%s", id, password);

    free(id);
    free(password);
    return credentials;
}

/**
 * Retrieves VAPIX credentials from the D-Bus system.
 *
 * Fetches credentials for a specific username from a D-Bus VAPIX service.
 *
 * Parameters:
 *   username (const char*): The username for which to retrieve credentials.
 *
 * Returns:
 *   char*: Retrieved credentials (must be freed by the caller).
 */
static char *retrieve_vapix_credentials(const char *username)
{
    GError *error = NULL;
    GDBusConnection *connection = g_bus_get_sync(G_BUS_TYPE_SYSTEM, NULL, &error);

    if (!connection)
    {
        syslog(LOG_ERR, "Error connecting to D-Bus: %s", error->message);
        return NULL;
    }

    const char *bus_name = "com.axis.HTTPConf1";
    const char *object_path = "/com/axis/HTTPConf1/VAPIXServiceAccounts1";
    const char *interface_name = "com.axis.HTTPConf1.VAPIXServiceAccounts1";
    const char *method_name = "GetCredentials";

    GVariant *result = g_dbus_connection_call_sync(connection,
                                                   bus_name,
                                                   object_path,
                                                   interface_name,
                                                   method_name,
                                                   g_variant_new("(s)", username),
                                                   NULL,
                                                   G_DBUS_CALL_FLAGS_NONE,
                                                   -1,
                                                   NULL,
                                                   &error);

    if (!result)
    {
        syslog(LOG_ERR, "Error invoking D-Bus method: %s", error->message);
        return NULL;
    }

    char *credentials = parse_credentials(result);

    g_variant_unref(result);
    g_object_unref(connection);
    return credentials;
}

/**
 * Enables the "best snapshot" mode on the camera.
 *
 * Sends a PUT request with the appropriate payload to the camera's REST API.
 */
static void enable_best_snapshot(void)
{
    char *credentials = retrieve_vapix_credentials("user");
    const char *data = "{\"data\":true}"; // JSON payload to enable best snapshot
    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();

    if (curl)
    {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Accept: application/json");
        headers = curl_slist_append(headers, "Content-Type: application/json");

        // Set Basic Authentication
        curl_easy_setopt(curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_easy_setopt(curl, CURLOPT_USERPWD, credentials);

        curl_easy_setopt(curl, CURLOPT_URL, ENABLE_SNAPSHOT_URL);
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        // Capture the response data
        char response_data[1024]; // Buffer to hold response
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback_snapshot);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, response_data);

        res = curl_easy_perform(curl);

        if (res != CURLE_OK)
        {
            syslog(LOG_ERR, "Failed to enable best snapshot: %s", curl_easy_strerror(res));
        }
        else
        {
            syslog(LOG_INFO, "Response from camera: %s", response_data);
        }

        curl_easy_cleanup(curl);
    }
    free(credentials);
}

static void on_done_subscriber_create(const mdb_error_t *error, void *user_data)
{
    if (error != NULL)
    {
        syslog(LOG_ERR, "Got subscription error: %s, Aborting...", error->message);
        abort();
    }
    channel_identifier_t *channel_identifier = (channel_identifier_t *)user_data;
    syslog(LOG_INFO, "Subscribed to %s (%s)...", channel_identifier->topic, channel_identifier->source);
}

static void sig_handler(int signum)
{
    (void)signum;
}

int main(int argc, char **argv)
{
    (void)argc;
    (void)argv;

    curl_global_init(CURL_GLOBAL_ALL);
    syslog(LOG_INFO, "Subscriber started...");

    // source corresponds to the video channel number, should be 1
    channel_identifier_t channel_identifier = {
        .topic = "com.axis.consolidated_track.v1.beta",
        .source = "1"};

    mdb_error_t *error = NULL;
    mdb_subscriber_config_t *subscriber_config = NULL;
    mdb_subscriber_t *subscriber = NULL;

    mdb_connection_t *connection = mdb_connection_create(on_connection_error, NULL, &error);
    if (error != NULL)
        goto end;

    subscriber_config = mdb_subscriber_config_create(channel_identifier.topic,
                                                     channel_identifier.source,
                                                     on_message,
                                                     &channel_identifier,
                                                     &error);
    if (error != NULL)
        goto end;

    subscriber = mdb_subscriber_create_async(connection, subscriber_config, on_done_subscriber_create, &channel_identifier, &error);
    if (error != NULL)
        goto end;
    enable_best_snapshot();
    signal(SIGTERM, sig_handler);
    pause();

end:
    if (error != NULL)
        syslog(LOG_ERR, "%s", error->message);

    mdb_error_destroy(&error);
    mdb_subscriber_config_destroy(&subscriber_config);
    mdb_subscriber_destroy(&subscriber);
    mdb_connection_destroy(&connection);

    syslog(LOG_INFO, "Subscriber closed...");
    curl_global_cleanup();

    return 0;
}