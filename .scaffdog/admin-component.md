---
name: "Admin Component"
root: "apps/admin/src/components"
output: "."
ignore: ["."]
questions: 
  name: "Enter component name:"
---

# `{{ inputs.name | pascal }}.tsx`

```typescript
// export interface {{ inputs.name | pascal }}Props {}

export function {{ inputs.name | pascal }}(
  // {}:{{ inputs.name | pascal }}Props
 ) {
  return <div>{/* TODO */}</div>
}
```

# `index.ts`

```typescript
{{ read output.abs }}export * from "./{{ inputs.name | pascal }}"
```
