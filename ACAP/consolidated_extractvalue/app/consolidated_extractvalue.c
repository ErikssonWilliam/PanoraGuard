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

typedef struct channel_identifier {
    char* topic;
    char* source;
} channel_identifier_t;

bool extract_value(const char* json_str, const char* key, char* output, size_t output_size);
void extract_classes(const char* json_str, char* class_type, char* class_score);

static void on_connection_error(mdb_error_t* error, void* user_data) {
    (void)user_data;

    syslog(LOG_ERR, "Got connection error: %s, Aborting...", error->message);
    abort();
}

// Function to extract a value from a JSON string by its key
bool extract_value(const char* json_str, const char* key, char* output, size_t output_size) {
    char* key_loc = strstr(json_str, key);
    if (key_loc) {
        key_loc = strchr(key_loc, ':') + 2;  // Move past the ": "
        char* value_end = strchr(key_loc, ',');
        if (value_end == NULL) {
            value_end = strchr(key_loc, '}');
        }
        
        if (value_end) {
            size_t value_length = value_end - key_loc;
            if (value_length >= output_size) {
                // Handle case where output buffer is not large enough
                return false; // Indicate failure
            }
            strncpy(output, key_loc, value_length);
            output[value_length] = '\0'; // Null terminate the output string
            return true; // Indicate success
        }
    }
    return false; // Key not found
}

// Function to extract class type and class score from JSON string
void extract_classes(const char* json_str, char* class_type, char* class_score) {
    // Try to extract class type
    if (!extract_value(json_str, "\"type\"", class_type, 20)) {
        // Handle case where class type is not found
        strcpy(class_type, "N/A"); // Or set to an appropriate default value
    }

    // Try to extract class score
    if (!extract_value(json_str, "\"score\"", class_score, 10)) {
        // Handle case where class score is not found
        strcpy(class_score, "N/A"); // Or set to an appropriate default value
    }
}

static void on_message(const mdb_message_t* message, void* user_data) {
    const struct timespec* timestamp     = mdb_message_get_timestamp(message);
    const mdb_message_payload_t* payload = mdb_message_get_payload(message);
    //payload is the data, it follows a JSON schema, see link
    //https://axiscommunications.github.io/acap-documentation/docs/api/src/api/metadata-broker/html/standard_topics.html
    
    channel_identifier_t* channel_identifier = (channel_identifier_t*)user_data;
    
    char class_type[10]; // Adjust size as needed
    char class_score[10]; // Adjust size as needed

    const char* json_string = (const char*)payload->data;

    extract_classes(json_string, class_type, class_score);
    
    if (strcmp(class_type, "N/A") != 0 && strcmp(class_score, "N/A") != 0) {
        syslog(LOG_INFO,
           "message received from topic: %s on source: %s: Monotonic time - "
           "%lld.%.9ld. Class Type - %s, Class Score - %s",
           channel_identifier->topic,
           channel_identifier->source,
           (long long)timestamp->tv_sec,
           timestamp->tv_nsec,
           class_type, class_score); 
    }
    
}

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

    return 0;
}
