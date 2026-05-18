# WatsonX AI Backend API

A FastAPI application that provides REST API endpoints for IBM WatsonX AI model inference.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your WatsonX credentials:
- `WATSONX_URL`: Your WatsonX API URL
- `WATSONX_API_KEY`: Your IBM Cloud API key
- `WATSONX_PROJECT_ID`: Your WatsonX project ID

### 3. Run the Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API.

### Generate Text
```
POST /generate
Content-Type: application/json

{
  "prompt": "How far is Paris from Bangalore?",
  "max_tokens": 100
}
```

Returns:
```json
{
  "prompt": "How far is Paris from Bangalore?",
  "response": "The distance between Paris and Bangalore is approximately..."
}
```

### Generate Detailed
```
POST /generate-detailed
Content-Type: application/json

{
  "prompt": "How far is Paris from Bangalore?",
  "max_tokens": 100
}
```

Returns detailed generation output with additional metadata.

## Interactive Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Example Requests

### Using curl
```bash
curl -X POST "http://localhost:8000/generate" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is the capital of France?", "max_tokens": 100}'
```

### Using Python
```python
import requests

response = requests.post(
    "http://localhost:8000/generate",
    json={
        "prompt": "What is the capital of France?",
        "max_tokens": 100
    }
)

print(response.json())
```
