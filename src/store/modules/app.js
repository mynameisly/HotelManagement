
// const state = {
//   sidebar: {
//     opened: true
//   },
//   themeColor: '#33a0bb'
// }

// const mutations = {
//   // sidebar切换
//   TOGGLE_SIDEBAR: state => {
//     state.sidebar.opened = !state.sidebar.opened
//   },
//   CLOSE_SIDEBAR: (state) => {
//     state.sidebar.opened = false
//   },
//   OPEN_SIDEBAR: (state) => {
//     state.sidebar.opened = true
//   },
//   // 主题切换
//   TOGGLE_COLOR: (state, color) => {
//     state.themeColor = color;
//     // 动态修改homeicon颜色
//     const homeicon = document.getElementById("homeIcon");
//     homeicon.style.color = state.themeColor;
//     const homespan = document.querySelector("#homeIcon+span");
//     homespan.style.color = state.themeColor;
//   }
// }

// const actions = {
//   toggleSideBar({ commit }) {
//     commit('TOGGLE_SIDEBAR')
//   },
//   closeSideBar({ commit }) {
//     commit('CLOSE_SIDEBAR')
//   },
//   openSideBar({ commit }) {
//     commit('OPEN_SIDEBAR')
//   },
//   toggleColor({ commit }, color) {
//     commit('TOGGLE_COLOR', color)
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
