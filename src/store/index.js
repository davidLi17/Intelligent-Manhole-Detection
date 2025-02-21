import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id:'',
    scatterData:[],
    msg:[{sender: "photoB", text: "" },{ sender: "bot", text: "需要什么帮助吗" }]
  },
  getters: {
    getId(state) {
      return state.id;
    },
    getScatterData: state => state.scatterData,
    getMsg: state => state.msg
  },
  mutations: {
    updateId(state, newId) {
      state.id = newId;
    },
    setScatterData(state, data) {
      state.scatterData = data;
    },
    setMsg(state, data) {
      state.msg = data;
    }
  },
  actions: {
    setId({ commit }, newId) {
      commit('updateId', newId);
    },
    updateScatterData({ commit }, data) {
      commit('setScatterData', data);
    },
    updateMsg({ commit }, data) {
      commit('setMsg', data);
    }
  },
  modules: {
  }
})
