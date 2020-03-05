// import { asyncRoutes, constantRoutes } from '../../router'

// const state = {
//   routes: [],
//   addRoutes: []
// }

// const mutations = {
//   SET_ROUTES: (state, routes) => {
//     state.addRoutes = routes;
//     state.routes = constantRoutes.concat(routes)
//   }
// }

// const actions = {
//   generateRoutes({ commit }, roles) {
//     return new Promise(resolve => {
//       let accessedRoutes
//       //   如果角色为管理员，所有动态路由都可以查看
//       if (roles.includes('admin')) {
//         accessedRoutes = asyncRoutes || []
//       } else {
//         //   否则根据角色获取动态路由
//         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
//       }
//       commit('SET_ROUTES', accessedRoutes)
//       resolve(accessedRoutes)
//     })
//   }
// }

// // 使用meta.roles确定当前角色是否具有权限
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

// // 通过递归过滤动态路由
// export function filterAsyncRoutes(routes, roles) {
//   const res = [];
//   routes.forEach(route => {
//     const temp = { ...route };
//     if (hasPermission(roles, temp)) {
//       if (temp.children) {
//         temp.children = filterAsyncRoutes(temp.children, roles)
//       }
//       res.push(temp)
//     }
//   })
//   return res
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
