"use client"

import { FormEvent, useState, useRef, useEffect, useCallback } from "react"
import AgentTimeline from "./AgentTimeline"

type Source = {
  source: string
  error: string | null
  count: number
}

type ResultItem = {
  source: string
  title: string
  text: string
  url: string
  author: string
  date: string
}

type NormalizedData = {
  summary_context: string
  key_entities: string[]
  trends: string[]
  sources: Source[]
  results: ResultItem[]
}

type IntelligenceReport = {
  summary: string
  key_trends: string[]
  insights: string[]
  opportunities: string[]
  risk_signals: string[]
  source_attribution: string[]
}

type ChatResponse = {
  query: string
  sources: Source[]
  data: NormalizedData
  intelligence: IntelligenceReport | null
}

type Message = {
  role: "user" | "assistant"
  content: string
  response?: ChatResponse
}

type AgentStepDef = {
  step: string
  label: string
  icon: string
  progress: number
}

type AgentRunResponse = {
  session_id: string
  steps: AgentStepDef[]
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStepDef[]>([])
  const [agentDone, setAgentDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleAgentComplete = useCallback((_state: unknown) => {
    setAgentDone(true)
    setLoading(false)
  }, [])

  const handleAgentError = useCallback((error: string) => {
    setLoading(false)
    setAgentDone(true)
    const errorMsg: Message = {
      role: "assistant",
      content: `Agent error: ${error}`,
    }
    setMessages((prev) => [...prev, errorMsg])
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: "user", content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    const query = input.trim()
    setInput("")
    setLoading(true)
    setAgentSessionId(null)
    setAgentSteps([])
    setAgentDone(false)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      const res = await fetch(`${API_URL}/agent/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      })
      const data: AgentRunResponse = await res.json()
      setAgentSessionId(data.session_id)
      setAgentSteps(data.steps)
    } catch {
      setLoading(false)
      const errorMsg: Message = {
        role: "assistant",
        content: "Error connecting to backend. Make sure the server is running.",
      }
      setMessages((prev) => [...prev, errorMsg])
    }
  }

  function addResultMessage(response: ChatResponse) {
    const assistantMsg: Message = {
      role: "assistant",
      content: response.intelligence
        ? `Intelligence Report for "${response.query}"`
        : `InternetOS processed: "${response.query}"`,
      response,
    }
    setMessages((prev) => [...prev, assistantMsg])
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* LEFT: Chat panel */}
      <div className={`flex flex-col ${agentSessionId ? "w-1/2 border-r border-zinc-800" : "flex-1"}`}>
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 && !agentSessionId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <p className="text-zinc-500 text-sm mb-1">Ask InternetOS anything...</p>
                <p className="text-zinc-600 text-xs">An autonomous AI research agent</p>
              </div>
            </div>
          )}
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  <div className="rounded-xl bg-zinc-800 px-4 py-3 text-sm leading-relaxed text-zinc-100 self-end max-w-[80%] ml-auto">
                    {msg.content}
                  </div>
                ) : (
                  <div className="rounded-xl bg-zinc-900 px-4 py-3 text-sm leading-relaxed text-zinc-300 self-start max-w-full">
                    {msg.response?.intelligence ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-800">
                          <span className="text-xs text-zinc-500 uppercase tracking-wide font-semibold">
                            Intelligence Report
                          </span>
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Summary
                          </p>
                          <p className="text-sm text-zinc-200 leading-relaxed">
                            {msg.response.intelligence.summary}
                          </p>
                        </div>

                        {msg.response.intelligence.key_trends.length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                              Key Trends
                            </p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {msg.response.intelligence.key_trends.map((t, j) => (
                                <li key={j} className="text-xs text-zinc-300">{t}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {msg.response.intelligence.insights.length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                              Insights
                            </p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {msg.response.intelligence.insights.map((insight, j) => (
                                <li key={j} className="text-xs text-zinc-300">{insight}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {msg.response.intelligence.opportunities.length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                              Opportunities
                            </p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {msg.response.intelligence.opportunities.map((o, j) => (
                                <li key={j} className="text-xs text-zinc-300">{o}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {msg.response.intelligence.risk_signals.length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                              Risk Signals
                            </p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {msg.response.intelligence.risk_signals.map((r, j) => (
                                <li key={j} className="text-xs text-amber-300">{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {msg.response.intelligence.source_attribution.length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                              Sources
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.response.intelligence.source_attribution.map((s, j) => (
                                <span key={j} className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : msg.response ? (
                      <div className="space-y-3">
                        <p className="text-xs text-zinc-500 italic">
                          Intelligence unavailable — showing raw data
                        </p>
                        <div>
                          <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Sources
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.sources.map((s, j) => (
                              <span
                                key={j}
                                className={`rounded px-2 py-0.5 text-xs ${
                                  s.error
                                    ? "bg-red-900/40 text-red-300"
                                    : "bg-zinc-800 text-zinc-200"
                                }`}
                              >
                                {s.source}: {s.count}
                              </span>
                            ))}
                          </div>
                        </div>
                        {msg.response.data.results.length > 0 && (
                          <div>
                            <p className="mb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                              Results ({msg.response.data.results.length})
                            </p>
                            <div className="space-y-2">
                              {msg.response.data.results.slice(0, 5).map((r, j) => (
                                <div key={j} className="rounded bg-zinc-800/50 p-2 text-xs">
                                  <p className="text-zinc-200 font-medium truncate">
                                    {r.title || "(no title)"}
                                  </p>
                                  <p className="text-zinc-400 mt-0.5 line-clamp-2">{r.text}</p>
                                  <div className="flex gap-2 mt-1 text-zinc-500">
                                    <span>{r.source}</span>
                                    {r.author && <span>by {r.author}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {loading && !agentSessionId && (
              <div className="self-start rounded-xl bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
                Starting agent...
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-zinc-800 p-4">
          <div className="mx-auto flex max-w-2xl gap-2">
            <input
              className="flex-1 rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-zinc-600"
              placeholder="Type your research query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300 disabled:opacity-40"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT: Agent Timeline panel */}
      {agentSessionId && (
        <div className="flex w-1/2 flex-col overflow-y-auto px-4 py-6">
          <AgentTimeline
            sessionId={agentSessionId}
            steps={agentSteps}
            onComplete={(state) => {
              handleAgentComplete(state)
              if (state.result) {
                const result = state.result as unknown as ChatResponse
                addResultMessage(result)
              }
            }}
            onError={handleAgentError}
          />
        </div>
      )}
    </div>
  )
}
