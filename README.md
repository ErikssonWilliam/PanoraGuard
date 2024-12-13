<div style="text-align: center;">
  <img src="Client/Frontend/src/assets/PanoraGuard.svg" alt="PanoraGuard Logo" width="400"/>
</div>

---
**Final Product Demo Pitch** 
<div >
  <!-- Second Icon (YouTube) -->
  <a href="https://www.youtube.com/watch?v=JkDI--DhFnU&t=1s" target="_blank">
    <img width=200px src="https://img.shields.io/badge/youtube-%23FF0000.svg?&style=for-the-badge&logo=youtube&logoColor=white&color=FF0000" alt="YouTube"/>
  </a>
</div>

---

Welcome to **PanoraGuard**, a security surveillance system developed by **Company 3** in collaboration with **AXIS Communications**.

Project in the course **TDDC88 Software Engineering** at Linköping's University during fall of 2024

Explore the product on our live cloud deployment:  
[**panoraguard.se**](https://panoraguard.se/)

---

<div style="text-align: center;">
  <img src="Client/Frontend/src/assets/C3WBG.png" alt="Company 3 Logo" width="200" style="display: inline-block; margin-right: 10px;"/>
  <img src="Client/Frontend/src/assets/AxisLogo.png" alt="AXIS Communications Logo" width="200" style="display: inline-block;"/>
</div>

## Who are we?

Learn more about us on our company website: [**Company Website**](https://company-members-rajag969-b760ce3a61d886c9508e8e542a6936a0f6ede1.gitlab-pages.liu.se/)

## Follow the journey

- [**Demo iteration 2**](https://drive.google.com/file/d/1ICRIwVadDdsYsEZzZyCarr14lxmGuBHL/view?usp=drive_link)
- [**Demo iteration 3**](https://drive.google.com/file/d/1vbIL0ewWdcuGKRSdi8LCC5NupxmdV6Gc/view?usp=drive_link)
- [**Final Product Demo Pitch**](https://www.youtube.com/watch?v=JkDI--DhFnU&t=1s)

## What is PanoraGuard?

PanoraGuard is an advanced security surveillance solution combining **hardware** and **software** to provide automated alarms and detailed monitoring. It is designed to enhance security during periods of low activity or restricted access.

### Main Features:

- **Automated Alarms**: Triggers alerts when specific objects are identified with a set confidence level.
- **Operator Notifications**: Displays a snapshot of the object, alarm details, and a live camera feed for real-time decision-making.
- **Alarm Actions**: Allows operators to either dismiss false alarms or notify guards for intervention.
- **Integrated Speaker Alerts**: Activates warning signals to deter intruders.
- **Admin & Manager Tools**:
  - Configure camera settings and alarm triggers.
  - Access historical alarm data for analysis and reporting.

---

## System Architecture

PanoraGuard integrates both **hardware** and **software** components:

### Hardware:

- **AXIS Cameras**: Object detection and alarm triggering.
- **Speaker System**: For audible warnings.
- **LAN Server (Host machine)**: Local management of cameras and system configurations.

### Software:

1. **ACAP**: Custom-built applications on AXIS cameras for object detection.
2. **Client**: A GUI for operators, admin and managers to monitor and manage alarms.
3. **External Server**: Cloud-hosted server for alarm handling, business logic, and database management.
4. **LAN Server**: Local server managing camera schedules, live feeds, and configurations.

### Data Flow:

1. **Object Detection**: The built-in ACAP on AXIS cameras detects objects (e.g., human/face) and sends data (type, confidence score, timestamp, camera ID) to the LAN server on the same network.
2. **Data Forwarding**: The LAN server forwards the information to the external server (Azure cloud or local server for development).
3. **Alarm Creation**: The external server applies business logic to decide if an alarm should be created (e.g., confidence score above threshold, no active alarms for the same camera). Alarms are stored in the database.
4. **Speaker Activation**: If an alarm is triggered, the external server instructs the LAN server to activate the speaker for a warning audio signal.
5. **Frontend Notification**: The external server notifies the frontend via WebSocket, updating the GUI with the new alarm, including a snapshot, metadata, and live camera feed.
6. **Operator Action**: The operator can dismiss the alarm (disabling the speaker and updating the alarm status to "ignored") or notify a guard (sending an email with alarm details). Guards notify the operator when resolved, and the operator updates the status to "resolved."
7. **Admin Features**: Admins configure camera settings, schedules, and confidence thresholds via the frontend, which communicates with both the external and LAN servers.

This seamless flow ensures efficient alarm management and real-time decision-making.

![System Architecture](architecture.png)

---

## How to Run the System

### Running Locally

1. **Clone the Repository** and follow setup instructions in `/Client` and `/Server` directories.
2. Connect hardware:
   - Cameras and speakers to a network switch.
   - Network switch connected to a router with internet access.
3. Connect your computer to the same network.
4. Install the ACAP on cameras using instructions in `/ACAP` README.
5. Start all components:
   - Run the **LAN Server**, **External Server**, and **Client** in separate terminals.
6. Open the client application in your browser to monitor the system.

### Running in the Cloud

1. Set up cameras and speakers on the same network as the **LAN Server** running on a host machine.
2. Install the ACAP on the cameras, including the correct LAN server endpoint (see `/ACAP` README).
3. Start the LAN Server on the host machine.
4. Access the cloud GUI at:  
   [**panoraguard.se**](https://panoraguard.se/)

---

## Additional Information

- Detailed setup instructions for each component are available in their respective `/README` files:
  - `/ACAP`
  - `/Client`
  - `/Server`
- For local database management and environment setup, refer to `/Server` README files.

Let’s secure your space with **PanoraGuard**!
