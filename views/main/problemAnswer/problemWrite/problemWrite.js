/**
 *  作者：makaiqin
 *	时间：2016-08-10
 *	描述：问题填写
 */
define(function(require){
    var app = require('../../../../app');

    app.controller('problemWriteCrl',['$scope','$location','$http','url',function($scope,$location,$http,url){

        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

        $scope.parm = {};

        //下拉菜单
        $scope.selects = [
            {value:'1',name:'类型1'},
            {value:'2',name:'类型2'},
            {value:'3',name:'类型3'}
        ];

        //提交
        $scope.sub = function(){
            var type = app.get('checkValue').isNull($scope.parm.type);
            var detail = app.get('checkValue').isNull($scope.parm.detail);
            if(!type.state){
                yMake.layer.msg('请选择反馈类型',{icon:0});
                return;
            }else if(!detail.state){
                yMake.layer.msg('请输入详细描述',{icon:0});
                return;
            }
            $http.post(url + '/suggestion/add?loginname='+userInfo.data.loginname, $scope.parm).success(function(data){
                $location.path('/main/problemAnswer');
                $scope.parm = {};
                yMake.layer.msg('提交成功!',{icon:1});
            }).error(function(){
                yMake.layer.msg('提交失败!',{icon:2});
            });
        };

        //取消
        $scope.cancle = function(){
            //切记清空数据
            $scope.parm = {};
            $location.path('/main/problemAnswer');
        };
    }]);
});