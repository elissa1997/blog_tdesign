import { instance_api } from '@/network/axios.js'

export function dict(params) {
  return instance_api({
    url: process.env.VUE_APP_API + '/dict/findbytype',
    method: 'get',
    params
  })
}

export function json(fileName) {
  return instance_api({
    url: process.env.VUE_APP_STATIC_URL+'blog/json/'+fileName+'.json',
    method: 'get',
  })
}