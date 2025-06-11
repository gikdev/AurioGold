export type NonNullableObj<TObj> = {
  [Property in keyof TObj]: NonNullable<TObj[Property]>
}

export type SafeOmit<Obj, K extends keyof Obj> = Omit<Obj, K>
