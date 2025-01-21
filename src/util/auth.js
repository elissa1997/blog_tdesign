// 鉴权相关
import Cookies from 'js-cookie';
import dayjs from "dayjs";
import Router from "@/router/index.js";
import Store from "@/store/index.js";
import { message } from 'tdesign-vue';

// 登录成功后保存token并跳转
export function loginSuccess(token) {
  let time = dayjs().add(12, 'h').toDate();
  Cookies.set('token', token, { expires: time });
  Store.dispatch('user/getLoginUserInfo').then(() => {
    Router.push('/admin')
  });
}

// 通过路由检查是否存在token
export function checkTokenByRouter(to, from, next) {
  if (to.meta.auth) {
    //cookie中存在token, 可以直接next
    //没有登录 跳转到/login
    if (Cookies.get('token')) {
      next();
    } else {
      message.error('Please login first');
      next({ path: '/login' })
    }
  } else {
    next();
  }
}

// 通过网络请求返回检查token是否过期
export function checkTokenByApi() {

}