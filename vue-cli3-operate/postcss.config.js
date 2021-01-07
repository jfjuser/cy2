module.exports = {
  plugins: {
    autoprefixer: {},
	"postcss-px2rem-exclude": {  // 添加的代码
	   remUnit: 37.5,
	   // exclude: /node_modules|folder_name/i // 忽略node_modules目录下的文件，注意这里值不要写成字符串，否则引入的外部UI也会转rem
	}
  }
}
