import { dict } from "@/network/static.js";

export default {
  namespaced: true,
  state: {
    article: undefined
  },
  getters: {
    transDict:( state ) => (filename, obj, key) => {
      return state[filename][obj].find(item => item.key === key).value
    },

    getDictObj:( state ) => (filename, obj) => {
      return state[filename][obj]
    }
  },
  mutations: {
    SET_ARTICLE(state, article) {
      state.article = article;
    },
  },
  actions: {
    // 缓存字典
    async cacheDict(ctx, payload) {
      if (ctx.state.article) {
        
        return;
      }else{
        let data = undefined;
        await dict(payload.fileName).then(res => {
          data = res;
        });
        console.log("缓存字典", payload.fileName);
        ctx.commit(payload.mutationsName, data);
      }
    }
  },
}