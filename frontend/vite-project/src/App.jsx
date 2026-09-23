import { useEffect, useState } from 'react'
import { promptModes } from '../api/promptModes'
import './App.css'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [settings, setSettings] = useState({
    model: 'exaone3.5:7.8b',
    systemPrompt: '너는 초보자를 돕는 AI 강사다. 답변은 명확하고 간결하게 작성한다.',
    temperature: '0.7',
    topP: '0.9',
    numPredict: '256',
  })
  const [models, setModels] = useState([])
  const [isLoadingModels, setIsLoadingModels] = useState(true)
  const [modelsError, setModelsError] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [chatError, setChatError] = useState('')
  const [lastRequest, setLastRequest] = useState(null)
  const [promptMode, setPromptMode] = useState('basic')
  const [messages, setMessages] = useState([
    {
      id: 'sample-user',
      role: 'user',
      content: '로컬 LLM의 중요성에 대해 설명해줘',
    },
    {
      id: 'sample-assistant',
      role: 'assistant',
      content: '로컬 LLM(대형 언어 모델)의 중요성은 다음과 같습니다.',
      points: [
        ['즉시성 향상:', '로컬 환경에서 모델을 실행하면 지연 시간이 줄어듭니다.'],
        ['데이터 보안:', '민감한 데이터를 클라우드로 전송하지 않고 로컬에서 처리하므로 개인정보 보호와 데이터 보안이 강화됩니다.'],
        ['연결 불안정성 대응:', '인터넷 연결이 불안정하거나 없는 환경에서도 안정적으로 작동할 수 있어, 다양한 장소에서 손쉽게 사용할 수 있습니다.'],
        ['비용 절감:', '클라우드 서비스 사용 비용을 줄일 수 있으며, 특히 대용량 데이터 처리나 빈번한 요청이 있는 경우 효율적입니다.'],
        ['맞춤형 서비스:', '로컬 환경에서 모델을 조정하고 훈련할 수 있어 특정 사용자 요구나 지역 특성에 맞춘 서비스를 제공하기가 쉽습니다.'],
      ],
      conclusion: '이러한 이유들로 인해 로컬 LLM은 특정 환경에서 높은 효율성과 유연성을 제공합니다.',
    },
  ])

  useEffect(() => {
    async function loadModels() {
      try {
        setModelsError('')
        const response = await fetch(`${API_BASE_URL}/models`)

        if (!response.ok) {
          throw new Error('모델 목록을 불러오지 못했습니다.')
        }

        const data = await response.json()

        if (!Array.isArray(data.models)) {
          throw new Error('모델 목록 응답 형식이 올바르지 않습니다.')
        }

        setModels(data.models)
        setSettings((currentSettings) => ({
          ...currentSettings,
          model: data.models.includes(currentSettings.model) ? currentSettings.model : (data.models[0] || ''),
        }))
      } catch (error) {
        console.error(error)
        setModelsError('모델 목록을 불러오지 못했습니다. 서버 연결을 확인해 주세요.')
      } finally {
        setIsLoadingModels(false)
      }
    }

    loadModels()
  }, [])

  function updateSetting(event) {
    const { name, value } = event.target

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value,
    }))
  }

  function handlePromptModeChange(event) {
    const modeKey = event.target.value

    setPromptMode(modeKey)
    setSettings((currentSettings) => ({
      ...currentSettings,
      systemPrompt: promptModes[modeKey].prompt,
    }))
  }

  async function sendChatRequest(request) {
    setIsSending(true)
    setChatError('')

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error('채팅 요청에 실패했습니다.')
      }

      const data = await response.json()

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.message,
        },
      ])
    } catch (error) {
      console.error(error)
      setChatError(error instanceof TypeError
        ? '서버에 연결할 수 없습니다. 서버 실행 상태를 확인한 뒤 다시 시도해 주세요.'
        : '답변을 생성하지 못했습니다. 다시 시도해 주세요.')
    } finally {
      setIsSending(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || isSending || isLoadingModels || modelsError) {
      return
    }

    const request = {
      message: trimmedMessage,
      model: settings.model,
      system_prompt: settings.systemPrompt,
      temperature: Number(settings.temperature),
      top_p: Number(settings.topP),
      num_predict: Number(settings.numPredict),
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmedMessage,
      },
    ])
    setMessage('')
    setLastRequest(request)
    sendChatRequest(request)
  }

  function handleRetry() {
    if (lastRequest && !isSending) {
      sendChatRequest(lastRequest)
    }
  }

  function handleReset() {
    setMessages([])
    setChatError('')
    setLastRequest(null)
  }

  return (
    <main className="chat-app">
      <aside className="settings-panel" aria-labelledby="settings-title">
        <h1 id="settings-title">모델 설정</h1>
        <div className="setting-field">
          <label htmlFor="model">모델</label>
          <select id="model" name="model" value={settings.model} onChange={updateSetting} disabled={isLoadingModels || Boolean(modelsError)}>
            {isLoadingModels && <option value="">모델 목록을 불러오는 중...</option>}
            {!isLoadingModels && !modelsError && models.length === 0 && <option value="">사용 가능한 모델이 없습니다.</option>}
            {!isLoadingModels && !modelsError && models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          {modelsError && <p className="field-status field-status-error" role="alert">{modelsError}</p>}
        </div>
        <div className="setting-field">
          <label htmlFor="prompt-mode-select">프롬프트 모드</label>
          <select id="prompt-mode-select" name="promptMode" value={promptMode} onChange={handlePromptModeChange}>
            {Object.entries(promptModes).map(([key, mode]) => (
              <option key={key} value={key}>{mode.label}</option>
            ))}
          </select>
        </div>
        <div className="setting-field">
          <label htmlFor="system-prompt">시스템 프롬프트</label>
          <textarea id="system-prompt" name="systemPrompt" value={settings.systemPrompt} onChange={updateSetting} rows="4" />
        </div>
        <div className="setting-field range-field">
          <label htmlFor="temperature">Temperature: {settings.temperature}</label>
          <input id="temperature" name="temperature" type="range" min="0" max="2" step="0.1" value={settings.temperature} onChange={updateSetting} />
        </div>
        <div className="setting-field range-field">
          <label htmlFor="top-p">Top P: {settings.topP}</label>
          <input id="top-p" name="topP" type="range" min="0" max="1" step="0.1" value={settings.topP} onChange={updateSetting} />
        </div>
        <div className="setting-field">
          <label htmlFor="num-predict">Num Predict</label>
          <input id="num-predict" name="numPredict" type="number" min="1" max="2048" value={settings.numPredict} onChange={updateSetting} />
        </div>
      </aside>

      <section className="chat-workspace" aria-labelledby="chat-title">
        <header className="chat-header">
          <div>
            <h2 id="chat-title">Local LLM Chat</h2>
            <p>React + FastAPI + Ollama 기반 로컬 AI 채팅 앱</p>
          </div>
          <button type="button" className="reset-button" onClick={handleReset} disabled={messages.length === 0}>대화 초기화</button>
        </header>

        <section className="conversation" aria-label="대화 내용">
          {messages.length === 0 && <p className="empty-conversation">대화를 시작해 보세요.</p>}
          {messages.map((chatMessage) => (
            <article
              key={chatMessage.id}
              className={`message message-${chatMessage.role}`}
              aria-label={chatMessage.role === 'user' ? '사용자 메시지' : 'AI 응답'}
            >
              {chatMessage.role === 'assistant' && chatMessage.points ? (
                <>
                  <p>{chatMessage.content}</p>
                  <ol>
                    {chatMessage.points.map(([title, description]) => (
                      <li key={title}><strong>{title}</strong> {description}</li>
                    ))}
                  </ol>
                  <p>{chatMessage.conclusion}</p>
                </>
              ) : chatMessage.content}
            </article>
          ))}
          {isSending && <p className="chat-status" role="status" aria-live="polite">AI가 답변을 생성하고 있습니다...</p>}
          {chatError && (
            <div className="chat-error" role="alert">
              <p>{chatError}</p>
              <button type="button" onClick={handleRetry} disabled={isSending || !lastRequest}>다시 시도</button>
            </div>
          )}
        </section>

        <form className="composer" aria-label="메시지 작성" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="message-input">질문 입력</label>
          <textarea
            id="message-input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
            placeholder="질문을 입력하세요. 예: FastAPI와 React를 연결하는 이유를 설명해줘. Shift+Enter: 줄바꿈"
            rows="2"
            disabled={isSending || isLoadingModels || Boolean(modelsError) || models.length === 0}
          />
          <button type="submit" disabled={!message.trim() || isSending || isLoadingModels || Boolean(modelsError) || models.length === 0}>전송</button>
        </form>
      </section>
    </main>
  )
}

export default App
