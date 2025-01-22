import { dict } from "@/network/static.js";

export default {
  namespaced: true,
  state: {
  },
  getters: {
    transDict:( state ) => (dict_type, key) => {
      return state[dict_type].find(item => item.value === key).name
    },

    getDictObj:( state ) => (dict_type) => {
      return state[dict_type]
    }
  },
  mutations: {
    SET_DICT(state, {dict_type, data}) {
      console.log("SET_DICT", dict_type, data);
      state[dict_type] = data;
    }
  },
  actions: {
    // 缓存字典
    async cacheDict(ctx, payload) {
      if (ctx.state[payload.dict_type]) {
        console.log("字典已存在");
        return;
      }else{
        let data = undefined;
        await dict({dict_type: payload.dict_type}).then(res => {
          data = res;
        });

        if (data.code === 200) {
          console.log("缓存字典数据", data.data.rows);
          ctx.commit("SET_DICT", { dict_type: payload.dict_type, data: data.data.rows });
        }
      }
    }
  },
}