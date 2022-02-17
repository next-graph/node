export const storage = globalThis.document
  ? new Proxy(localStorage, {
    set(target, prop, value) {
      Reflect.apply(target.setItem, target, [prop, JSON.stringify(value)])
      return true
    },
    get(target, prop) {
      return JSON.parse(Reflect.apply(target.getItem, target, [prop]))
    },
    deleteProperty(target, prop) {
      Reflect.apply(target.removeItem, target, [prop])
      return true
    },
  })
  : {}
