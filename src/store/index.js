// 导入 Vue 核心库
import Vue from 'vue'
// 导入 Vuex 状态管理库
import Vuex from 'vuex'

// 在 Vue 中安装 Vuex 插件
Vue.use(Vuex)

// 创建并导出 Vuex store 实例
export default new Vuex.Store({
  // 定义状态(数据)
  state: {
    id: '', // 用户 ID
    scatterData: [], // 散点图数据
    msg: [
      { sender: "photoB", text: "" },
      { sender: "bot", text: "需要什么帮助吗" }
    ] // 消息数组，包含发送者和文本内容
  },

  // 定义 getters（类似 Vue 中的计算属性）
  getters: {
    // 获取 ID，并在控制台打印状态
    getId(state) {
      console.log('In index.js state::: ', state);
      return state.id;
    },
    // 获取散点图数据（使用箭头函数简写）
    getScatterData: state => state.scatterData,
    // 获取消息数据
    getMsg: state => state.msg
  },

  // 定义 mutations（用于修改状态的方法）
  mutations: {
    // 更新 ID
    updateId(state, newId) {
      state.id = newId;
    },
    // 设置散点图数据
    setScatterData(state, data) {
      state.scatterData = data;
    },
    // 设置消息数据
    setMsg(state, data) {
      state.msg = data;
    }
  },

  // 定义 actions（可包含异步操作，通过提交 mutation 来修改状态）
  actions: {
    // 设置 ID 的 action
    setId({ commit }, newId) {
      commit('updateId', newId);
    },
    // 更新散点图数据的 action
    updateScatterData({ commit }, data) {
      commit('setScatterData', data);
    },
    // 更新消息数据的 action
    updateMsg({ commit }, data) {
      commit('setMsg', data);
    }
  },

  // 模块配置（用于将 store 分割成模块），当前为空
  modules: {
  }
})