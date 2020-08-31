<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <user-card :userForm="userForm" />
      </el-col>

      <el-col :span="18" :xs="24">
        <el-card>
          <el-tabs v-model="activeTab">
            <!-- <el-tab-pane label="基本信息" name="account"> -->
            <account :userForm="accounForm" />
            <!-- </el-tab-pane> -->
            <!-- <el-tab-pane label="活动" name="activity">
              <activity />
            </el-tab-pane>
            <el-tab-pane label="时间线" name="timeline">
              <timeline />
            </el-tab-pane> -->
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getInfo } from "@/api/user";
import UserCard from "./components/UserCard";
import Activity from "./components/Activity";
import Timeline from "./components/Timeline";
import Account from "./components/Account";

export default {
  name: "Profile",
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      userForm: {},
      activeTab: "account",
      accounForm: {}
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      // this.user = {
      //   name: this.name,
      //   role: this.roles.join(' | '),
      //   email: 'admin@test.com',
      //   avatar: this.avatar
      // }
      getInfo().then(res => {
        if (res.rescode == 2000) {
          this.userForm = {
            userName: res.data.userName,
            sysRoles: res.data.sysRoles || [],
            email: res.data.email,
            mobile: res.data.mobile,
            avatarImg: res.data.avatarImg,
            userId: res.data.id,
            loginAccount: res.data.loginAccount
          };
          this.accounForm = { ...this.userForm, smsKey: "", smsCode: "" };
        }
      });
    }
  }
};
</script>
