const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  cache: {
    // If using webpack 5, the recommended type is 'filesystem'
    type: "filesystem",
    buildDependencies: {
      // With this configuration, webpack will automatically manage caching when these files change.
      config: ["/node_modules/"], // Include this config file
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./src"),
    historyApiFallback: true,
  },
  entry: {
    popup: [
      path.resolve(__dirname, "./src/index-popup.js"),
      "./src/styles.css",
    ],
    options: [
      path.resolve(__dirname, "./src/index-options.js"),
      "./src/styles.css",
    ],
    foreground: [
      path.resolve(__dirname, "./src/index-foreground.js"),
      "./src/styles.css",
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    // publicPath: '/dist'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                {
                  plugins: ["@babel/plugin-proposal-class-properties"],
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.json5$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "json5-loader",
          options: {
            esModule: false,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "popup.html",
      template: "src/popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      filename: "options.html",
      template: "src/options.html",
      chunks: ["options"],
    }),
    new HtmlWebpackPlugin({
      filename: "foreground.html",
      template: "src/foreground.html",
      chunks: ["foreground"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "[name].[ext]" },
        { from: "src/background.js", to: "[name].[ext]" },
        { from: "src/inject_script.js", to: "[name].[ext]" },
        { from: "src/*.png", to: "[name].[ext]" },
      ],
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
  ],
};
