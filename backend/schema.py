from pydantic import BaseModel, Field
# Pydantic은 API 데이터의 형식과 유효성을 검사하는 라이브러리입니다.
# BaseModel: 데이터 모델의 기본 클래스입니다.
# Field: 기본값, 설명, 허용 범위 등을 지정합니다.


#ChatRequest 전송 모델 설계

class ChatRequest(BaseModel):
    message: str = Field(..., description="사용자가 입력한 질문")
    # message는 문자열(str)이어야 합니다.
    # ...은 “반드시 입력해야 하는 값”이라는 뜻입니다.
    model: str = Field(default="exaone3.5:7.8b", description="Ollama 모델명")
    system_prompt: str = Field(
        default="너는 초보자를 돕는 친절한 AI 강사다.",
        description="모델의 역할을 지정하는 시스템 프롬프트",
    )
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=0.9, ge=0.0, le=1.0)
    num_predict: int = Field(default=256, ge=1, le=2048)


# ChatResponse 모델 설계
# /chat API가 돌려주는 응답 형식을 정의합니다.
class ChatResponse(BaseModel):
    model: str # model: 실제 사용한 모델 이름
    message: str # message: AI의 답변
    elapsed_time: float # elapsed_time: 걸린 시간
    