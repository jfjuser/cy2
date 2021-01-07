import webStorageCache from 'web-storage-cache'
/* eslint-disable-next-line */
const Storage = new webStorageCache()

const Session = {}
Session.set = (key, value, isjson = true) => {
  if (isjson) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } else {
    window.sessionStorage.setItem(key, value)
  }
}

Session.get = (key, isjson = true) => {
  if (isjson) {
    return JSON.parse(window.sessionStorage.getItem(key))
  }
  return window.sessionStorage.getItem(key)
}

Session.remove = (key) => {
  return window.sessionStorage.removeItem(key)
}

export {
  Storage,
  Session
}
