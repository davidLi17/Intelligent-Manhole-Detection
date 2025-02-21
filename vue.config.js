const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
	transpileDependencies: true,

	devServer: {
		client: {
			overlay: false,
		},
		proxy: {
			"/vanna": {
				target: "http://101.126.18.51:8084",
				changeOrigin: true,
				pathRewrite: {
					"^/vanna": "",
				},
			},
			"/api": {
				target: "http://101.126.18.51:3000",
				changeOrigin: true,
				pathRewrite: {
					"^/api": "",
				},
			},
		},
	},
	publicPath: "./",
});
