/*
Steps to build ACAP
docker build --tag <Image Name>  .
docker create <Image Name>
docker cp <Image ID>:/opt/app ./build
copy .eap file from the build folder, and install it on the camera

To change the name of the ACAP:
1. Change the name of the app in the Makefile
2. Change the name of the app in the manifest.json
3. Change the name of the app in the .c file
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

// Add JSON library for parsing JSON data
#include <jansson.h> 

typedef struct channel_identifier {
    char* topic;
    char* source;
} channel_identifier_t;

static void on_connection_error(mdb_error_t* error, void* user_data) {
    (void)user_data;

    syslog(LOG_ERR, "Got connection error: %s, Aborting...", error->message);
    abort();
}

static void on_message(const mdb_message_t* message, void* user_data) {
    const struct timespec* timestamp     = mdb_message_get_timestamp(message);
    const mdb_message_payload_t* payload = mdb_message_get_payload(message);
    
    channel_identifier_t* channel_identifier = (channel_identifier_t*)user_data;
    
    // Parse JSON payload
    json_error_t error;
    json_t* root = json_loadb((const char*)payload->data, payload->size, 0, &error);
    
    if (!root) {
        syslog(LOG_ERR, "JSON parsing error: %s", error.text);
        return;
    }

    // Extract classes array
    json_t* classes = json_object_get(root, "classes");
    if (json_is_array(classes) && json_array_size(classes) > 0) {
        json_t* first_class = json_array_get(classes, 0);
        
        // Extract score and type
        json_t* score = json_object_get(first_class, "score");
        json_t* type = json_object_get(first_class, "type");
        
        if (json_is_real(score) && json_is_string(type)) {
            double score_value = json_real_value(score);
            const char* type_value = json_string_value(type);
            
            syslog(LOG_INFO,
                   "Detected object - Topic: %s, Source: %s, Time: %lld.%.9ld, Type: %s, Score: %.4f",
                   channel_identifier->topic,
                   channel_identifier->source,
                   (long long)timestamp->tv_sec,
                   timestamp->tv_nsec,
                   type_value,
                   score_value);
        }
    } 
    
    // Clean up
    json_decref(root);
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
