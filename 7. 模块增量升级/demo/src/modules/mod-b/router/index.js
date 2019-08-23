export default {
  aa: () => import( /* webpackChunkName: "mod-b/function-a/page-a" */ `@mod-b/views/function-a/page-a`),
  ab: () => import( /* webpackChunkName: "mod-b/function-a/page-b" */ `@mod-b/views/function-a/page-b`),
  ba: () => import( /* webpackChunkName: "mod-b/function-b/page-a" */ `@mod-b/views/function-b/page-a`),
}
