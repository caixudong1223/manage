import request from "@/utils/request";

/**
 * 商品中心文件上传
 * @param {*} data
 */
export function goodsUploadFile(data) {
  return request({
    url: `/hellozj-file/file/goods/uploadFile`,
    method: "post",
    data
  });
}
