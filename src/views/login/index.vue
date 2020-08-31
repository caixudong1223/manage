<template>
  <div class="login-container">
    <!-- <div class="left">
      <img class="logo" src="@/assets/images/login/logo.png" />
      <img class="banner" src="@/assets/images/login/banner.png" />
      <p>
        Copyright
        &copy;XXXX有限公司版权所有&nbsp;&nbsp;苏ICP备xxxxx号
      </p>
    </div> -->
    <div class="right">
      <div class="box">
        <div class="box-title">xxx后台管理系统</div>
        <div class="box-content">
          <div class="box-content-tab">
            <div
              class="box-content-tab-item"
              :class="{
                'box-content-tab-item-active': activeLoginType === 'phone'
              }"
              @click="handleSwitchLoginType('phone')"
            >
              短信登录
              <div class="line" v-if="activeLoginType === 'phone'"></div>
            </div>
            <div
              class="box-content-tab-item"
              :class="{
                'box-content-tab-item-active': activeLoginType !== 'phone'
              }"
              @click="handleSwitchLoginType('acount')"
            >
              账号登录
              <div class="line" v-if="activeLoginType === 'acount'"></div>
            </div>
          </div>

          <div class="box-content-form">
            <template v-if="activeLoginType === 'phone'">
              <el-form
                ref="loginSmsForm"
                :model="loginSmsForm"
                :rules="rules"
                class="login-form"
                autocomplete="on"
                label-position="left"
                @keyup.enter.native="handleLogin"
              >
                <el-form-item prop="phone">
                  <span class="svg-container">
                    <svg-icon icon-class="phone" />
                  </span>
                  <el-input
                    ref="phone"
                    v-model="loginSmsForm.phone"
                    placeholder="手机号"
                    name="phone"
                    type="text"
                    tabindex="1"
                    autocomplete="off"
                    maxlength="11"
                  />
                </el-form-item>

                <el-form-item prop="smsCode">
                  <span class="svg-container">
                    <svg-icon icon-class="edit" />
                  </span>
                  <el-input
                    ref="smsCode"
                    v-model="loginSmsForm.smsCode"
                    type="text"
                    maxlength="6"
                    placeholder="请输入手机验证码"
                    autocomplete="off"
                  >
                    <span slot="suffix" :disabled="disabled">
                      <div class="sendcode" @click="getSmsCode">{{ btntxt }}</div>
                    </span>
                  </el-input>
                </el-form-item>

                <el-form-item prop="captcha">
                  <span class="svg-container">
                    <svg-icon icon-class="edit" />
                  </span>
                  <el-input
                    v-model="loginSmsForm.captchaCode"
                    maxlength="6"
                    type="code"
                    placeholder="请输入图形验证码"
                  >
                    <span slot="suffix">
                      <img :src="captchaImg" width="110" @click="sendCaptcha" />
                    </span>
                  </el-input>
                </el-form-item>

                <el-button
                  :loading="loading"
                  type="primary"
                  size="medium"
                  style="width:100%;margin-bottom:30px;"
                  @click.native.prevent="handleLogin"
                  >登录</el-button
                >
              </el-form>
            </template>
            <template v-if="activeLoginType === 'acount'">
              <el-form
                ref="loginForm"
                :model="loginForm"
                :rules="rules"
                class="login-form"
                autocomplete="on"
                label-position="left"
              >
                <el-form-item prop="username">
                  <span class="svg-container">
                    <svg-icon icon-class="user" />
                  </span>
                  <el-input
                    ref="username"
                    v-model="loginForm.username"
                    placeholder="手机号/账号"
                    name="username"
                    type="text"
                    tabindex="1"
                    autocomplete="off"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    tabindex="2"
                    autocomplete="off"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon
                      :icon-class="
                        passwordType === 'password' ? 'eye' : 'eye-open'
                      "
                    />
                  </span>
                </el-form-item>

                <el-form-item prop="captcha">
                  <span class="svg-container">
                    <svg-icon icon-class="edit" />
                  </span>
                  <el-input
                    v-model="loginForm.captchaCode"
                    maxlength="6"
                    type="code"
                    placeholder="请输入图片验证码"
                  >
                    <span slot="suffix">
                      <img :src="captchaImg" width="110" @click="sendCaptcha" />
                    </span>
                  </el-input>
                </el-form-item>

                <el-button
                  :loading="loading"
                  type="primary"
                  size="medium"
                  style="width:100%;margin-bottom:30px;"
                  @click="handleLogin"
                  >登录</el-button
                >
              </el-form>
            </template>

            <!-- <p class="info" @click="$router.push('/apply')">
              还没拥有店铺？快速注册店铺>>>
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { validUsername, validPhone } from "@/utils/validate";
import { getCaptcha, getSmsCode } from "@/api/user";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validPhoneNo = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!validPhone(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    const validImageVerifyCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入图形验证码"));
      } else {
        callback();
      }
    };
    return {
      time: 60,
      captchaImg: "",
      captchaKey: "",
      smsKey: "",
      activeLoginType: "phone",
      btntxt: "获取验证码",
      disabled: false,
      loginForm: {
        username: "",
        password: "",
        captchaCode: "",
        userType: 3, //1用户 2工程师 3运营端用户
        type: "acount"
      },
      loginSmsForm: {
        phone: "",
        smsKey: "", //短信验证码key
        smsCode: "",
        captchaCode: "",
        userType: 3, //1用户 2工程师 3运营端用户
        type: "phone"
      },

      rules: {
        username: [{ required: true, trigger: "blur", message: "请输入账号" }],
        phone: [{ required: true, trigger: "blur", validator: validPhoneNo }],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        smsCode: [
          { required: true, trigger: "blur", message: "请输入手机验证码" }
        ],
        captchaKey: [
          { required: true, trigger: "blur", validator: validImageVerifyCode }
        ],
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
    this.sendCaptcha();
  },
  mounted() {
    // if (this.loginForm.username === "") {
    //   this.$refs.username.focus();
    // } else if (this.loginForm.password === "") {
    //   this.$refs.password.focus();
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    sendCaptcha() {
      this.captchaImg = "";
      getCaptcha()
        .then(res => {
          if (res.rescode === 2000 && res.data) {
            this.captchaImg = res.data.img;
            this.captchaKey = res.data.captchaKey;
          } else {
            this.$message(res.message || "获取图形验证码失败");
          }
        })
        .catch(err => {
          this.$message("获取图形验证码失败");
        });
    },
    handleSwitchLoginType(type) {
      this.activeLoginType = type;
    },
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      if (this.activeLoginType === "phone") {
        this.$refs.loginSmsForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/userlogin", {
                ...this.loginSmsForm,
                captchaKey: this.captchaKey,
                smsKey: this.smsKey || 'nokey'
              })
              .then(() => {
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery
                });
                this.loading = false;
              })
              .catch(() => {
                this.sendCaptcha();
                this.loading = false;
              });
          }
        });
      } else {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/userlogin", {
                ...this.loginForm,
                password: md5(this.loginForm.password),
                captchaKey: this.captchaKey
              })
              .then(() => {
                this.$router.push({
                  path: this.redirect || "/",
                  query: this.otherQuery
                });
                this.loading = false;
              })
              .catch(() => {
                this.sendCaptcha();
                this.loading = false;
              });
          }
        });
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    getSmsCode() { // 获取短信验证码
      if (this.time != 60) {
        return;
      }

      this.$refs.loginSmsForm.validateField("phone", errMsg => {
        if (!errMsg) {
          getSmsCode({
            phone: this.loginSmsForm.phone
          }).then(res => {
            if (res && res.rescode === 2000 && res.data) {
              this.smsKey = res.data.smsKey;
              this.timer();
            }
            this.$message.success(res.message || "发送成功！");
          });
        }
      });
    },
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
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
// $cursor: #fff;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     // color: $cursor;
//   }
// }

/* reset element-ui css */
.login-container {
  /deep/ .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    /deep/ input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      // caret-color: $cursor;

      // &:-webkit-autofill {
      //   box-shadow: 0 0 0px 1000px $bg inset !important;
      //   -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

$bg: #fff;
$dark_gray: #889aa4;
$light_blue: #1b6bff;
$light_gray: #eee;

>>> .el-form-item--small .el-form-item__content {
  box-shadow: 0px 0px 4px 0px rgba(221, 221, 221, 1);
  border-radius: 5px;
}

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  .left {
    flex: 1;
    background-image: linear-gradient(to bottom left, #0f4fbd, #16b1ff);
    position: relative;
    overflow: hidden;

    .logo {
      position: absolute;
      left: 100px;
      top: 50px;
      width: 120px;
    }

    .banner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 458px;
    }

    p {
      color: #fff;
      font-size: 12px;
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      text-align: center;
    }
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 75%;
      height: 550px;
      max-width: 460px;
      min-width: 375px;
      &-title {
        font-size: 24px;
        color: #1b6bff;
        font-weight: bold;
        text-align: center;
      }

      &-content {
        margin-top: 70px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        overflow: hidden;
        padding: 30px 10px;
        &-tab {
          display: flex;
          justify-content: space-between;
          text-align: center;
          width: 50%;
          margin: 0 auto;
          &-item {
            // width: 140px;
            font-size: 22px;
            cursor: pointer;
            position: relative;
            &-active {
              color: #1b6bff;
            }

            .line {
              height: 2px;
              background: #1b6bff;
              // width: 120px;
              position: absolute;
              bottom: -10px;
              left: 0;
              right: 0;
            }
          }
        }

        .info {
          margin: 0;
          text-align: center;
          color: #1b6bff;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 40px 35px 20px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_blue;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  .el-input__suffix-inner .sendcode {
    margin-top: 10px;
    color: #1b6bff;
    cursor: pointer;
  }

  .el-input__suffix-inner img {
    height: 100%;
    width: auto;
    /* margin-right: 0; */
    // height: 48px;
    // margin-right: -38px;
    height: 30px;
    margin-right: -15px;
    margin-top: 8px;
  }

  @media only screen and (max-width: 750px) {
    .thirdparty-button {
      display: none;
    }

    .left {
      display: none;
    }
  }
}
</style>
