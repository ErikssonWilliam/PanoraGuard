/*
This file provides the implementation of how the camera sends information to the rest of the system,
this is done thorugh a subscriber to an MDB-based message broker. 
It listens data recieved from the camera, processes received messages, and posts alarm data 
to an external server if certain conditions are met. Additionally, it configures and interacts 
with the camera for best snapshot functionality via HTTP requests.
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

// Code ------------------------------------
#include <jansson.h>   // For JSON handling
#include <curl/curl.h> // For HTTP requests
#include <gio/gio.h>   // For Dbus credentials

// Define constants
#define CAMERA_ID "B8A44F9EEE36" // Serial number for camera ip 121
// #define CAMERA_ID "B8A44F9EEFE0" //Serial nummber for camera ip 116
// #define EXTERNAL_URL "http://192.168.1.145:5000/alarms/add" // For local external server
#define EXTERNAL_URL "https://company3-externalserver.azurewebsites.net/alarms/add" // cloud external server

#define ENABLE_SNAPSHOT_URL "http://127.0.0.12/config/rest/best-snapshot/v1/enabled" // For enable snapshot endpoint

// -----------------------------------------

/*
Structure to hold channel topic and source info.
*/
typedef struct channel_identifier
{
    char *topic;
    char *source;
} channel_identifier_t;

/*
Function to handle MDB connection errors.
Logs the error message and aborts execution.

Parameters:
    error (mdb_error_t*): The error object received.
    user_data (void*): User-defined data, not used in this function.
*/
static void on_connection_error(mdb_error_t *error, void *user_data)
{
    (void)user_data;
    syslog(LOG_ERR, "Got connection error: %s, Aborting...", error->message);
    abort();
}

// ------------------------------------------------------------------

/*
Callback function for processing HTTP responses.
Logs the response received from the camera.

Parameters:
    contents (void*): Data buffer received in the response.
    size (size_t): Size of each data block.
    nmemb (size_t): Number of data blocks.
    userp (void*): User-defined data, not used in this function.

Returns:
    size_t: Total size of the processed data.
*/
static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp)
{
    (void)userp;

    size_t total_size = size * nmemb;
    syslog(LOG_INFO, "Response from camera: %.*s", (int)total_size, (char *)contents);
    return total_size;
}

/*
Function to send alarm data to an external server.

Parameters:
    data (const char*): JSON-formatted string containing the alarm data.
*/
static void post_to_external(const char *data)
{
    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();
    if (curl)
    {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Accept: application/json");
        headers = curl_slist_append(headers, "Content-Type: application/json");

        curl_easy_setopt(curl, CURLOPT_URL, EXTERNAL_URL);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

        res = curl_easy_perform(curl);
        if (res != CURLE_OK)
            syslog(LOG_ERR, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

        curl_easy_cleanup(curl);
    }
}

/*
Function to parse class data from the JSON payload.

Parameters:
    first_class (const json_t*): JSON object containing class data.
    type_value (char**): Pointer to store the parsed type.
    score_value (double*): Pointer to store the parsed score.

Returns:
    bool: True if parsing succeeds, false otherwise.
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

/*
Function to parse image data from the JSON payload.

Parameters:
    image (const json_t*): JSON object containing image data.
    image_value (char**): Pointer to store the parsed image data.

Returns:
    bool: True if parsing succeeds, false otherwise.
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

/*
Function to parse the JSON payload from the MDB message.

Parameters:
    payload (const mdb_message_payload_t*): Payload containing the raw JSON data.
    type_value (char**): Pointer to store the parsed object type.
    score_value (double*): Pointer to store the parsed confidence score.
    image_value (char**): Pointer to store the parsed image data.

Returns:
    bool: True if parsing succeeds, false otherwise.
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
        syslog(LOG_ERR, "JSON parsing error: No classes object in alarm data");
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
