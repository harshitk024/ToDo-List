const HTMLPlugin = require("html-webpack-plugin")
module.exports = {
    entry : "./src/index.js",

    module:{
      rules:[
        {
          test: /\.css$/i,
          use: ['style-loader','css-loader']
        }
      ]
    },

    plugins: [new HTMLPlugin({
        template: "./src/index.html"
    })]

}
