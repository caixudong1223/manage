<template>
  <div>
    <el-form ref="userForm" :model="userForm" label-width="120px" :rules="rules">
      <el-form-item label="登录账号" prop="loginAccount">
        <template v-if="isEdit">{{userForm.loginAccount || '暂无'}}</template>
        <el-input v-else v-model="userForm.loginAccount" />
      </el-form-item>
      <el-form-item label="昵称" prop="userName">
        <el-input v-model="userForm.userName" />
      </el-form-item>

      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="userForm.mobile" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" />
      </el-form-item>

      <el-form-item label="密码" prop="loginPwd" v-if="!isEdit">
        <el-input v-model="userForm.loginPwd" type="password"/>
      </el-form-item>

      <el-form-item label="头像" prop="avatarImg">
        <!-- <el-input v-model="userForm.avatarImg" /> -->
        <el-upload
          ref="fileUpload"
          class="avatar-uploader"
          :action="$base.goodsUploadUrl"
          accept="image/*"
          :auto-upload="false"
          :show-file-list="false"
          :http-request="httpRequest"
          :on-change="selectChange"
        >
          <img
            v-if="userForm.avatarImg"
            :src="userForm.avatarImg"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="选择角色" prop="roleIds">
        <el-checkbox-group v-model="userForm.roleIds">
          <el-checkbox
            v-for="role in roleList"
            :label="role.id"
            :key="role.id"
            :disabled="hasRole(role)"
            >{{ role.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="操作">
        <el-button
          v-permission="['system:user:manage:add:confirm']"
          type="primary"
          :loading="loading"
          @click="() => addManageUser()"
          v-if="!isEdit"
          >保存</el-button
        >
        <el-button
          v-permission="['system:user:manage:edit:confirm']"
          type="primary"
          :loading="loading"
          @click="() => updateManageUser()"
          v-if="isEdit"
          >保存</el-button
        >
        <el-button
          v-permission="['system:user:store:add:confirm']"
          type="primary"
          :loading="loading"
          @click="() => addStoreUser()"
          v-if="!isEdit"
          >保存</el-button
        >
        <el-button
          v-permission="['system:user:store:edit:confirm']"
          type="primary"
          :loading="loading"
          @click="() => updateStoreUser()"
          v-if="isEdit"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 截图组件 -->
    <cropper
      v-if="showCropper"
      :dialog-visible="showCropper"
      :cropper-img="cropperImg"
      :custom-option="cropperOption"
      @update-cropper="updateCropper"
      @colse-dialog="closeDialog"
      @upload-img="uploadImg"
    />
  </div>
</template>

<script>
import { addManage, addStoreUser, updateManageInfo, updateStoreUserInfo } from "@/api/userManage";
import { goodsUploadFile } from "@/api/file";
import Cropper from "@/components/Cropper";
import md5 from 'js-md5'
import { validEmail } from "@/utils/validate";
export default {
  name: "userForm",
  props: {
    userForm: Object,
    isEdit: Boolean,
    reload: Function,
    roleList: Array
  },
  components: {
    Cropper
  },
  data() {
    const emailValidator = (rule, value, callback) => {
      if (!validEmail(value) && value !== null && value !== "") {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    return {
      showCropper: false,
      cropperImg: "", //需要裁减的图片
      uploadFile: "", //裁减后的文件
      cropperOption: {
        autoCropWidth: 100,
        autoCropHeight: 100,
        fixedBox: true //固定截图框大小
      },
      loading: false,
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        loginAccount: [
          { required: true, message: "请输入登录账号", trigger: "blur" }
        ],
        loginPwd: [{ required: true, message: "请设置密码", trigger: "blur" }],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email:[{ validator: emailValidator, trigger: "blur" }],
        roleIds:[{ required: true, message: "请选择用户角色" }]
      },
    };
  },
  methods: {
    addManageUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let roleType = [];
          roleType = this.roleList.filter(item=>{
            return (this.userForm.roleIds.indexOf(item.id)!=-1)
          })
          this.userForm.roleType = roleType.map(item=>{
            return item.roleType
          })
          addManage({
              ...this.userForm,
              loginPwd: md5(this.userForm.loginPwd)
          })
            .then(res => {
              if (res.rescode === 2000) {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "新增成功"
                });
                this.$emit("reload");
              } else {
                this.loading = false;
                this.$message({
                  type: "error",
                  message: res.message || "新增失败"
                });
              }
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    updateManageUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let roleType = [];
          roleType = this.roleList.filter(item=>{
            return (this.userForm.roleIds.indexOf(item.id)!=-1)
          })
          this.userForm.roleType = roleType.map(item=>{
            return item.roleType
          })
          updateManageInfo(this.userForm)
            .then(res => {
              if (res.rescode === 2000) {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.$emit("reload");
              } else {
                this.loading = false;
                this.$message({
                  type: "error",
                  message: res.message || "修改失败"
                });
              }
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    addStoreUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let roleType = [];
          roleType = this.roleList.filter(item=>{
            return (this.userForm.roleIds.indexOf(item.id)!=-1)
          })
          this.userForm.roleType = roleType.map(item=>{
            return item.roleType
          })
          addStoreUser({
            ...this.userForm,
            loginPwd: md5(this.userForm.loginPwd)
          })
            .then(res => {
              if (res.rescode === 2000) {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "新增成功"
                });
                this.$emit("reload");
              } else {
                this.loading = false;
                this.$message({
                  type: "error",
                  message: res.message || "新增失败"
                });
              }
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    updateStoreUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true;
          updateStoreUserInfo(this.userForm)
            .then(res => {
              if (res.rescode === 2000) {
                this.loading = false;
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.$emit("reload");
              } else {
                this.loading = false;
                this.$message({
                  type: "error",
                  message: res.message || "修改失败"
                });
              }
            })
            .catch(err => {
              this.loading = false;
            });
        }
      });
    },
    httpRequest(request) {
      const { action, file } = request;

      let fd = new FormData();
      fd.append("file", this.uploadFile, file.name);

      const loading = this.$loading.service({
        lock: true,
        text: "上传中……",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });

      goodsUploadFile(fd).then(res => {
        if (res.rescode === 2000 && res.data) {
          loading.close();
          this.userForm.avatarImg = res.data;
          this.closeDialog();
        }
      });
    },
    closeDialog() {
      this.showCropper = false;
    },
    // 选择文件
    selectChange(file) {
      const { raw } = file;
      this.openCropper(raw);
    },
    // 打开截图组件
    openCropper(file) {
      this.cropperImg = "";
      var files = file;
      let isLt5M = files.size > 5 << 20;
      if (isLt5M) {
        this.$message.error("请上传5M内的图片");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        this.cropperImg = data;
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(files);
      this.showCropper = true;
    },
    uploadImg(file) {
      this.uploadFile = file;
      this.$refs.fileUpload.submit();
    },
    updateCropper() {
      this.$refs.fileUpload.$children[0].$el.click();
    },
    hasRole(role){
      let selected;
      selected = this.roleList.filter(item=>{
        return (this.userForm.roleIds.indexOf(item.id)!=-1)
      })
      if(role.roleType == 6){
        //自营店铺
        let result = selected.some(item=>{
          return item.roleType !=6;
        })
        return result
      }else{
        let result = selected.some(item=>{
          return item.roleType ==6;
        })
        return result
      }
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
}
.avatar {
  width: 78px;
  height: 78px;
  display: block;
}
</style>
