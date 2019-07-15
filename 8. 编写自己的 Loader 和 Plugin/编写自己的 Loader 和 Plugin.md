## 新建打包环境
1. 初始化 npm 环境，生成 `package.json`
    ```bash
    npm init -y
    ```
2. 安装 `webpack` 和 `webpack-cli`
    ```bash
    yarn add webpack webpack-cli -D
    ```
3. 新建 webpack 配置文件
    把 `/1. 起步/demo/webpack.config.js` 复制过来略作调整

    `webpack.config.js`
    ```javascript
    const path = require('path')

    module.exports = {
      mode: 'development',
      entry: './hello-world.js',
      output: {
        filename: 'dist.js',
        path: path.resolve(__dirname, './')
      }
    }
    ```
4. 新建源文件
    `hello-world.js`
    ```javascript
    console.log('Hello World!')
    ```

5. npm scritps
   ```json
   {
    "scripts": {
      "build": "webpack"
    }
   }
   ```

命令行执行 `yarn build` 可以在生成的 dist 文件中看到 `eval("console.log('Hello World!'))` 。

## Loader
现在我们有了一个新的需求，希望把 `World` 字符串替换为 `Loader` 字符串且不能直接改动源码，我们可以写个 loader 来完成它。

> 所谓 loader 只是一个导出为函数的 JavaScript 模块。loader runner 会调用这个函数，然后把上一个 loader 产生的结果或者资源文件(resource file)传入进去，函数的 this 上下文将由 webpack 填充。

### 基础使用
1. 新增 Loader
    `helloLoader/index.js`

    ```javascript
    // 不能使用箭头函数，因为 Loader 函数中 this 指向 Loader Content 对象
    module.exports = function(content) {
      return content.replace(/World/g, 'Loader')
    }
    ```
2. 使用 Loader

   和使用其他 Loader 一样，在 `module.rules` 中配置
   `webpack.config.js`
   ```javascript
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader: path.resolve(__dirname, './helloLoader/index.js')
          }]
        }
      ]
    }
   ```

执行 `yarn build` 或 `webpack` ，可以在新生成的 `/dist.js` 文件中看到 `Hello Loader!`

*如果你在使用 Loader 时配置了 `options` 选项，则可以在函数中用 `this.query` 获取到 `options` 的全部配置*

### 异步 Loader
由于 Node 是单线程的，当你 Loader 计算耗时较长时，同步就不再合适。在异步 Loader 中，必须调用 `this.async()` ，来指示 loader runner 等待异步结果。

`helloLoader/async-index.js`
```javascript
module.exports = function (content) {
  let callback = this.async()
  setTimeout(() => {
    callback(null, content.replace(/World/g, 'Async Loader'))
  }, 3000)
}

```
可以对比分别使用 `helloLoader/index.js` 和 `helloLoader/async-index.js` 时的打包时间，刚好相差 3s ，说明异步是生效的。

## Plugin
> 插件向第三方开发者提供了 webpack 引擎中完整的能力。使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。

插件由以下几点构成：
- 具名 Javascript 函数
- 在它的原型上定义 apply 方法
- 指定一个触及到 webpack 本身的 [事件钩子](https://webpack.docschina.org/api/compiler-hooks/)
- 操作 webpack 内部的实例特定数据
- 实现功能后调用 webpack 提供的 callback （异步时需要）

*插件和 Loader 的不同在于插件可以控制在 Webpack 的某个生命周期执行， 而 Loader 只能在文件加载时进行处理*

### 基础使用
编写插件需要熟悉的是 Webpack 提供的钩子，其中最为重要的就是 [compiler](https://webpack.docschina.org/api/compiler-hooks/) 和 [compilation](https://webpack.docschina.org/api/compilation-hooks/)

1. 新增 Plugin
   `helloPlugin/index.js`
   ```javascript
   module.exports = class HelloPlugin {
     apply(compiler) {
       compiler.hooks.compilation.tap('HelloPlugin', compilation => {
         console.log('helloPlugin load successful')
       })
     }
   }
   ```
2. 使用 Plugin
   `webpack.config.js`
   ```javascript
    const HelloPlugin = require('./helloPlugin/index.js')
    module.exports = {
      plugins: [
        new HelloPlugin()
      ]
    }
   ```

### 代码所有权注释插件
插件将实现在每个生成文件中添加代码所有权注释（基础功能），主要参考 [[文档] 编写一个插件](https://webpack.docschina.org/contribute/writing-a-plugin/#%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E6%8F%92%E4%BB%B6) 和 `/node_modules/webpack/lib/BannerPlugin.js` 。

`helloPlugin/copyright.js`
```javascript
const { ConcatSource } = require('webpack-sources')

module.exports = class copyrightWebpackPlugin {
  constructor(options) {
    // 一般还应做参数合法性校验
    // 默认从 package.json 中获取代码作者和版本
    let defualt = ` * @copyright ${require('../package.json').auther}\n * @version ${require('../package.json').version}`
    this.banner = options.banner || defualt
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('copyrightWebpackPlugin', compilation => {
      compilation.hooks.optimizeChunkAssets.tapAsync('copyrightWebpackPlugin', (chunks, callback) => {
        chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            console.log(this.banner)
            compilation.assets[file] = new ConcatSource(
              `/*\n${this.banner}\n */`,
              '\n\n',
              compilation.assets[file]
            )
          })
        })

        callback()
      })
    })
  }
}
```

在 `plugins` 数组中增加上面这个插件的示例，打包后可以在 `dist.js` 看到插件生成的所有权注释:

```javascript
/*
 * @copyright hundsun
 * @version 1.0.0
 */

// ... 原本内容 ...
```


## 参考文档
- [Loader API](https://webpack.docschina.org/api/loaders/)
- [Plugin API](https://webpack.docschina.org/api/plugins/)
- [编写一个 loader](https://webpack.docschina.org/contribute/writing-a-loader/)
- [编写一个 plugin](https://webpack.docschina.org/contribute/writing-a-plugin/)
