import { useApiRequest } from "@gikdev/react-datapi/src"

type ResultKeyValues = string | number | null | undefined

export function useGetMasterInfo(input: string[]): ResultKeyValues[] {
  const res = useApiRequest<{ result: Record<string, ResultKeyValues> }>(() => ({
    url: "/Customer/GetMaster",
    defaultValue: { result: {} },
  }))

  if (!res.success || res.loading) return []

  const toReturn: ResultKeyValues[] = []

  input.map(key => toReturn.push(res.data?.result[key]))

  return toReturn
}
