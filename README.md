# Getting Started with Git: Installation and Setup Guide

## Sequence Steps:

### Download Git:
1. Go to the [Git website](https://git-scm.com/downloads).
2. Download the installer for your operating system:
   - **Windows**: Download the Windows 64-bit installer.
   - **macOS**: Download Git for macOS from the same site.
3. Follow the installation instructions for your OS.

### Open Terminal or Git Bash:
- **Windows**:
4. Right-click anywhere on your desktop or in a folder where you want to save the repository.
5. Select **Show more options**.
6. Click **Open Git Bash here**.

- **macOS**:
4. Open **Terminal** from **Applications** > **Utilities** or by pressing **Command + Space** and typing "Terminal".

### Generate SSH Key:
- **Windows**:
7. Press the **Windows key** and type `cmd`.
8. Open **Command Prompt** and type:
      ```bash
      ssh-keygen -t ed25519
      ```
9. Press **Enter** three times to accept the default location and skip setting a password for the ssh key.

- **macOS**:
7. In **Terminal**, type:
      ```bash
      ssh-keygen -t ed25519
      ```
8. Press **Enter** three times to accept the default location and skip setting a password for the ssh key.

### Copy SSH Key:
- **Windows**:
10. Navigate to the location where the key was saved, usually `C:/Users/<YourUserName>/.ssh/id_ed25519.pub`.
11. Right-click on `id_ed25519.pub` and choose **Open with** a text editor (e.g., Notepad).
12. Copy all the contents of the file, starting with `ssh-ed25519`.

- **macOS**:
10. In **Terminal**, type:
      ```bash
      cat ~/.ssh/id_ed25519.pub
      ```
11. Copy the output, starting with `ssh-ed25519`.

### Add SSH Key to GitLab:
13. Go to [GitLab](https://gitlab.liu.se).
14. Click on your profile picture, then select **Preferences**.
15. In the left-hand menu, click **SSH Keys**.
16. Click **Add New Key**.
17. Paste the SSH key into the big text box and press **Add Key**.

### Clone Repository:
18. Go back to **Git Bash** (Windows) or **Terminal** (macOS).
19. Type:
    ```bash
    git clone git@gitlab.liu.se:tddc88-ht24/company3.git
    ```
20. Press **Enter**.
21. If prompted about the fingerprint, type **yes**.

### Error Handling (Optional):
- If you encounter the error `fatal: Could not read from remote repository`, type:
  ```bash
  git config --global user.email "yourLiUID@student.liu.se"
  ```
  Return to step 19.
