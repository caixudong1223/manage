<template>
  <div class="role">
    <!-- 筛选面板 -->
    <el-card class="filter-card">

      <el-form ref="roleFilterForm" :inline="true" :model="roleFilterForm">
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="roleFilterForm.code"
            placeholder="角色编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleFilterForm.name"
            placeholder="角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="state">
          <el-select v-model="roleFilterForm.state" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button
          type="primary"
          @click="handleSearch"
          ><i class="el-icon-search"></i>&nbsp;查询&nbsp;</el-button
        >
        <el-button
          @click="handleReset"
          ><i class="el-icon-refresh-left"></i>&nbsp;重置&nbsp;</el-button
        >
      </el-form>
    </el-card>
    <!-- 数据面板 -->
    <el-card class="data-card">
      <div slot="header" class="clearfix">
        <el-button
          type="primary"
          v-permission="['system:role:add']"
          @click="handleAddRole"
          ><i class="el-icon-plus"></i>&nbsp;添加角色</el-button
        >
      </div>
      <el-table
        :data="roleData"
        style="width: 100%"
        stripe
        header-row-class-name="headerCls"
        v-loading="tableLoading"
      >
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="code" label="角色编码"> </el-table-column>
        <el-table-column prop="name" label="角色名称"> </el-table-column>
        <el-table-column prop="name" label="角色类别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.roleType === 1" type="success"
              >平台角色</el-tag
            >
            <el-tag v-if="scope.row.roleType === 2" type="warning"
              >店铺角色</el-tag
            >
            <el-tag v-if="scope.row.roleType === 3" type="warning"
              >服务中心</el-tag
            >
            <el-tag v-if="scope.row.roleType === 6" type="warning"
              >自营店铺</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="state" label="是否启用">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 1" type="success">是</el-tag>
            <el-tag v-else type="warning">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" width="200">
            <el-button
              v-permission="['system:role:update']"
              @click="handleEditRole(scope.row)"
              type="text"
              ><svg-icon
                icon-class="edit"
                class-name="custom-class"
              />&nbsp;编辑</el-button
            >
            <el-button
              type="text"
              v-permission="['system:role:assign']"
              @click="
                $router.push(
                  '/system/role/assign?roleId=' +
                    scope.row.id +
                    '&roleName=' +
                    scope.row.name
                )
              "
              ><svg-icon
                icon-class="assign"
                class-name="custom-class"
              />&nbsp;分配权限</el-button
            >
            <el-button
              type="text"
              v-permission="['system:role:delete']"
              @click="handleDeleteRole(scope.row)"
              ><svg-icon
                icon-class="delete"
                class-name="custom-class"
              />&nbsp;删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="page">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[5, 10, 15]"
          :current-page="pageNum"
          :page-count="pages"
          :page-size="pageSize"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-drawer
      :title="title"
      :visible.sync="showDrawer"
      direction="rtl"
      size="250"
    >
      <div style="padding: 20px;">
        <RoleForm :roleForm="roleForm" @reload="reloadRole" :isEdit="isEdit" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { deleteRole, pageRoles } from "@/api/role";
import RoleForm from "../components/roleForm";

export default {
  name: "role",
  components: {
    RoleForm
  },
  data() {
    return {
      roleData: [],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1,
      showDrawer: false,
      isEdit: false, //新增or编辑标志
      roleForm: {},
      tableLoading: false,
      roleFilterForm: {
        //筛选搜索条件
        code: "",
        name: "",
        state: ""
      }
    };
  },
  created() {
    this.pageRoles();
  },
  computed: {
    title() {
      return `${this.isEdit ? "修改" : "新增"}角色`;
    }
  },
  methods: {
    pageRoles(data = {}) {
      this.tableLoading = true;
      pageRoles({
        data,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
        .then(res => {
          if (res.rescode === 2000 && res.data.list.length) {
            this.roleData = res.data.list;
            this.pages = res.data.pages;
            this.total = res.data.total;
          } else {
            this.roleData = [];
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    handlePageChange(index) {
      this.pageNum = index;
      this.pageRoles();
    },
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.pageRoles();
    },
    handleAddRole() {
      this.isEdit = false;
      this.roleForm = {
        code: "",
        name: "",
        roleType: 1, //默认平台
        state: 1 //默认启用
      };
      this.showDrawer = true;
    },
    handleEditRole(row) {
      this.isEdit = true;
      this.roleForm = {
        id: row.id,
        code: row.code,
        name: row.name,
        roleType: row.roleType,
        state: row.state //默认启用
      };
      this.showDrawer = true;
    },
    handleDeleteRole(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole({ id: row.id }).then(res => {
            if (res.rescode === 2000) {
              this.$message({
                type: "success",
                message: "角色删除成功"
              });
              this.pageRoles();
            } else {
              this.$message({
                type: "error",
                message: "角色删除失败"
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
    reloadRole() {
      this.showDrawer = false;
      this.pageRoles();
    },
    handleSearch() {
      this.pageNum = 1;
      this.pageRoles({
        ...this.roleFilterForm,
        state:
          this.roleFilterForm.state !== ""
            ? Number(this.roleFilterForm.state)
            : undefined
      });
    },
    handleReset() {
      this.$refs.roleFilterForm.resetFields();
      this.pageNum = 1;
      this.pageRoles();
    }
  }
};
</script>

<style lang="scss" scoped>
.role {
  margin: 0 20px;

  .data-card {
    margin-top: 10px;
  }

  .custom-class {
    color: #409eff;
  }

  .page {
    padding: 20px 0;
    text-align: right;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
:focus {
  outline: 0;
}
</style>
