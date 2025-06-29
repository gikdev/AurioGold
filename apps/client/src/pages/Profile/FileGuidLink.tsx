import type { AnchorHTMLAttributes } from "react"
import genDatApiConfig from "#/shared/datapi-config"

interface FileGuidLink extends AnchorHTMLAttributes<HTMLAnchorElement> {
  guid?: string | null
}

export default function FileGuidLink({ guid, ...others }: FileGuidLink) {
  const isLink = !!guid
  const url = `${genDatApiConfig().baseUrl}/TyFiles/download/${guid}`

  if (!isLink) return <span className={others.className}>ندارن</span>

  return (
    <a
      className="border-b border-current transition-colors hover:text-blue-10"
      {...others}
      download
      href={url}
    >
      دانلود
    </a>
  )
}
