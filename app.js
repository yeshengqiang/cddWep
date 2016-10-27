/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：配置文件
 */
define(function(require,exports,module){
	
	var angular = require('angular');
	var asyncLoader = require('angular-async-loader');
	var animate = require('angular-animate');
	require('angular-ui-router');

	var app = angular.module('app', ['ui.router','ngAnimate']);
	asyncLoader.configure(app);
	
	module.exports = app;
});