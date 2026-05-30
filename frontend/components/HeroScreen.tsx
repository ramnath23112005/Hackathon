"use client"

import { FormEvent, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Search, LineChart, Shield, Bot, Send, ArrowRight } from "lucide-react"

const EXAMPLE_PROMPTS = [
  "Find trending AI startups hiring now",
  "Analyze sentiment around OpenAI",
  "Discover emerging cybersecurity companies",
  "Track investor interest in AI agents",
]

const FEATURES = [
  { icon: Search, label: "Live Internet Search", desc: "Real-time data from Reddit, News & Web" },
  { icon: Bot, label: "Autonomous Agent", desc: "AI plans, searches, and analyzes steps" },
  { icon: LineChart, label: "Intelligence Reports", desc: "Structured insights with trends & risks" },
  { icon: Shield, label: "Source Attribution", desc: "Every claim linked to its source" },
]

type Props = {
  onSelectPrompt: (prompt: string) => void
  onSend: (message: string) => void
}

export default function HeroScreen({ onSelectPrompt, onSend }: Props) {
  const [input, setInput] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input.trim())
    setInput("")
  }

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8">
        <motion.div
          className="flex flex-col items-center gap-2 text-center sm:gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 ring-1 ring-zinc-700/50 shadow-lg shadow-blue-500/5 sm:h-16 sm:w-16"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={26} className="text-blue-400 sm:size-[30px]" />
          </motion.div>
          <h2 className="max-w-2xl bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-2xl font-bold leading-tight text-transparent sm:text-3xl lg:text-4xl">
            Turn Live Internet Data Into Actionable Intelligence
          </h2>
          <p className="max-w-lg text-xs leading-relaxed text-zinc-500 sm:text-sm">
            InternetOS combines Wire, AI reasoning, and autonomous agents to transform real-time internet
            signals into decisions.
          </p>
        </motion.div>

        <motion.div
          className="flex w-full max-w-xl flex-wrap justify-center gap-2 sm:gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="group flex items-center gap-2.5 rounded-xl bg-zinc-900/40 px-3.5 py-2.5 ring-1 ring-zinc-800/40 transition hover:bg-zinc-800/40 hover:ring-zinc-700/60 sm:gap-3 sm:px-4 sm:py-3"
              whileHover={{ scale: 1.02, y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-600/10 ring-1 ring-zinc-700/40 transition group-hover:ring-blue-500/30 sm:h-9 sm:w-9">
                <f.icon size={14} className="text-blue-400 sm:size-[16px]" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-200 sm:text-sm">{f.label}</p>
                <p className="text-[10px] text-zinc-600 sm:text-xs">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="w-full max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600 sm:mb-3 sm:text-xs">
            Try an example
          </p>
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                onClick={() => onSelectPrompt(prompt)}
                className="group flex items-center gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/20 px-3.5 py-2.5 text-left text-xs text-zinc-400 transition hover:border-blue-500/30 hover:bg-zinc-800/30 hover:text-zinc-200 sm:gap-2.5 sm:px-4 sm:py-3 sm:text-sm"
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRight size={12} className="shrink-0 text-zinc-600 transition group-hover:text-blue-400 sm:size-[14px]" />
                <span className="leading-snug">{prompt}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 border-t border-zinc-800/40 bg-zinc-900/20 p-3 backdrop-blur-sm sm:p-4">
        <div className="mx-auto flex max-w-2xl gap-2 sm:gap-2.5">
          <div className="relative flex-1">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 sm:left-3.5 sm:size-[16px]" />
            <input
              className="w-full rounded-xl bg-zinc-900/60 py-2.5 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none ring-1 ring-zinc-800/60 transition focus:ring-2 focus:ring-blue-500/40 sm:py-3 sm:pl-10"
              placeholder="Type your research query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90 disabled:opacity-30 sm:gap-2 sm:px-5 sm:py-3"
          >
            <Send size={14} className="sm:size-[15px]" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  )
}
