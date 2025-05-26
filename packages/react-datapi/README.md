# react-datapi

A React hook for handling API requests with TypeScript support.

[![npm](https://img.shields.io/npm/v/@gikdev/react-datapi)](https://npmjs.com/package/@gikdev/react-datapi)

## Install

```bash
npm install @gikdev/react-datapi
```

## Example Usage:

```typescript
import { useApiRequest } from '@gikdev/react-datapi'

const { data, loading, error, reload } = useApiRequest(() => ({
  url: '/todos',
  defaultValue: [],
}))
```
