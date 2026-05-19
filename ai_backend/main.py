from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import base64
import json
from dotenv import load_dotenv
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from typing import Optional

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="WatsonX AI API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get environment variables
watsonx_url = os.getenv("WATSONX_URL")
watsonx_api_key = os.getenv("WATSONX_API_KEY")
watsonx_project_id = os.getenv("WATSONX_PROJECT_ID")

# Validate required environment variables
if not watsonx_url:
    raise ValueError("WATSONX_URL is not set. Please configure it in .env file")
if not watsonx_api_key:
    raise ValueError("WATSONX_API_KEY is not set. Please configure it in .env file")
if not watsonx_project_id:
    raise ValueError("WATSONX_PROJECT_ID is not set. Please configure it in .env file")

# Initialize WatsonX client
credentials = Credentials(
    url=watsonx_url,
    api_key=watsonx_api_key,
)

client = APIClient(credentials)

# Initialize model
model = ModelInference(
    model_id="ibm/granite-4-h-small",
    api_client=client,
    project_id=watsonx_project_id,
    params={
        "max_new_tokens": 100,
        "temperature": 0.4
    }
)

model2= ModelInference(
    model_id="meta-llama/llama-3-2-11b-vision-instruct",
    api_client=client,
    project_id=watsonx_project_id,
    params={
        "max_new_tokens": 100,
        "temperature": 0.4
    }
)


class PromptRequest(BaseModel):
    prompt: str
    max_tokens: int = 100
    image_url: Optional[str] = None

class ChatRequest(BaseModel):
    message: dict  # {"text": str, "files": list}
    history: list = []  # conversation history


class PromptResponse(BaseModel):
    prompt: str
    response: dict  # JSON 객체로 변경

async def image_to_base64(file: UploadFile):
    content = await file.read()
    image_base64 = base64.b64encode(content).decode("utf-8")
    return image_base64

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Check if WatsonX client is properly initialized
        if not client:
            return JSONResponse(
                status_code=500,
                content={"status": "ERROR"}
            )
        return {"status": "OK"}
    except Exception:
        return JSONResponse(
            status_code=500,
            content={"status": "ERROR"}
        )


@app.post("/generate", response_model=PromptResponse)
async def generate_text(request: PromptRequest):
    """
    Generate text using WatsonX model

    Args:
        request: PromptRequest containing the prompt text

    Returns:
        PromptResponse with the generated text
    """
    try:
        if not request.prompt or not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        # Update max tokens if provided
        model.params["max_new_tokens"] = request.max_tokens

        # System prompt

        system_prompt = '''

        '''

        # User Prompt

        user_prompt = '''

        '''

        messages = [
            {"role": "system", "content": system_prompt },
            {"role": "user", "content": user_prompt }
        ]

        response = model.chat(messages = messages)

        
        if isinstance(response, str):
            try:
                response_obj = json.loads(response)
            except:
                response_obj = {"result": response}
        else:
            response_obj = {"result": str(response)}

        return PromptResponse(
            prompt=request.prompt,
            response=response_obj
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error generating text: {str(e)}")
    

@app.post("/generate-img", response_model=PromptResponse)
async def generate_img(file: UploadFile = File(...)):
    """
    Analyze image using WatsonX model

    Args:
        file: Image file to analyze

    Returns:
        PromptResponse with the analysis result
    """
    try:
        if not file:
            raise HTTPException(status_code=400, detail="Image file is required")

        # Read the uploaded file
        image_b64_encoded_string = await image_to_base64(file)

        # System prompt
        system_prompt2 = '''
            당신은 이미지 분석 전문가 AI입니다.
            사용자의 요청에 따라

            - 이미지 설명
            - 분위기 분석
            - 감정 분석
            - 객체 설명
            - 캡션 생성
            - 여행 추천
            - 스타일 분석

            등을 수행하세요.

            항상
            - 한국어로 답변
            - 사용자의 요청 의도를 우선 반영
            - 읽기 쉽게 작성
        '''

        # User Prompt
        user_prompt = '시스템 프롭프트에 따라 이미지를 분석해줘.'

        messages = [
            {"role": "system", "content": system_prompt2 },
            {"role": "user", "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{image_b64_encoded_string}"
                    }
                },
                {
                    "type": "text",
                    "text": user_prompt
                }
            ] }
        ]

        response = model2.chat(messages = messages)

        import json
        if isinstance(response, str):
            try:
                response_obj = json.loads(response)
            except:
                response_obj = {"result": response}
        else:
            response_obj = {"result": response}

        return PromptResponse(
            prompt="Image Analysis",
            response=response_obj
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")

@app.post("/generate-reuse", response_model=PromptResponse)
async def generateReuse(request: PromptRequest):
    try:
        if not request.prompt and not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")
        
        model.params["max_new_tokens"] = request.max_tokens

        # System prompt

        system_prompt = '''
            당신은 회고 생성하는 어시스턴트 AI 서비스입니다.
        '''

        # User Prompt

        user_prompt = '''
            input: f{request.prompt}

            다음과 같은 형식으로 회고 답안을 주세요.
            
            회고 제목 : ex) 나를 위한 보상보다 아쉬움이 더 컸던 오늘

            소비 이유 : ex) 보상 심리

            만족도 : 숫자로 표현(최대 5)

            내일의 다짐: 지출 줄이기

            이런 점을 바꿔보면 어떨까요? 4줄로 (~요)로 결정

            보상 심리가 생길땐 이렇게 해보세요 : 3가지 (~기로 설정)
        '''

        messages = [
            {"role": "system", "content": system_prompt },
            {"role": "user", "content": user_prompt }
        ]

        response = model.chat(messages = messages)

        if isinstance(response, str):
            try:
                response_obj = json.loads(response)
            except:
                response_obj = {"result": response}
        else:
            response_obj = {"result": response}

        return PromptResponse(
            prompt=request.prompt,
            response=response_obj
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")




@app.post("/generate-detailed", response_model=dict)
async def generate_detailed(request: PromptRequest):
    """
    Generate text with detailed output using WatsonX model

    Args:
        request: PromptRequest containing the prompt text

    Returns:
        Detailed generation response
    """
    try:
        if not request.prompt or not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        # Update max tokens if provided
        model.params["max_new_tokens"] = request.max_tokens

        response = model.generate(request.prompt)

        return {
            "prompt": request.prompt,
            "response": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating text: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
