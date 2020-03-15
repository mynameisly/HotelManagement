import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
          path: '/',
          redirect: '/login'
        },
        {
          path: '/',
          component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
          meta: { title: 'Home' },
          children: [
              {
                path: '/dashboard',
                component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                meta: { title: '系统首页' }
              },
              {
                path: '/checkin',
                component: () => import(/* webpackChunkName: "icon" */ '../pub/checkin/index'),
                meta: { title: '入住信息' }
              },
              {
                path: '/employee',
                component: () => import(/* webpackChunkName: "table" */ '../pub/employee/index'),
                meta: { title: '员工管理' }
              },
              {
                path: '/roomservice',
                component: () => import(/* webpackChunkName: "tabs" */ '../pub/roomservice/index'),
                meta: { title: '客户服务' }
              },
              {
                path: '/room',
                component: () => import(/* webpackChunkName: "form" */ '../pub/room/index'),
                meta: { title: '客房管理' }
              },
              {
                path: '/searchroom',
                component: () => import(/* webpackChunkName: "form" */ '../pub/searchroom/index'),
                meta: { title: '客房查询' }
              },
              {
                path: '/cropper',
                component: () => import(/* webpackChunkName: "upload" */ '../components/page/Cropper.vue'),
                meta: { title: '文件上传(可裁剪)' }
              },
              {
                path: '/checkout',
                component: () => import(/* webpackChunkName: "i18n" */ '../pub/checkout/index'),
                meta: { title: '退房记录' }
              },,
              {
                path: '/finance',
                component: () => import(/* webpackChunkName: "donate" */ '../pub/finance/index.vue'),
                meta: { title: '财务管理' }
              },
              {
                path: '/updatePwd',
                component: () => import(/* webpackChunkName: "donate" */ '../components/page/updatePwd.vue'),
                meta: { title: '修改密码' }
              }
          ]
        },
        {
          path: '/login',
          component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
          meta: { title: '登录' }
        },
        {
          path: '*',
          redirect: '/404'
        }
    ]
});
