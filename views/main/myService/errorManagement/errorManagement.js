/**
 *  作者：cl
 *	时间：2016-08-10
 *	描述：差错管理
 */
define(function(require){
    var app = require('../../../../app');

    app.controller('myServiceErrorManagementCrl',['$scope',function($scope){
        $scope.title='上报差错';

        var bgWhite = $('.bgWhite');
        bgWhite.css('height',$(document).height()-bgWhite.offset().top-20)
    }]);
});