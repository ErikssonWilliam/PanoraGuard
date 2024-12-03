# Client - Local Development Environment Setup

## Prerequisites

- **Node.js**: Install Node.js from [Node.js Downloads](https://nodejs.org/en/download/prebuilt-installer). This will automatically install **npm** (Node Package Manager).
- Verify installation by running the following commands in any terminal:
  ```bash
  node --version
  npm --version
  ```

## Install Dependencies

1. Navigate to the `Client/Frontend` directory.
2. Run the command:
   ```bash
   npm install
   ```

## Change URL to correct server IP-address

To ensure the local development setup redirects calls correctly to the LAN server and the External server:

1. Open the file located at:
   ```plaintext
   /Client/Frontend/src/api/axiosConfig.js
   ```
2. Edit the URL configurations in this file to match your environment. The file contains URL configurations like this:
   ```javascript
   //const externalURL = "https://company3-externalserver.azurewebsites.net"; // URL to Azure Cloud Server
   //const lanURL = "https://airedale-engaging-easily.ngrok-free.app";  // URL to Raspberry Pi LAN-Server
   const externalURL = "http://127.0.0.1:5000"; // URL to local server
   const lanURL = "http://127.0.0.1:5100"; // URL to local LAN server
   ```
3. Ensure the `externalURL` and `lanURL` are set to the appropriate values for your **local setup**.
4. Save the file after making the necessary changes.

## Run the application

1. Start the development server when standing in `/Client/Frontend`:
   ```bash
   npm run dev
   ```
2. Click the provided link to open the website in your browser.

## LINTING AND FORMATTING

To maintain code quality, ensure that linting and formatting are completed **before each commit and push**. This is **MANDATORY** because otherwise the **pipeline tests** in GitLab will **FAIL**!

### Commands to Run Before Committing

Run the following commands in the `Client/Frontend` directory:

```bash
npx eslint .
npx prettier --write .
```

These commands will check for linting issues and fix formatting automatically.

# Client - Production Environment Setup

To be finished...
