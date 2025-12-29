export default [
  { path: "/", redirect: "/index" },
  { name: "首页", path: "/index", component: "./index-page/index" },
  {
    path: "/user",
    layout: false,
    routes: [
      {
        path: "/user/login",
        layout: false,
        name: "登录",
        component: "./user/login",
      },
      { path: "/user", redirect: "/user/login" },
      {
        name: "注册结果",
        icon: "smile",
        path: "/user/register-result",
        component: "./user/register-result",
      },
      {
        name: "注册",
        icon: "smile",
        path: "/user/register",
        component: "./user/register",
      },
      { component: "404", path: "/user/*" },
    ],
  },
  {
    path: "/admin/interface-info",
    icon: "table",
    name: "接口管理",
    routes: [
      {
        path: "/admin/interface-info/manage",
        name: "接口列表",
        component: "./admin/interface-info/manage",
      },
    ],
  },
  {
    name: "接口详情",
    path: "/interfaceInfo-detail/:id",
    component: "./interfaceInfo-detail",
    hideInMenu: true,
  },
  {
    name: "个人页",
    icon: "user",
    path: "/account",
    routes: [
      { path: "/account", redirect: "/account/center" },
      {
        name: "个人中心",
        icon: "smile",
        path: "/account/center",
        component: "./account/center",
      },
      {
        name: "个人设置",
        icon: "smile",
        path: "/account/settings",
        component: "./account/settings",
      },
    ],
  },
  { path: "*", component: "./exception/404" },
  { path: "*", component: "./exception/404" },
  { path: "/500", component: "./exception/500" },
  { path: "/403", component: "./exception/403" },
];
