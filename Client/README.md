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

## Run the application

1. Start the development server
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
