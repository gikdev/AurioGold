import { v4 as uuid } from "uuid"

export type InputHint = {
  id: string
  text: string
  validate?: () => boolean
}

export interface InputHintProps {
  hints?: InputHint[]
}

export function InputHint({ hints }: InputHintProps) {
  if (!hints?.length) return null
  return (
    <ul>
      {hints.map(hint => (
        <SingleHint hint={hint} key={hint.id} />
      ))}
    </ul>
  )
}

interface SingleHintProps {
  hint: InputHint
}

function SingleHint({ hint }: SingleHintProps) {
  return (
    <li>
      <span>{hint.text}</span>
      {hint.validate?.() !== undefined && (hint.validate() ? " ✅" : " ❌")}
    </li>
  )
}

export type HintsObj = Record<string, InputHint[]>

type HintWithoutId = Omit<InputHint, "id">

export function createSingleHint(rawObj: HintWithoutId): InputHint {
  return { ...rawObj, id: uuid() }
}

export function createHintsObj(rawObj: Record<string, HintWithoutId>): HintsObj {
  const final: HintsObj = {}

  if (!objHasKeys(rawObj)) return final

  for (const key in rawObj) {
    if (Object.hasOwn(rawObj, key)) {
      const item = rawObj[key]
      if (!item) continue
      final[key] = [createSingleHint(item)]
    }
  }

  return final
}

function objHasKeys<T extends object>(obj: T): obj is T & Record<string, unknown> {
  return Object.keys(obj).length > 0
}
