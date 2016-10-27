/**
 *  作者：cl
 *	时间：2016-08-30
 *	描述：配送数据明细
 */
define(function(require){
    var app = require('../../../../../app');

    app.controller('reportsDetailCrl',['$scope','$http','url','$stateParams',function($scope,$http,url,$stateParams){

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.parentTitle = '';                        //父标题
        if(role==1){
            $scope.parentTitle = '我的服务商';
            $scope.demand = true;
        }else if(role==2){
            $scope.parentTitle = '我的客户';
            $scope.services = true;
        }

        //获取所有的省
        $http.get(url+'/location/loadProvince').success(function(data){
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function(province){
            $scope.searchData.city = '';
            $http.get(url+'/location/loadCity?id='+province).success(function(data){
                $scope.cities = data.data;
            })
        };
        function load(){
            /*var str = $stateParams.id,info = str.split('-');
            if(info[1]==0){//物流
                $http.post(url+'/delivery/checkMinute', $.extend({loginname:userInfo.data.loginname,wlcompanyid:info[0]},$scope.searchData))
                    .success(function(data){
                        $scope.reportsDetail  = data;
                    });
            }else{//品牌
                $http.post(url+'/delivery/checkMinute', $.extend({loginname:userInfo.data.loginname,brandedcompanyid:info[0]},$scope.searchData))
                    .success(function(data){
                        $scope.reportsDetail  = data;
                    });
            }*/
            $http.post(url+'/delivery/checkMinute', $.extend({loginname:userInfo.data.loginname,fromplace:$stateParams.id},$scope.searchData))
                .success(function(data){
                    $scope.reportsDetail  = data;
                });
        }
        load();

        yMake.fn.autoHeight('.bgWhite',45)
    }]);
});

