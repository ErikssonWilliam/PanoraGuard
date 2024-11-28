# PanoraGuard

Welcome to **PanoraGuard**, a security surveillance system developed by **Company 3** in collaboration with **AXIS Communications**.

---

## Who are we?

Check in our company website:
https://company-members-rajag969-b760ce3a61d886c9508e8e542a6936a0f6ede1.gitlab-pages.liu.se/

---

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
- **LAN Server (Raspberry Pi)**: Local management of cameras and system configurations.

### Software:

1. **ACAP**: Custom-built applications on AXIS cameras for object detection.
2. **Client**: A GUI for operators, admin and managers to monitor and manage alarms.
3. **External Server**: Cloud-based system for alarm handling, business logic, and database management.
4. **LAN Server**: Local server managing camera schedules, live feeds, and configurations.

---

## How to Run the System

### Running Locally

1. **Clone the Repository** and follow setup instructions in `/Client` and `/Server` directories.
2. Connect hardware:
   - Cameras and speakers to a network switch.
   - Switch connected to a router with internet access.
3. Connect your computer to the same network.
4. Install the ACAP on cameras using instructions in `/ACAP` README.
5. Start all components:
   - Run the **LAN Server**, **External Server**, and **Client** in separate terminals.
6. Open the client application in your browser to monitor the system.

### Running in the Cloud

1. Set up cameras and speakers on the same network as the **LAN Server** running on a Raspberry Pi.
2. Install the ACAP with the cloud server's endpoint (see `/ACAP` README).
3. Start the LAN Server on the Raspberry Pi.
4. Access the cloud GUI at:  
   [PanoraGuard Cloud GUI](https://ashy-meadow-0a76ab703.5.azurestaticapps.net)

---

## Additional Information

- Detailed setup instructions for each component are available in their respective `/README` files:
  - `/ACAP`
  - `/Client`
  - `/Server`
- For local database management and environment setup, refer to `/Server` README files.

Let’s secure your space with **PanoraGuard**!
