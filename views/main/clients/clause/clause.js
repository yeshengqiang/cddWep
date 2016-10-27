/**
 *  作者：yeshengqiang
 *    时间：2016-08-09
 *    描述：合同条款
 */
define(function (require) {
    var app = require('../../../../app');
    app.controller('serviceTeamCrl', ['$scope', 'url', '$http', function ($scope, url, $http) {

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.parentTitle = '';                        //父标题
        if (role == 1) {
            $scope.parentTitle = '我的服务商';
            $scope.demand = true;
            demFun();
        } else if (role == 2) {
            $scope.parentTitle = '我的客户';
            $scope.services = true;
            serFun();
        }
        //获取所有的省
        $http.get(url + '/location/loadProvince').success(function (data) {
            $scope.provinces = data.data;
        });
        //根据省id获取城市
        $scope.getCity = function (province) {
            $scope.searchData.city = '';
            $http.get(url + '/location/loadCity?id=' + province).success(function (data) {
                $scope.cities = data.data;
            })
        };

        //初始化
        $scope.searchData = {};
        //公共分页方法
        var fetchFunction = function(page,callback){
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.loginname =userInfo.data.loginname;
            $http.post(url+'/pact/showPageList', $.extend({},page,param)).success(callback)
            console.log(param);
        };
        $scope.searchPaginator = app.get('Paginator').list(fetchFunction,6);
        console.log( $scope.searchPaginator);

        //品牌
        function demFun() {
            //公共分页方法
            var fetchFunction = function (page, callback) {
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/pact/showPageList?loginname=' + userInfo.data.loginname, $.extend({}, page, param)).success(callback)
            };
            $scope.searchPaginator = app.get('Paginator').list(fetchFunction, 6);

            //下载
            $scope.download = function (fileName) {
                layer.confirm("是否下载文件？",
                    {btn : ['是','否']},function(){
                        window.location.href = url + '/file/download?downloadType=2&path=' + fileName;
                        yMake.layer.msg("文件下载成功 ",{icon:1,time:1000});
                        layer.msg("",{time:1});
                    })
            };
        }

        //物流
        function serFun() {
            //公共分页方法
            var fetchFunction = function (page, callback) {
                var param = app.get('checkValue').dateRangeFormat($scope.searchData);
                console.log(param);
                $http.post(url + '/pact/showPageList?loginname=' + userInfo.data.loginname, $.extend({}, page, param)).success(callback)
            };
            $scope.searchPaginator = app.get('Paginator').list(fetchFunction, 6);
            console.log($scope.searchPaginator);
            //下载
            $scope.download = function (fileName) {
                layer.confirm("是否下载文件？",
                    {btn : ['是','否']},function(){
                        window.location.href = url + '/file/download?downloadType=2&path=' + fileName;
                        yMake.layer.msg("文件下载成功 ",{icon:1,time:1000});
                        layer.msg("",{time:1});
                    })
            };
        }
        //下载
        $scope.downloadFile = function (fileName) {

            layer.confirm("是否下载文件？",
                {btn : ['是','否']},function(){
                    window.location.href = url + '/file/download?downloadType=2&path=' + fileName;
                    yMake.layer.msg("文件下载成功 ",{icon:1,time:1000});
                    layer.msg("",{time:1});
                })
        };

	}]);
});