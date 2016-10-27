/**
 *  作者：maxu
 *	时间：2016-08-09
 *	描述：我的星级
 */
define(function(require){
    var app = require('../../../../app');

    app.controller('myStarCrl',['$scope','url','$http','$location',function($scope,url,$http,$location){

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;               //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //物流
        $scope.backstage = false;                          //后台
        $scope.title = '';                                //对应名称
        if(role==2){
            $scope.services = true;
            $scope.title = '我的星级';

            //获取数据（我的星级物流）
            $http.post(url+'/level/mylevel?loginname='+userInfo.data.loginname).success(function(data){
                $scope.starts = data.data;
            }).error(function(){
                yMake.layer.msg('查询失败',{icon:2});
            });

        }else if(role==3){
            $scope.backstage = true;
            $scope.title = '会员星级查询';
            //初始化
            $scope.searchData = {};
            //分页查询
            var fetchFunction = function(page,callback){
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url+'/level/showPageList', $.extend({},page,param)).success(callback)
            };
            $scope.searchPaginator = app.get('Paginator').list(fetchFunction,6);
            console.log($scope.searchPaginator);
            //$scope.timeCheck=function(){
            //    var time = app.get('checkValue').isrightTime($scope.searchData.starttime,$scope.searchData.endtime);
            //    if(!time.state){
            //        yMake.layer.msg(time.info,{icon:0});
            //    }
            //};
        }
        //yMake.fn.autoHeight('.bgWhite',45);
    }]);
});

