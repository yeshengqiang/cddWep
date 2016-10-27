define(function (require) {
    var app = require('../app');


    app.run(['$rootScope','$location','$timeout','$stateParams',function($rootScope,$location,$timeout,$stateParams){
        $rootScope.params = $stateParams;

        //背景色自适应高度
        $rootScope.autoHeight = function(modifyHeight){
            yMake.fn.autoHeight('.bgWhite',modifyHeight);
        }

        $rootScope.$on('$stateChangeStart',function(event,toState){
            var state = ['login','register','forget'];
            //查找对应的路由
            if(state.indexOf(toState.name)>-1){
                return;
            }
            if(!sessionStorage.getItem('userInfo')){
               event.preventDefault();
                /*layer.msg('暂无登陆信息,请重新登陆!',{icon:0,time:2000});
                $timeout(function(){
                    $location.path('/login');
                },3000);*/
            }
        });
    }]);

    //后退
    app.directive('goBack',['$window',function($window){
        console.log($window.history);
        return function(scope,element,attr){
            element.on('click',function(){
                $window.history.go(-1);
            });
        }
    }]);

    //日期控件
    app.directive('datePick',function(){
        return {
            restrict:'A',
            scope:{
                datePick:'='
            },
            require:'?ngModel',
            link:function(scope,element,attr,ngModel){
                if(!ngModel)return
                $(function(){
                    require(['daterangepicker'],function(){
                        $(element).daterangepicker({
                            singleDatePicker: false,
                            autoUpdateInput:false,
                            timePicker12Hour: true, //采用24小时计时制
                            locale : {
                                applyLabel: '确定',
                                cancelLabel: '取消',
                                format:'YYYY-MM-DD',
                                separator: '/'
                            }
                        });
                        var reg = new RegExp('^(.*)\\/(.*)$','gi'); //
                        var dateReg = /([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/;
                        ngModel.$viewChangeListeners.unshift(function(){
                            value = ngModel.$viewValue || ngModel.$modelValue;
                            if(value.search(reg)>-1){
                                var startTime = value.replace(reg,'$1');
                                var endTime = value.replace(reg,'$2');
                                if(dateReg.test(startTime)){
                                    scope.datePick.starttime = startTime;
                                }else{
                                    scope.datePick.starttime = '';
                                }
                                if(dateReg.test(endTime)){
                                    scope.datePick.endtime = endTime;
                                }else{
                                    scope.datePick.endtime = '';
                                }
                            }else{
                                if(dateReg.test(value)){
                                    scope.datePick.starttime = value;
                                }else{
                                    scope.datePick.starttime = '';
                                }
                                scope.datePick.endtime = '';
                            }
                        });
                        $(element).on('apply.daterangepicker',function(ev, picker) {
                            scope.$apply(function(){
                                ngModel.$setViewValue(picker.startDate.format('YYYY-MM-DD') + '/' + picker.endDate.format('YYYY-MM-DD'));
                                scope.datePick.starttime = picker.startDate.format('YYYY-MM-DD');
                                scope.datePick.endtime = picker.endDate.format('YYYY-MM-DD');
                                ngModel.$render();
                            });
                        });
                    });


                });
            }
        }
    });

    app.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function ($stateProvider, $urlRouterProvider,$httpProvider) {
        //console.log($httpProvider);
        //更改请求方式
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        $httpProvider.defaults.transformRequest = [function(data) {
            var param = function(obj) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for (name in obj) {
                    value = obj[name];

                    if (value instanceof Array) {
                        for (i = 0; i < value.length; ++i) {
                            subValue = value[i];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value instanceof Object) {
                        for (subName in value) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    } else if (value !== undefined && value !== null) {
                        query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                    }
                }

                return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
        }];
        //路由
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            //登录
            .state('login', {
                url: '/login',
                views: {
                    '': {
                        templateUrl: 'views/login/login.html',
                        controllerUrl: 'views/login/login',
                        controller: 'loginCrl',
                        dependencies: ['services/checkValue']
                    }
                }
            })
            //注册
            .state('register', {
                url: '/register',
                views: {
                    '': {
                        templateUrl: 'views/register/register.html',
                        controllerUrl: 'views/register/register',
                        controller: 'registerCrl',
                        dependencies: ['services/checkValue']
                    }
                }
            })
            //忘记密码
            .state('forget', {
                url: '/forget',
                views: {
                    '': {
                        templateUrl: 'views/forget/forget.html',
                        controllerUrl: 'views/forget/forget',
                        controller: 'forgetCrl',
                        dependencies: ['services/checkValue']
                    }
                }
            })
            //首页
            .state('main', {
                url: '/main',
                abstract: true,
                views: {
                    '': {
                        templateUrl: 'views/main/main.html',
                        controllerUrl: 'views/main/main',
                        controller: 'mainCrl'
                    },
                    'top@main': {
                        templateUrl: 'views/main/top/top.html',
                        controllerUrl: 'views/main/top/top',
                        controller: 'topCrl',
                        dependencies: ['services/checkValue']
                    },
                    'left@main': {
                        templateUrl: 'views/main/left/left.html',
                        controllerUrl: 'views/main/left/left',
                        controller: 'leftCrl'
                    }
                }
            })
            //基础信息
            .state('main.baseInfo', {
                url: '/baseInfo',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/baseInfo/baseInfo.html',
                        controllerUrl: 'views/main/baseInfo/baseInfo',
                        controller: 'baseInfoCrl',
                        dependencies: ['services/checkValue','services/PageServices']
                    }
                }
            })
            //基础信息--新增
            .state('main.baseInfo.baseInfoNew', {
                url: '/baseInfoNew',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/baseInfo/baseInfoNew/baseInfoNew.html',
                        controllerUrl: 'views/main/baseInfo/baseInfoNew/baseInfoNew',
                        controller: 'baseInfoNewCrl',
                        dependencies: ['services/checkValue']
                    }
                }
            })
            //客户需求
            .state('main.customer', {
                url: '/customer',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/customer/customer.html',
                        controllerUrl: 'views/main/customer/customer',
                        controller: 'customerCrl',
                        dependencies: ['services/PageServices']
		  			}
		  		}
		  	})
		  	//我的客户--服务团队
            .state('main.clients',{
                url:'/clients',
                views:{
                    'main@main':{
                        templateUrl:'views/main/clients/clients.html',
                        controllerUrl:'views/main/clients/clients',
                        controller:'clientsCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //合同条款
            .state('main.clients.clause', {
                url: '/clause',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/clause/clause.html',
                        controllerUrl: 'views/main/clients/clause/clause',
                        controller: 'serviceTeamCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //运营报表-配送报表
            .state('main.clients.reports', {
                url: '/reports',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/reports.html',
                        controllerUrl: 'views/main/clients/reports/reports',
                        controller: 'reportsCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //退货数据明细
            .state('main.clients.reports.reportsDetail', {
                url: '/reportsDetail/:id',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/reportsDetail/reportsDetail.html',
                        controllerUrl: 'views/main/clients/reports/reportsDetail/reportsDetail',
                        controller: 'reportsDetailCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //调拨报表
            .state('main.clients.reports.allot', {
                url: '/allot',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/allot/allot.html',
                        controllerUrl: 'views/main/clients/reports/allot/allot',
                        controller: 'allotCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //调拨报表明细
            .state('main.clients.reports.allot.allotDetail', {
                url: '/allotDetail/:fromplace',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/allot/allotDetail/allotDetail.html',
                        controllerUrl: 'views/main/clients/reports/allot/allotDetail/allotDetail',
                        controller: 'allotDetailCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //退货数据
            .state('main.clients.reports.returnData', {
                url: '/returnData',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/returnData/returnData.html',
                        controllerUrl: 'views/main/clients/reports/returnData/returnData',
                        controller: 'returnDataCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //退货数据明细
            .state('main.clients.reports.returnData.returnDataDetail', {
                url: '/returnDataDetail/:id',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/returnData/returnDataDetail/returnDataDetail.html',
                        controllerUrl: 'views/main/clients/reports/returnData/returnDataDetail/returnDataDetail',
                        controller: 'returnDataDetailCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //时效数据
            .state('main.clients.reports.agingData', {
                url: '/agingData',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/agingData/agingData.html',
                        controllerUrl: 'views/main/clients/reports/agingData/agingData',
                        controller: 'agingDataCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })
            //日出入库报表明细
            .state('main.clients.reports.outPut.outPutDailyCheck', {
                url: '/outPutDailyCheck/:shdate',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/outPut/outPutDailyCheck/outPutDailyCheck.html',
                        controllerUrl: 'views/main/clients/reports/outPut/outPutDailyCheck/outPutDailyCheck',
                        controller: 'outPutDailyCheckCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //月出入库报表明细
            .state('main.clients.reports.outPut.outPutMonthlyCheck', {
                url: '/outPutMonthlyCheck/:m',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/outPut/outPutMonthlyCheck/outPutMonthlyCheck.html',
                        controllerUrl: 'views/main/clients/reports/outPut/outPutMonthlyCheck/outPutMonthlyCheck',
                        controller: 'outPutMonthlyCheckCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //出入库报表
            .state('main.clients.reports.outPut', {
                url: '/outPut',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/outPut/outPut.html',
                        controllerUrl: 'views/main/clients/reports/outPut/outPut',
                        controller: 'outPutCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //盘点差异表
            .state('main.clients.reports.inventory', {
                url: '/inventory',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/inventory/inventory.html',
                        controllerUrl: 'views/main/clients/reports/inventory/inventory',
                        controller: 'inventoryCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //退货数据明细
            .state('main.clients.reports.inventory.inventoryDetail', {
                url: '/inventoryDetail/:id',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/reports/inventory/inventoryDetail/inventoryDetail.html',
                        controllerUrl: 'views/main/clients/reports/inventory/inventoryDetail/inventoryDetail',
                        controller: 'inventoryDetailCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })

            //公函管理
            .state('main.clients.officeManagement', {
                url: '/officeManagement',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/officeManagement/officeManagement.html',
                        controllerUrl: 'views/main/clients/officeManagement/officeManagement',
                        controller: 'officeManagementCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })
            //公函管理--查看邮件
            .state('main.clients.officeManagement.lookEmail', {
                url: '/lookEmail/:id',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/officeManagement/lookEmail/lookEmail.html',
                        controllerUrl: 'views/main/clients/officeManagement/lookEmail/lookEmail',
                        controller: 'lookEmailCrl'
                    }
                }
            })
            //差错管理
            .state('main.clients.errorManagement', {
                url: '/errorManagement',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/errorManagement/errorManagement.html',
                        controllerUrl: 'views/main/clients/errorManagement/errorManagement',
                        controller: 'errorManagementCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })

            //投诉管理
            .state('main.clients.complaintRecord', {
                url: '/complaintRecord',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/complaintRecord/complaintRecord.html',
                        controllerUrl: 'views/main/clients/complaintRecord/complaintRecord',
                        controller: 'complaintRecordCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })

            //理赔管理
            .state('main.clients.claimManagement', {
                url: '/claimManagement',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/claimManagement/claimManagement.html',
                        controllerUrl: 'views/main/clients/claimManagement/claimManagement',
                        controller: 'claimManagementCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })

            //账户中心
            .state('main.accountCenter', {
                url: '/accountCenter',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/accountCenter/accountCenter.html',
                        controllerUrl: 'views/main/accountCenter/accountCenter',
                        controller: 'accountCenterCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })

            //账户中心明细
            .state('main.accountCenter.accountCenterCheck', {
                url: '/accountCenterCheck/:types',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/accountCenter/accountCenterCheck/accountCenterCheck.html',
                        controllerUrl: 'views/main/accountCenter/accountCenterCheck/accountCenterCheck',
                        controller: 'accountCenterCheckCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })

            //仓到店条款
            .state('main.clause', {
                url: '/clause',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clause/clause.html',
                        controllerUrl: 'views/main/clause/clause',
                        controller: 'clausCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })

            //SOP条款
            .state('main.sopClause', {
                url: '/sopClause',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/sopClause/sopClause.html',
                        controllerUrl: 'views/main/sopClause/sopClause',
                        controller: 'sopClauseCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })

            //通报栏
            .state('main.navBar', {
                url: '/navBar',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/navBar/navBar.html',
                        controllerUrl: 'views/main/navBar/navBar',
                        controller: 'navBarCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })

            //星级管理--星级评定标准
            .state('main.starManage', {
                url: '/starManage',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/starManage/starAssertNormal.html',
                        controllerUrl: 'views/main/starManage/starAssertNormal',
                        controller: 'starAssertNormalCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })

            //我的星级
            .state('main.starManage.myStar', {
                url: '/myStar',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/starManage/myStar/myStar.html',
                        controllerUrl: 'views/main/starManage/myStar/myStar',
                        controller: 'myStarCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })

            //问题反馈
            .state('main.problemAnswer', {
                url: '/problemAnswer',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/problemAnswer/problemAnswer.html',
                        controllerUrl: 'views/main/problemAnswer/problemAnswer',
                        controller: 'problemAnswerCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })

            //问题反馈--问题填写
            .state('main.problemAnswer.problemWrite', {
                url: '/problemWrite',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/problemAnswer/problemWrite/problemWrite.html',
                        controllerUrl: 'views/main/problemAnswer/problemWrite/problemWrite',
                        controller: 'problemWriteCrl',
                        dependencies: ['services/checkValue']
                    }
                }
            })

            //早安1919(物流)
            .state('main.goodMorning', {
                url: '/goodMorning',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/goodMorning/goodMorning.html',
                        controllerUrl: 'views/main/goodMorning/goodMorning',
                        controller: 'goodMorningCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
/******************************以上是物流管理*****************************/
            //基础信息--仓配需求
            .state('main.baseInfo.demand', {
                url: '/demand',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/baseInfo/demand/demand.html',
                        controllerUrl: 'views/main/baseInfo/demand/demand',
                        controller: 'demandCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //询价平台
            .state('main.inquiryPlatform', {
                url: '/inquiryPlatform',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/inquiryPlatform/inquiryPlatform.html',
                        controllerUrl: 'views/main/inquiryPlatform/inquiryPlatform',
                        controller: 'inquiryPlatformCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //企业资质
            .state('main.clients.enterprise', {
                url: '/enterprise',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/enterprise/enterprise.html',
                        controllerUrl: 'views/main/clients/enterprise/enterprise',
                        controller: 'enterpriseCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //差错管理--上报差错
            .state('main.clients.errorManagement.reportErrors', {
                url: '/reportErrors',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/errorManagement/reportErrors/reportErrors.html',
                        controllerUrl: 'views/main/clients/errorManagement/reportErrors/reportErrors',
                        controller: 'reportErrorsCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })
/******************************以上是品牌管理*****************************/
            //会员管理
            .state('main.vipManagement', {
                url: '/vipManagement',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/vipManagement/vipManagement.html',
                        controllerUrl: 'views/main/vipManagement/vipManagement',
                        controller: 'vipManagementCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })

            //会员管理 -- 认证审核
            .state('main.vipManagement.audit', {
                url: '/audit',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/vipManagement/audit/audit.html',
                        controllerUrl: 'views/main/vipManagement/audit/audit',
                        controller: 'auditCrl',
                        dependencies: ['services/checkValue']
                    }
                }
            })
            //合同管理
            .state('main.clauseManagement', {
                url: '/clauseManagement',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clauseManagement/clauseManagement.html',
                        controllerUrl: 'views/main/clauseManagement/clauseManagement',
                        controller: 'clauseManagementCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //合同管理--新增合同
            .state('main.clauseManagement.addClause', {
                url: '/addClause',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clauseManagement/addClause/addClause.html',
                        controllerUrl: 'views/main/clauseManagement/addClause/addClause',
                        controller: 'addClauseCrl',
                        dependencies: ['services/checkValue']
                    }
                }
            })
            //客户账户查询
            .state('main.accountQuery', {
                url: '/accountQuery',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/accountQuery/accountQuery.html',
                        controllerUrl: 'views/main/accountQuery/accountQuery',
                        controller: 'accountQueryCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //平台收入账单
            .state('main.accountQuery.revenueBills', {
                url: '/revenueBills',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/accountQuery/revenueBills/revenueBills.html',
                        controllerUrl: 'views/main/accountQuery/revenueBills/revenueBills',
                        controller: 'revenueBillsCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //品质中心
            .state('main.qualityCenter', {
                url: '/qualityCenter',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/qualityCenter/qualityCenter.html',
                        controllerUrl: 'views/main/qualityCenter/qualityCenter',
                        controller: 'qualityCenterCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //差错管理--差错数据分析
            .state('main.clients.errorManagement.errorAnalyze', {
                url: '/errorAnalyze',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clients/errorManagement/errorAnalyze/errorAnalyze.html',
                        controllerUrl: 'views/main/clients/errorManagement/errorAnalyze/errorAnalyze',
                        controller: 'errorAnalyzeCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //投诉管理
            .state('main.qualityCenter.complaintManagement', {
                url: '/complaintManagement',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/qualityCenter/complaintManagement/complaintManagement.html',
                        controllerUrl: 'views/main/qualityCenter/complaintManagement/complaintManagement',
                        controller: 'complaintManagementCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //投诉管理--投诉明细
            .state('main.qualityCenter.complaintManagement.complaintDetail', {
                url: '/complaintDetail',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/qualityCenter/complaintManagement/complaintDetail/complaintDetail.html',
                        controllerUrl: 'views/main/qualityCenter/complaintManagement/complaintDetail/complaintDetail',
                        controller: 'complaintDetailCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //投诉管理--投诉数据分析
            .state('main.qualityCenter.complaintManagement.complaintAnalyze', {
                url: '/complaintAnalyze',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/qualityCenter/complaintManagement/complaintAnalyze/complaintAnalyze.html',
                        controllerUrl: 'views/main/qualityCenter/complaintManagement/complaintAnalyze/complaintAnalyze',
                        controller: 'complaintAnalyzeCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //通报发布
            .state('main.qualityCenter.reportReleased', {
                url: '/reportReleased',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/qualityCenter/reportReleased/reportReleased.html',
                        controllerUrl: 'views/main/qualityCenter/reportReleased/reportReleased',
                        controller: 'reportReleasedCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //仓到店条款--新增SOP条款
            .state('main.clause.newClause', {
                url: '/newClause',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/clause/newClause/newClause.html',
                        controllerUrl: 'views/main/clause/newClause/newClause',
                        controller: 'newClauseCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //SOP条款--新增SOP条款
            .state('main.sopClause.newSopClause', {
                url: '/newSopClause',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/sopClause/newSopClause/newSopClause.html',
                        controllerUrl: 'views/main/sopClause/newSopClause/newSopClause',
                        controller: 'newSopClauseCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //早安1919
            .state('main.qualityCenter.claimManagementQualityCentral', {
                url: '/claimManagementQualityCentral',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/qualityCenter/claimManagementQualityCentral/claimManagementQualityCentral.html',
                        controllerUrl: 'views/main/qualityCenter/claimManagementQualityCentral/claimManagementQualityCentral',
                        controller: 'claimManagementQualityCentralCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            })
            //意见反馈
            .state('main.viewAnswer', {
                url: '/viewAnswer',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/viewAnswer/viewAnswer.html',
                        controllerUrl: 'views/main/viewAnswer/viewAnswer',
                        controller: 'viewAnswerCrl',
                        dependencies: ['services/PageServices','services/checkValue']
                    }
                }
            })
            //意见填写
            .state('main.viewAnswer.viewWrite', {
                url: '/viewWrite',
                views: {
                    'main@main': {
                        templateUrl: 'views/main/viewAnswer/viewWrite/viewWrite.html',
                        controllerUrl: 'views/main/viewAnswer/viewWrite/viewWrite',
                        controller: 'viewWriteCrl',
                        dependencies: ['services/PageServices']
                    }
                }
            });
/******************************以上是后台管理*****************************/



    }]);
});