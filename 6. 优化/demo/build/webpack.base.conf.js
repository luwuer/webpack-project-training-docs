const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  resolve,
  generateAddAssests,
  generateDllReferences
} = require('./utils')

module.exports = {
  entry: {
    app: ['./src/main.js']
  },
  output: {
    publicPath: '/',
    filename: '[name].[hash:5].js',
    chunkFilename: '[name].[hash:5].chunk.js',
    path: resolve('dist')
  },
  resolve: {
    extensions: ['.vue', '.js'],
    alias: {
      '@': resolve('./src'),
      '@root': resolve()
    },
    modules: [resolve('./node_modules')]
  },
  performance: false,
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // 在开发环境下，不使用 prettier 格式化编译后的模板渲染代码
          // 更多设置： https://vue-loader.vuejs.org/zh/options.html#cachedirectory-cacheidentifier
          prettify: false,
          cacheDirectory: resolve('node_modules/.cache/vue-loader'),
          cacheIdentifier: 'vue'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src')
        ],
        options: {
          cacheDirectory: true // 默认目录 node_modules/.cache/babel-loader
          // cacheDirectory: resolve('/.cache/babel-loader')
        }
      },
      {
        test: /\.styl(us)?$/,
        use: [
          process.env.NODE_ENV !== 'production' ?
          'vue-style-loader' : {
            // loader: resolve('node_modules/mini-css-extract-plugin/dist/loader.js'),
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2 // 在 css-loader 前执行的 loader 数量
            }
          },
          'postcss-loader',
          {
            loader: 'stylus-loader',
            options: {
              preferPathResolver: 'webpack' // 优先使用 webpack 用于路径解析，找不到再使用 stylus-loader 的路径解析
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production' ?
          'vue-style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        use: [{
          loader: 'url-loader',
          options: {
            // 文件命名
            name: '[name].[ext]',
            // 输出路径
            outputPath: 'imgs/',
            // 小于 10k 的图片转成 base64 编码
            limit: 10240
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      }
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:5].css',
      chunkFilename: 'css/[name].[contenthash:5].css'
    }),
    ...generateAddAssests(),
    ...generateDllReferences()
  ]
}
