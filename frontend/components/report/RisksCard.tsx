import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import Card from "@/components/ui/Card"

type Props = {
  risks: string[]
}

export default function RisksCard({ risks }: Props) {
  if (!risks.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
    >
      <Card icon={<AlertTriangle size={14} />} title="Risk Signals" accent="amber">
        <ul className="space-y-2">
          {risks.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-amber-200/80">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
