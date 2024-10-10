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
#include <jansson.h>  // For JSON handling
#include <curl/curl.h> // For HTTP requests

// ------------------------------------------------------------------

// Structure to hold channel topic and source info
typedef struct channel_identifier {
    char* topic;
    char* source;
} channel_identifier_t;

static void on_connection_error(mdb_error_t* error, void* user_data) {
    (void)user_data;
    syslog(LOG_ERR, "Got connection error: %s, Aborting...", error->message);
    abort();
}

// ------------------------------------------------------------------
// Function to handle the response from HTTP requests
static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp) {
    (void)contents; // Suppress unused parameter warning
    (void)userp;    // Suppress unused parameter warning
    return size * nmemb;
}

// // Function to send HTTP POST request to the specified URL with the JSON data
// static void send_http_request(const char* url, const char* data) {
//     CURL *curl;
//     CURLcode res;

//     curl = curl_easy_init();
//     if(curl) {
//         struct curl_slist *headers = NULL;
//         headers = curl_slist_append(headers, "Accept: application/json");
//         headers = curl_slist_append(headers, "Content-Type: application/json");

//         curl_easy_setopt(curl, CURLOPT_URL, url);
//         curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
//         curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
//         curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

//         res = curl_easy_perform(curl);
//         if(res != CURLE_OK)
//             syslog(LOG_ERR, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

//         curl_easy_cleanup(curl);
//     }
// }

// Method to parse the JSON payload and extract "type" and "score" from the first class
static bool parse_json_payload(const mdb_message_payload_t* payload, char** type_value, double* score_value) {
    json_error_t error;
    json_t* root = json_loadb((const char*)payload->data, payload->size, 0, &error);

    if (!root) {
        syslog(LOG_ERR, "JSON parsing error: %s", error.text);
        return false; // Error in JSON parsing
    }

    json_t* classes = json_object_get(root, "classes");
    if (json_is_array(classes) && json_array_size(classes) > 0) {
        json_t* first_class = json_array_get(classes, 0);
        json_t* score = json_object_get(first_class, "score");
        json_t* type = json_object_get(first_class, "type");

        if (json_is_real(score) && json_is_string(type)) {
            *score_value = json_real_value(score);
            *type_value = strdup(json_string_value(type)); // Duplicate string to return
            json_decref(root); // Clean up
            return true; // Success
        }
    }

    json_decref(root); // Clean up in case of error
    return false; // Error if classes array is invalid or fields are missing
}

// Function to enable the best snapshot feature by sending an HTTP request (using Basic Authentication)
static void enable_best_snapshot(void) {
    const char* url = "http://192.168.1.116/config/rest/best-snapshot/v1/enabled"; // Use actual camera IP
    const char* data = "{\"data\":true}"; // JSON payload to enable best snapshot
    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();
    if(curl) {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Accept: application/json");
        headers = curl_slist_append(headers, "Content-Type: application/json");

        // Set Basic Authentication (instead of Digest)
        curl_easy_setopt(curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_easy_setopt(curl, CURLOPT_USERNAME, "root"); // Replace with your username
        curl_easy_setopt(curl, CURLOPT_PASSWORD, "secure"); // Replace with your password

        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "PUT");  // Use PUT as per the documentation
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            syslog(LOG_ERR, "Failed to enable best snapshot: %s", curl_easy_strerror(res));

        curl_easy_cleanup(curl);
    }
}

// Function to retrieve the best snapshot from the camera (using Basic Authentication)
static void retrieve_best_snapshot(char* snapshot_data, size_t snapshot_data_size) {
    (void)snapshot_data_size;
    const char* url = "http://192.168.1.116/config/rest/best-snapshot/v1/snapshot"; // Use actual camera IP
    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();
    if(curl) {
        // Set Basic Authentication (instead of Digest)
        curl_easy_setopt(curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_easy_setopt(curl, CURLOPT_USERNAME, "root"); // Replace with your username
        curl_easy_setopt(curl, CURLOPT_PASSWORD, "secure"); // Replace with your password

        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *)snapshot_data);
        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            syslog(LOG_ERR, "Failed to retrieve best snapshot: %s", curl_easy_strerror(res));
        curl_easy_cleanup(curl);
    }
}

// Function to send metadata to the external server
static void send_metadata(const char* metadata) {
    const char* url = "http://192.168.1.113:5000/camera/data_JSON"; // Use your server's metadata endpoint

    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, metadata);

        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            syslog(LOG_ERR, "Failed to send metadata: %s", curl_easy_strerror(res));

        curl_easy_cleanup(curl);
    }
}

// Function to send snapshot to the external server
static void send_snapshot(const char* snapshot_data) {
    const char* url = "http://192.168.1.113:5000/camera/data_JSON"; // Use your server's snapshot endpoint

    CURL *curl;
    CURLcode res;
    curl = curl_easy_init();
    if(curl) {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/octet-stream");

        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, snapshot_data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            syslog(LOG_ERR, "Failed to send snapshot: %s", curl_easy_strerror(res));

        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
}

// Function to handle incoming object detection data from the Metadata Broker
static void on_message(const mdb_message_t* message, void* user_data) {
    const struct timespec* timestamp = mdb_message_get_timestamp(message);
    const mdb_message_payload_t* payload = mdb_message_get_payload(message);

    channel_identifier_t* channel_identifier = (channel_identifier_t*)user_data;

    char* type_value = NULL;
    double score_value = 0.0;

    if (parse_json_payload(payload, &type_value, &score_value)) {
        syslog(LOG_INFO,
               "Detected object - Topic: %s, Source: %s, Time: %lld.%.9ld, Type: %s, Score: %.4f",
               channel_identifier->topic,
               channel_identifier->source,
               (long long)timestamp->tv_sec,
               timestamp->tv_nsec,
               type_value,
               score_value);

        // Create JSON object for metadata
        json_t* json_data = json_object();
        json_object_set_new(json_data, "topic", json_string(channel_identifier->topic));
        json_object_set_new(json_data, "source", json_string(channel_identifier->source));
        json_object_set_new(json_data, "time_sec", json_integer((long long)timestamp->tv_sec));
        json_object_set_new(json_data, "time_nsec", json_integer(timestamp->tv_nsec));
        json_object_set_new(json_data, "type", json_string(type_value));
        json_object_set_new(json_data, "score", json_real(score_value));

        // Convert JSON to string
        char* metadata_str = json_dumps(json_data, JSON_ENCODE_ANY);

        // Enable best snapshot
        enable_best_snapshot();

        // Buffer to hold the snapshot data
        char snapshot_data[65536]; 
        retrieve_best_snapshot(snapshot_data, sizeof(snapshot_data));

        // Log the metadata and snapshot data
        syslog(LOG_INFO, "Metadata: %s", metadata_str);
        syslog(LOG_INFO, "Snapshot data: %s", snapshot_data);

        // Send metadata and snapshot separately
        send_metadata(metadata_str);
        send_snapshot(snapshot_data);

        free(metadata_str);
        free(type_value); // Free the duplicated string
        json_decref(json_data); // Clean up the JSON object
    }
}

// ------------------------------------------------------------------

static void on_done_subscriber_create(const mdb_error_t* error, void* user_data) {
    if (error != NULL) {
        syslog(LOG_ERR, "Got subscription error: %s, Aborting...", error->message);
        abort();
    }
    channel_identifier_t* channel_identifier = (channel_identifier_t*)user_data;
    syslog(LOG_INFO, "Subscribed to %s (%s)...", channel_identifier->topic, channel_identifier->source);
}

static void sig_handler(int signum) {
    (void)signum;
}

int main(int argc, char** argv) {
    (void)argc;
    (void)argv;

    curl_global_init(CURL_GLOBAL_ALL);
    syslog(LOG_INFO, "Subscriber started...");

    // source corresponds to the video channel number, should be 1
    channel_identifier_t channel_identifier = {
        .topic = "com.axis.consolidated_track.v1.beta",
        .source = "1"
    };

    mdb_error_t* error = NULL;
    mdb_subscriber_config_t* subscriber_config = NULL;
    mdb_subscriber_t* subscriber = NULL;

    mdb_connection_t* connection = mdb_connection_create(on_connection_error, NULL, &error);
    if (error != NULL) goto end;

    subscriber_config = mdb_subscriber_config_create(channel_identifier.topic,
                                                     channel_identifier.source,
                                                     on_message,
                                                     &channel_identifier,
                                                     &error);
    if (error != NULL) goto end;

    subscriber = mdb_subscriber_create_async(connection, subscriber_config, on_done_subscriber_create, &channel_identifier, &error);
    if (error != NULL) goto end;

    signal(SIGTERM, sig_handler);
    pause();

end:
    if (error != NULL) syslog(LOG_ERR, "%s", error->message);

    mdb_error_destroy(&error);
    mdb_subscriber_config_destroy(&subscriber_config);
    mdb_subscriber_destroy(&subscriber);
    mdb_connection_destroy(&connection);

    syslog(LOG_INFO, "Subscriber closed...");
    curl_global_cleanup();

    return 0;
}
