/**
 *  作者：yeshengqiang
 *	时间：2016-08-08
 *	描述：顶部页面
 */
define(function(require){
	var app = require('../../../app');


	app.controller('topCrl',['$scope','$location','$http','url',function($scope,$location,$http,url){

        //初始化
        $scope.userInfo = {};

        //获取用户登录信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        $scope.userInfo.loginname = userInfo.data.loginname;
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.backTitle = false;                       //品质中心(后台)
        $scope.company= '';                        //父标题
        if(role==1){
            $scope.services =true;
        }else if(role==2){
            $scope.demand =true;
        }else if(role==3){
            $scope.backTitle =true;
        }

        $scope.company= userInfo.data.name;
        //修改密码
        $scope.sub = function(){
            var oldPwd = app.get('checkValue').isNull($scope.userInfo.oldpwd);
            var isEqual1 = app.get('checkValue').isEqual($scope.userInfo.oldpwd,userInfo.data.password);
            var newPwd = app.get('checkValue').isComplex($scope.userInfo.newpwd,'新');
            var repeatPwd = app.get('checkValue').isNull($scope.userInfo.repeatPwd);
            var isEqual2 = app.get('checkValue').isEqual($scope.userInfo.newpwd,$scope.userInfo.repeatPwd);

            if(!oldPwd.state){
                yMake.layer.msg(oldPwd.info+'原始密码',{icon:0,time:2000});
                return;
            }else if(!isEqual1.state){
                yMake.layer.msg('原始密码输入错误',{icon:0,time:2000});
                return;
            }else if(!newPwd.state){
                yMake.layer.msg(newPwd.info,{icon:0,time:2000});
                return;
            }else if(!repeatPwd.state){
                yMake.layer.msg(repeatPwd.info+'重复密码',{icon:0,time:2000});
                return;
            }else if(!isEqual2.state){
                yMake.layer.msg(isEqual2.info,{icon:0,time:2000});
                return;
            }

            $http.post(url+'/user/changepwd?id=21',$scope.userInfo).success(function(data){
                yMake.layer.msg('修改成功!',{icon:0,time:2000});
            }).error(function(){
                yMake.layer.msg('修改失败!',{icon:0,time:2000});
            });
        };

        //退出登录
        $scope.exit = function(){
            layer.confirm('确定退出？', {
                btn: ['确定','取消'] //按钮
            }, function(){
                if(sessionStorage.getItem('userInfo')){
                    sessionStorage.removeItem('userInfo');
                    yMake.layer.msg('退出成功!',{icon:1,time:2000});
                    layer.msg('',{time:1});
                    $scope.$apply(function(){
                        $location.path('/login');
                    });
                }
            });
        };


	}]);
});