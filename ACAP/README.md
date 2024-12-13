# ACAP Build Instructions

ACAPs are built-in applications on AXIS cameras.

The purpose of the ACAP is to identify objects with a specified confidence level and send this information to a LAN server. The LAN server uses this data to trigger alarms if necessary and forwards it to an external server to display them on a GUI.

**Important Note**: Since the cloud server in the Azure environment won't accept requests directly from the ACAP in the camera, the information is first passed to a LAN server on the same local area network as the camera, which then forwards it to the external server.

## Overview

The main code file for the ACAP is located at `/ACAP/consolidated_main/app/alarm_identifier.c`.

This file contains the core functionality of the ACAP and is where you will make adjustments to suit the specific camera and server configuration.

The ACAP must be installed on each camera, with the **following modifications** made to the code file for each camera:

1.  `CAMERA_ID`: Update this to the appropriate ID for the camera on which the ACAP will be installed.
2.  `SERVER_URL`: Update this to the IP address of the server where the system will send the data.
    - **Running Locally**: URL to local LAN server.
    - **Running Hosted Remotely**: URL to remotely hosted LAN server.

## Prerequisites

- **Docker Desktop** must be installed and running. However, you do not need to do anything in the application. Just make sure it is running.

## Build and Install

Follow these steps to build and install an ACAP using Docker.

### Step 1: Code Modifications

1. Open the main code file:
   `/ACAP/consolidated_main/app/alarm_identifier.c`.

2. Update the following lines (line 30-33):

   ```c
   // #define CAMERA_ID "B8A44F9EEE36" // Serial number for camera at IP 121
   #define CAMERA_ID "B8A44F9EEFE0" // Serial number for camera at IP 116
   #define SERVER_URL "http://192.168.1.145:5100/alarms/redirect" // RUNNING LOCALLY: URL for sending alarms to local LAN server
   // #define SERVER_URL "http://192.168.1.144:5100/alarms/redirect" // RUNNING REMOTELY: URL for sending alarms to target LAN server with a static ip
   ```

   - `CAMERA_ID`: Set to the correct camera serial number.
   - `SERVER_URL`:
     - **Running Locally**: Change `192.168.1.145:5100` to the server's IP adress while keeping `http://` and `/alarms/add` intact.
     - **Running Hosted Remotely**: Use the adress of the LAN server set up at the target location.

3. To find the camera's IP address:

   - Ensure the hardware is set up, and your computer is connected to the same network.
   - Open a browser and try accessing these URLs:
     - `http://192.168.1.121/`
     - `http://192.168.1.116/`
   - The URL that responds indicates the camera's IP address. Match the IP address to its corresponding serial number in the code (lines 30-31) and update the `CAMERA_ID` accordingly.

4. To find the local server's IP:

   - Be on the same network as the camera.
   - Start the LAN server as described in `/Server/README`.
   - Use the displayed IP address.

### Step 2: Build the Docker Image

1. Navigate to the `consolidated_main` folder:

   ```bash
   cd consolidated_main
   ```

2. Build the Docker image:
   ```bash
   docker build --tag <Image Name> .
   ```
   Replace `<Image Name>` with name of your choice.

### Step 3: Create Container and Extract Build Files

- **Windows**:

  ```bash
  docker create <Image Name>
  docker cp <Image ID>:/opt/app ./build
  ```

- **Mac/Linux**:
  ```bash
  docker cp $(docker create <Image Name>):/opt/app ./build
  ```

### Step 4: Install on the camera:

1. Locate the `.eap` file from the `./build` directory that just got created in `/consolidated_main`.

2. Head to the camera's interface by writing the IP adress for this specific camera in a browser. Note that your computer must be on the same network as the camera all the time.

3. In the AXIS GUI, navigate to `Apps` in the left side-bar menu.

4. Delete any existing ACAP named `alarm_identifier`, if there is any.

5. Add the new ACAP by clicking **Add app** and drag the `.eap` file to the box, and click on **install**.

6. Turn on the ACAP, and you're good to go.

## Change the name of the ACAP

1. Update the app name in the **Makefile**.
2. Change the app name in **manifest.json**.
3. Modify the name in the **.c** source file.

## Get camera ID

1. Connect to the same internet as the camera you want to get the ID of
2. Run this command in a terminal: curl -X POST "http://<Camera IP>/axis-cgi/basicdeviceinfo.cgi" -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"apiVersion\":\"1.0\",\"context\":\"Client defined request ID\",\"method\":\"getAllUnrestrictedProperties\"}"
3. The camera id will be printed as Serial Number

## Additional Resources

- [(Message) Metadata Broker Example](https://github.com/AxisCommunications/acap-native-sdk-examples/tree/main/message-broker)
- [Metadata Broker API Docs](https://axiscommunications.github.io/acap-documentation/docs/api/src/api/metadata-broker/html/standard_topics.html)
- [AXIS Scene Metadata integration](https://www.axis.com/developer-community/scene-metadata-integration)
