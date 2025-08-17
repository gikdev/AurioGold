import { CircleNotchIcon } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

interface CountdownProps {
  minutes: number | null
}

export function Countdown({ minutes }: CountdownProps) {
  const isTimer = typeof minutes === "number" && minutes > 0
  const [sec, setSec] = useState(minutes ?? 0)

  useEffect(() => {
    if (typeof minutes !== "number") return
    const newSec = minutes * 60
    setSec(newSec)
  }, [minutes])

  useEffect(() => {
    if (sec === 0 || !isTimer) return
    setTimeout(() => setSec(sec - 1), 1000)
  }, [sec, isTimer])

  return (
    <div className="text-slate-12 text-3xl font-bold flex gap-1 items-center">
      <time className="relative top-1">{formatSecondsToClock(sec)}</time>
      <CircleNotchIcon className="animate-spin" size={48} />
    </div>
  )
}

function formatSecondsToClock(seconds: number): string {
  const s = seconds % 60
  const strS = s.toString().padStart(2, "0")

  const m = Math.floor((seconds % (60 * 60)) / 60)
  const strM = m.toString().padStart(2, "0")

  const h = Math.floor(seconds / (60 * 60))
  const strH = h.toString().padStart(2, "0")

  return `${strH}:${strM}:${strS}`
}
