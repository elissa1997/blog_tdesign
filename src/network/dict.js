import { instance_api } from '@/network/axios.js'
import Cookies from 'js-cookie';

// 字典列表
export function list(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'/dict/list',
    method: 'get',
    params,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

export function findbytype(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'/dict/findbytype',
    method: 'get',
    params,
    // headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

// 增加字典
export function add(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/dict/add',
    method: 'post',
    data,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

// 修改字典
export function update(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/dict/update',
    method: 'post',
    data,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

// 删除字典
export function del(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/dict/delete',
    method: 'post',
    data,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}