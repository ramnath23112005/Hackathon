"use client"

import { useState, useCallback } from "react"
import Header from "@/components/Header"
import HeroScreen from "@/components/HeroScreen"
import ChatPanel from "@/components/ChatPanel"
import type { ChatResponse, Message } from "@/components/ChatPanel"
import AgentTimeline from "@/components/AgentTimeline"
import IntelligencePanel from "@/components/report/IntelligencePanel"
import { AnimatePresence, motion } from "framer-motion"

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStepDef[]>([])
  const [activeReport, setActiveReport] = useState<ChatResponse | null>(null)

  const handleSend = useCallback(async (query: string) => {
    const userMsg: Message = { role: "user", content: query }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    setAgentSessionId(null)
    setAgentSteps([])
    setActiveReport(null)

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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to backend." },
      ])
    }
  }, [])

  const handleSelectPrompt = useCallback((prompt: string) => {
    handleSend(prompt)
  }, [handleSend])

  const handleAgentComplete = useCallback((state: { result: unknown }) => {
    setLoading(false)
    if (state.result) {
      const result = state.result as ChatResponse
      setActiveReport(result)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Intelligence Report for "${result.query}"`,
          response: result,
        },
      ])
    }
  }, [])

  const handleAgentError = useCallback((error: string) => {
    setLoading(false)
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `Agent error: ${error}` },
    ])
  }, [])

  const showTimeline = agentSessionId !== null
  const showReport = activeReport !== null

  return (
    <main className="flex h-dvh flex-col bg-[#0B0F19] text-zinc-100">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Chat Panel — always visible */}
        <AnimatePresence mode="wait">
          {messages.length === 0 && !agentSessionId ? (
            <motion.div
              key="hero"
              className="flex flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <HeroScreen onSelectPrompt={handleSelectPrompt} onSend={handleSend} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              className={`flex flex-col border-r border-zinc-800/60 ${
                showTimeline || showReport ? "w-[28%]" : "flex-1"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ChatPanel
                messages={messages}
                loading={loading}
                onSend={handleSend}
                onSelectPrompt={handleSelectPrompt}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTER: Agent Timeline */}
        {(showTimeline || (loading && agentSessionId)) && (
          <motion.div
            key="timeline"
            className="w-[28%] border-r border-zinc-800/60 px-4 py-4"
            initial={{ width: 0, opacity: 0, overflow: "hidden" }}
            animate={{ width: "28%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AgentTimeline
              sessionId={agentSessionId!}
              steps={agentSteps}
              onComplete={handleAgentComplete}
              onError={handleAgentError}
            />
          </motion.div>
        )}

        {/* RIGHT: Intelligence Report */}
        {showReport && activeReport?.intelligence && (
          <motion.div
            key="report"
            className="flex-1 overflow-y-auto px-4 py-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <IntelligencePanel intelligence={activeReport.intelligence} />
          </motion.div>
        )}
      </div>
    </main>
  )
}
