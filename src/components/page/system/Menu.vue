<!-- 菜单树 -->
<template>
  <div class="menus-tree">
    <div slot="header" class="dia log-header">
      <el-button type="primary" @click="addShowDialogForm()">添加</el-button>
    </div>
    <!-- 菜单树形表格 -->
    <el-table ref="menusTable" :row-style="showRow" :data="menusTable" v-bind="$attrs">
      <el-table-column
        prop="title"
        label="菜单名称">
        <template slot-scope="scope">
          <span :class="['level'+scope.row.level]">
          <i v-show="!scope.row.showChildBtn" @click="openToggle(scope.row)"
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
                     @click="addShowDialogForm(scope.row,'新增菜单')">增加
          </el-button>
          <!-- 判断下面是否有子菜单，有子菜单不能是有删除按钮 -->
          <el-button v-if="!scope.row.children" type="text" size="small">删除</el-button>
          <el-button type="text" @click="updateShowDialogForm(scope.row,'修改菜单')" size="small">编辑</el-button>
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
        <el-button type="primary" @click="submit(dialogTitle)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<!-- Form -->
<script>
  import tips from '../../common/utils/TipsUtils';
  import http from '../../common/utils/HttpUtils';

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
      this.$options.methods.shuffle(this);
    },
    methods: {
      // 展示添加、修改菜单的弹窗界面
      addShowDialogForm: function (parent, dialogTitle) {
        this.menuDTO = {}; //初始化数据
        if (parent) {
          this.menuParentDTO.title = parent.title; // 判断是否显示上级菜单的标题
          this.menuDTO.level = parent.level + 1; // 等级赋值
          this.menuDTO.parentId = parent.id; // 菜单绑定
        } else {
          this.menuDTO.level = 1; // 等级赋值
          this.menuDTO.parentId = undefined; // 菜单绑定
        }
        this.dialogTitle = dialogTitle; // 弹窗标题
        this.dialogFormVisible = true; // 打开弹窗
      },
      updateShowDialogForm: function (item, dialogTitle) {
        this.menuDTO = item;
        this.dialogTitle = dialogTitle; // 弹窗标题
        this.dialogFormVisible = true; // 打开弹窗
      },
      // 添加菜单操作
      addMenu: function (self) {
        self.dialogFormVisible = false;
        http.post('sys/menu/save', self.menuDTO).then(response => {
          tips.success("请求成功");
          self.$options.methods.shuffle(self);
        })
      },
      // 修改菜单操作
      updateMenu: function (self) {
        http.post('sys/menu/updateById', self.menuDTO).then(response => {
          tips.success("请求成功");
          self.$options.methods.shuffle(self);
        })
        self.dialogFormVisible = false;
      },
      // 重新渲染树形表格数据
      shuffle: function (self) {
        http.get('sys/menu/list').then(response => {
          self.menusTable = response.data;
        })
      },
      submit: function (dialogTitle) {
        if (dialogTitle === '修改菜单') {
          this.$options.methods.updateMenu(this);
        } else {
          this.$options.methods.addMenu(this)
        }
      },
      showRow: function (row) {
        const show = row.row.parent ? row.row.parent._expanded && row.row.parent._show : true;
        row.row._show = show;
        return show ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;" : "display:none;";
      },
      // 树节点开关操作
      openToggle: function (item) {
        if (item.open === undefined) {
          item.open = false;
        }
        // 这里只是展开和关闭样式的变换
        item.open = !item.open;
        // 展开的时候，显示子节点，关闭的时候隐藏子节点
        if (item.open) {
          let menusTable = this.menusTable;
          http.get('sys/menu/list', {'parentId': item.id}).then(response => {
              if (response.data.length > 0) {
                for (let j = 0; j < menusTable.length; j++) {
                  // 找到父节点的id，然后依次把子节点放到数组里面父节点后面
                  if (this.menusTable[j].id !== item.id) {
                    continue;
                  }
                  // 把请求到的数据拼接到该行数据后面
                  response.data.forEach(function (child, index) {
                    menusTable.splice(j + index + 1, 0, child); // 添加子节点
                  });
                  break;
                }
              } else {
                // 如果没有子菜单，就隐藏图标
                item.showChildBtn = true;
                // TODO 为什么这里执行了这个方法，按钮就消失了呢？
                this.menusTable = this.menusTable.filter(function (element) {
                  return element.parentId !== item.id
                })
              }
            }
          )
        } else {
          // 把子菜单全部从表格中剔除
          this.menusTable = this.menusTable.filter(function (element) {
            return element.parentId !== item.id
          })
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
