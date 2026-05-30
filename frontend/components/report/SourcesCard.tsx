import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import Card from "@/components/ui/Card"

type Props = {
  sources: string[]
}

export default function SourcesCard({ sources }: Props) {
  if (!sources.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
    >
      <Card icon={<Globe size={14} />} title={`Sources (${sources.length})`} accent="rose">
        <div className="flex flex-wrap gap-1.5">
          {sources.map((s, i) => (
            <span
              key={i}
              className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 ring-1 ring-zinc-700/50"
            >
              {s}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
