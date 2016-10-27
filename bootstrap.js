/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：配置文件
 */


require.config({
    //urlArgs: "bust=" +  (new Date()).getTime(),
	paths:{
		'angular':'bower_components/angular/angular.min',
		'angular-ui-router':'bower_components/angular/angular-ui-router',
		'angular-async-loader':'bower_components/angular/angular-async-loader.min',
		'angular-animate':'bower_components/angular/angular-animate.min',
		'jquery':'bower_components/jquery/jquery-1.11.2.min',
		'bootstrap':'bower_components/bootstrap/js/bootstrap.min',
		'layer-ext':'bower_components/layer/extend/layer.ext',
		'layer':'bower_components/layer/layer',
		'zyupload':'bower_components/zyupload/lib/zyupload-1.0.0.min',
		'yMake':'bower_components/yMake/yMake',
		'daterangepicker':'bower_components/date/daterangepicker',
		'moment':'bower_components/date/moment.min'
	},
	shim:{
		'angular':{exports:'angular'},
		'angular-ui-router':{deps:['angular']},
		'angular-animate':{deps:['angular']},
		'bootstrap':{deps:['jquery']},
		'layer':{deps:['jquery']},
		'layer-ext':{deps:['layer']},
		'zyupload':{deps:['jquery']},
		'yMake':{deps:['jquery']},
		'daterangepicker':{deps:['jquery','moment']}
	}
});
require(['angular','bootstrap','views/config','routes/app-route','layer-ext','zyupload','yMake'],function(angular){
	angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});
