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

// Define constants
#define EXTERNAL_URL "http://192.168.1.135:5000/processing/camera/data_JSON" // For external server
#define ENABLE_SNAPSHOT_URL "http://192.168.1.116/config/rest/best-snapshot/v1/enabled" // For camera api endpoint
// -----------------------------------------

// Structure to hold channel topic and source info
typedef struct channel_identifier
{
    char *topic;
    char *source;
} channel_identifier_t;

static void on_connection_error(mdb_error_t *error, void *user_data)
{
    (void)user_data;
    syslog(LOG_ERR, "Got connection error: %s, Aborting...", error->message);
    abort();
}

// Code ------------------------------------------------------------------

// Function to handle the response from the HTTP request
static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp)
{
    (void)userp;
    size_t total_size = size * nmemb;
    syslog(LOG_INFO, "Response from camera: %.*s", (int)total_size, (char *)contents);
    return total_size;
}

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

static bool parse_json_payload(const mdb_message_payload_t *payload, char **type_value, double *score_value, char **image_value, char **time)
{
    json_error_t error;
    json_t *root = json_loadb((const char *)payload->data, payload->size, 0, &error);

    if (!root)
    {
        syslog(LOG_ERR, "JSON parsing error: %s", error.text);
        return false; 
    }

    //retrive score and type from "classes"
    json_t *classes = json_object_get(root, "classes");
    if(!json_is_array(classes) || json_array_size(classes) = 0){
        syslog(LOG_ERR, "JSON parsing error: No classes object in alarm data");
        json_decref(root);
        return false; 
    }

    json_t *first_class = json_array_get(classes, 0);
    json_t *score = json_object_get(first_class, "score");

    if(!json_is_real(score)){
        syslog(LOG_ERR, "JSON parsing error: No object score found");
        json_decref(root);
        return false;
    }
    *score_value = json_real_value(score);

    json_t *type = json_object_get(first_class, "type");
    if(!json_is_string(type)){
        syslog(LOG_ERR, "JSON parsing error: No object type found");
        json_decref(root);
        return false;
    }

    *type_value = strdup(json_string_value(type));

    json_t *image = json_object_get(root, "image");
    if(!json_is_object(image)){
        syslog(LOG_ERR, "JSON parsing error: No image object in alarm data");
        json_decref(root);
        return false;
    }

    json_t *data = json_object_get(image, "data");
    if(!json_is_string(data)){
        syslog(LOG_ERR, "JSON parsing error: No image data found in alarm data");
        json_decref(root);
        return false;
    }
    *image_value = strdup(json_string_value(data));

    json_t *t = json_object_get(root, "end_time");
    if(!json_is_string(t)){
        syslog(LOG_ERR, "JSON parsing error: No timestamp found in alarm data");
        json_decref(root);
        return false;
    }
    *time = strdup(json_string_value(t));

    json_decref(root);
    return true;
}

static void on_message(const mdb_message_t *message, void *user_data)
{
    const struct timespec *timestamp = mdb_message_get_timestamp(message);
    const mdb_message_payload_t *payload = mdb_message_get_payload(message);
    channel_identifier_t *channel_identifier = (channel_identifier_t *)user_data;

    // Variables for parsed data
    char *type_value = NULL;
    double score_value = 0.0;
    char *image_value = NULL;
    char *time = NULL;

    bool res = parse_json_payload(payload, &type_value, &score_value, &image_value, time);
    if (res)
    {
        // Log the detected object information
        syslog(LOG_INFO,
               "Detected object - Topic: %s, Source: %s, Time: %lld.%.9ld, Type: %s, Score: %.4f, Image Data: %s",
               channel_identifier->topic,
               channel_identifier->source,
               (long long)timestamp->tv_sec,
               timestamp->tv_nsec,
               type_value,
               score_value,
               image_value);

        // Prepare data for HTTP request, Create a JSON object
        json_t *json_data = json_object();
        //json_object_set_new(json_data, "topic", json_string(channel_identifier->topic));
        //json_object_set_new(json_data, "source", json_string(channel_identifier->source));
        //json_object_set_new(json_data, "time_sec", json_integer((long long)timestamp->tv_sec));
        //json_object_set_new(json_data, "time_nsec", json_integer(timestamp->tv_nsec));
        //json_object_set_new(json_data, "type", json_string(type_value));
        json_object_set_new(json_data, "confidence_score", json_real(score_value));
        json_object_set_new(json_data, "image_base64", json_string(image_value));
        json_object_set_new(json_data, "timestamp", json_string(time));
        //TODO: add camera_id

        char *json_str = json_dumps(json_data, JSON_ENCODE_ANY);
        post_to_external(json_str);

        // TODO:
        // We do not need to enable snapshot each time. One time is enough. However, what happens when we restart the camera...?
        // Enable best snapshot feature
        // enable_best_snapshot(); //function at end of file
        // syslog(LOG_INFO, "Attempted to enable best snapshot feature");

        free(json_str);
        json_decref(json_data);
        free(type_value);
        free(image_value);
    }
}

// ------------------------------------------------------------------

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

// // Function to enable the best snapshot feature by sending an HTTP request (using Basic Authentication)
// static void enable_best_snapshot(void) {
//     const char* url = "http://192.168.1.116/config/rest/best-snapshot/v1/enabled"; // Use actual camera IP
//     const char* data = "{\"data\":true}"; // JSON payload to enable best snapshot
//     CURL *curl;
//     CURLcode res;
//     curl = curl_easy_init();
//     if(curl) {
//         struct curl_slist *headers = NULL;
//         headers = curl_slist_append(headers, "Accept: application/json");
//         headers = curl_slist_append(headers, "Content-Type: application/json");

//         // Set Basic Authentication (instead of Digest)
//         curl_easy_setopt(curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
//         curl_easy_setopt(curl, CURLOPT_USERNAME, "root"); // Replace with your username
//         curl_easy_setopt(curl, CURLOPT_PASSWORD, "secure"); // Replace with your password

//         curl_easy_setopt(curl, CURLOPT_URL, url);
//         curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");  // Use PUT as per the documentation
//         curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
//         curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

//         // Capture the response data
//         char response_data[1024];  // Buffer to hold response
//         curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
//         curl_easy_setopt(curl, CURLOPT_WRITEDATA, response_data);

//         res = curl_easy_perform(curl);
//         if(res != CURLE_OK) {
//             syslog(LOG_ERR, "Failed to enable best snapshot: %s", curl_easy_strerror(res));
//         } else {
//             syslog(LOG_INFO, "Response from camera: %s", response_data);
//         }

//         curl_easy_cleanup(curl);
//     }
// }