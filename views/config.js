/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：配置文件(全局url)
 */
define(function(require){
	var app = require('../app');
	//公共入口
	app.constant('url', 'http://121.43.101.74:8080/warehouse');
	//app.constant('url', 'http://:80/warehouse');
	//app.constant('url', 'http://192.168.10.189:8080/CddWep');
});