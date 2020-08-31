<template>
  <el-form ref="loginForm" :model="loginForm" label-width="80px" :rules="rules">
    <el-form-item label="用户名">
      {{loginForm.userName}}
    </el-form-item>
    <el-form-item label="密码" prop="loginPwd">
      <el-input v-model="loginForm.loginPwd" type="password" />
    </el-form-item>
    
    <el-form-item label="操作">
      <el-button
        type="primary"
        :loading="loading"
        @click="updateUserLogin"
        >重置</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import { updateUserLogin } from "@/api/userManage";
import md5 from 'js-md5'
export default {
  props:{
    loginForm:Object,
    reload: Function
  },
  data(){
    return{
      loading:false,
      rules:{
        loginPwd: [{ required: true, message: "请设置密码", trigger: "blur" }]
      }
    }
  },
  methods:{
    updateUserLogin(){
      this.$refs.loginForm.validate(valid=>{
        if(valid){
          this.loading = true;
          let params = {
            userId:this.loginForm.userId,
            loginPwd:md5(this.loginForm.loginPwd)
          }
          updateUserLogin(params).then(res=>{
            if(res.rescode == 2000){
              this.loading = false;
              this.$message({
                type: "success",
                message: "密码重置成功"
              });
              this.$emit('reload')
              return
            }
            this.$message({
              type: "error",
              message: res.message || "密码重置失败"
            });
            this.loading = false;
          }).catch(err => {
            this.loading = false;
          });
        }
      })
    }
  }
}
</script>
