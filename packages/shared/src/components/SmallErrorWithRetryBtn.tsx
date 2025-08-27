import { skins } from "#shared/forms"

interface SmallErrorWithRetryBtnProps {
  details?: string
  onClick?: () => void
}

export function SmallErrorWithRetryBtn({ details, onClick }: SmallErrorWithRetryBtnProps) {
  return (
    <div className="flex flex-col gap-2 items-center justify-center p-4 bg-red-2 text-red-11 rounded-md">
      <p>یه مشکلی پیش اومده</p>

      {details && (
        <code dir="auto" className="bg-black text-white font-mono rounded-sm p-2">
          {details}
        </code>
      )}

      <button type="button" onClick={onClick} className={skins.btn({ intent: "error" })}>
        امتحان دوباره
      </button>
    </div>
  )
}
