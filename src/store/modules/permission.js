import { asyncRoutes, constantRoutes } from '@/router'
import { selectRoleMenus } from '@/api/menu'
import { selectPermissionByUserId } from '@/api/authority'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * 递归过滤异步路由表，返回符合系统所需结构的路由表
 * @param routes asyncRouterMap
 */
function translateRouters(routes, isTop = true) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    // 菜单为按钮，则略过
    if (Number(tmp.isLeaf) === 2) {
      return
    }

    if (!tmp.hasOwnProperty('path')) {
      tmp.path = tmp.menuUrl
    }

    if (tmp.upSubMenus) {
      tmp.upSubMenus = translateRouters(tmp.upSubMenus, false)
    }

    // 顶级菜单
    if (isTop) {
      doBuildTopRouter(tmp, res)
    } else {
      // 非顶级菜单
      const menu = {
        path: tmp.path,
        name: tmp.menuName,
        hidden: tmp.show === 0 ? true : false,
        component: resolve =>
          require([`@/views${tmp.path}/index.vue`], resolve),
        meta: {
          title: tmp.menuName,
          icon: tmp.menuIcon
        },
        children: tmp.upSubMenus
      }

      res.push(menu)
    }
  })
  return res
}

// 构建顶级菜单
function doBuildTopRouter(tmp, list) {
  if (!tmp.upSubMenus || tmp.upSubMenus.length <= 0) {
    // 顶层菜单-无下级菜单
    const menu = {
      path: tmp.path,
      name: tmp.menuName,
      // show: tmp.show,
      hidden: tmp.show === 0 ? true : false,
      component: Layout,
      redirect: 'noredirect',
      meta: {
        title: tmp.menuName,
        icon: tmp.menuIcon
      },
      children: [
        {
          path: 'index',
          component: resolve =>
            require([`@/views${tmp.path}/index.vue`], resolve),
          name: tmp.menuName,
          meta: {
            title: tmp.menuName,
            icon: tmp.menuIcon
          }
        }
      ]
    }
    list.push(menu)
  } else {
    // 顶层菜单-有下级菜单
    const menu = {
      path: tmp.path,
      name: tmp.menuName,
      hidden: tmp.show === 0 ? true : false,
      component: Layout,
      redirect: 'noredirect',
      meta: {
        title: tmp.menuName,
        icon: tmp.menuIcon
      },
      children: tmp.upSubMenus || []
    }

    list.push(menu)
  }
}

const state = {
  routes: constantRoutes,
  addRoutes: [],
  permissions: [] // 当前用户的所有权限资源
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSION: (state, permissions) => {
    state.permissions = permissions
  },
  RESET_ROUTES: state => {
    state.addRoutes = []
    state.routes = constantRoutes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = []
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }

      selectRoleMenus({}).then(res => {
        if (res.rescode === 2000 && res.data.length) {
          accessedRoutes = translateRouters(res.data, true)
        }
        commit('SET_ROUTES', accessedRoutes)
        resolve()
      })
    })
  },
  getAllPermission({ commit }) {
    return new Promise(resolve => {
      selectPermissionByUserId().then(res => {
        if (res.rescode === 2000 && res.data.length) {
          commit('SET_PERMISSION', res.data)
        }
        resolve()
      })
    })
  },
  resetPermission({ commit }) {
    return new Promise(resolve => {
      commit('SET_PERMISSION', [])
      commit('RESET_ROUTES')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
