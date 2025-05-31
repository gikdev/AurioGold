---
name: "Admin Page"
root: "apps/admin/src/pages"
output: "."
ignore: ["."]
questions: 
  name: "Enter page name:"
---

# `{{ inputs.name | pascal }}/index.tsx`

```typescript

export default function {{ inputs.name | pascal }}() {
  return <div>{/* TODO */}</div>
}
```
