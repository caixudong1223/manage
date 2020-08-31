import Cookies from 'js-cookie'

const TokenKey = 'access_token'
const TokenRefreshKey = 'refresh_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get(TokenRefreshKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setRefreshToken(token) {
  return Cookies.set(TokenRefreshKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(TokenRefreshKey)
}