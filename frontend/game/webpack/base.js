const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry:"./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test:/\.(png|jpe?g|svg)$/i,
        use: "image-webpack-loader",
        type: "asset/resource"
      },
      {
        test: /\.(gif|xml)$/i,
        use: "file-loader",
        type: "asset/resource"
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'GameObjetsManager', 
      template: 'index.html' }) 
  ],

  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 8080,
  },
};
