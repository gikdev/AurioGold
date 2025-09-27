import { create } from "zustand"

interface DateFilterState {
  fromDate: Date
  toDate: Date
  setFromDate: (date: Date) => void
  setToDate: (date: Date) => void
  resetDate: () => void

  isOpen: boolean
  setOpen: (isOpen: boolean) => void

  page: number
  count: number

  resetAll: () => void
}

export const useDateFilterStore = create<DateFilterState>()(set => ({
  fromDate: startOfDay(new Date()),
  toDate: endOfDay(new Date()),

  setFromDate: date => set({ fromDate: startOfDay(date) }),
  setToDate: date => set({ toDate: endOfDay(date) }),
  resetDate: () =>
    set({
      fromDate: startOfDay(new Date()),
      toDate: endOfDay(new Date()),
    }),

  isOpen: false,
  setOpen: isOpen => set({ isOpen }),

  page: 1,
  count: 100,

  resetAll: () =>
    set({
      isOpen: false,
      fromDate: startOfDay(new Date()),
      toDate: endOfDay(new Date()),
    }),
}))

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function endOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}
