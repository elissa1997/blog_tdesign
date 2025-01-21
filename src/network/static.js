import { instance_api } from '@/network/axios.js'

export function dict(fileName) {
  return instance_api({
    url: process.env.VUE_APP_STATIC_URL+'blog/json/'+fileName+'.json',
    method: 'get',
  })
}

export function json(fileName) {
  return instance_api({
    url: process.env.VUE_APP_STATIC_URL+'blog/json/'+fileName+'.json',
    method: 'get',
  })
}