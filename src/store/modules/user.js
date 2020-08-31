import { login, loginSms, getInfo } from "@/api/user";
import {
  getToken,
  setToken,
  setRefreshToken,
  removeToken,
  getRefreshToken,
  removeRefreshToken
} from "@/utils/auth";
import router, { resetRouter } from "@/router";

const state = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  name: "",
  avatar: "",
  introduction: "",
  roles: [],
  userInfo: {}
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
};

const actions = {
  userlogin({ commit }, form) {
    if (form.type === "acount") {
      return new Promise((resolve, reject) => {
        login(form)
          .then(response => {
            const { data } = response;
            console.log(data);
            commit("SET_TOKEN", 'Bearer '+data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            setToken('Bearer '+ data.access_token);
            setRefreshToken(data.refresh_token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        loginSms(form)
          .then(response => {
            const { data } = response;
            commit("SET_TOKEN", 'Bearer '+ data.access_token);
            commit("SET_REFRESH_TOKEN", data.refresh_token);
            setToken('Bearer '+ data.access_token);
            setRefreshToken(data.refresh_token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({})
        .then(response => {
        const { data } = response

        if (!data) {
          reject('权限校验失败，请重新登录')
        }

        const { sysRoles, userName, avatarImg } = data

        if (!sysRoles || sysRoles.length <= 0) {
          reject('很抱歉！当前用户还没有分配角色！请联系管理员！')
        }
        commit('SET_ROLES', sysRoles)
        commit('SET_USER_INFO', data)
        commit('SET_NAME', userName)
        commit('SET_AVATAR', avatarImg)
          // resolve(data)
          resolve(sysRoles);
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      commit("SET_TOKEN", "");
      commit("SET_REFRESH_TOKEN", "");
      commit("SET_ROLES", []);
      commit('SET_USER_INFO', {})
      removeToken();
      removeRefreshToken();
      resetRouter();

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch("tagsView/delAllViews", null, { root: true });

      resolve();
      // }).catch(error => {
      //   reject(error)
      // })
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit("SET_TOKEN", "");
      commit("SET_REFRESH_TOKEN", "");
      commit("SET_ROLES", []);
      commit("SET_USER_INFO", {})
      removeToken();
      removeRefreshToken();
      resolve();
    });
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + "-token";

      commit("SET_TOKEN", token);
      setToken(token);

      const { roles } = await dispatch("getInfo");

      resetRouter();

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch("permission/generateRoutes", roles, {
        root: true
      });

      // dynamically add accessible routes
      router.addRoutes(accessRoutes);

      // reset visited views and cached views
      dispatch("tagsView/delAllViews", null, { root: true });

      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
