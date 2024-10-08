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

// Code ------------------------------------------------------------

// Add JSON library for parsing JSON data
#include <jansson.h> 

// Add libcurl for HTTP requests (lightweight HTTP client library)
#include <curl/curl.h>

// ------------------------------------------------------------------

typedef struct channel_identifier {
    char* topic;
    char* source;
} channel_identifier_t;

static void on_connection_error(mdb_error_t* error, void* user_data) {
    (void)user_data;

    syslog(LOG_ERR, "Got connection error: %s, Aborting...", error->message);
    abort();
}

// Code ----------------------------------------------------------------

// Function to handle the response from the HTTP request
static size_t write_callback(void *contents, size_t size, size_t nmemb, void *userp) {
    (void)contents; // Suppress unused parameter warning
    (void)userp;    // Suppress unused parameter warning
    
    // This callback is needed by curl, but we don't need to do anything with the response
    return size * nmemb;
}

// Function to send HTTP POST request to the specified URL with the JSON data
static void send_http_request(const char* url, const char* data) {
    
    // Initialize curl
    CURL *curl;
    CURLcode res;

    curl = curl_easy_init();
    if(curl) {
        struct curl_slist *headers = NULL;
        headers = curl_slist_append(headers, "Accept: application/json");
        headers = curl_slist_append(headers, "Content-Type: application/json");

        // Set the URL and data for the HTTP POST request
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);

        // Perform the HTTP POST request
        res = curl_easy_perform(curl);
        if(res != CURLE_OK)
            syslog(LOG_ERR, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));

        // Clean up
        curl_easy_cleanup(curl);
    }
}

// Method to parse the JSON payload and extract "type" and "score" from the first class
static bool parse_json_payload(const mdb_message_payload_t* payload, char** type_value, double* score_value) {
    // Parse JSON payload into a JSON object: root, using Jansson library
    json_error_t error;
    json_t* root = json_loadb((const char*)payload->data, payload->size, 0, &error);
    
    // Check if the JSON object was created successfully
    if (!root) {
        syslog(LOG_ERR, "JSON parsing error: %s", error.text);
        return false; // Error in JSON parsing
    }

    // Extract classes array
    json_t* classes = json_object_get(root, "classes");
    if (json_is_array(classes) && json_array_size(classes) > 0) {
        
        // Get the first class in the classes array
        json_t* first_class = json_array_get(classes, 0);
        
        // Extract score and type from the first class
        json_t* score = json_object_get(first_class, "score");
        json_t* type = json_object_get(first_class, "type");
        
        // Check if score and type are valid
        if (json_is_real(score) && json_is_string(type)) {
<<<<<<< HEAD
            *score_value = json_real_value(score);
            *type_value = strdup(json_string_value(type)); // Duplicate string to return
            json_decref(root); // Clean up
            return true; // Success
=======
            double score_value = json_real_value(score);
            const char* type_value = json_string_value(type);
            
            // Log the detected object information
            syslog(LOG_INFO,
                   "Detected object - Topic: %s, Source: %s, Time: %lld.%.9ld, Type: %s, Score: %.4f",
                   channel_identifier->topic,
                   channel_identifier->source,
                   (long long)timestamp->tv_sec,
                   timestamp->tv_nsec,
                   type_value,
                   score_value);

            // Prepare data for HTTP request
            char data[256];
            snprintf(data, sizeof(data), 
                     "topic=%s&source=%s&time=%lld.%.9ld&type=%s&score=%.4f",
                     channel_identifier->topic,
                     channel_identifier->source,
                     (long long)timestamp->tv_sec,
                     timestamp->tv_nsec,
                     type_value,
                     score_value);

            // Send HTTP request
            send_http_request("http://192.168.1.123:5000/camera/data", data); // TODO: Change to the correct IP address

            // The output of the HTTP request will look like this:
            // topic=com.axis.consolidated_track.v1.beta&source=1&time=1234567890.123456789&type=person&score=0.9876

            // Add error handling for the HTTP request
            // ...
>>>>>>> 0b8417a63635189f0371185b582e6eadf88828d3
        }
    }

    json_decref(root); // Clean up in case of error
    return false; // Error if classes array is invalid or fields are missing
}


// Function to handle incoming object detection data from the Metadata Broker
static void on_message(const mdb_message_t* message, void* user_data) {
    
    // Get the timestamp and payload from the message. Payload is the JSON data.
    const struct timespec* timestamp     = mdb_message_get_timestamp(message);
    const mdb_message_payload_t* payload = mdb_message_get_payload(message);
    
    // Get the channel identifier from the user data
    channel_identifier_t* channel_identifier = (channel_identifier_t*)user_data;
    
     // Variables for parsed data
    char* type_value = NULL;
    double score_value = 0.0;

     // Parse the JSON payload
    if (parse_json_payload(payload, &type_value, &score_value)) {        
           // Log the detected object information
        syslog(LOG_INFO,
                "Detected object - Topic: %s, Source: %s, Time: %lld.%.9ld, Type: %s, Score: %.4f",
                channel_identifier->topic,
                channel_identifier->source,
                (long long)timestamp->tv_sec,
                timestamp->tv_nsec,
                type_value,
                score_value);

        // Prepare data for HTTP request, Create a JSON object
        json_t* json_data = json_object();
        json_object_set_new(json_data, "topic", json_string(channel_identifier->topic));
        json_object_set_new(json_data, "source", json_string(channel_identifier->source));
        json_object_set_new(json_data, "time_sec", json_integer((long long)timestamp->tv_sec));
        json_object_set_new(json_data, "time_nsec", json_integer(timestamp->tv_nsec));
        json_object_set_new(json_data, "type", json_string(type_value));
        json_object_set_new(json_data, "score", json_real(score_value));

        // Convert the JSON object to a string
        char* json_str = json_dumps(json_data, JSON_ENCODE_ANY);

        // Send HTTP request
        send_http_request("http://192.168.1.123:5000/camera/dataM", json_str); // TODO: Change to the correct IP address

        // The output of the HTTP request will look like this:
        // topic=com.axis.consolidated_track.v1.beta&source=1&time=1234567890.123456789&type=person&score=0.9876

        // Add error handling for the HTTP request
        // ...
    }
} 
    
// ------------------------------------------------------------------


static void on_done_subscriber_create(const mdb_error_t* error, void* user_data) {
    if (error != NULL) {
        syslog(LOG_ERR, "Got subscription error: %s, Aborting...", error->message);
        abort();
    }
    channel_identifier_t* channel_identifier = (channel_identifier_t*)user_data;

    syslog(LOG_INFO,
           "Subscribed to %s (%s)...",
           channel_identifier->topic,
           channel_identifier->source);
}

static void sig_handler(int signum) {
    (void)signum;
    // Do nothing, just let pause in main return.
}

int main(int argc, char** argv) {
    (void)argc;
    (void)argv;

    // Initialize libcurl
    curl_global_init(CURL_GLOBAL_ALL);

    syslog(LOG_INFO, "Subscriber started...");

    // source corresponds to the video channel number, should be 1
    channel_identifier_t channel_identifier    = {.topic =
                                                      "com.axis.consolidated_track.v1.beta",
                                                  .source = "1"};
    mdb_error_t* error                         = NULL;
    mdb_subscriber_config_t* subscriber_config = NULL;
    mdb_subscriber_t* subscriber               = NULL;
    syslog(LOG_INFO,"%s", channel_identifier.topic);

    mdb_connection_t* connection = mdb_connection_create(on_connection_error, NULL, &error);
    if (error != NULL) {
        goto end;
    }

    subscriber_config = mdb_subscriber_config_create(channel_identifier.topic,
                                                     channel_identifier.source,
                                                     on_message,
                                                     &channel_identifier,
                                                     &error);
    if (error != NULL) {
        goto end;
    }

    subscriber = mdb_subscriber_create_async(connection,
                                             subscriber_config,
                                             on_done_subscriber_create,
                                             &channel_identifier,
                                             &error);
    if (error != NULL) {
        goto end;
    }

    // Add signal handler to allow for cleanup on ordered termination.
    (void)signal(SIGTERM, sig_handler);

    pause();

end:
    if (error != NULL) {
        syslog(LOG_ERR, "%s", error->message);
    }

    mdb_error_destroy(&error);
    mdb_subscriber_config_destroy(&subscriber_config);
    mdb_subscriber_destroy(&subscriber);
    mdb_connection_destroy(&connection);

    syslog(LOG_INFO, "Subscriber closed...");

    // Cleanup libcurl
    curl_global_cleanup();

    return 0;
}
