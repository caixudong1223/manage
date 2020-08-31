/** When your routing table is too long, you can split it into small modules**/

import Layout from "@/layout";

const sysRouter = {
  path: "/system",
  component: Layout,
  redirect: "noRedirect",
  name: "system",
  meta: {
    title: "权限管理",
    icon: "chart"
  },
  children: [
    {
      path: "user",
      component: () => import("@/views/auth/user.vue"),
      name: "user",
      meta: { title: "用户列表", noCache: true }
    },
    {
      path: "role",
      component: () => import("@/views/auth/role.vue"),
      name: "role",
      meta: { title: "角色列表", noCache: true }
    },
    {
      path: "menu-and-resource",
      component: () => import("@/views/auth/menuAndResource.vue"),
      name: "menuAndResource",
      meta: { title: "菜单与资源", noCache: true }
    }
  ]
};

export default sysRouter;
