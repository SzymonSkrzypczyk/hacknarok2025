# Backend

## Dev Setup
To install the backend dependencies, run the following command:

```bash
pip install -r requirements.txt
```

Run the following command to start up the uvicorn server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Note that database connection is required for proper functionality. You can set up a local PostgreSQL database or use Docker to run a PostgreSQL container.

## Docker compose
To start both database and backend, run the following command:

```bash
docker-compose up
```
This will start the backend server and a PostgreSQL database. The backend will be available at `http://0.0.0.0:8000`.


## Environment Variables
The backend requires the following environment variables to be set:
- `OPENAI_TOKEN``: Your OpenAI API key.

