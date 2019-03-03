'use strict'

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const buildDir = 'dev'

const base = baseConfig(buildDir)
const dev = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(true)
    })
  ]
}

module.exports = merge(base, dev)
