import { motion } from "framer-motion"
import { Sparkles, Search, LineChart, Shield, Bot } from "lucide-react"

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
}

export default function HeroScreen({ onSelectPrompt }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 ring-1 ring-zinc-700/50">
            <Sparkles size={28} className="text-blue-400" />
          </div>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-zinc-100">
          Turn Live Internet Data Into Actionable Intelligence
        </h2>
        <p className="mx-auto max-w-md text-sm text-zinc-500 leading-relaxed">
          InternetOS combines Wire, AI reasoning, and autonomous agents to transform real-time internet
          signals into decisions.
        </p>
      </motion.div>

      <motion.div
        className="mb-8 grid grid-cols-2 gap-2"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 rounded-lg bg-zinc-900/50 px-3 py-2.5 ring-1 ring-zinc-800/50"
          >
            <f.icon size={14} className="mt-0.5 shrink-0 text-blue-400" />
            <div>
              <p className="text-xs font-medium text-zinc-300">{f.label}</p>
              <p className="text-[10px] text-zinc-600">{f.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        <p className="mb-2 text-center text-[10px] font-medium uppercase tracking-widest text-zinc-600">
          Try an example
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSelectPrompt(prompt)}
              className="group flex items-center gap-2 rounded-lg border border-zinc-800/60 bg-zinc-900/30 px-3.5 py-2.5 text-left text-xs text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-800/40 hover:text-zinc-200"
            >
              <span className="text-zinc-600 transition group-hover:text-blue-400">&rarr;</span>
              {prompt}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
