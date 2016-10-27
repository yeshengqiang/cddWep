/**
 *  作者：cl
 *	时间：2016-08-10
 *	描述：差错管理
 */
define(function(require){
    var app = require('../../../../../app');
    app.controller('errorDetailCrl',['$scope','$http','url',function($scope,$http,url){
        $scope.title='差错明细';
        function load(){
            var fetchFunction = function(page,callback){
                $http.post(url+'/mistake/showPageList', $.extend({},page,{})).success(callback)
            };
            $scope.mistakeDetail = app.get('Paginator').list(fetchFunction,6);
        }
        load();
        //判定
        $scope.decide = function(id){
            layer.confirm('判定是否有错！',{btn:['有错','无错']},function(){
                $http.get(url+'/').success(function(data){
                    layer.msg('判定成功！')
                }).error(function(){
                    layer.msg('判定出错！')
                })
            },function(){
                $http.get(url+'/').success(function(data){
                    layer.msg('判定成功！')
                }).error(function(){
                    layer.msg('判定出错！')
                })
            })
        };

        //导出
        $scope.downloadFile = function(){
            var teamInfo = {
                //brandedcompanyid: $scope.brandedcompanyid,
                //city: $scope.city,
                //province: $scope.province
            };
            layer.confirm("是否下载模板？",
                {btn: ['是', '否']}, function () {
                    window.location.href = url+'/team/export?teamInfo='+JSON.stringify(teamInfo);
                    yMake.layer.msg("文件导出成功 ", {icon: 1, time: 1000});
                    layer.msg("", {time: 1});
                });
        };

        //var bgWhite = $('.bgWhite');
        //bgWhite.css('height',$(document).height()-bgWhite.offset().top-20)
    }]);
});