'use strict';

const NODE_ENV = process.env.NODE_ENV || "development";
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: "./main",
  output: {
    path: __dirname + "/public",
    filename: "build.js",
    library: "home"
  },

  watch: true,

  watchOptions:{
      aggregateTimeout: 100
  },

  devtool: "inline-source-map",

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.html$/, loader: "html-loader"
      },
      {
        test: /\.(png|jpg|gif|svg|JPG)$/,
        loader: 'file-loader?name=img/[name].[ext]?[hash]'
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ]
  },

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new UglifyJsPlugin({
      "uglifyOptions":
      {
        compress: {
          warnings: false
        },
        sourceMap: true
      }
    }
    ),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}