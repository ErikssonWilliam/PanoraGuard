# Server - Local Development Environment Setup

## 1. Database Setup

### Install PostgreSQL & Connect to Local DB

1. Download and install **PostgreSQL**.
   - https://www.postgresql.org/download/
2. During installation:
   - Set a root password (make sure to remember this password).
   - Keep the port at the default `5432`.
   - **Do not** install the Stack Builder.
3. Once installed, open **pgAdmin4** (automatically installed with PostgreSQL).
4. In pgAdmin4:
   - Click on the "Servers" drop-down icon in the left sidebar.
   - Enter the password you set during PostgreSQL installation.
   - Under "Servers", click on the "PostgreSQL 17" dropdown icon.
   - Right-click on "Databases" → "Create" → "Database...".
   - In the "Database" field (under "General"), enter `company3_db`.
   - Keep the owner field set to the default `postgres`.
   - Press **Save**.
5. The local instance of the database is now created.

**Note:** If having the correct credentials to the Azure database instance, you can connect to the cloud database hosted in Azure from the pgAdmin4 desktop application as well.

---

## 2. Backend Setup

This process needs to be completed in both the `Server/External` and `Server/LAN` directories.

1. Open **a separate terminal for each server**.
2. Follow the steps outlined in the `2. Backend Setup` section below.
3. Execute each instruction in the corresponding terminal for both servers.

### Prerequisites

- Python
- PostgreSQL
- pip

### Create Virtual Environment

```bash
python -m venv venv # or python3 -m venv venv
# For Windows:
Set-ExecutionPolicy Unrestricted -Scope Process
venv\Scripts\activate # Windows
# For macOS/Linux:
source venv/bin/activate
```

### Install Dependencies

```bash
python -m pip install -U pip
pip install -r requirements.txt
```

### Set Up Environment Variables

This needs to be done in both the `Server/External` and `Server/LAN` directories.

1. Create a `.env` file in each directory.
2. Add the following environment variables:

```bash
DATABASE_URL = postgresql://postgres:PASSWORD@localhost:5432/company3_db
SECRET_KEY = your_random_secret_text
email_pswrd = srqe miip ozmo kwhd # only for External
CAMERA_USERNAME = root # only for LAN
CAMERA_PASSWORD = secure # only for LAN
```

3. Replace `PASSWORD` in `DATABASE_URL` with the password you set during PostgreSQL installation.

### Change URL to correct server IP-address

To ensure the **LAN server** communicates correctly with the external server for alarm handling, and with the speaker, make sure that the correct URLs is defined:

1. Open the file located at:
   ```plaintext
   /Server/LAN/config.py
   ```
2. Edit the `SPEAKER_IP` in this file to match your speaker. The file contains a line like this:
   ```python
   SPEAKER_IP = "192.168.1.108"
   ```
3. Edit the `EXTERNAL_ALARMS_ADD` in this file to match your **external server**, while keeping the route \*alarms/add
   ```python
   EXTERNAL_ALARMS_ADD = "https://company3-externalserver.azurewebsites.net/alarms/add"
   ```
4. Save the file after necessary changes.

### Run the Application

```bash
python run.py
```

### Important Note

When the external server starts, **it creates mock data to fill up the database.**  
This means that you can log in from the start using the following credentials:

- `admin` - `admin` (username - password for ADMIN)
- `operator` - `operator` (username - password for OPERATOR)
- `manager` - `manager` (username - password for MANAGER)

The mock data also fills the database with alarms in order to view alarm history and manage data as the manager.

This process repeats each time you restart the external server. If you don’t want too many alarms, **comment out line 15** in `Server/External/run.py` (`#create_mock_data()`) after starting the server for the first time.

### Important Note 2

Debug mode is set to `False`. This means that any code changes require restarting the server for those changes to apply.

This applies to both the **External server** and the **LAN server**.

## 3. LINTING AND FORMATTING

To maintain code quality, ensure that linting and formatting are completed **before each commit and push**. This is **MANDATORY** because otherwise the **pipeline tests** in GitLab will **FAIL**!

### Ruff

**Ruff** is used as the linter and formatter for Python.

1. Installation

```bash
pip install ruff
```

2. Commands to run before commiting:

```bash
ruff check        # Check code quality
ruff check --fix  # Fix linting issues automatically
ruff format       # Format the code'
```

3. Tip for handling linting issues:

- Avoid using `import *`. Instead, use explicit imports by naming the modules or objects.

4. Automate Formatting and Linting with **Pre-Commit**:
   ```bash
    pip install pre-commit
    pre-commit install
   ```
   With Pre-Commit installed, it will **automatically format and lint** your code before each commit.

## 4. Database Management

### Viewing Tables in pgAdmin4

To view the tables in **pgAdmin4**:

1. Go to **Server → PostgreSQL 17 → Databases → company3_db → Schemas → public → Tables**.
2. To view the contents of a table:
   - Right-click on the table (e.g., "alarms").
   - Select **View/Edit Data → All Rows**.

### Modifying the Database

To modify the database structure (e.g., objects or attributes):

- Edit each cell directly in pgAdmin4, like in excel.
- Write SQL queries directly in pgAdmin4.
- Send requests using **Postman** to the routes defined in the server source code.

### Modifying Mock Data

To adjust the mock data populated in the database on each server start:

- Modify the file `Server/External/app/mock_data.py`.

### Resetting the Database

If changes occur that affect your local database and errors arise, try resetting it using one of the following scripts:

- `Server/External/reset_database.py`
- `Server/External/reset_database_windows.py`

To reset, navigate to the `Server/External/` directory and run:

```bash
python reset_database.py # for macOS
python reset_database_windows.py # for Windows
```

This should resolve any issues related to the database.

# Server - Production Environment Setup

To be finished...

1. _Optional_: Connect to Azure database instance from pgAdmin4 desktop application.

2. **LAN Server**: Start the LAN server, and connect it to the same network as the camera.

3. **External Server**: Spinning in the cloud 24/7 on an Azure Web App server instance.
