import { getUserInfo } from "@/network/user.js"
import { message } from "tdesign-vue";

export default {
  namespaced: true,
  state: {
    loginUserInfo: undefined
  },
  mutations: {
    SET_LOGIN_USER_INFO(state, userInfo) {  
      state.loginUserInfo = userInfo
    },
  },
  actions: {
    // 获取登录用户信息
    async getLoginUserInfo(ctx, payload) {
      const userInfo = await getUserInfo();
      console.log(userInfo)
      if (userInfo.code === 200) {
        ctx.commit('SET_LOGIN_USER_INFO', userInfo.data);
      }else{
        message.error('获取用户信息失败');
      }
    },
  },
  getters: {
    // 根据传入ID获得用户名
    getLoginUserName:(state) => (id) => {
      if (state.loginUserInfo.id === id) {
        return state.loginUserInfo.name
      }else{
        return '未知用户'
      }
    }
  }
}