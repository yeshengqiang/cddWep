/**
 *  作者：yeshengqiang
 *	时间：2016-08-09
 *	描述：调拨报表
 */
define(function(require){
    var app = require('../../../../../app');

    app.controller('allotCrl',['$scope','url','$http','$location','$state','$rootScope',function($scope,url,$http,$location,$state,$rootScope){

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.parentTitle = '';                        //父标题
        //初始化
        $scope.searchData = {};
        if(role==1){
            $scope.parentTitle = '我的服务商';
            $scope.demand = true;
            //分页查询
            var currentCheck = function(page,callback){
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url+'/delivery/showPageList', $.extend({loginname:userInfo.data.loginname,type:2},page,param)).success(callback);
            };
            $scope.searchPaginator = app.get('Paginator').list(currentCheck,6);
        }else if(role==2){
            $scope.parentTitle = '我的客户';
            $scope.services = true;
            //分页查询
            var currentCheck = function(page,callback){
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url+'/delivery/showPageList', $.extend({loginname:userInfo.data.loginname,type:2},page,param)).success(callback);
            };
            $scope.searchPaginator = app.get('Paginator').list(currentCheck,6);
        }



        //查看明细
        $scope.loadDetail = function (item) {
            $state.go('main.clients.reports.allot.allotDetail',{'fromplace':item.fromplace});
        };
        //导出
        $scope.export=function(){
			var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.fromplace = param.fromplace||'';
            layer.confirm("是否导出文件？",
                {btn : ['是','否']},function(){
                    window.location.href=url +"/delivery/export?loginname="+userInfo.data.loginname+"&type=2"+'&fromplace='+param.fromplace;
                    yMake.layer.msg("文件导出成功 ",{icon:1,time:1000});
                    layer.msg("",{time:1});
                })
        };
        //load();
        yMake.fn.autoHeight('.bgWhite',45)
    }]);
});
