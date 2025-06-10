interface OnlineNumberCardProps {
  num: number
  description: string
}

export default function OnlineNumberCard({ description, num }: OnlineNumberCardProps) {
  return (
    <div className="flex flex-col gap-2 border border-slate-6 bg-slate-3 max-w-40 p-4 items-center rounded-md w-full relative">
      {num > 0 && (
        <span
          className="
            inline-block bg-green-9 rounded-full w-4 h-4
            top-0 left-0 -translate-1/2 absolute
            after:inline-block after:bg-green-9 after:rounded-full after:w-4 after:h-4
            after:top-0 after:left-0 after:absolute
            after:animate-ping
          "
        />
      )}

      <p className="text-5xl text-slate-12 font-bold">{num}</p>

      <p className="text-xs text-slate-11">{description}</p>
    </div>
  )
}
