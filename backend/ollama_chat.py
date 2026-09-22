import time
from xml.parsers.expat import model
from ollama import chat
import requests

def call_ollama_chat(
        message:str, # message: 사용자의 질문
        model: str = "gemma4:e2b", # model: 사용할 Ollama 모델
        system_prompt:str = "너는 초보자를 돕는 친절한 AI 강사다.", # AI의 역할 설정
        temperature: float = 0.7, # 답변 다양성 설정
        top_p: float = 0.9,
        num_predict: int = 256 # 최대 생성 길이
        ):
    """
    Ollama API를 호출하여 채팅을 수행하는 함수
    """
    start_time = time.perf_counter()  # 시작 시간 기록

    # Ollama API 호출
    # Ollama 모델에 채팅 요청을 보냅니다.
    response = chat(
        model=model, # model=model은 함수에 전달받은 모델 이름을 사용한다는 뜻입니다.
        # AI에게 전달할 대화 목록입니다.
        # role은 메시지의 주체를 나타냅니다.
        messages=[{
            "role": "system", # 첫 번째 메시지는 시스템 지시입니다.
            "content": system_prompt 
            },
            {
            "role": "user", # 두 번째 메시지는 사용자의 질문입니다.
            "content": message
            },
        ],
        # Ollama 모델의 생성 옵션을 전달합니다.
        options={
            "temperature": temperature,
            "top_p": top_p,
            "num_predict": num_predict
        },
        think = False # 모델의 내부 추론/생각 출력 기능을 사용하지 않도록 합니다.
    )

    elapsed_time = round(time.perf_counter() - start_time,3 ) # 시작 시각부터 현재까지 걸린 시간을 계산합니다.
    # API가 사용할 결과를 딕셔너리로 반환합니다.
    return {
        "model": model,
        "ai_message": response.message.content, # response.message.content가 AI의 실제 답변 텍스트입니다.
        "elapsed_time": elapsed_time
    }

OLLAMA_API_URL = "http://localhost:11434/api/tags"

# 설치된 Ollama 모델의 이름만 뽑아 반환하는 함수입니다.
def get_ollama_models():
    """
    Ollama API를 호출하여 모델 목록을 가져오는 함수
    """
    response = requests.get(
        OLLAMA_API_URL,
        timeout=30
        )
    #응답 실패 (4xx, 5xx) 시 예외 로 전환

    response.raise_for_status() # 응답 상태 코드가 400번대 또는 500번대면 예외를 발생시킵니다. # 예: Ollama 서버가 실행 중이 아니면 오류가 발생할 수 있습니다.

    data = response.json()
    print(data)
    
    # JSON 안의 "models" 값을 가져옵니다.
    # 키가 없으면 빈 리스트 []를 사용합니다.

    models = data.get("models", [])

    return [model["name"] for model in models]

if __name__ == "__main__":

    print("\n채팅 응답 테스트(결과를 기다려 주세요.):")
    result = call_ollama_chat(message="Local LLM이 무엇인지 초보자에게 설명해줘.")
    print("\n모델:", result["model"])
    print("소요 시간:", result["elapsed_time"], "초")
    print("응답:")
    print(result["ai_message"])

    # 모델 목록 가져오기
    models = get_ollama_models()
    print("사용 가능한 모델 목록:")
    print(models)