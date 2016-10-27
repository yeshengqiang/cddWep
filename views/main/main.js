/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：路由首页
 */
define(function(require){
	var app = require('../../app');

	app.controller('mainCrl',['$scope','$rootScope',function($scope,$rootScope){
        $(function(){
            setTimeout(function () {
                yMake.fn.autoHeight('.leftBox',16);
            },10)
        });

        console.log($rootScope);

	}]);
});