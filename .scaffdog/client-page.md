---
name: "Client Page"
root: "apps/client/src/pages"
output: "."
ignore: ["."]
questions: 
  name: "Enter page name:"
---

# `{{ inputs.name | pascal }}/index.tsx`

```typescript
// export interface {{ inputs.name | pascal }}Props {}

export default function {{ inputs.name | pascal }}(
  // {}:{{ inputs.name | pascal }}Props
 ) {
  return <div>{/* TODO */}</div>
}
```
