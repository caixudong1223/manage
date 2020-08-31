import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    // const roles = store.getters && store.getters.roles
    const permissions = store && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionUser = value

      const hasPermission = permissions.some(permission => {
        return permissionUser.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need permissions! Like v-permission="['sys:role:add']"`)
    }
  }
}
