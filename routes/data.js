/**
 * @author [yeshengqiang]
 * @description ['字典数据']
 * @time 2016/11/03
 */
define(function(require, exports, module) {
    var data = {};
    //一级分类
    data.firstData = [{
        name: '仓储',
        value: '1'
    }, {
        name: '物流',
        value: '2'
    }, {
        name: '省公司',
        value: '3'
    }, {
        name: '品牌公司',
        value: '4'
    }, {
        name: '其他',
        value: '5'
    }];
    //二级分类
    data.secoundData = [{
        id: '1',
        name: '入库',
        value: '1'
    }, {
        id: '2',
        name: '库内',
        value: '2'
    }, {
        id: '3',
        name: '盘点',
        value: '3'
    }, {
        id: '4',
        name: '出库',
        value: '4'
    }, {
        id: '5',
        name: '退货',
        value: '5'
    }, {
        id: '6',
        name: '运输',
        value: '6'
    }];
    //三级分类
    data.threeData = [{
        pId: '1',
        name: '到货计划未做',
        value: '1'
    }, {
        pId: '1',
        name: '异常未反馈',
        value: '2'
    }, {
        pId: '1',
        name: '卸货不及时',
        value: '3'
    }, {
        pId: '1',
        name: '异常未反馈',
        value: '4'
    }, {
        pId: '1',
        name: '违规装卸',
        value: '5'
    }, {
        pId: '1',
        name: '少货错货',
        value: '6'
    }, {
        pId: '1',
        name: '货损、污染',
        value: '7'
    }, {
        pId: '1',
        name: '未按标准收货',
        value: '8'
    }, {
        pId: '1',
        name: '保质期不符',
        value: '9'
    }, {
        pId: '1',
        name: '未抽检',
        value: '10'
    }, {
        pId: '1',
        name: '异常未反馈',
        value: '11'
    }, {
        pId: '1',
        name: 'PDA未操作',
        value: '12'
    }, {
        pId: '1',
        name: '单据未签字',
        value: '13'
    }, {
        pId: '1',
        name: '未使用到货签收确认单',
        value: '14'
    }, {
        pId: '1',
        name: '收货当日未扫码入库',
        value: '15'
    }, {
        pId: '1',
        name: '赋码错误',
        value: '16'
    }, {
        pId: '1',
        name: '码货未按标准',
        value: '17'
    }, {
        pId: '1',
        name: '无库位信息',
        value: '18'
    }, {
        pId: '1',
        name: '库位不准确',
        value: '19'
    }, {
        pId: '1',
        name: '当日扫码未上架',
        value: '20'
    }, {
        pId: '1',
        name: '丢单',
        value: '21'
    }, {
        pId: '1',
        name: '延迟邮寄单据',
        value: '22'
    }, { //库内
        pId: '2',
        name: '残次品未处理',
        value: '23'
    }, { //库内
        pId: '2',
        name: '属性鉴别错误',
        value: '24'
    }, { //库内
        pId: '2',
        name: '库位错误',
        value: '25'
    }, { //库内
        pId: '2',
        name: '残次未上报',
        value: '26'
    }, { //库内
        pId: '2',
        name: '保质期不符',
        value: '27'
    }, { //库内
        pId: '2',
        name: '无库位管理',
        value: '28'
    }, { //库内
        pId: '2',
        name: '账实不符',
        value: '29'
    }, { //库内
        pId: '2',
        name: '文件学习不合格',
        value: '30'
    }, { //盘点
        pId: '3',
        name: '盘点未执行',
        value: '31'
    }, { //盘点
        pId: '3',
        name: '整理未完成',
        value: '32'
    }, { //盘点
        pId: '3',
        name: '盘点不合规',
        value: '33'
    }, { //盘点
        pId: '3',
        name: '未按时发盘点差异公函',
        value: '34'
    }, { //库内
        pId: '3',
        name: '未确认盘点差异',
        value: '35'
    }, { //库内
        pId: '3',
        name: '未按时提交盘点差异',
        value: '36'
    }, { //库内
        pId: '3',
        name: '盘点未关闭',
        value: '37'
    }, { //出库
        pId: '4',
        name: '任务创建不及时',
        value: '38'
    }, { //出库
        pId: '4',
        name: '货损',
        value: '39'
    }, { //出库
        pId: '4',
        name: 'PDA未操作',
        value: '40'
    }, { //出库
        pId: '4',
        name: '退拣当日未完成',
        value: '41'
    }, { //出库
        pId: '4',
        name: '无标签',
        value: '42'
    }, { //出库
        pId: '4',
        name: '配载错误',
        value: '43'
    }, { //出库
        pId: '4',
        name: '当日未发运',
        value: '44'
    }, { //出库
        pId: '4',
        name: '单据未签字',
        value: '45'
    }, { //出库
        pId: '4',
        name: '装错货',
        value: '46'
    }, { //出库
        pId: '4',
        name: '保质期不符',
        value: '47'
    }, { //出库
        pId: '4',
        name: '违规装卸',
        value: '48'
    }, { //出库
        pId: '4',
        name: '配送超时',
        value: '49'
    }, { //出库
        pId: '4',
        name: '错发货',
        value: '50'
    }, { //出库
        pId: '4',
        name: '单据未签字',
        value: '51'
    }, { //出库
        pId: '4',
        name: '丢单',
        value: '52'
    }, { //出库
        pId: '4',
        name: '延迟邮寄单据',
        value: '53'
    }, { //退货
        pId: '5',
        name: '退货不及时',
        value: '54'
    }, { //出库
        pId: '5',
        name: '少货错货',
        value: '55'
    }, { //出库
        pId: '5',
        name: '单据未签字',
        value: '56'
    }, { //出库
        pId: '5',
        name: '单据不齐',
        value: '57'
    }, { //出库
        pId: '5',
        name: 'PDA未操作',
        value: '58'
    }, { //出库
        pId: '5',
        name: '违规装卸',
        value: '59'
    }, { //出库
        pId: '5',
        name: '少货错货',
        value: '60'
    }, { //出库
        pId: '5',
        name: '系统未操作/PDA未操作',
        value: '61'
    }, { //出库
        pId: '5',
        name: '退货入库当日系统数据未上架',
        value: '62'
    }, { //出库
        pId: '5',
        name: '丢单',
        value: '63'
    }, { //运输
        pId: '6',
        name: '提货不及时',
        value: '64'
    }, { //运输
        pId: '6',
        name: '运输超时未达',
        value: '65'
    }, { //运输
        pId: '6',
        name: '交通事故4小时未反馈',
        value: '66'
    }, { //运输
        pId: '6',
        name: '污染',
        value: '67'
    }];
    //抛出数据
    module.exports = data;
});