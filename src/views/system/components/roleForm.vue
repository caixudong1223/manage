<template>
  <el-form ref="roleForm" :model="roleForm" label-width="80px" :rules="rules">
    <el-form-item label="角色编码" prop="code">
      <el-input v-model="roleForm.code" />
    </el-form-item>
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="roleForm.name" />
    </el-form-item>
    <el-form-item label="角色类别" prop="state">
      <el-radio-group v-model="roleForm.roleType">
        <el-radio :label="1">平台角色</el-radio>
        <el-radio :label="2">店铺角色</el-radio>
        <el-radio :label="3">服务中心</el-radio>
        <el-radio :label="6">自营店铺</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="是否启用" prop="state">
      <el-radio-group v-model="roleForm.state">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="操作">
      <el-button
        type="primary"
        :loading="loading"
        @click="() => addRole()"
        v-if="!isEdit"
        >新增角色</el-button
      >
      <el-button
        type="primary"
        :loading="loading"
        @click="() => updateRole()"
        v-if="isEdit"
        >修改角色</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { addRole, updateRole } from "@/api/role";
export default {
  name: "roleForm",
  props: {
    roleForm: Object,
    isEdit: Boolean,
    reload: Function
  },
  data() {
    return {
      loading: false,
      rules: {
        code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      }
    };
  },
  methods: {
    addRole() {
      console.log(this.$refs)
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          addRole(this.roleForm).then(res => {
            if (res.rescode === 2000) {
              this.loading = false;
              this.$message({
                type: "success",
                message: "角色新增成功"
              });
              this.$emit("reload");
            } else {
              this.loading = false;
              this.$message({
                type: "error",
                message: res.message || "角色新增失败"
              });
            }
          }).catch(err => {
            this.loading = false;
          });
        }
      });
    },
    updateRole() {
      this.$refs.roleForm.validate(valid => {
        if(valid) {
          this.loading = true;
          updateRole(this.roleForm).then(res => {
            if (res.rescode === 2000) {
              this.loading = false;
              this.$message({
                type: "success",
                message: "角色修改成功"
              });
              this.$emit("reload");
            } else {
              this.loading = false;
              this.$message({
                type: "error",
                message: res.message || "角色修改失败"
              });
            }
          }).catch(err => {
            this.loading = false;
          });
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped></style>
