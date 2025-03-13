const { defineConfig } = require("@vue/cli-service"); // 引入 vue-cli-service 提供的 defineConfig 函数，用于定义 Vue CLI 配置
const CompressionPlugin = require("compression-webpack-plugin"); // 引入 compression-webpack-plugin 插件，用于gzip压缩

module.exports = defineConfig({ // 使用 defineConfig 函数包裹配置对象，提供类型提示
	transpileDependencies: true, // Babel 转译依赖项，确保依赖中的代码也被 Babel 处理

	devServer: { // 配置 webpack-dev-server
		client: {
			overlay: false, // 关闭浏览器错误提示遮罩层，设置为false时错误信息将显示在控制台
		},
		proxy: { // 配置代理
			"/vanna": { // 代理以 /vanna 开头的请求
				target: "http://101.126.18.51:8084", // 代理目标地址
				changeOrigin: true, // 改变请求头中的 Origin 字段，设置为 true 时，Origin 会被修改为 target 的域名
				pathRewrite: { // 路径重写
					"^/vanna": "", // 将以 /vanna 开头的路径重写为空字符串，即请求到 target 时会去除 /vanna 前缀
				},
			},
			"/api": { // 代理以 /api 开头的请求
				target: "http://101.126.18.51:3000", // 代理目标地址
				changeOrigin: true, // 改变请求头中的 Origin 字段
				pathRewrite: { // 路径重写
					"^/api": "", // 将以 /api 开头的路径重写为空字符串，即请求到 target 时会去除 /api 前缀
				},
			},
			"/public": {  // 添加新的代理配置
				target: "http://101.126.18.51:3000",
				changeOrigin: true,
				pathRewrite: {
					"^/public": "/public"  // 保持 public 路径不变
				}
			},
			"/result-image": {
				target: "http://101.126.18.51:3000",
				changeOrigin: true,
				pathRewrite: {
					"^/result-image": "/result-image"
				}
			}
		},
	},
	configureWebpack: (config) => { //  使用 configureWebpack 选项可以更细粒度的控制 webpack 配置
		// 正确地将 CompressionPlugin 添加到 config.plugins 数组中
		config.plugins.push( //  向 webpack 配置的 plugins 数组中添加插件
			new CompressionPlugin({ //  创建 CompressionPlugin 实例，用于gzip压缩
				test: /\.(js|css|html|svg)$/, //  匹配需要压缩的文件类型，这里匹配 js、css、html 和 svg 文件
				threshold: 10240, //  文件压缩阈值，只有当文件大小大于 10KB 时才会被压缩 (单位 bytes)
				deleteOriginalAssets: false, //  是否删除原始资源文件，设置为 false 表示保留原始文件和压缩后的文件
			})
		);
		config.devtool = 'source-map'; // 保留 source-map 配置，用于在开发者工具中调试源代码
	},
	publicPath: "./", //  设置 publicPath 为 "./"，使打包后的资源使用相对路径，适用于部署在子目录或本地
});