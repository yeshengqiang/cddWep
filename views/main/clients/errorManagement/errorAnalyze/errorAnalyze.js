/**
 *  作者：cl
 *    时间：2016-08-10
 *    描述：差错管理
 */
define(function (require) {
    var app = require('../../../../../app');

    app.controller('errorAnalyzeCrl', ['$scope', '$http', 'url', function ($scope, $http, url) {
        //$scope.title='差错数据分析';
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));  //获取用户信息
        var fetchFunction = function (page, callback) {
            var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/mistake/query2Tj', $.extend({}, page, parm)).success(callback)
        };
        $scope.mistakeAnalyze = app.get('Paginator').list(fetchFunction, 6);
        console.log($scope.mistakeAnalyze);
        //导出
        $scope.downloadFile = function () {
            var teamInfo = {
            };
            //导出接口暂时没有，待修改
            layer.confirm("是否下载模板？",
                {btn: ['是', '否']}, function () {
                    window.location.href = url + '/mistake/export?teamInfo=' + JSON.stringify(teamInfo);
                    yMake.layer.msg("文件导出成功 ", {icon: 1, time: 1000});
                    layer.msg("", {time: 1});
                });
        };

        /*var bgWhite = $('.bgWhite');
         bgWhite.css('height',$(document).height()-bgWhite.offset().top-20)*/
        yMake.fn.autoHeight('.bgWhite', 45);
    }]);
});