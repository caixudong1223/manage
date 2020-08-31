import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import { Message, Loading } from 'element-ui'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import base from '@/api/base'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import permission from '@/directive/permission'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

const bus = new Vue()
Vue.prototype.$bus = bus

Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/*
重写elementUI message部分功能
* */
const LocalMessage = function(options ,single = true){
  options = options || {};
  if (typeof options === 'string') {
    options = {
      message: options
    };
  }
  if (single) {
    // 判断是否已存在Message
    if (document.getElementsByClassName('el-message').length === 0) {
      Message(options);
    }
  } else {
    Message(options);
  }
}

const LocalMessageTypes = ['success', 'warning', 'info', 'error']
LocalMessageTypes.forEach(type => {
  LocalMessage[type] = (options,single = true) => {
    if (typeof options === 'string') {
      options = {
        message: options
      };
    }
    options.type = type;
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName('el-message').length === 0) {
        return Message(options);
      }
    } else {
      return Message(options);
    }
  };
});

Vue.use(permission)

Vue.config.productionTip = false
Vue.prototype.$message = LocalMessage
Vue.prototype.$loading = Loading
Vue.prototype.$base = base

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})