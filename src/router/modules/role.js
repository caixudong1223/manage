/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const roleRouter = {
  path: '/role',
  component: Layout,
  redirect: '/role/index',
  name: 'Role',
  meta: {
    title: '角色管理',
    icon: 'table'
  },
  children: [
    {
      path: 'assign',
      component: () => import('@/views/system/role/assignMenuAndResource.vue'),
      name: 'assigMenuAndResource',
      meta: { title: '分配菜单与资源' }
    },
  ]
}
export default roleRouter
