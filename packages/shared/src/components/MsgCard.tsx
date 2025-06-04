import styled from "@master/styled.react"
import { Heading, Hr } from "#shared/components"

interface MsgCardProps {
  title: string
  children: string
}

export function MessageCard({ title, children }: MsgCardProps) {
  const Container = styled.div`
    bg-slate-2 border-2 border-slate-6 px-4 py-8
    flex flex-col gap-4 rounded-lg max-w-max
  `

  return (
    <Container>
      <div className="flex flex-col gap-2">
        <Heading as="h2" size={2} className="text-center">
          {title}
        </Heading>
        <Hr />
        <p className="text-center">{children}</p>
      </div>
    </Container>
  )
}
