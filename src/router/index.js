import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/common/Home.vue'),
      meta: {title: "博客发布"},
      children: [
        {
          path: '/blog/edit',
          name: 'blog-edit',
          component: () => import("../components/page/blog/Editor.vue")
        }, {
          path: '/system/menu',
          name: 'sys-menu',
          component: () => import("../components/page/system/Menu.vue")
        }
      ]
    },
  ]
})
