import { instance_api } from '@/network/axios.js'
import Cookies from 'js-cookie';

export function login(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/auth/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return instance_api({
    url: process.env.VUE_APP_API+'/auth/info',
    method: 'get',
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}