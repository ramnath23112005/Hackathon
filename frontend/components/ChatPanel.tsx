"use client"

import { FormEvent, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, User, Bot } from "lucide-react"

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

export type ChatResponse = {
  query: string
  sources: Source[]
  data: NormalizedData
  intelligence: IntelligenceReport | null
}

export type Message = {
  role: "user" | "assistant"
  content: string
  response?: ChatResponse
}

type Props = {
  messages: Message[]
  loading: boolean
  onSend: (message: string) => void
  onSelectPrompt: (prompt: string) => void
}

export default function ChatPanel({ messages, loading, onSend, onSelectPrompt }: Props) {
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput("")
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 px-4 pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Conversation</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex items-start gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-violet-500/20 text-violet-400"
                  }`}
                >
                  {msg.role === "user" ? <User size={13} /> : <Bot size={13} />}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-500/10 text-zinc-200 ring-1 ring-blue-500/20"
                      : "bg-zinc-900/50 text-zinc-300 ring-1 ring-zinc-800/50"
                  }`}
                >
                  {msg.role === "user" ? (
                    <p>{msg.content}</p>
                  ) : msg.response?.intelligence ? (
                    <div>
                      <div className="mb-2 flex items-center gap-1.5 text-[10px] text-emerald-400">
                        <span>Intelligence Report</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-zinc-500">
                          {msg.response.intelligence.source_attribution.length} sources
                        </span>
                      </div>
                      <p className="text-sm text-zinc-200 leading-relaxed">
                        {msg.response.intelligence.summary.slice(0, 200)}
                        {msg.response.intelligence.summary.length > 200 ? "..." : ""}
                      </p>
                      <p className="mt-2 text-[10px] text-zinc-600">
                        See full report in the Intelligence panel &rarr;
                      </p>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-zinc-800/60 p-4">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg bg-zinc-900/50 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none ring-1 ring-zinc-800/60 transition focus:ring-2 focus:ring-blue-500/40"
            placeholder="Type your research query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-30"
          >
            <Send size={14} />
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
