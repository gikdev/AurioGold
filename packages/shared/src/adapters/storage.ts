import Cookies from "js-cookie"

interface StorageAdapter {
  get: (name: string) => string | undefined | null
  set: (name: string, value: string) => void
  remove: (name: string) => void
}

type StorageKey = "cookie" | "localStorage" | "sessionStorage"

const adapters: Record<StorageKey, StorageAdapter> = {
  cookie: {
    get: name => Cookies.get(name),
    set: (name, value) => Cookies.set(name, value),
    remove: name => Cookies.remove(name),
  },
  localStorage: {
    get: name => localStorage.getItem(name),
    set: (name, value) => localStorage.setItem(name, value),
    remove: name => localStorage.removeItem(name),
  },
  sessionStorage: {
    get: name => sessionStorage.getItem(name),
    set: (name, value) => sessionStorage.setItem(name, value),
    remove: name => sessionStorage.removeItem(name),
  },
}

export const storageManager = {
  save: (key: string, value: string, targetOrTargets: StorageKey | StorageKey[]) => {
    if (!Array.isArray(targetOrTargets)) {
      adapters[targetOrTargets].set(key, value)
      return
    }

    for (const target of targetOrTargets) {
      adapters[target].set(key, value)
    }
  },

  get: (key: string, targetOrTargets: StorageKey | StorageKey[]) => {
    if (!Array.isArray(targetOrTargets)) {
      const value = adapters[targetOrTargets].get(key)
      return value
    }

    for (const target of targetOrTargets) {
      const value = adapters[target].get(key)
      if (value != null) return value
    }

    return null
  },

  remove: (key: string, targetOrTargets: StorageKey | StorageKey[]) => {
    if (!Array.isArray(targetOrTargets)) {
      adapters[targetOrTargets].remove(key)
      return
    }

    for (const target of targetOrTargets) {
      adapters[target].remove(key)
    }
  },
}
