import request from '@/utils/request'

/**
 * 账号密码登录
 * @param {*} params 
 */
export function login(params) {
  return request({
    url: `/water-facade-user/user/login`,
    method: 'post',
    params
  })
}

/**
 * 获取图形验证码
 */
export function getCaptcha() {
  return request({
    url: `/water-facade-user/user/captcha.jpg`,
    method: 'get',
    params: {
      st: new Date().getTime()
    }
  })
}

/**
 * 短信验证码登录
 * @param {*} data 
 */
export function loginSms(params) {
  return request({
    url: `/water-facade-user/user/login-sms`,
    method: 'post',
    params
  })
}

/**
 * 获取短信验证码
 * @param {*} params
 */
export function getSmsCode(params) {
  return request({
    url: `/water-facade-user/sms/getSmsCode`,
    method: 'post',
    params
  })
}

/**
 * 获取用户信息
 */
export function getInfo() {
  return request({
    url: `/water-facade-user/userProfile/getCurrentUserInfo`,
    method: 'post',
    params: {}
  })
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: `/water-facade-user/user/logout`,
    method: 'post'
  })
}

/**
 * 获取短信验证码
 * @param {*} data
 */
export function getPhoneCode(params) {
  return request({
    url: `/water-facade-user/sms/getPhoneCode`,
    method: 'post',
    params
  })
}