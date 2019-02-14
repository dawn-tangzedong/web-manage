<!-- 菜单树 -->
<template>
  <div class="menus-tree">
    <!-- 菜单树形表格 -->
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
                     @click="showDialogForm(scope.row,'新增菜单')">增加
          </el-button>
          <!-- 判断下面是否有子菜单，有子菜单不能是有删除按钮 -->
          <el-button v-if="!scope.row.children" type="text" size="small">删除</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  弹窗表单，用于添加或者修改菜单信息  -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form v-if="menuParentDTO.title" :model="menuParentDTO" disabled="disabled">
        <el-form-item label="上级" :label-width="formLabelWidth">
          <el-input v-model="menuParentDTO.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="menuParentDTO">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="menuDTO.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="menuDTO" disabled="disabled">
        <el-form-item label="等级" :label-width="formLabelWidth">
          <el-input v-model="menuDTO.level" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form v-if="menuDTO.level === 1" :model="menuDTO">
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-input v-model="menuDTO.icon" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form :model="menuDTO">
        <el-form-item label="路径" :label-width="formLabelWidth">
          <el-input v-model="menuDTO.path" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dia log-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!-- Form -->
<script>
  import Vue from 'vue';
  import tips from '../../common/utils/TipsUtils';
  import http from '../../common/utils/HttpUtils';

  let vue = new Vue();
  export default {
    data() {
      return {
        dialogTitle: '',
        formLabelWidth: '120px',
        // 菜单dialog表单显示控制器
        dialogFormVisible: false,
        // 场景：添加菜单，菜单dialog表单父类数据，菜单父类信息渲染
        menuParentDTO: {
          title: undefined,
        },
        // 菜单dialog表单数据传输对象
        menuDTO: {
          level: '', // 菜单等级
          parentId: '', // 父id
          path: '', //路由跳转路径
          icon: '', // 菜单图标
          title: '', //菜单标题
        },
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
      // 洗牌树形表格
      http.post('sys/menu/list').then(response => {
          this.menusTable = response.data;
        }
        // , reject => {
        //   console.log(reject)
        // }
      )
    },
    methods: {
      // 展示添加、修改菜单的弹窗界面
      showDialogForm: function (parent, dialogTitle) {
        if (parent) {
          this.menuParentDTO.title = parent.title; // 判断是否显示上级菜单的标题
        }
        this.menuDTO.level = parent.level + 1; // 等级赋值
        this.menuDTO.parentId = parent.id; // 菜单绑定
        this.dialogTitle = dialogTitle; // 弹窗标题
        this.dialogFormVisible = true; // 打开弹窗
      },
      // 添加菜单操作
      addMenu: function () {
        this.dialogFormVisible = false;
        http.post('sys/menu/save', this.menuDTO).then(response => {
          tips.success("请求成功");
          http.post('sys/menu/list').then(response => {
            this.menusTable = response.data;
          })
        })
      },
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
