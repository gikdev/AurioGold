interface NotesProps {
  notes: string[]
}

export function Notes({ notes }: NotesProps) {
  return (
    <div className="">
      <p className="text-slate-12 font-bold">نکات:</p>
      <ul className="ps-2">
        {notes.map(n => (
          <li className="" key={n}>
            - {n}
          </li>
        ))}
      </ul>
    </div>
  )
}
