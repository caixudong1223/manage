import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const iconList = req.keys().map(item => req(item))
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

export default {
    // 获取图标icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
    getNameList() {
        return iconList.map(item => item.default.id.split('-')[1])
    }
}