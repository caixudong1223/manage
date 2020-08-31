import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect", "/apply"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasRoles =
        store.getters.userInfo &&
        store.getters.userInfo.sysRoles &&
        store.getters.userInfo.sysRoles.length > 0;

      if (hasRoles) {
        //已拉取到用户信息，直接跳转
        if (to.matched.length === 0) {
          next("/401");
        } else {
          next();
        }
      } else {
        store
          .dispatch("user/getInfo")
          .then(roles => {
            if (roles.length > 0) {
              store.dispatch("permission/getAllPermission"); //获取资源权限
              // 获取菜单信息
              store.dispatch("permission/generateRoutes").then(() => {
                router.addRoutes(store.getters.addRoutes || []);
                next({ ...to, replace: true });
              });
            }
          })
          .catch(error => {
            Message.error(error || "Has Error");
            store.dispatch("user/resetToken");
            next("/login");
            NProgress.done();
          });
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      let queries = Object.keys(to.query);
      let urlQuer = ''
      if(queries && queries.length>0){
        queries.forEach((item,index)=>{
          urlQuer = urlQuer+`${index == 0?'?':'&'}${item}=${to.query[item]}`
        })
      }
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}${urlQuer}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
