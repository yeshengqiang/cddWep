/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：会员管理
 */
define(function(require){
    var app = require('../../../app');

    app.filter('stateFormat',function(){
        //0 未认证,2 认证不通过,1 认证,3 拉黑
        return function(inp){
            var info = '';
            switch (inp){
                case '1':
                    info = '认证不通过';
                    break;
                case '2':
                    info = '已认证';
                    break;
                case '3':
                    info = '已拉黑';
                    break;
                default :
                    info = '未认证';
                    break;
            }
            return info;
        }
    });

    app.controller('vipManagementCrl',['$scope','url','$http','$location','$state','$rootScope',function($scope,url,$http,$location,$state,$rootScope){

        //条件
        $scope.division = [
            {value:0,name:'未认证'},
            {value:1,name:'认证不通过'},
            {value:2,name:'已认证'},
            {value:3,name:'已拉黑'}
        ];

        //分页查询
        var fetchFunction = function(page,callback){
            var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
            console.log(parm);
            $http.post(url+'/user/hyquery2Page', $.extend({},page, parm)).success(callback)
        };
        $scope.searchPaginator = app.get('Paginator').list(fetchFunction,6);
        console.log($scope.searchPaginator);
        //审核
        $scope.audit = function(item){
            if(sessionStorage.getItem('auditItm'))sessionStorage.removeItem('auditItm');
            sessionStorage.setItem('auditItm',JSON.stringify(item));
            $location.path('/main/vipManagement/audit');
        };
        yMake.fn.autoHeight('.bgWhite',45);
        //yMake.fn.autoHeight('.contentHeight',5);
    }]);
});
