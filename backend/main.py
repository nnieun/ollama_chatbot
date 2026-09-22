from fastapi import FastAPI, HTTPException
import uvicorn
# ollama_chat 모듈의 call_ollama_chat 함수 로딩
from ollama_chat import call_ollama_chat, get_ollama_models
from schema import ChatRequest, ChatResponse 
from fastapi.middleware.cors import CORSMiddleware # 프론트엔드와 백엔드의 주소가 다를 때, 브라우저가 API 요청을 막지 않도록 하는 CORS 설정 도구입니다.

# FastAPI 객체 생성
app = FastAPI(
    title="Local LLM Chat API",
    description="Ollama 기반 로컬 LLM 채팅 백엔드 API",
    version="0.1.0",
)

# 브라우저는 보안상 서로 다른 출처의 요청을 제한하기 때문에 설정 필요
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # 어떤 주소에서든 요청 가능.
    # allow_origins=["http://localhost:5173"],
    # allow_origins=["http://localhost:5173", "https://example.com"] 
    allow_credentials=True,
    allow_methods=["*"], # GET, POST 등 모든 HTTP 메서드 허용.
    allow_headers=["*"], # 모든 요청 헤더 허용.
)

# /chat API 구현
# http://localhost:8000/chat
@app.post("/chat", response_model=ChatResponse) 
# response_model=ChatResponse 이거 안넣어도 응답 간다. 넣는 이유는? 응답도 정해진 형식으로 관리하고 검증하기 위해서
def chat(request: ChatRequest): #클라이언트가 보낸 JSON 데이터를 ChatRequest 형식으로 받습니다.
    # 클라이언트로부터 값 넘겨받기 
    # 비즈니스 로직처리
    # return_value = {
    #     "model": "aaaa",
    #     "ai_message": "ai_message",
    #     "걸린시간" : "걸린시간"
    # }
    # print(request.message)
    try:

        return_value = call_ollama_chat(
                message=request.message,
                model=request.model,
                system_prompt=request.system_prompt,
                temperature=request.temperature,
                top_p=request.top_p,
                num_predict=request.num_predict,
            )


        return return_value
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"채팅 처리 중 오류가 발생했습니다: {exc}"
        ) 

# model 목록 가져오기
# http://localhost:8000/models
@app.get("/models")
def list_models():
    try:
        print("진입")
        models = get_ollama_models()
        print(models)
        return {"models": models}
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"모델 목록 조회 중 오류가 발생했습니다: {exc}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )