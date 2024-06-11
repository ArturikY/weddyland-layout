const config = {
  mode: "production",
  entry: {
    index: "./src/scripts/index.js",
    login: "./src/scripts/login.js",
    base: "./src/scripts/base.js",
  },
  output: {
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}

module.exports = config;