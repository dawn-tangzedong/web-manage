<!-- 侧边栏 -->
<template>
  <div class="sidebar">
    <el-menu class="sidebar-menu"
             :default-active="$route.path"
             background-color="#282d30"
             text-color="#fff"
             active-text-color="#ffd04b"
             unique-opened
             router>
      <!-- 动态生成侧边栏菜单 -->
      <template v-for="menu in menus">
        <!-- 判断是否子菜单，渲染一级菜单 -->
        <template v-if="menu.children">
          <el-submenu :index="menu.path?menu.path:menu.index">
            <template slot="title">
              <i :class="menu.icon"></i> <span>{{menu.title}}</span>
            </template>
            <!-- 循环渲染二级子菜单 -->
            <template v-for="childMenu in menu.children">
              <el-submenu v-if="childMenu.children" :index="childMenu.path?childMenu.path:childMenu.index">
                <!-- 渲染三级子菜单 -->
                <template slot="title">{{childMenu.title}}</template>
                <el-menu-item v-for="(threeMenu,i) in childMenu.children" :key="i"
                              :index="threeMenu.path?threeMenu.path:threeMenu.index">
                  {{threeMenu.title}}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="childMenu.path?childMenu.path:childMenu.index">{{childMenu.title}}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <!-- 一级菜单不需要子菜单 -->
        <template v-else>
          <el-menu-item :index="menu.path?menu.path:menu.index">
            <i :class="menu.icon"></i> <span>{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // 菜单列表树形数据
        // 无子集菜单可持有path属性，一级菜单可持有icon属性
        // 最多拥有第三集子菜单
        menus: [{
          icon: 'fa fa-book fa-2', // 菜单图标
          title: '博客管理', //菜单标题
          index: '1', //菜单下标
          children: [{
            title: '博客发布',
            index: '1-1',
            path: '/blog/push' // route跳转路径
          }, {
            title: '博客列表',
            index: '1-2',
            path: '/blog/list'
          }, {
            title: '博客编辑',
            index: '1-3',
            path: '/blog/edit'
          }]
        }, {
          icon: 'fa fa-address-book fa-2',
          title: '用户信息',
          index: '2',
          children: [{
            title: '用户列表',
            index: '2-1',
            path: '/list'
          }]
        }, {
          icon: 'fa fa-list-ul fa-2',
          title: "系统管理",
          index: "3",
          children: [{
            title: '菜单管理',
            index: '3-1',
            path: '/system/menu'
          }]
        }]
      }
    },
  }
</script>

<style scoped>
  .sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
  }

  /* 侧边工具栏不需要滚动条 */
  .sidebar::-webkit-scrollbar {
    width: 0;
  }

  /* 侧边工具栏的宽度 */
  .sidebar-menu:not(.el-menu--collapse) {
    width: 180px;
  }
</style>
