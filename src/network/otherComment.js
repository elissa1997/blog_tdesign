import { instance_api } from '@/network/axios.js'
import Cookies from 'js-cookie';

// 评论列表
export function list(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'/othercomment/list',
    method: 'get',
    params,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

export function findbytype(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'/othercomment/findbytype',
    method: 'get',
    params,
    // headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

// 增加评论
export function add(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/othercomment/add',
    method: 'post',
    data
  })
}

// 修改评论
export function update(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/othercomment/update',
    method: 'post',
    data,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

// 删除评论
export function del(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/othercomment/del',
    method: 'post',
    data,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}