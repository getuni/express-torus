const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  //mode: process.env.NODE_ENV,
  plugins: [
    new CopyPlugin({
      patterns: [{from: "./src/app/assets/loading.json", to: "app/assets/loading.json"}],
    }),
  ],
  entry: {
    vendor: ["@babel/polyfill", "react"],
    app: ["./src/app/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".wasm", ".mjs", "*"]
  }
};
