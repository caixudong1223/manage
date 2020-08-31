import {getToken} from "@/utils/auth";

/**
 * @description 导出工具方法
 * @author      wangxiushen
 * @date        2020/7/28 16:59
 * @export
 * @param {*}   address:接口地址,data:导出页的筛选条件,是个对象,vm:页面的this
 * @returns
 */
export function download(address, data, vm, fn) {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.responseType = 'blob';
  xmlhttp.open('POST',process.env.VUE_APP_BASE_API + address,true);
  xmlhttp.setRequestHeader('Content-Type', 'application/json');
  xmlhttp.setRequestHeader('Authorization', getToken());
  xmlhttp.send(JSON.stringify(data));
  function state_Change() {
    if (xmlhttp.readyState === 4) {
      // 4 = "loaded"
      if (xmlhttp.status === 200 && xmlhttp.getResponseHeader("filename") != null) {
        // 200 = "OK"
        let exportData = new Blob([xmlhttp.response]);
        let downloadUrl = window.URL.createObjectURL(exportData);
        let anchor = document.createElement('a');
        anchor.href = downloadUrl;
        const date = new Date();
        const month = date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1).toString();
        anchor.download = date.getFullYear().toString() + month + date.getDate().toString() + decodeURIComponent(xmlhttp.getResponseHeader("filename"));
        anchor.click();
        window.URL.revokeObjectURL(exportData);
        fn()
      } else {
        const reader = new FileReader();
        reader.readAsText(new Blob([xmlhttp.response]));
        reader.onload = function(){
          //读取完毕后输出结果
          let mes = JSON.parse(this.result)
          vm.$message.error({
            message: mes.message,
            type: 'error',
            duration: 3 * 1000
          })
        }

        fn()
      }
    }
  }
  xmlhttp.onreadystatechange = state_Change;
}
