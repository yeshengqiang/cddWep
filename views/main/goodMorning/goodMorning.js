/**
 *  作者：yeshengqiang
 *    时间：2016-08-08
 *    描述：早安1919
 */
define(function (require) {
    var app = require('../../../app');

    app.controller('goodMorningCrl', ['$scope', '$http', 'url', function ($scope, $http, url) {

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo')), checkVlaue = app.get('checkValue');
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.services = false;                        //服务项目(物流)
        if (role == 1) {
            $scope.demand = true;
            loadPP();
        } else if (role == 2) {
            $scope.services = true;
            loadWL();
        }

        $scope.searchData = {};
        //物流
        function loadWL() {
            //分页
            var currentBrand = function (page, callback) {
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                $http.post(url + '/paper/showPageList', $.extend({}, page, parm)).success(callback);
            };
            $scope.currentBrand = app.get('Paginator').list(currentBrand, 6);

            //下载
            $scope.down = function (item) {
                layer.confirm("是否下载文件？",
                    {btn : ['是','否']},function(){
                        window.location.href = url + '/file/download?downloadType=2&path=' + item.content;
                        yMake.layer.msg("文件下载成功 ",{icon:1,time:1000});
                        layer.msg("",{time:1});
                    })

            };
        }

        //品牌
        function loadPP() {
            //分页
            var currentBrand = function (page, callback) {
                console.log($scope.searchData);
                var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
                console.log('品牌');
                console.log(parm);
                $http.post(url + '/paper/showPageList', $.extend({}, page, parm)).success(callback);
            };
            $scope.currentBrand = app.get('Paginator').list(currentBrand, 6);

            //下载
            $scope.down = function (item) {
                layer.confirm("是否下载文件？",
                    {btn : ['是','否']},function(){
                        window.location.href = url + '/file/download?downloadType=2&path=' + item.content;
                        yMake.layer.msg("文件下载成功 ",{icon:1,time:1000});
                        layer.msg("",{time:1});
                    })
            };
        }
        //yMake.fn.autoHeight('.bgWhite',45);
    }]);
});