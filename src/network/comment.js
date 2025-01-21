import { instance_api } from '@/network/axios.js'
import Cookies from 'js-cookie';

// 根据文章ID获取评论列表
export function list(params) {
  return instance_api({
    url: process.env.VUE_APP_API+'/comment/list',
    method: 'get',
    params,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

// 增加评论
export function add(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/comment/add',
    method: 'post',
    data
  })
}

// 修改评论
export function update(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/comment/update',
    method: 'post',
    data,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}

// 删除评论
export function del(data) {
  return instance_api({
    url: process.env.VUE_APP_API+'/comment/del',
    method: 'post',
    data,
    headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
  })
}