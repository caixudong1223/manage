import request from "@/utils/request";

/**
 * 查询城市列表（懒加载方式）
 * @param {*} data 
 */
export function queryCityAreaInfoList(params) {
  return request({
    url: "/water-facade-user/areaInfo/queryCityAreaInfoList",
    method: "post",
    params
  });
}


/**
 * 查询城市列表
 * @param {*} data 
 */
export function queryCityAreaTree(params) {
  return request({
    url: "/water-facade-user/areaInfo/queryCityAreaTree",
    method: "post",
    params
  });
}