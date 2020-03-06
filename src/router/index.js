import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
          path: '/',
          redirect: '/dashboard'
        },
        {
          path: '/',
          component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
          meta: { title: '自述文件' },
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
                component: () => import(/* webpackChunkName: "table" */ '../pub/employee/a'),
                meta: { title: '员工管理' }
              },
              {
                path: '/roomservice',
                component: () => import(/* webpackChunkName: "tabs" */ '../pub/roomservice/index'),
                meta: { title: '客房服务' }
              },
              {
                path: '/roomstate',
                component: () => import(/* webpackChunkName: "form" */ '../pub/roominfo/roomstate'),
                  meta: { title: '客房状态' }
              },
              {
                path: '/roomtype',
                component: () => import(/* webpackChunkName: "markdown" */ '../pub/roominfo/roomtype'),
                meta: { title: '客房类型' }
              },
              {
                // 图片上传组件
                path: '/upload',
                component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                meta: { title: '文件上传' }
              },
              {
                // 退房办理组件
                path: '/checkout',
                component: () => import(/* webpackChunkName: "i18n" */ '../pub/checkout/index'),
                meta: { title: '退房办理' }
              },
              {
                // 权限页面
                path: '/permission',
                component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                meta: { title: '权限测试', permission: true }
              },
              {
                path: '/404',
                component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                meta: { title: '404' }
              },
              {
                path: '/403',
                component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                meta: { title: '403' }
              },
              {
                path: '/finance',
                component: () => import(/* webpackChunkName: "donate" */ '../pub/finance/index.vue'),
                meta: { title: '财务管理' }
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
