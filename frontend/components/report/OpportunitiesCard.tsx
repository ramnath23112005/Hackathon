import { motion } from "framer-motion"
import { Target } from "lucide-react"
import Card from "@/components/ui/Card"

type Props = {
  opportunities: string[]
}

export default function OpportunitiesCard({ opportunities }: Props) {
  if (!opportunities.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
    >
      <Card icon={<Target size={14} />} title="Opportunities" accent="emerald">
        <ul className="space-y-2">
          {opportunities.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
