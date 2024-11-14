## Prerequisites

- Python
- PostgreSQL
- pip

## Create Virtual Environment
```bash
python -m venv venv # or python3 -m venv venv
#for windows 
Set-ExecutionPolicy Unrestricted -Scope Process
venv\Scripts\activate # Windows
source venv/bin/activate # macOS/Linux
```

## Install dependencies
```bash
python -m pip install -U pip
pip install -r requirements.txt
```
## Set Up Environment Variables
Create a `.env` file and add
```
DATABASE_URL = postgresql://username:password@localhost:port/dbname
SECRET_KEY = your_random_secret_text
```

## Run the Application
```bash
python run.py
```
