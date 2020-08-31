import request from "@/utils/request";

// 获取当前用户菜单
export function selectRoleMenus(data) {
  return request({
    url: `/hellozj-admin/roleMenu/selectRoleMenus`,
    method: "post",
    data
  });
}

// 获取所有菜单
export function selectAllMenus(params) {
  return request({
    url: `/hellozj-admin/menu/selectAllMenus`,
    method: "post",
    params
  });
}

// 获取菜单详情
export function selectMenuDetail(params) {
  return request({
    url: `/hellozj-admin/menu/selectMenuDetail`,
    method: "post",
    params
  });
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: `/hellozj-admin/menu/addMenu`,
    method: "post",
    data
  });
}

// 删除菜单
export function delMenu(params) {
  return request({
    url: `/hellozj-admin/menu/delMenu`,
    method: "post",
    params
  });
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: `/hellozj-admin/menu/updateMenu`,
    method: "post",
    data
  });
}

/**
 * 根据角色获取菜单
 * @param {*} params
 */
export function selectRoleMenusByRoleId(params) {
  return request({
    url: `/hellozj-admin/roleMenu/selectRoleMenusByRoleId`,
    method: "post",
    params
  });
}

/**
 * 根据角色id获取已勾选角色id集合
 * @param {*} params
 */
export function selectMenuIdsByRoleId(params) {
  return request({
    url: `/hellozj-admin/roleMenu/selectMenuIdsByRoleId`,
    method: "post",
    params
  });
}

/**
 * 添加角色与菜单关系
 */
export function addRoleMenus(data) {
  return request({
    url: `/hellozj-admin/roleMenu/addRoleMenus`,
    method: "post",
    data
  });
}
