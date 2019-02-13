<!-- 菜单树 -->
<template>
  <div class="menus-tree">
    <el-table ref="menusTable" :row-style="showRow" :data="menusTable" v-bind="$attrs">
      <el-table-column
        prop="title"
        label="菜单名称">
        <template slot-scope="scope">
          <span :class="['level'+scope.row.level]">
          <i v-if="scope.row.children" @click="openToggle(scope.row)"
             :class="[scope.row.open?'fa fa-chevron-down':'fa fa-chevron-right']"></i>
            </span>
          {{scope.row.title}}
        </template>
      </el-table-column>
      <el-table-column
        prop="icon"
        label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="index"
        label="路径">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
        <template slot-scope="scope">
          <!-- 三级菜单不能增加子菜单 -->
          <el-button v-if="scope.row.level!=='3' && !scope.row.path" type="text" size="small"
                     @click="dialogFormVisible = true">增加
          </el-button>
          <!-- 判断下面是否有子菜单，有子菜单不能是有删除按钮 -->
          <el-button v-if="!scope.row.children" type="text" size="small">删除</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="menuParentDTO">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="menuDTO.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="menuParentDTO">
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="menuDTO.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="menuParentDTO">
        <el-form-item label="路径" :label-width="formLabelWidth">
          <el-input v-model="menuDTO.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dia log-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!-- Form -->
<script>
  import Vue from 'vue';
  import http from '../../common/utils/HttpUtils';

  let vue = new Vue();
  export default {
    data() {
      return {
        dialogTitle: '新增菜单',
        formLabelWidth: '120px',
        // 菜单dialog表单显示控制器
        dialogFormVisible: false,
        // 菜单dialog表单父类数据
        menuParentDTO: {
          level: '',
        },
        // 菜单dialog表单数据传输对象
        menuDTO: {
          id: '', // 主键PK
          level: '', // 菜单等级
          parentId: '', // 父id
          path: '', //路由跳转路径
          icon: '', // 菜单图标
          title: '', //菜单标题
        },
        // 菜单树结构数据
        menusTree: [{
          id: '1', // 主键PK
          level: '1', // 菜单等级
          parentId: '', // 父id
          icon: 'fa fa-book fa-2', // 菜单图标
          title: '博客管理', //菜单标题
          children: [{
            id: '4',
            level: '2',
            parentId: '1',
            title: '博客发布',
            path: 'blog/edit',
          }, {
            id: '5',
            title: '博客列表',
            index: '1-2',
            level: '2',
            children: [{
              id: '9',
              level: '3',
              parentId: '5',
              title: '三次菜单',
              path: 'blog/edit',
            }]
          }, {
            id: '6',
            level: '2',
            title: '博客编辑',
            index: '1-3',
          }]
        }, {
          id: '2',
          level: '1',
          icon: 'fa fa-address-book fa-2',
          title: '用户信息',
        }, {
          id: '3',
          level: '1',
          icon: 'fa fa-list-ul fa-2',
          title: "系统管理",
          children: [{
            id: '7',
            level: '2',
            title: '菜单管理',
            path: 'system/menu'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        // 菜单表格结构数据
        menusTable: []
      }
    },
    // 初始化函数，赋值，menusTree =>menusTable
    created() {
      // this.menusTable = this.menusTree;
      // 从后端Java项目中获取数据
      console.log("从后端Java项目中获取数据");
      http.$axios('sys/menu/list','post').then(response => {
        console.log("<================response=================>");
        console.log(response);
      }, reject => {
        console.log(reject)
      })
    },
    methods: {
      showRow: function (row) {
        const show = row.row.parent ? row.row.parent._expanded && row.row.parent._show : true;
        row.row._show = show;
        return show ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;" : "display:none;";
      },
      // 树节点开关操作
      openToggle: function (item) {
        // 这里只是展开和关闭样式的变换方法
        vue.set(item, 'open', !item.open);
        // 展开的时候，显示子节点，关闭的时候隐藏子节点
        // 遍历所有的子节点，加入到menuTable中
        for (let j = 0; j < this.menusTable.length; j++) {
          // 找到父节点的id，然后依次把子节点放到数组里面父节点后面
          if (this.menusTable[j].id !== item.id) {
            continue;
          }
          if (item.open) { // open => close
            console.log(item.children);
            let menusTable = this.menusTable;
            item.children.forEach(function (child, index) {
              menusTable.splice(j + index + 1, 0, child); // 添加子节点
            })
          } else {
            this.menusTable.splice(j + 1, item.children.length); // 删除子节点
          }
        }
      }
    }
  }
</script>

<style scoped>
  /* 这个是树形表格层级关系的css */
  .level1, .level2, .level3 {
    display: inline-block;
    width: 20px;
  }

  .level1 {
    margin-left: 5px;
  }

  .level2 {
    margin-left: 20px;
  }

  .level3 {
    margin-left: 35px;
  }
</style>
