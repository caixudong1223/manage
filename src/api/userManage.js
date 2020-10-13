/**
 * @description 用户管理api
 * @author caixudong
 * @date 2020-06-29
 */

import request from "@/utils/request";

/**
 * @description 管理员管理—查询所有管理人员以及角色
 * @param {*} data
 */
export function selectAllManageInfo(data) {
  return request({
    url: `/water-facade-user/userProfile/pageBySelective`,
    method: "post",
    data
  });
}

/**
 * @description 管理员管理—查询所有店铺人员以及角色
 * @param {*} data
 */
export function selectAllStoreUserInfo(data) {
  return request({
    url: `/water-facade-user/manage/selectAllStoreUserInfo`,
    method: "post",
    data
  });
}

/**
 * @description 获取管理员端角色（不分页）
 * @param {*} data
 */
export function selectManageRoles(data) {
  return request({
    url: `/water-facade-user/roles/selectManageRoles`,
    method: "post",
    data
  });
}

/**
 * @description 获取店铺端所有角色
 * @param {*} data
 */
export function selectStoreRoles(data) {
  return request({
    url: `/water-facade-user/roles/selectStoreRoles`,
    method: "post",
    data
  });
}

/**
 * @description 管理员/店铺人员管理—分配角色
 * @param {*} data
 */
export function addUserRole(data) {
  return request({
    url: `/water-facade-user/manage/addUserRole`,
    method: "post",
    data
  });
}

/**
 * @description 管理员管理—添加管理员
 * @param {*} data
 */
export function addManage(data) {
  return request({
    url: `/water-facade-user/manage/addManage`,
    method: "post",
    data
  });
}

/**
 * @description 店铺管理—添加用户
 * @param {*} data
 */
export function addStoreUser(data) {
  return request({
    url: `/water-facade-user/manage/addStoreUser`,
    method: "post",
    data
  });
}

/**
 * @description 管理员管理—修改管理员用户信息
 * @param {*} data
 */
export function updateManageInfo(data) {
  return request({
    url: `/water-facade-user/manage/updateManageInfo`,
    method: "post",
    data
  });
}

/**
 * @description 店铺人员管理—修改人员信息
 * @param {*} data
 */
export function updateStoreUserInfo(data) {
  return request({
    url: `/water-facade-user/manage/updateStoreUserInfo`,
    method: "post",
    data
  });
}

/**
 * @description 管理员管理—删除用户
 * @param {*} params
 */
export function deleteManage(params) {
  return request({
    url: `/water-facade-user/manage/deleteManage`,
    method: "post",
    params
  });
}

/**
 * @description 管理员管理—删除用户
 * @param {*} params
 */
export function deleteStoreUser(params) {
  return request({
    url: `/water-facade-user/manage/deleteStoreUser`,
    method: "post",
    params
  });
}

/**
 * @description 平台、店铺获取用户信息
 * @param {*} params
 */
export function getManageInfoByUserId(params) {
  return request({
    url: `/water-facade-user/manage/getManageInfoByUserId`,
    method: "post",
    params
  });
}

/**
 * @description 启停用户
 * @param {*} data
 */
export function updateUserLogin(data) {
  return request({
    url: `/water-facade-user/manage/updateUserLogin`,
    method: "post",
    data
  });
}
