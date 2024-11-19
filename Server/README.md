# Server - Local Development Environment Setup

## 1. Database Setup

### Install PostgreSQL

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

---

## 2. Backend Setup

### Prerequisites

- Python
- PostgreSQL
- pip

### Create Virtual Environment

```bash
python -m venv venv # or python3 -m venv venv
# For Windows
Set-ExecutionPolicy Unrestricted -Scope Process
venv\Scripts\activate # Windows
# For macOS/Linux
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

```
DATABASE_URL = postgresql://postgres:PASSWORD@localhost:5432/company3_db
SECRET_KEY = your_random_secret_text
email_pswrd = srqe miip ozmo kwhd # only for External
CAMERA_USERNAME = root # only for LAN
CAMERA_PASSWORD = secure # only for LAN
```

3. Replace `PASSWORD` in `DATABASE_URL` with the password you set during PostgreSQL installation.

### Run the Application

```bash
python run.py
```

### Important Note

After the server is running, **you need to create a user to log in.**

1. Open **Postman** and create a POST request:
   - **URL:** `http://127.0.0.1:5000/users/create`
   - **Body (raw JSON):**
   ```json
   {
     "username": "admin",
     "password": "admin",
     "role": "ADMIN",
     "email": "admin@gmail.com"
   }
   ```
2. Send the request. You can now log in with the credentials `admin` / `admin`.

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
   `bash
 pip install pre-commit
 pre-commit install 
 `
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

- Write SQL queries directly in **pgAdmin4**.
- Send requests using **Postman** to the routes defined in the server source code.

### Modifying Mock Data

To adjust the mock data populated in the database on each server start:

- Modify the file `Server/External/app/mock_data.py`.
