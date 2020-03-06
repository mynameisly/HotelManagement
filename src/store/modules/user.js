// import { setToken, getToken, removeToken } from '../../utils/token'
const state = {
  // token: getToken(),
  employeeId: '',
  number: '',
  // usertype: '',
  headImg: '',
  // roles: [],
  data: {},
  // isLogin: 0 // 初始时候给 isLogin=0表示未登录
}

const mutations = {
  // 改变登录状态， 为1表示已登录
  // CHANGE_LOGIN (state) {
  //   state.isLogin = 1
  // },
  USER_MUTATION: (state, userdata) => {
    // setToken(userdata.token)
    // state.token = userdata.token;
    state.data = userdata;
    state.employeeId = userdata.employeeId;
    state.number = userdata.number;
    // state.usertype = userdata.utype;
    state.headImg = userdata.headImg;
    // state.roles = userdata.roles;
  }
}

const actions = {
  // changeLogin ({ commit }) {
  //   commit('CHANGE_LOGIN')
  // },
  setUserdata({ commit }, userdata) {
    commit('USER_MUTATION', userdata);
  },
  getInfo({ commit, state }) {
    const data = state.data;
    state.employeeId = data.employeeId;
    state.number = data.number;
    // state.usertype = data.utype;
    state.headImg = data.headImg;
    // state.roles = data.roles;
  },
  // remove Token
  resetToken({ commit, state }) {
    return new Promise(resolve => {
      commit('USER_MUTATION', '')
      // state.roles = []
      // removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
