# ACAP Build Instructions

Follow these steps to build and install an ACAP using Docker.

## Prerequisites

- Docker Desktop must be installed and running.

## Build and Install

1. **Build the Docker image:**
   ```bash
   docker build --tag <Image Name> .
    ```

2. **Create the container and extract build files:**
   ```bash
   docker create <Image Name>
   docker cp <Image ID>:/opt/app ./build
    ```
   * On **Mac**, you can combine these:
     ```bash
     docker cp $(docker create <APP_IMAGE>):/opt/app ./build
     ```

3. **Install on the camera**:
    * Copy the ```.eap``` file from ```./build``` and install it on the camera.


## Change the name of the ACAP

1. Update the app name in the **Makefile**.
2. Change the app name in **manifest.json**.
3. Modify the name in the **.c** source file.

##Get camera ID

1. Connect to the same internet as the camera you want to get the ID of
2. Run this command in a terminal: curl -X POST "http://<Camera IP>/axis-cgi/basicdeviceinfo.cgi" -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"apiVersion\":\"1.0\",\"context\":\"Client defined request ID\",\"method\":\"getAllUnrestrictedProperties\"}"
3. The camera id will be printed as Serial Number

## Additional Resources

- [(Message) Metadata Broker Example](https://github.com/AxisCommunications/acap-native-sdk-examples/tree/main/message-broker)
- [Metadata Broker API Docs](https://axiscommunications.github.io/acap-documentation/docs/api/src/api/metadata-broker/html/standard_topics.html)
- [AXIS Scene Metadata integration](https://www.axis.com/developer-community/scene-metadata-integration)