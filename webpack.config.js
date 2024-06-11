const config = {
  mode: "production",
  entry: {
    base: "./src/scripts/base.js",
    index: "./src/scripts/index.js",
    login: "./src/scripts/login.js",
    register: "./src/scripts/register.js",
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