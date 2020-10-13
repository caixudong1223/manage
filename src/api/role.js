import request from '@/utils/request'

/**
 * 分页查询角色
 * @param {*} data 
 */
export function pageRoles(data) {
  return request({
    url: '/water-facade-user/roles/pageRoles',
    method: 'post',
    data
  })
}

/**
 * 获取角色详情
 * @param {*} params 
 */
export function getRoleDetail(params) {
  return request({
    url: '/water-facade-user/roles/getRoleDetail',
    method: 'post',
    params
  })
}

/**
 * 添加角色
 * @param {*} data 
 */
export function addRole(data) {
  return request({
    url: '/water-facade-user/roles/addRole',
    method: 'post',
    data
  })
}

/**
 * 更新角色
 * @param {*} data 
 */
export function updateRole(data) {
  return request({
    url: `/water-facade-user/roles/updateRole`,
    method: 'post',
    data
  })
}

/**
 * 删除角色
 * @param {*} params 
 */
export function deleteRole(params) {
  return request({
    url: `/water-facade-user/roles/deleteRole`,
    method: 'post',
    params
  })
}
