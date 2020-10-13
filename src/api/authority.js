import request from "@/utils/request";

/**
 * 添加权限
 * @param {*} data
 */
export function addPermissions(data) {
  return request({
    url: `/water-facade-user/permission/addPermissions`,
    method: "post",
    data
  });
}

/**
 * 修改权限
 * @param {*} data
 */
export function updatePermissions(data) {
  return request({
    url: `/water-facade-user/permission/updatePermissions`,
    method: "post",
    data
  });
}

/**
 * 删除权限
 * @param {*} params
 */
export function deletePermission(params) {
  return request({
    url: `/water-facade-user/permission/deletePermission`,
    method: "post",
    params
  });
}

/**
 *
 * @param {*} params
 */
export function getPermission(params) {
  return request({
    url: `/water-facade-user/permission/getPermission`,
    method: "post",
    params
  });
}

/**
 * 获取权限详情
 * @param {*} params
 */
export function findPermissions(params) {
  return request({
    url: `/water-facade-user/permission/findPermissions`,
    method: "post",
    params
  });
}

/**
 * 获取菜单资源权限
 * @param {*} params
 */
export function selectPermissionByMenuId(data) {
  return request({
    url: `/water-facade-user/permission/selectPermissionByMenuId`,
    method: "post",
    data
  });
}

/**
 * 根据菜单id、角色id获取权限
 * @export
 */
export function selectPermissionByMenuIdAndRoleId(data) {
  return request({
    url: `/water-facade-user/permission/selectPermissionByMenuIdAndRoleId`,
    method: "post",
    data
  });
}

/**
 * 保存角色资源关系
 * @export
 */
export function addRolePermission(data){
  return request({
    url: `/water-facade-user/rolePermission/addRolePermission`,
    method: "post",
    data
  });
}

/**
 * 获取当前用户所有权限资源
 * @param {*} data
 */
export function selectPermissionByUserId(data) {
  return request({
    url: `/water-facade-user/permission/selectPermissionByUserId`,
    method: "post",
    data
  });
}