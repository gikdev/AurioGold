import { HeadingLine } from "@repo/shared/layouts"
import SendSmsForm from "./SendSmsForm"

export default function SendSms() {
  return (
    <HeadingLine title="ارسال پیامک" className="flex flex-col gap-8">
      <SendSmsForm />
    </HeadingLine>
  )
}
