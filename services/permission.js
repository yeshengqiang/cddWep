/**
 *  作者：yeshengqiang
 *	时间：2016-08-12
 *	描述：设置广播事件
 */
define(function(require){
    var app = require('../app');

    app.factory('permission',['$rootScope',function($rootScope){
        var permission = {};

            //设置权限
            permission.setPermiss = function(res){
                $rootScope.$broadcast('type',res);
            };
        return permission;
    }]);
})