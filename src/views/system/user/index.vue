<template>
  <div class="user">
    <!-- 筛选面板 -->
    <el-card class="filter-card">
      <el-form ref="userFilterForm" :inline="true" :model="userFilterForm">
        <el-form-item label="昵称" prop="userName">
          <el-input
            v-model="userFilterForm.userName"
            placeholder="昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="userFilterForm.mobile"
            placeholder="手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userFilterForm.email"
            placeholder="邮箱"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleSearch"
          ><i class="el-icon-search"></i>&nbsp;查询&nbsp;</el-button
        >
        <el-button @click="handleReset"
          ><i class="el-icon-refresh-left"></i>&nbsp;重置&nbsp;</el-button
        >
      </el-form>
    </el-card>
    <!-- 数据面板 -->
    <el-card class="data-card">
      <div style="margin-bottom: 10px;">
        <el-button
          type="primary"
          @click="handleAddManageUser"
          v-permission="['system:user:manage:add']"
          ><i class="el-icon-plus"></i>&nbsp;添加用户</el-button
        >
        <el-button
          type="primary"
          @click="handleAddStoreUser"
          v-permission="['system:user:store:add']"
          ><i class="el-icon-plus"></i>&nbsp;添加用户</el-button
        >
      </div>
      <el-table :data="userData" stripe v-loading="tableLoading">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column
          prop="loginAccount"
          label="登录账号"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="userName"
          label="昵称"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="roleName" label="角色" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{
              Array.isArray(row.roleName) &&
                row.roleName.map(r => (r && r.name) || "").join(",")
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['user:column:store'])"
          prop="storeName"
          label="所属店铺"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['user:column:team'])"
          prop="teamNameList"
          label="服务中心"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="active"
          label="启停用"
          width="80"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <el-tag type="success" v-if="row.active === 1">启用</el-tag>
            <el-tag type="danger" v-else>停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template
            slot-scope="scope"
            v-if="!scope.row.selected || scope.row.selected != 1"
          >
            <el-button
              v-permission="['system:user:manage:edit']"
              v-if="!scope.row.storeSelected || scope.row.storeSelected != 1"
              @click="handleEditManageUser(scope.row)"
              type="text"
            >
              <svg-icon icon-class="edit" class-name="custom-class" />&nbsp;编辑
            </el-button>
            <el-button
              type="text"
              v-if="!scope.row.storeSelected || scope.row.storeSelected != 1"
              v-permission="['system:user:manage:assign']"
              @click="handleShowAssign(scope.row)"
            >
              <svg-icon
                icon-class="assign"
                class-name="custom-class"
              />&nbsp;分配角色
            </el-button>

            <el-button type="text" v-permission="['system:user:manage:lock']">
              <template v-if="scope.row.active === 1">
                <el-button
                  type="text"
                  @click="handleLockUser(scope.row.userId, 0)"
                >
                  <i class="el-icon-lock"></i>&nbsp;停用
                </el-button>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="handleLockUser(scope.row.userId, 1)"
                >
                  <i class="el-icon-unlock"></i>&nbsp;启用
                </el-button>
              </template>
            </el-button>

            <el-button
              type="text"
              @click="handleDeleteManageUser(scope.row)"
              v-permission="['system:user:manage:delete']"
            >
              <svg-icon
                icon-class="delete"
                class-name="custom-class"
              />&nbsp;删除
            </el-button>

            <el-button
              @click="handleEditStoreUser(scope.row)"
              v-if="!scope.row.storeSelected || scope.row.storeSelected != 1"
              type="text"
              v-permission="['system:user:store:edit']"
            >
              <svg-icon icon-class="edit" class-name="custom-class" />&nbsp;编辑
            </el-button>
            <el-button
              type="text"
              v-permission="['system:user:store:assign']"
              v-if="!scope.row.storeSelected || scope.row.storeSelected != 1"
              @click="handleShowAssign(scope.row)"
            >
              <svg-icon
                icon-class="assign"
                class-name="custom-class"
              />&nbsp;分配角色
            </el-button>

            <el-button type="text" v-permission="['system:user:store:lock']">
              <template v-if="scope.row.active === 1">
                <el-button
                  type="text"
                  @click="handleLockUser(scope.row.userId, 0)"
                  ><i class="el-icon-lock"></i>&nbsp;停用</el-button
                >
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="handleLockUser(scope.row.userId, 1)"
                  ><i class="el-icon-unlock"></i>&nbsp;启用</el-button
                >
              </template>
            </el-button>

            <el-button
              type="text"
              v-permission="['system:user:store:delete']"
              @click="handleDeleteStoreUser(scope.row)"
            >
              <svg-icon
                icon-class="delete"
                class-name="custom-class"
              />&nbsp;删除
            </el-button>
            <el-button
              v-permission="['system:user:reset:password']"
              type="text"
              @click="resetPass(scope.row)"
            >
              <i class="el-icon-refresh-left"></i>&nbsp;重置密码
            </el-button>
            <el-button
              type="text"
              v-permission="['system:user:store:select:team']"
              v-if="scope.row.teamSelected == 1"
              @click="selectTeamIdName(scope.row)"
            >
              <svg-icon
                icon-class="assign"
                class-name="custom-class"
              />&nbsp;选择服务中心
            </el-button>
            <!--       v-permission="['system:user:manage:assign:game']"-->
            <el-button
              type="text"
              v-show="isAduit(scope.row.roleName)"
              @click="handleAssignGameArea(scope.row)"
            >
              分配赛区
            </el-button>
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
      @open="selectManageRoles"
    >
      <div style="padding: 20px;">
        <UserForm
          v-if="showDrawer"
          ref="userForm"
          :userForm="userForm"
          @reload="reloadUser"
          :isEdit="isEdit"
          :roleList="roleList"
        />
      </div>
    </el-drawer>

    <el-drawer
      title="分配角色"
      :visible.sync="showAssign"
      direction="rtl"
      @open="selectManageRoles"
    >
      <div style="padding: 20px;">
        <el-form :model="assignForm" label-width="100px">
          <el-form-item label="选择角色:">
            <el-checkbox-group v-model="assignForm.roleIds">
              <el-checkbox
                v-for="role in roleList"
                :label="role.id"
                :disabled="hasRole(role)"
                :key="role.id"
                >{{ role && role.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="操作">
            <el-button
              type="primary"
              :loading="confirmLoading"
              @click="handleConfirmAssign"
              >确认分配</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer title="重置密码" :visible.sync="showPass" direction="rtl">
      <div style="padding: 20px;">
        <LoginForm :loginForm="loginForm" @reload="closePass" />
      </div>
    </el-drawer>

    <el-drawer
      title="选择服务中心"
      :rule="teamRule"
      :visible.sync="showTeam"
      direction="rtl"
      :before-close="handleClose"
    >
      <div style="padding: 20px;">
        <el-form
          ref="teamForm"
          :model="teamForm"
          :rules="teamRule"
          label-width="110px"
        >
          <el-form-item label="选择服务中心" prop="teamIdList">
            <el-select
              v-model="teamForm.teamIdList"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in teamList"
                :key="item.id"
                :label="item.teamName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作">
            <el-button
              type="primary"
              :loading="teamLoading"
              @click="handleConfirmTeam"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer title="分配赛区" :visible.sync="showAssignGame" direction="rtl">
      <div style="padding: 20px;">
        <el-form
          ref="gameForm"
          :model="gameForm"
          :rules="gameRule"
          label-width="110px"
        >
          <el-form-item label="选择赛区" prop="gameList">
            <el-select
              v-model="gameForm.gameList"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in gameList"
                :key="item.id"
                :label="item.areaName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作">
            <el-button type="primary" @click="handleSaveGameArea"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  deleteStoreUser,
  deleteManage,
  selectAllManageInfo,
  updateUserLogin,
  selectManageRoles,
  addUserRole
} from "@/api/userManage";
import { selectTeamIdName, updateTeamLeader } from "@/api/team";
import {
  getActivityArea,
  selectGameByUserId,
  insertGameByUserId
} from "@/api/engineer";
import UserForm from "../components/userForm";
import LoginForm from "../components/loginForm";
import checkPermission from "@/utils/permission"; // 权限判断函数

const userFormCopy = {
  mobile: "",
  loginPwd: "",
  userName: "",
  email: "",
  avatarImg: "",
  loginAccount: "",
  roleType: [],
  roleIds: []
};

export default {
  name: "user",
  components: {
    UserForm,
    LoginForm
  },
  data() {
    const validateGame = (rule, value, callback) => {
      if (value.length > 0) {
        callback();
      } else {
        callback("请选择赛区");
      }
    };

    return {
      userData: [],
      pageNum: 1,
      pageSize: 10,
      pages: 1,
      total: 1,
      showDrawer: false,
      showAssign: false,
      isEdit: false, //新增or编辑标志
      userForm: {},
      tableLoading: false,
      userFilterForm: {
        //筛选搜索条件
        userName: "",
        mobile: ""
      },
      roleList: [],
      assignForm: {
        userId: "",
        roleIds: []
      },
      confirmLoading: false,
      max: 10,
      showPass: false,
      loginForm: {},
      teamList: [],
      teamForm: {
        teamIdList: "",
        teamLeader: ""
      },
      teamLoading: false,
      showTeam: false,
      teamRule: {
        teamIdList: [
          { required: true, message: "请选择服务中心", trigger: "change" }
        ]
      },
      gameRule: {
        gameList: [
          { required: true, message: "请选择赛区", trigger: "blur" },
          { message: "请选择赛区", validator: validateGame }
        ]
      },
      showAssignGame: false,
      assignUserId: "",
      gameList: [],
      gameForm: {
        gameList: []
      }
    };
  },
  created() {
    this.pageUsers();
    this.getActivityArea();
  },
  computed: {
    title() {
      return `${this.isEdit ? "修改" : "新增"}用户`;
    }
  },
  methods: {
    isAduit(roles) {
      let flag = false;
      Array.isArray(roles) &&
        roles.map(item => {
          if (item.code === "AUDIT") {
            flag = true;
          }
        });
      return flag;
    },
    getActivityArea() {
      getActivityArea().then(res => {
        if (res.rescode === 2000 && res.data.length) {
          this.gameList = res.data;
        }
      });
    },
    async handleAssignGameArea(row) {
      this.selectGameByUserId(row.userId)
        .then(data => {
          this.gameForm.gameList = data;
          this.assignUserId = row.userId;
          this.showAssignGame = true;
        })
        .catch(err => {
          this.$message(err);
        });
    },
    selectGameByUserId(id) {
      let fd = new FormData();
      fd.append("gameAuditId", id);
      return new Promise((resolve, reject) => {
        selectGameByUserId(fd)
          .then(res => {
            if (res.rescode === 2000) {
              resolve(res.data);
            } else {
              reject(res.message || "error");
            }
          })
          .catch(err => reject("error"));
      });
    },
    handleSaveGameArea() {
      this.$refs.gameForm.validate(valid => {
        if (valid) {
          let fd = new FormData();
          insertGameByUserId({
            "gameAuditId": this.assignUserId,
            "gameAreaId": this.gameForm.gameList
          })
            .then(res => {
              if (res.rescode === 2000) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.showAssignGame = false;
              } else {
                this.$message.error(res.message || "error");
              }
            })
            .catch(err => {
              this.$message.error(err);
            });
        }
      });
    },
    pageUsers(data = {}) {
      this.tableLoading = true;
      selectAllManageInfo({
        data: this.userFilterForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })
        .then(res => {
          if (res.rescode === 2000 && res.data.list && res.data.list.length) {
            this.userData = res.data.list;
            this.pages = res.data.pages;
            this.total = res.data.total;
          } else {
            this.userData = [];
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    handleShowAssign(row) {
      // this.max = max;
      this.assignForm.userId = row.userId;
      this.assignForm.roleIds = row.roleName.map(r => r.id);
      this.showAssign = true;
    },
    handlePageChange(size) {
      this.pageNum = size;
      this.pageUsers();
    },
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.pageNum = 1;
      this.pageUsers();
    },
    handleAddManageUser() {
      this.isEdit = false;
      this.userForm = {
        ...userFormCopy
      };
      this.showDrawer = true;
      this.$nextTick(() => {
        this.$refs.userForm.$refs.userForm.clearValidate();
      });
    },
    handleAddStoreUser() {
      this.isEdit = false;
      this.userForm = {
        ...userFormCopy
      };
      this.showDrawer = true;
      this.$nextTick(() => {
        this.$refs.userForm.$refs.userForm.clearValidate();
      });
    },
    handleEditManageUser(row) {
      this.isEdit = true;
      this.userForm = {
        userId: row.userId,
        userName: row.userName,
        mobile: row.mobile,
        email: row.email,
        loginPwd: "",
        avatarImg: row.avatarImg,
        roleIds: row.roleIds || [],
        roleType: row.roleType || [],
        loginAccount: row.loginAccount
      };
      this.showDrawer = true;
      this.$nextTick(() => {
        this.$refs.userForm.$refs.userForm.clearValidate();
      });
    },
    handleEditStoreUser(row) {
      this.isEdit = true;
      this.userForm = {
        userId: row.userId,
        userName: row.userName,
        mobile: row.mobile,
        email: row.email,
        avatarImg: row.avatarImg,
        roleIds: row.roleIds || [],
        roleType: row.roleType || [],
        loginAccount: row.loginAccount
      };

      this.showDrawer = true;
    },
    handleDeleteManageUser(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteManage({ userId: row.userId }).then(res => {
            if (res.rescode === 2000) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.pageUsers();
            } else {
              this.$message({
                type: "error",
                message: "删除失败"
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
    selectManageRoles() {
      selectManageRoles({}).then(res => {
        if (res.rescode === 2000 && res.data && res.data.length) {
          this.roleList = res.data;
        }
      });
    },
    handleDeleteStoreUser(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteStoreUser({ userId: row.userId }).then(res => {
            if (res.rescode === 2000) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.pageUsers();
            } else {
              this.$message({
                type: "error",
                message: "删除失败"
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
    reloadUser() {
      this.showDrawer = false;
      this.pageUsers();
    },
    handleSearch() {
      this.pageNum = 1;
      this.pageUsers({
        ...this.userFilterForm
      });
    },
    handleReset() {
      this.$refs.userFilterForm.resetFields();
      this.pageNum = 1;
      this.pageUsers();
    },
    handleLockUser(userId, active = 1) {
      this.$confirm(`确认${active === 1 ? "启" : "停"}用该用户?`, {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          updateUserLogin({
            userId,
            active
          }).then(res => {
            if (res.rescode === 2000) {
              this.$message({
                type: "success",
                message: `已${active === 1 ? "启" : "停"}用`
              });

              this.pageUsers();
            }
          });
        })
        .catch(err => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleConfirmAssign() {
      this.confirmLoading = true;
      let roleType = [];
      roleType = this.roleList.filter(item => {
        return this.assignForm.roleIds.indexOf(item.id) != -1;
      });
      this.assignForm.roleType = roleType.map(item => {
        return item.roleType;
      });
      addUserRole(this.assignForm).then(res => {
        if (res.rescode === 2000) {
          this.confirmLoading = false;
          this.$message({
            type: "success",
            message: "分配成功"
          });
          this.showAssign = false;
          this.reloadUser();
        }
      });
    },
    resetPass(row) {
      this.showPass = true;
      this.loginForm = {
        userId: row.userId,
        userName: row.userName,
        loginPwd: ""
      };
    },
    closePass() {
      this.showPass = false;
    },
    selectTeamIdName(row) {
      this.teamForm.teamLeader = row.userId;
      this.teamForm.teamIdList = row.teamIdList || [];
      this.showTeam = true;
      selectTeamIdName().then(res => {
        if (res.rescode == 2000) {
          this.teamList = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.message || "获取服务中心失败"
          });
        }
      });
    },
    handleConfirmTeam() {
      this.$refs.teamForm.validate(valid => {
        if (valid) {
          this.teamLoading = true;
          updateTeamLeader(this.teamForm)
            .then(res => {
              if (res.rescode == 2000) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                this.pageUsers();
                this.handleClose();
              } else {
                this.$message({
                  type: "error",
                  message: res.message || "保存失败"
                });
              }
              this.teamLoading = false;
            })
            .catch(e => {
              this.$message({
                type: "error",
                message: "保存失败"
              });
              this.teamLoading = false;
            });
        }
      });
    },
    handleClose() {
      this.$refs.teamForm.resetFields();
      this.showTeam = false;
    },
    checkPermission(role) {
      return checkPermission(role);
    },
    hasRole(role) {
      let selected;
      selected = this.roleList.filter(item => {
        return this.assignForm.roleIds.indexOf(item.id) != -1;
      });
      if (role.roleType == 6) {
        //自营店铺
        let result = selected.some(item => {
          return item.roleType != 6;
        });
        return result;
      } else {
        let result = selected.some(item => {
          return item.roleType == 6;
        });
        return result;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.user {
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
