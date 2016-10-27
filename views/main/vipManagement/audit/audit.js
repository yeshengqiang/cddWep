/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：认证审核
 */
define(function(require){
   var app = require('../../../../app');

    app.controller('auditCrl',['$scope','url','$http','$rootScope','$location',function($scope,url,$http,$rootScope,$location){
        if(sessionStorage.getItem('auditItm')){
            $scope.auditItm = JSON.parse(sessionStorage.getItem('auditItm'));
        }else{
            $location.path('/main/vipManagement');
        }
        $scope.url = url;
        try{
            $scope.auditItm.certificate = $scope.auditItm.certificate.split(',');
            console.log($scope.auditItm.certificate)
        }catch (e){
            $scope.auditItm.certificate = $scope.auditItm.certificate || [];
        }
        try{
            $scope.auditItm.corporationim = $scope.auditItm.corporationim.split(',');
        }catch (e){
            $scope.auditItm.corporationim = $scope.auditItm.corporationim || [];
        }
        $scope.title = '认证审核';
        $scope.changeIt = function(state) {
            $http.post(url + '/user/setState',{state:state,id:$scope.auditItm.id}).success(function (data) {
                yMake.layer.msg('审核成功!', {icon: '1', time: 2000});
                $location.path('/main/vipManagement');
                //$scope.auditItm = null;
            }).error(function () {
                yMake.layer.msg('审核失败!', {icon: '2', time: 2000});
            });
        };
        //查看图片
        $scope.changePhoto =function(){
            yMake.an.mark($scope.auditItm.certificate);
        }
        //查看图片
        $scope.changePhotoPerson =function(){
            yMake.an.mark($scope.auditItm.corporationim );
        }
    }]);

});