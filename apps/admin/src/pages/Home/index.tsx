import { styled } from "@repo/shared/helpers"

// export interface HomeProps {}

const Btn = styled(
  "button",
  `
  bg-blue-9 hover:bg-blue-4 cursor-pointer
  hover:bg-blue-10 py-2 px-5 rounded-lg
`,
)

export default function Home(
  // {}:HomeProps
) {
  return (
    <div>
      <Btn type="button">سلام به همگی!</Btn>
    </div>
  )
}
