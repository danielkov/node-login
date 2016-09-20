var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
   context: __dirname,
   devtool: debug ? 'inline-sourcemap' : null,
   entry: './client/app.js',
   output: {
      path: __dirname + '/client',
      filename: 'js/app.bundle.js'
   },
   module: {
    loaders: [{
        test: /\.html$/,
        loader: "html"
     },
     {
        test: /\.sass$/,
        loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader', 'sass-loader'])
     },
     {
       test: /\.hbs$/,
       loader: 'handlebars-loader'
     }
  ]
   },
   plugins: debug ? [
      new HtmlWebpackPlugin({
         title: 'Login App'
      }),
      new ExtractTextPlugin("css/style.bundle.css"),

   ] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
         mangle: false,
         sourcemap: false
      })
   ]
}
