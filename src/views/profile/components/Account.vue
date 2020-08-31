<template>
  <el-form ref="userForm" :model="userForm" :rules="rules" label-width="120px">
    <el-form-item label="登录账号" prop="loginAccount">
      {{ userForm.loginAccount || "暂无" }}
    </el-form-item>
    <el-form-item label="昵称" prop="userName">
      <el-input v-model.trim="userForm.userName" />
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model.trim="userForm.mobile" />
    </el-form-item>
    <el-form-item label="验证码" prop="smsCode">
      <el-input
        ref="smsCode"
        v-model="userForm.smsCode"
        type="text"
        maxlength="6"
        placeholder="请输入手机验证码"
        autocomplete="off"
      >
        <span slot="suffix">
          <div class="sendcode" @click="getSmsCode">{{ btntxt }}</div>
        </span>
      </el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="userForm.email" autocomplete="off" />
    </el-form-item>
    <el-form-item label="密码" prop="loginPwd">
      <el-input
        v-model="userForm.loginPwd"
        autocomplete="off"
        :type="passwordType"
      />
      <span class="show-pwd" @click="showPwd">
        <svg-icon
          :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
        />
      </span>
    </el-form-item>
    <el-form-item label="确认密码" prop="requirePwd">
      <!-- <el-input v-model="userForm.requirePwd" type="password"/> -->
      <el-input
        v-model="userForm.requirePwd"
        :type="passwordType"
        placeholder="确认密码"
        autocomplete="off"
      />
      <span class="show-pwd" @click="showPwd">
        <svg-icon
          :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
        />
      </span>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submit" v-loading="loading"
        >保存</el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
import { validEmail } from "@/utils/validate";
import { updateManageInfo } from "@/api/userManage";
import md5 from "js-md5";
import { getSmsCode } from "@/api/user";
export default {
  data() {
    const emailValidator = (rule, value, callback) => {
      if (!validEmail(value) && value !== null && value !== "") {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    const requirePwdValidator = (rule, value, callback) => {
      if (value && value != this.userForm.loginPwd) {
        callback(new Error("两次密码不一致，请重新输入"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        smsCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        loginPwd: [{ required: true, message: "请设置密码", trigger: "blur" }],
        requirePwd: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: requirePwdValidator, trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email: [{ validator: emailValidator, trigger: "blur" }]
      },
      passwordType: "password",
      loading: false,
      time: 60,
      btntxt: "获取验证码"
    };
  },
  props: {
    userForm: {
      type: Object,
      default: () => {
        return {
          userName: "",
          mobile: "",
          email: "",
          avatarImg: "",
          loginPwd: "",
          requirePwd: ""
        };
      }
    }
  },
  methods: {
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          if (this.userForm && !this.userForm.smsKey) {
            this.$message({ type: "error", message: "请先获取验证码" });
            return;
          }
          let {
            requirePwd,
            avatarImg,
            loginPwd,
            sysRoles,
            ...params
          } = this.userForm;
          params.loginPwd = md5(loginPwd);
          this.loading = true;
          updateManageInfo(params).then(res => {
            if (res.rescode === 2000) {
              this.loading = false;
              this.$message({
                type: "success",
                message: "修改成功"
              });
            } else {
              this.loading = false;
              this.$message({
                type: "error",
                message: res.message || "修改失败"
              });
            }
          }).catch(e=>{
            this.loading = false;
          });
        }
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    //获取短信验证码
    getSmsCode() {
      if (this.time != 60) {
        return;
      }
      getSmsCode({
        phone: this.userForm.mobile
      }).then(res => {
        if (res && res.rescode === 2000 && res.data) {
          this.userForm.smsKey = res.data.smsKey;
          this.timer();
        }
        this.$message.success(res.message || "发送成功！");
      });
    },
    //显示发送验证码按钮和倒计时
    timer() {
      if (this.time > 0) {
        this.time--;
        this.btntxt = this.time + "秒后重发";
        setTimeout(this.timer, 1000);
      } else {
        this.time = 60;
        this.btntxt = "获取验证码";
        this.disabled = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  position: relative;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
.el-input__suffix-inner .sendcode {
  color: #1b6bff;
  cursor: pointer;
}
</style>
