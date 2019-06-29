import Cookies from "universal-cookie"
import _ from "lodash"

let options = {}
const cookies = new Cookies()

export function setOption(op = {}) {
  return _.merge({ path: "/" }, op)
}

export function addChangeListener(callback) {
  cookies.addChangeListener(callback)
}

export function removeChangeListener(callback) {
  cookies.removeChangeListener(callback)
}

export function setCookie(localStorageName, data) {
  cookies.set(localStorageName, data, { path: "/" })
}

export function getCookie(localStorageName, op = {}) {
  const cookie = cookies.get(localStorageName, op)
  if (cookie) {
    return cookie
  } else {
    return '';
  }
}

export function getAllCookies(op = {}) {
  return cookies.getAll(op)
}

export function removeCookie(localStorageName, op = {}) {
  cookies.remove(localStorageName, { path: "/" })
}

export function removeAllLocalItem(prefix, op) {
  const storageName = cookies.getAll()
  Object.keys(storageName).forEach(function (key) {
    const regex = new RegExp("^" + prefix + ".*", 'i')
    if (regex.test(key)) {
      removeCookie(key, op)
    }
  })
}