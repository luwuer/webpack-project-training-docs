export default {
  aa: () => import( /* webpackChunkName: "mod-a/function-a/page-a" */ `@mod-a/views/function-a/page-a`),
  ab: () => import( /* webpackChunkName: "mod-a/function-a/page-b" */ `@mod-a/views/function-a/page-b`),
  ba: () => import( /* webpackChunkName: "mod-a/function-b/page-a" */ `@mod-a/views/function-b/page-a`),
}
