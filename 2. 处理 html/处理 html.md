# 使用 HtmlWebpackPlugin 处理 html
上一节我有提到 Webpack 只能处理 Javascript 文件，这显然不能满足用户的日常使用需求，所以 Webpack 提供了 loader 和 plugins 两个配置选项，用于扩展 Webpack 的处理类型。本节要讲的 `HtmlWebpackPlugin` 就是专门用来处理和生成 `html` 文件的插件。

由于 Webpack 中文网 plugins 和 loaders 文档部分内容更新滞后，使用中如果有疑惑，请点击文档右上角的“查阅原文”查看英文文档。

## 安装
把 `HtmlWebpackPlugin` 安装到项目，本小节项目基于上一节的示例项目进行扩展。

```bash
yarn add html-webpack-plugin -D
```
*`HtmlWebpackPlugin` 只是用于 Webpack 打包而不是项目运行所需依赖，所以将其放到 `package.json` 的 `devDependencies` 项中，表示开发依赖。*

## 基本使用
`HtmlWebpackPlugin` 使用有一个前置条件，就是当前项目已经安装有 `webpack` 依赖，你可以在 `node_modules/html-webpack-plugin/package.json` 中的 `peerDependencies` 项看到。

*如果不能在 `node_modules/` 目录下找到 `webpack` ，打包会报错 `Cannot find module 'webpack/lib/node/NodeTemplatePlugin'`*

1. 在项目中安装 Webpack
    ```bash
    yarn add webpack -D
    ```
    因为你已经在全局安装过 Webpack，你也可以使用 `npm link webpack` 把全局 Webpack 依赖链接到这个示例项目。**但并不推荐**这样做，因为 link 并不会把依赖加入到项目的 `package.json` 中，所以当你把配置给别人使用时，别人仍然会报错。

2. 在 `webpack.config.js` 中加入 `HtmlWebpackPlugin` 的基本配置

   `webpack.config.js`
    ```javascript
    const path = require('path')
    // +++
    const HtmlWebpackPlugin = require('html-webpack-plugin')

    module.exports = {
      mode: 'development',
      entry: './src.js',
      output: {
        filename: 'dist.js',
        // modified
        path: path.resolve(__dirname, './dist')
      },
      // +++
      plugins:[
        new HtmlWebpackPlugin()
      ]
    }
    ```

3. 打包
    ```bash
    webpack
    ```
    可以看到在生成的 `dist/` 目录下生成了两个文件: `dist.js` 和 `index.html`，`dist.js` 内容同上一节，`index.html` 就是 `HtmlWebpackPlugin` 生成的，我们可以在浏览器中打开并查看控制台 `counter` 函数的输出。

    `index.html`
    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Webpack App</title>
      </head>
      <body>
      <script type="text/javascript" src="dist.js"></script></body>
    </html>
    ```

## 常用配置
本小节将通过 `HtmlWebpackPlugin` 的配置解释，为什么上方生成了这样一个 html 文件。

- `filename` 生成 html 文件的文件名，默认值 `index.html`

  上文生成 `index.html` 的原因，你可以这样修改它：
  ```javascript
  new HtmlWebpackPlugin({
    filename: 'app.html'
  })
  ```

- `title` 生成 html 文件的 title 标签内容，默认值 `Webpack App`

  `index.html` 中 `<title>Webpack App</title>` 的原因，你可以这样修改它：
  ```javascript
  new HtmlWebpackPlugin({
    title: 'my app'
  })
  ```
- `chunks` 生成 html 文件的引入，默认为所有非懒加载生成文件

  `index.html` 中 `<script type="text/javascript" src="dist.js"></script>` 的原因，你可以这样修改它：
  ```javascript
  new HtmlWebpackPlugin({
    chunks: [] // 不加载任何生成文件
  })
  ```
- `template` 生成 html 基于的模板

  有时候我们希望在项目根目录存写一个 `index.html` ，让一些静态引用变得更方便，这个时候就需要用到 `template` 配置项，最终生成的 html 文件会合并 `template` 中的引入和其他配置 / 插件生成的引入 。

  ```javascript
  const path = require('path')
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'index.html')
  })
  ```
- `chunksSortMode` 控制生成 html 文件资源引入顺序，默认值 `auto`

  `none | auto | dependency | manual | {Function}`

  一般来说，都是使用默认值。但部分 webpack 3x 项目升级 webpack 4x 时会出现循环依赖报错，实际不会影响到项目运行，而排查起来十分恼火，故可能在某些特定情况下，你需要把它设置为 `none`。当然这绝对不是建议，只是可能需要。
- `minify` 生成 html 压缩相关配置，`mode: production` 时为 `true` 否则为 `false`

  但其他当然你还可以进行更详细的配置：
  ```javascript
  new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }
  })
  ```
  在目前比较流行的前端框架中（ vue / react / angular ）用处较小
