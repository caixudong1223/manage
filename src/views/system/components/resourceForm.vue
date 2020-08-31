<template>
  <el-form :model="resourceForm" label-width="80px">
    <el-form-item label="当前菜单">{{ resourceForm.menuName }}</el-form-item>
    <el-form-item label="权限标志">
      <el-input v-model="resourceForm.permission" />
    </el-form-item>
    <el-form-item label="权限名称">
      <el-input v-model="resourceForm.name" />
    </el-form-item>
    <el-form-item label="是否按钮">
      <el-radio-group v-model="resourceForm.isBtn">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="操作">
      <el-button
        type="primary"
        :loading="loading"
        @click="addPermissions"
        v-if="!isEdit"
        >新增资源</el-button
      >
      <el-button
        type="primary"
        :loading="loading"
        @click="updatePermission"
        v-if="isEdit"
        >修改资源</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { addPermissions, updatePermissions } from "@/api/authority";
export default {
  name: "ResourceForm",
  props: {
    resourceForm: Object,
    isEdit: Boolean,
    reload: Function
  },
  data() {
    return {
      loading: false
    };
  },
  methods: {
    addPermissions() {
      this.loading = true;
      addPermissions(this.resourceForm).then(res => {
        if (res.rescode === 2000) {
          this.$message({
            type: "success",
            message: "资源新增成功"
          });
          this.loading = false;
          this.$emit("reload");
        } else {
          this.loading = false;
          this.$message(res.message || "资源新增失败");
        }
      });
    },
    updatePermission() {
      this.loading = true;
      updatePermissions(this.resourceForm).then(res => {
        if (res.rescode === 2000) {
          this.$message({
            type: "success",
            message: "资源修改成功"
          });
          this.loading = false;
          this.$emit("reload");
        } else {
          this.loading = false;
          this.$message(res.message || "资源修改失败");
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
