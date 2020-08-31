<template>
  <div class="container">
    <div class="block b1">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>菜单</span>
          <el-button
            @click="handleAddMenu(0)"
            style="float: right; padding: 0;"
            type="text"
            ><i class="el-icon-plus"></i>&nbsp;新增一级菜单</el-button
          >
        </div>
        <el-tree
          :data="menus"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          v-loading="loading"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              {{ node.label }}&nbsp;
              <i
                class="el-icon-success"
                style="color: #67C23A;"
                v-if="data.state === 1"
              ></i>
              <i class="el-icon-error" style="color: #F56C6C;" v-else></i>
            </span>
            <span>
              <el-button
                type="text"
                size="mini"
                v-if="!data.isLeaf"
                @click="e => append(data, e)"
              >
                <i class="el-icon-plus" title="新增"></i>&nbsp;
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="e => remove(node, data, e)"
              >
                <i title="删除" class="el-icon-close" style="color: #F56C6C;"></i>&nbsp;
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-card>
    </div>

    <div class="block b2">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ flag ? "菜单信息" : "新增菜单" }}</span>
        </div>
        <MenuForm :menuForm="menuDetail" :flag="flag" @reload="getAllMenus" />
      </el-card>
    </div>

    <div class="block b3">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span
            >资源列表<el-button
              type="text"
              v-if="selIsLeaf"
              @click="showResourceDrawer"
              style="float: right; padding: 0;"
              ><i class="el-icon-plus"></i>&nbsp;新增资源</el-button
            ></span
          >
        </div>
        <el-table :data="resourceData">
          <el-table-column prop="permission" label="权限标志">
            <template slot-scope="scope">
              <el-tag>{{ scope.row.permission }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="isButton" label="是否按钮">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.isBtn === 1">是</el-tag>
              <el-tag type="warning" v-else>否</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deleteFlag" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleUpdatePermission(scope.row)"
                >修改</el-button
              >
              <el-button type="text" @click="handleDelPermission(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-drawer
      :title="title"
      :visible.sync="showDrawer"
      direction="rtl"
      size="250"
    >
      <div style="padding: 20px;">
        <ResourceForm
          :resourceForm="resourceForm"
          @reload="reloadPermission"
          :isEdit="isEdit"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import MenuForm from "../components/menuForm";
import ResourceForm from "../components/resourceForm";
import { selectAllMenus, selectMenuDetail, addMenu, delMenu } from "@/api/menu";
import {
  deletePermission,
  selectPermissionByMenuId,
  getPermission
} from "@/api/authority";

export default {
  name: "menuAndResource", //菜单与资源
  components: {
    MenuForm,
    ResourceForm
  },
  data() {
    return {
      defaultProps: {
        children: "upSubMenus",
        label: "menuName"
      },
      menus: [],
      menuForm: {
        id: 0,
        isLeaf: 1,
        menuName: "",
        upperMenuId: 0,
        upperName: "",
        menuUrl: "",
        menuIcon: "",
        show: 1, //0不显示 1显示
        sort: 0,
        state: ""
      },
      resourceData: [],
      flag: true, //true新增菜单， false编辑菜单
      selMenuId: "",
      selIsLeaf: false,
      menuDetail: {
        id: 0,
        isLeaf: 1,
        menuName: "",
        upperMenuId: 0,
        upperMenuName: "",
        menuUrl: "",
        menuIcon: "",
        show: 1, //0不显示 1显示
        sort: 0,
        state: ""
      },
      loading: false,
      showDrawer: false,
      resourceForm: {
        menuName: "",
        menuId: 0,
        permission: "",
        name: "",
        isBtn: 1
      },
      isEdit: false
    };
  },
  created() {
    this.getAllMenus();
  },
  computed: {
    title() {
      return `${this.isEdit ? "修改" : "新增"}权限资源`;
    }
  },
  methods: {
    // 点击菜单查看详情
    handleNodeClick(node) {
      console.log(node);
      this.selMenuId = node.id;
      this.selMenuName = node.menuName;
      this.selIsLeaf = node.isLeaf;
      this.flag = true;
      this.getMenuDetail(this.selMenuId);
      // 叶子菜单请求资源
      if (node.isLeaf) {
        this.getPermissions();
      }
    },
    // 新增菜单
    append(data, e) {
      e.stopPropagation();
      this.handleAddMenu(data.id, data.menuName);
    },
    // 新增
    handleAddMenu(id, name = "") {
      this.flag = false;
      this.menuDetail = {
        isLeaf: 1,
        menuName: "",
        upperMenuId: id,
        upperMenuName: name,
        menuUrl: "",
        menuIcon: "",
        sort: 0,
        state: 1
      };
    },
    // 删除菜单
    remove(node, data, e) {
      e.stopPropagation();
      this.deleteMenu(data.id);
    },
    // 获取所有菜单
    getAllMenus() {
      selectAllMenus({
        upperMenuId: 0
      }).then(res => {
        if (res.rescode === 2000 && res.data.length) {
          this.menus = res.data;
        } else {
          res.data = [];
        }
      });
    },
    // 获取菜单详情
    getMenuDetail(id) {
      selectMenuDetail({ id }).then(res => {
        if (res.rescode === 2000 && res.data) {
          this.menuDetail = {
            ...this.menuDetail,
            ...res.data
          };
        }
      });
    },

    // 新增菜单
    addMenu() {
      let data = {};
      addMenu(data).then(res => {
        if (res.rescode === 2000) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
      });
    },

    // 删除菜单
    deleteMenu(id) {
      this.$confirm(`确认删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          delMenu({ id })
            .then(res => {
              if (res.rescode === 2000) {
                this.$message({
                  type: "success",
                  message: "删除成功"
                });
                this.getAllMenus();
                this.loading = false;
              } else {
                this.loading = false;
              }
            })
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 获取当前菜单权限资源
    findPermissions(id) {
      findPermissions({ id }).then(res => {
        if (res.rescode === 2000) {
        }
      });
    },
    // 拉出抽屉
    showResourceDrawer() {
      this.resourceForm = {
        menuId: this.selMenuId,
        menuName: this.selMenuName,
        permission: "",
        name: "",
        isBtn: 1
      };
      this.isEdit = false;
      this.showDrawer = true;
    },
    // 获取菜单资源
    getPermissions() {
      selectPermissionByMenuId({
        menuId: this.selMenuId
      }).then(res => {
        if (res.rescode === 2000 && res.data.length) {
          this.resourceData = res.data;
        } else {
          this.resourceData = [];
        }
      });
    },
    // 重新加载资源
    reloadPermission() {
      this.showDrawer = false;
      this.getPermissions();
    },
    // 删除权限
    handleDelPermission(per) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deletePermission({ id: per.id }).then(res => {
            if (res.rescode === 2000) {
              this.$message({
                type: "success",
                message: "权限资源删除成功"
              });
              this.getPermissions();
            } else {
              this.$message({
                type: "error",
                message: "权限资源删除失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 修改权限
    handleUpdatePermission(per) {
      this.isEdit = true;
      this.resourceForm = {
        permission: per.permission,
        name: per.name,
        isBtn: per.isBtn,
        menuId: per.menuId,
        id: per.id,
        menuName: this.selMenuName
      };

      this.showDrawer = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  min-height: calc(100vh - 124px);

  .block {
    // flex: 1;
    margin: 0 10px;

    .box-card {
      height: 100%;
    }
  }

  .b1 {
    flex: 1;
  }

  .b2 {
    flex: 2;
  }

  .b3 {
    flex: 3;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

<style rel="stylesheet/scss" lang="scss">
:focus {
  outline: 0;
}
</style>
