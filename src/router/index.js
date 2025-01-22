import Vue from 'vue'
import VueRouter from 'vue-router'
import { checkTokenByRouter } from "@/util/auth.js";

Vue.use(VueRouter)

const originPush = VueRouter.prototype.push
// 覆盖原型链的push
VueRouter.prototype.push = function(location,resolve,reject){
    // this:路由实例对象
    
    // 判断用户有没有传后面两个可选参数
    if( resolve || reject ){
      return originPush.call(this,location,resolve,reject)
    }else{// 用户只传了第一个参数
      /* 
      默认底层： catch()方法代码  throw err : 抛出异常
      吞掉报错原理： 重写catch()方法,把默认底层的 throw err给去掉，就不会抛出异常
      */
      return originPush.call(this,location).catch(err => {
        //  throw err
      })
    }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { 
      auth: false,
      footer: true,
      active: ['Home']
    },
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/article',
    name: 'Article',
    meta: {
      auth: false,
      footer: true,
      active: ['Article']
    },
    component: () => import('@/views/Article.vue')
  },
  {
    path: '/links',
    name: 'Links',
    meta: {
      auth: false,
      footer: true,
      active: ['Links']
    },
    component: () => import('@/views/Links.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      auth: false,
      footer: true,
      active: ['About']
    },
    component: () => import('@/views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      auth: false,
      footer: true,
      active: ['Admin']
    },
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    meta: { 
      auth: true,
      active: ['Admin']
    },
    component: () => import('@/views/Admin/index.vue'),
    children: [
      {
        path: 'articlelist',
        name: 'Admin-Article-list',
        meta: {
          auth: true,
          footer: false,
          active: ['Admin', 'Article']
        },
        component: () => import('@/views/Admin/ArticleManage/list.vue'),
      },
      {
        path: 'articleedit',
        name: 'Admin-Article-edit',
        meta: {
          auth: true,
          footer: false,
          active: ['Admin', 'Article']
        },
        component: () => import('@/views/Admin/ArticleManage/edit.vue'),
      },
      {
        path: 'commentlist',
        name: 'Admin-Comment-list',
        meta: {
          auth: true,
          footer: false,
          active: ['Admin', 'Comment']
        },
        component: () => import('@/views/Admin/CommentManage/list.vue'),
      },
      {
        path: 'othercommentlist',
        name: 'Admin-OtherComment-List',
        meta: {
          auth: true,
          footer: false,
          active: ['Admin', 'OtherComment']
        },
        component: () => import('@/views/Admin/otherComment/list.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  checkTokenByRouter(to, from, next);
})

export default router
