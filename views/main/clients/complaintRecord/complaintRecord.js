/**
 *  作者：cl
 *    时间：2016-08-10
 *    描述：投诉管理
 */
define(function (require) {
    var app = require('../../../../app');

    //过滤器
    app.filter('typeFormat', function () {
        return function (inp) {
            var info = "";
            switch (inp) {
                case '1':
                    info = '1';
                    break;
                case '2':
                    info = '2';
                    break;
                case '3':
                    info = '3';
                    break;
                case '4':
                    info = '4';
                    break;
            }
            return info;
        };
    });
    app.filter('statusFormat', function () {
        return function (inp) {
            var info = "";
            switch (inp) {
                case '0':
                    info = '未评价';
                    break;
                case '1':
                    info = '不满意';
                    break;
                case '2':
                    info = '满意';
                    break;
            }
            return info;
        };
    });

    app.controller('complaintRecordCrl', ['$scope', 'url', '$http', '$location','$timeout', function ($scope, url, $http, $location,$timeout) {
        //获取id的全局变量
        var getId;
        //获取用户信息
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        //获取对应角色
        var role = userInfo.data.type;                  //(1:品牌，2：物流，3：后台)
        $scope.services = false;                        //服务项目(物流)
        $scope.demand = false;                          //仓配需求(品牌)
        $scope.parentTitle = '';                        //一级标题
        $scope.title = '';                                //二级标题
        $scope.nextTitle = '';                            //三级标题
        if (role == 1) {
            //品牌 我的服务商  投诉管理
            $scope.parentTitle = '我的服务商';
            $scope.title = '投诉管理';
            $scope.demand = true;
        } else if (role == 2) {
            //物流 我的客户  投诉管理
            $scope.parentTitle = '我的客户';
            $scope.title = '投诉管理';
            $scope.services = true;
        } else if (role == 3) {
            //后台 品质中心 投诉管理 投诉明细/投诉数据分析

        }

        //下拉列表值
        $scope.division = [
            {name: '1', value: '1'},
            {name: '2', value: '2'},
            {name: '3', value: '3'},
            {name: '4', value: '4'}
        ];

        //投诉承运商下拉列表
        $http.post(url+'/location/loadDetail?loginname='+userInfo.data.loginname).success(function(data){
            console.log(data);
            $scope.wlname=data.data;
        });


        //获取分页数据
        var fetchFunction = function (page, callback) {
            var parm = app.get('checkValue').dateRangeFormat($scope.searchData);
            $http.post(url + '/complaint/showPageList?loginname=' + userInfo.data.loginname, $.extend({}, page, parm)).success(callback)
        };

        $scope.searchPaginator = app.get('Paginator').list(fetchFunction, 6);
        console.log($scope.searchPaginator);

        //导出
        $scope.expo = function () {
			var param = app.get('checkValue').dateRangeFormat($scope.searchData);
            param.starttime = param.starttime||'';
            param.endtime = param.endtime||'';
            param.type = param.type||'';
            layer.confirm("是否下载文件？",
                {btn: ['是', '否']}, function () {
                    window.location.href = url + "/complaint/export?loginname="+userInfo.data.loginname+'&starttime='+param.starttime+
                    '&endtime='+param.endtime+
                    '&type='+param.type;
                    yMake.layer.msg("文件导出成功 ", {icon: 1, time: 1000});
                    layer.msg("", {time: 1});
                })
        };

        $scope.returnMessage = function () {
            $http.post(url + 'warehouse').success(function () {
            });
        };

        var status;
        //回复内容的显示
        $scope.reply = function (item) {
            $("#a").removeAttr("disabled");
            $("#b").removeAttr("disabled");
            $scope.replyInfo = {};
            $scope.replyInfo.description = item.description;
            $scope.replyInfo.reply = item.reply;
            $scope.replyInfo.replyagain = item.replyagain;
            getId = item.id;
            if ($scope.replyInfo.reply) {
                if ($scope.replyInfo.replyagain == null || $scope.replyInfo.replyagain == undefined) {
                    status = 1;
                }
                $("#a").attr("disabled", 'disabled');
            } else if ($scope.replyInfo.reply == null || $scope.replyInfo.reply == undefined) {
                $("#b").attr("disabled", 'disabled');
                status = 0;
            }
            if ($scope.replyInfo.replyagain) {
                $("#b").attr("disabled", 'disabled');
            }
        };
        $scope.replyInfo = {};
        //保存回复
        $scope.replySave = function () {

            //var a = app.get('checkValue').isNull($scope.replyInfo.replyagain);
            //var b = app.get('checkValue').isNull($scope.replyInfo.reply);
            //console.log($scope.replyInfo);
            //if(!a.state){
            //    yMake.layer.msg('请填入回复内容!', {icon: '2'});
            //    return;
            //}else if(!b.state){
            //    yMake.layer.msg('请填入回复内容!', {icon: '2'});
            //    return;
            //}
            console.log($scope.replyInfo);
            $http.post(url + '/complaint/addReply', {
                status: status,
                id: getId,
                replyagain: $scope.replyInfo.replyagain,
                reply: $scope.replyInfo.reply
            }).success(function (data) {
                $scope.searchPaginator._load();
                yMake.layer.msg('回复成功!', {icon: '1', time: 2000});
                $scope.replyInfo = {};
            }).error(function () {
                yMake.layer.msg('回复失败!', {icon: '2', time: 2000});
                $scope.replyInfo = {};
            });
        };

        var giveId;
        //品牌公司的查看
        $scope.khrequest = {};
        $scope.lookSome = function (item) {
            console.log(item.score);
            $scope.khrequest.a = item.description;
            $scope.khrequest.b = item.reply;
            $scope.khrequest.c = item.replyagain;
            $scope.answerIt.a = item.score;
            giveId = item.id;
        };
        //上报投诉
        $scope.complaintInfo = {};
        $scope.complainUpIt = function () {

            var wlname = app.get('checkValue').isNull($scope.complaintInfo.wlcompanyid);
            var type = app.get('checkValue').isNull($scope.complaintInfo.type);
            var content = app.get('checkValue').isNull($scope.complaintInfo.description);
            if (!wlname.state) {
                yMake.layer.msg('请选择投诉承运商', {icon: 0});
                return;
            } else if (!type.state) {
                yMake.layer.msg('请选择投诉类型', {icon: 0});
                return;
            } else if (!content.state) {
                yMake.layer.msg('请输入详细描述', {icon: 0});
                return;
            }
            $http.post(url + '/complaint/addComplaint?loginname=' + userInfo.data.loginname, $scope.complaintInfo).success(function (data) {
                $scope.searchPaginator._load();
                $scope.khrequest = {};
                $scope.answerIt = {};
                $scope.complaintInfo = {};
                yMake.layer.msg('添加成功!', {icon: '1', time: 2000});
                $('#complaint').modal('hide');
            }).error(function () {
                yMake.layer.msg('添加失败!', {icon: '2', time: 2000});
            });
        };

        //评价功能
        $scope.upData = {};
        $scope.answerIt = {};
        $scope.complainUp = function () {
            //if($scope.answerIt.a==null&&$scope.answerIt.a==undefined){
            //    yMake.layer.msg('所填内容不能为空!', {icon: '2'});
            //    return;
            //}
            var value1 = app.get('checkValue').isNull($scope.answerIt.a);
            var value2 = app.get('checkValue').isNull($scope.answerIt.a);
            if (!value1.state && !value2.state) {
                yMake.layer.msg('请评价承运商回复', {icon: 0});
                return;
            }
            $http.post(url + '/complaint/updateStatus', {
                score: $scope.answerIt.a,
                id: giveId
            }).success(function (data) {
                $scope.searchPaginator._load();
                yMake.layer.msg('评价成功!', {icon: '1', time: 2000});
                $('#reply2').modal('hide');
            }).error(function () {
                yMake.layer.msg('评价失败!', {icon: '2', time: 2000});
            });

        };

        //取消按钮
        $scope.cancle = function () {
            //清空数据
            $scope.khrequest = {};
            $scope.complaintInfo = {};
            $scope.answerIt = {};
            $scope.replyInfo = {};
        };
        //yMake.fn.autoHeight('.bgWhite',45);
    }]);
});
