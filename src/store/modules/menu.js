const state = {
  menuType: '',
  typeList: '',
  menuList: ''
}

const mutations = {
  MENU_MUTATION: (state, menudata) => {
    state.menuType = menudata.menuType;
    state.typeList = menudata.typeList;
    state.menuList = menudata.menuList
  }
}

const actions = {
  setMenu({ commit }, menudata) {
    commit("MENU_MUTATION", menudata)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
