本节将在项目中加入 vue ，并使用单文件组件的方式进行后续开发。在这之前我们应该想到，`.vue` 文件是一种之前没有处理过的文件类型， Webpack 要解析它肯定需要使用其对应的 loader 。

## vue-loader
我们能从 vue 文档的菜单中找到 [vue-loader 文档](https://vue-loader.vuejs.org/zh/)，接下来就按照文档把 vue-loader 配置到 Webpack 的配置文件中。

```bash
yarn add vue-loader vue-template-compiler -D
```
> 你应该将 vue-loader 和 vue-template-compiler 一起安装

> 编译器的版本必须和基本的 vue 包保持同步，这样 vue-loader 就会生成兼容运行时的代码。这意味着你**每次升级项目中的 vue 包时，也应该匹配升级 vue-template-compiler**

```javascript
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // 在开发环境下，不使用 prettier 格式化编译后的模板渲染代码
          // 更多设置： https://vue-loader.vuejs.org/zh/options.html#cachedirectory-cacheidentifier
          prettify: false,
          cacheDirectory: resolve('/.cache')
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
```
*VueLoaderPlugin 插件是必须的，它的作用是将你定义的 `rules` 规则应用到 `.vue` 文件的 `<script> / <style>` 块中。*

## 其他调整

- 安装 vue 全家桶
  ```bash
  yarn add vue vue-router vuex
  ```

- 新增相应目录
  ```
  src
  ├──router
     ├──index.js
  ├──store
     ├──index.js
  ├──views
     ├──home
        ├──main.vue
     ├──page-a
        ├──main.vue
  ├──App.vue
  ```
- `resolve.alias`

  组件化开发需要频繁导入其他组件，如果只使用相对路径，代码层级较深时容易出错，所以我们通常都需要配置 Webpack 别名。
  ```javascript
  const path = require('path')
  module.exports = {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
  ```
- `resolve.extensions`

  `extensions` 可以让你在导入组件和工具函数时，忽略他们的扩展名， Webpack 会按数组顺序去查找文件。
  ```javascript
  module.exports = {
    resolve: {
      extensions: ['.vue', '.js']
    }
  }
  ```
- `resolve.modules`

  通常情况我们也会指明依赖目录的绝对路径，避免在导入依赖时 Webpack 一层层向上遍历，一般不能提升多少打包性能，聊胜于无。
  ```javascript
  module.exports = {
    resolve: {
      modules: [path.resolve(__dirname, './node_modules')]
    }
  }
  ```

## 部署
由于我们使用单页的开发模式，单纯用浏览器打开生成的 `.html` 文件就无法正常展示页面了（这里指 history 模式）。因为我们只有一个 `index.html` 文件，页面切换靠的是 vue-router 这个 JS 库，此时我们就需要一个静态资源访问服务，把不同的 url 指向同一个 `.html` 文件。

#### Nginx
这里不对 nginx 作额外的介绍，如果未曾使用过请查阅相关资料学习，当然也可以使用下文提到的 `http-server` 完成本小节的测试。

`nginx.conf`
```conf
server {
    listen 8080;
    server_name 127.0.0.1;

    charset utf-8;

    location / {
        root D:/dist;
        try_files $uri $uri/ /index.html;
        index  index.html;
    }
}
```
*此为简略版（生效配置）， 详细配置文件我放到 `demo/nginx-conf/conf/8081-staticTest.conf`*

#### http-server
nginx 是生产环境中常用服务器，但因其有很高的学习成本（部署 demo 项目学习成本不高，但相比 http-server 还是困难许多），所以这里再介绍一个替代方案 http-server。用它启动一个静态资源访问服务，只需要一句命令，不要太简单~

1. 安装
    ```bash
    yarn global add http-server
    ```

2. 使用

    ```bash
    # http-server [path] [options]
    http-server ./dist -p 8081
    ```
    *用 yarn 安装 `http-server` 依赖时可以看到，其实生成了两个可执行命令 `http-server` 和 `hs`，后者是前者的缩写，所以上方命令可以写作 `hs ./dist -p 8081`*


## 参考文档
- [Vue Loader Docs](https://vue-loader.vuejs.org/zh/)
- [Http-server Docs](https://www.npmjs.com/package/http-server)
- [[ Webpack Docs ] resolve](https://webpack.docschina.org/configuration/resolve/)
