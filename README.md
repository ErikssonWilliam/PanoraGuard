# Getting Started with Git: Installation and Setup Guide
Written by Fredrik Kämmerling, Project Manager, Company 3
## Sequence Steps for Windows (see for MAC below):

### Download Git:
1. Go to the [Git website](https://git-scm.com/downloads).
2. Download the Windows 64-bit installer.
3. Follow the installation instructions

### Generate SSH Key (If you do not have a SSH key added in GitLab already):
4. Press the **Windows key** and type `cmd`.
5. Open **Command Prompt** and type:
      ```bash
      ssh-keygen -t ed25519
      ```
6. Press **Enter** three times to accept the default location and skip setting a password for the ssh key.

### Copy SSH Key:
7. Navigate to the location where the key was saved, usually `C:/Users/<YourUserName>/.ssh/id_ed25519.pub`.
8. Right-click on `id_ed25519.pub` and choose **Open with** a text editor (e.g., Notepad).
9. Copy all the contents of the file, starting with `ssh-ed25519`.

### Add SSH Key to GitLab:
10. Go to [GitLab](https://gitlab.liu.se).
11. Click on your profile picture, then select **Preferences**.
12. In the left-hand menu, click **SSH Keys**.
13. Click **Add New Key**.
14. Paste the SSH key into the big text box and press **Add Key**.

### Open Git Bash:
15. Right-click in a folder where you want to save the repository.
16. Select **Show more options**.
17. Click **Open Git Bash here**.

### Clone Repository:
18. In the terminal, type:
    ```bash
    git clone git@gitlab.liu.se:tddc88-ht24/company3.git
    ```
19. Press **Enter**.
20. If prompted about the fingerprint, type **yes**.

### Error Handling (Optional):
- If you encounter the error `fatal: Could not read from remote repository`, type:
  ```bash
  git config --global user.email "yourLiUID@student.liu.se"
  ```
  Return to step 18.

## Sequence Steps for MAC:

### Download Git:
1. Open **Terminal** from **Applications** > **Utilities** or by pressing **Command + Space** and typing "Terminal".
2. Install Homebrew by typing 
    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```
3. When it is done installing, type 
    ```bash
    brew install git
    ```
### Generate SSH Key:
4. In **Terminal**, type:
      ```bash
      ssh-keygen -t ed25519
      ```
5. Press **Enter** three times to accept the default location and skip setting a password for the ssh key.

### Copy SSH Key:
6. In **Terminal**, type:
      ```bash
      cat ~/.ssh/id_ed25519.pub
      ```
7. Copy the output, starting with `ssh-ed25519`.

### Add SSH Key to GitLab:
8. Go to [GitLab](https://gitlab.liu.se).
9. Click on your profile picture, then select **Preferences**.
10. In the left-hand menu, click **SSH Keys**.
11. Click **Add New Key**.
12. Paste the SSH key into the big text box and press **Add Key**.

### Open Terminal:
13. Open a **Terminal** by pressing **Command + Space** and typing "Terminal" and **cd** to where you want to save your repository.

### Clone Repository:
14. In the terminal, type:
    ```bash
    git clone git@gitlab.liu.se:tddc88-ht24/company3.git
    ```
15. Press **Enter**.
16. If prompted about the fingerprint, type **yes**.

### Error Handling (Optional):
- If you encounter the error `fatal: Could not read from remote repository`, type:
  ```bash
  git config --global user.email "yourLiUID@student.liu.se"
  ```
  Return to step 14.
