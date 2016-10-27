/**
 *  作者：cl
 *	时间：2016-08-10
 *	描述：投诉管理
 */
define(function(require){
    var app = require('../../../../app');

    app.controller('complaintManagementCrl',['$scope',function($scope){

        var bgWhite = $('.bgWhite');
        bgWhite.css('height',$(document).height()-bgWhite.offset().top-20)
    }]);
});