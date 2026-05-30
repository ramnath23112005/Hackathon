import { motion } from "framer-motion"
import { Cpu } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
          <Cpu size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">InternetOS</h1>
          <p className="text-[10px] text-zinc-500">AI-Native Research Operating System</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.span
          className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          LIVE INTERNET INTELLIGENCE
        </motion.span>
      </div>
    </header>
  )
}
