# Backend

## Setup
To install the backend dependencies, run the following command:

```bash
pip install -r requirements.txt
```

Run the following command to start up the uvicorn server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Environment Variables
The backend requires the following environment variables to be set:
- `OPENAI_TOKEN``: Your OpenAI API key.

