<template>
  <div class="container">
    <div class="block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>【{{ $route.query.roleName }}】配置菜单</span>
          <el-button
            type="text"
            style="float: right;padding: 0;"
            @click="saveRoleMenu"
            :loading="saveMenuLoading"
          >
            <svg-icon iconClass="save"></svg-icon>&nbsp;保存菜单配置</el-button
          >
        </div>
        <el-tree
          ref="menuTree"
          :data="menus"
          :props="defaultProps"
          show-checkbox
          node-key="menuId"
          default-expand-all
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </el-card>
    </div>

    <div class="block">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span
            >【{{ $route.query.roleName }}】{{
              selectedMenuName && `-【${selectedMenuName}】`
            }}配置权限资源</span
          >
          <el-button
            type="text"
            style="float: right;padding: 0;"
            @click="saveRoleResource"
            :loading="saveResourceLoading"
          >
            <svg-icon iconClass="save"></svg-icon>&nbsp;保存资源配置</el-button
          >
        </div>
        <el-table
          ref="resourceTable"
          stripe
          header-row-class-name="headerCls"
          :data="resourceData"
          @selection-change="handleSelectionChange"
        >
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
          <el-table-column type="selection" width="55"> </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
// 递归搜索选择的节点id集合
const getCheckedNodeKeys = (selectedMenuIds, menus) => {
  menus.forEach(item => {
    if (item.selected === 1) {
      selectedMenuIds.push(item.menuId);
    }

    if (item.upSubMenus && item.upSubMenus.length) {
      getCheckedNodeKeys(selectedMenuIds, item.upSubMenus);
    }
  });
};

import {
  selectPermissionByMenuIdAndRoleId,
  addRolePermission
} from "@/api/authority";
import {
  selectAllMenus,
  selectRoleMenusByRoleId,
  addRoleMenus
} from "@/api/menu";

import { mapGetters } from "vuex";

export default {
  name: "assignMenuAndResource",
  data() {
    return {
      roleId: "",
      curMenuId: "",
      menus: [],
      defaultProps: {
        children: "upSubMenus",
        label: "menuName"
      },
      checkedMenuIds: [],
      saveMenuLoading: false,
      saveResourceLoading: false,
      resourceData: [],
      selectedResource: [],
      selectedMenuName: "" //当前选中菜单
    };
  },
  computed: {
    ...mapGetters(['roles'])
  },
  created() {
    this.selectRoleMenusByRoleId();
  },
  methods: {
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
    selectRoleMenusByRoleId() {
      selectRoleMenusByRoleId({
        roleId: this.$route.query.roleId
      })
        .then(res => {
          if (res.rescode === 2000 && res.data.length) {
            this.menus = res.data;
            this.$refs.menuTree.setCheckedKeys([]);
          } else {
            this.menus = [];
          }
        })
        .then(() => {
          let keys = [];
          getCheckedNodeKeys(keys, this.menus);
          this.$refs.menuTree.setCheckedKeys(keys);
        });
    },
    saveRoleMenu() {
      this.saveMenuLoading = true;
      let menuIds = this.$refs.menuTree.getCheckedKeys();
      addRoleMenus({
        menuIds,
        roleId: this.$route.query.roleId
      }).then(res => {
        if (res.rescode === 2000) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
        }
        this.saveMenuLoading = false;
      });
    },
    handleNodeClick(node) {
      this.curMenuId = node.menuId;
      if (node.isLeaf === 1) {
        this.selectedMenuName = node.menuName;
        this.selectPermissionByMenuIdAndRoleId({
          roleId: this.$route.query.roleId,
          menuId: node.menuId
        });
      } else {
        this.selectedMenuName = "";
      }
    },
    selectPermissionByMenuIdAndRoleId(data) {
      selectPermissionByMenuIdAndRoleId(data).then(res => {
        if (res.rescode === 2000 && res.data.length) {
          this.resourceData = res.data;
          this.$nextTick(() => {
            this.toggleRowSelection();
          });
        } else {
          this.resourceData = [];
        }
      });
    },
    handleSelectionChange(val) {
      this.selectedResource = val;
    },
    toggleRowSelection() {
      this.resourceData.forEach(el => {
        if (el.selected === 1) {
          this.$refs.resourceTable.toggleRowSelection(el, true);
        }
      });
    },
    saveRoleResource() {
      let permissionIds = [];
      this.selectedResource.forEach(el => {
        permissionIds.push(el.id);
      });
      this.saveResourceLoading = true;
      addRolePermission({
        permissionIds,
        roleId: this.$route.query.roleId,
        menuId: this.curMenuId
      }).then(res => {
        if (res.rescode === 2000) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          // 如果修改的是当前角色的权限资源，重新请求更新权限资源
          if (
            Array.isArray(this.roles) &&
            this.roles.some(role => role.id === Number(this.$route.query.roleId))
          ) {
            this.$store.dispatch("permission/getAllPermission");
          }
        }
        this.saveResourceLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  min-height: calc(100vh - 124px);

  .block {
    flex: 1;
    margin: 0 10px;

    .box-card {
      height: 100%;
    }
  }
}
</style>
