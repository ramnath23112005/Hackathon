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
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.05)_0%,transparent_60%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-4">
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 ring-1 ring-zinc-700/50 shadow-lg shadow-blue-500/5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={30} className="text-blue-400" />
          </motion.div>
          <h2 className="max-w-2xl bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl">
            Turn Live Internet Data Into Actionable Intelligence
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-zinc-500">
            InternetOS combines Wire, AI reasoning, and autonomous agents to transform real-time internet
            signals into decisions.
          </p>
        </motion.div>

        <motion.div
          className="flex w-full max-w-xl flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              className="group flex items-center gap-3 rounded-xl bg-zinc-900/40 px-4 py-3 ring-1 ring-zinc-800/40 transition hover:bg-zinc-800/40 hover:ring-zinc-700/60"
              whileHover={{ scale: 1.02, y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-violet-600/10 ring-1 ring-zinc-700/40 transition group-hover:ring-blue-500/30">
                <f.icon size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{f.label}</p>
                <p className="text-xs text-zinc-600">{f.desc}</p>
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
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.15em] text-zinc-600">
            Try an example
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {EXAMPLE_PROMPTS.map((prompt, i) => (
              <motion.button
                key={i}
                onClick={() => onSelectPrompt(prompt)}
                className="group flex items-center gap-2.5 rounded-xl border border-zinc-800/50 bg-zinc-900/20 px-4 py-3 text-left text-sm text-zinc-400 transition hover:border-blue-500/30 hover:bg-zinc-800/30 hover:text-zinc-200"
                whileHover={{ scale: 1.02, x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRight size={14} className="shrink-0 text-zinc-600 transition group-hover:text-blue-400" />
                <span className="leading-snug">{prompt}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 border-t border-zinc-800/40 bg-zinc-900/20 p-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl gap-2.5">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              className="w-full rounded-xl bg-zinc-900/60 py-3 pl-10 pr-3.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none ring-1 ring-zinc-800/60 transition focus:ring-2 focus:ring-blue-500/40"
              placeholder="Type your research query..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90 disabled:opacity-30"
            whileTap={{ scale: 0.97 }}
          >
            <Send size={15} />
            Send
          </motion.button>
        </div>
      </form>
    </div>
  )
}
