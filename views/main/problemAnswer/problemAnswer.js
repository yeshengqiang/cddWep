/**
 *  作者：makaiqin
 *	时间：2016-08-10
 *	描述：问题反馈
 */
define(function(require){
    var app = require('../../../app');
    //过滤器
    app.filter('typeFormat', function () {
        return function (inp) {
            var info = "";
            switch (inp) {
                case '1':
                    info = '类型1';
                    break;
                case '2':
                    info = '类型2';
                    break;
                case '3':
                    info = '类型3';
                    break;
            }
            return info;
        };
    });

    app.controller('problemAnswerCrl',['$scope','url','$http','$location',function($scope,url,$http,$location){

        //初始化
        $scope.searchData = {};
        //获取分页数据
        var answerList = function (page, callback) {
            var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/suggestion/showPageList', $.extend({},page, param)).success(callback)
        };
        $scope.searchPaginator = app.get('Paginator').list(answerList, 6);

        //问题反馈
        $scope.feedback = function(){

            $location.path('/main/problemAnswer/problemWrite');
        };

        yMake.fn.autoHeight('.bgWhite',45);

    }]);
});