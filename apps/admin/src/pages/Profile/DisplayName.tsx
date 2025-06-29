import { apiRequest } from "@gikdev/react-datapi/src"
import { FloppyDiskIcon } from "@phosphor-icons/react"
import { Btn, Input } from "@repo/shared/components"
import { useForm } from "react-hook-form"
import { useDisplayNameValue, useSetDisplayName } from "#/atoms"
import genDatApiConfig from "#/shared/datapi-config"
import { objToKeyVal } from "./profileImageUtils"

interface DisplayNameFormValues {
  name: string
}

export default function DisplayName() {
  const displayName = useDisplayNameValue()
  const setDisplayName = useSetDisplayName()

  const { register, handleSubmit } = useForm<DisplayNameFormValues>({
    defaultValues: {
      name: displayName || "",
    },
  })

  const onSubmit = (data: DisplayNameFormValues) => {
    const dataToSend = objToKeyVal({
      name: data.name,
    })

    apiRequest({
      config: genDatApiConfig(),
      options: {
        url: "/Master/UpdateF",
        method: "POST",
        body: JSON.stringify(dataToSend),
        onSuccess() {
          setDisplayName(data.name)
        },
      },
    })

    setDisplayName(data.name)
  }

  return (
    <form className="flex gap-2 items-center" onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("name", { required: "Display name is required" })} />

      <Btn className="w-12 p-1" theme="success" type="submit">
        <FloppyDiskIcon size={24} />
      </Btn>
    </form>
  )
}
