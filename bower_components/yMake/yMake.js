/**
 * create by yeshengqiang
 */

var yMake = (function($$){
	var $$ = $$ || {};
	//定义函数库
	$$.fn = {};
	//继承
	$$.extend = {};
	//验证
	$$.checkValue = {};
	//动画库
	$$.an = {};
	//弹出层
	$$.layer = {};
/******************************************************原型方法开始************************************************************************/
	/**
	 * 去除两边空格
	 */	
	String.prototype.trim = String.prototype.trim || function(){
		return this.replace(/^\s+|\s+$/g, '');
	}

	/**
	 * 去除两边空格
	 */
	Array.prototype.toHeavy = Array.prototype.toHeavy || function(){

		var res = [],tempObj = {},i = 0,ii;
		for(ii = this.length; i < ii; i++){
			if(!tempObj[this[i]]){
				res.push(this[i]);
				tempObj[this[i]] = 1;
			}
		}

		return res;
	}

	/**
	 * 全局替换
	 */
	String.prototype.replaceAll = String.prototype.replaceAll || function(arg1,arg2){
		return this.replace(new RegExp(arg1,"gm"),arg2);
	};

	//查找
	Array.prototype.indexOf = Array.prototype.indexOf || function (w)
	{
		for(var i=0;i<this.length;i++)if(this[i]==w)return i;
		return -1;
	};

    //数组remove方法
	Array.prototype.remove = Array.prototype.remove || function (w)
	{
		var n=this.indexOf(w);
		if(n!=-1)this.splice(n,1);
	};

	/**
     * concat 方法
	 */
	Array.prototype.append = Array.prototype.append || function (aAny)
	{
		for(var i=0,len=aAny.length;i<len;i++){
			this.push(aAny[i]);
		}		
		return this;
	};

    /*//创建元素(前面添加)
    Object.prototype.before = Object.prototype.before ||
    function(obj){
        var createNew = document.createElement(obj);
        this.parentNode.insertBefore(createNew,this);
    };

    //创建元素(后面添加)
    Object.prototype.after = Object.prototype.after ||
    function(obj){
        var createNew = document.createElement(obj);
        console.log(this.parentNode.lastChild==this);
        if(this.parentNode.lastChild==this){
            this.parentNode.appendChild(createNew,this);
        }else{
            this.parentNode.insertBefore(createNew,this.nextElementSibling || this.nextSibling);
        }
    };

    //创建元素(里面添加)
    Object.prototype.append = Object.prototype.append ||
    function(obj){
        var createNew = document.createElement(obj);
        this.appendChild(createNew);
    };

    //获取非行间样式
    function getStyle(obj,attr){
        if(obj.currentStyle){         //Ie
            return obj.currentStyle[attr];
        }else{
            return window.defaultView&&window.defaultView.getComputedStyle(obj,null)[attr];
        }
    };*/
	//兼容chrome的打印
	window.console = window.console || {};
	console.log = console.log || function (){};

/******************************************************原型方法结束************************************************************************/
	//绑定事件
	$$.fn.bindEvent = function (obj, ev, fn)
	{
		obj.addEventListener?obj.addEventListener(ev, fn, false):obj.attachEvent('on'+ev, fn);
	}
	//结束绑定
	$$.fn.unbindEvent = function (obj, ev, fn)
	{
		obj.removeEventListener?obj.removeEventListener(ev, fn, false):obj.detachEvent('on'+ev, fn);
	}
	//获取元素
	$$.fn.getEle = function(sExp, oParent)
	{
		var aResult=[];
		var i=0;
		
		oParent || (oParent=document);
		
		if(oParent instanceof Array)
		{
			for(i=0;i<oParent.length;i++)aResult=aResult.concat(getEle(sExp, oParent[i]));
		}
		else if(typeof sExp=='object')
		{
			if(sExp instanceof Array)
			{
				return sExp;
			}
			else
			{
				return [sExp];
			}
		}
		else
		{
			//xxx, xxx, xxx
			if(/,/.test(sExp))
			{
				var arr=sExp.split(/,+/);
				for(i=0;i<arr.length;i++)aResult=aResult.concat(getEle(arr[i], oParent));
			}
			//xxx xxx xxx 或者 xxx>xxx>xxx
			else if(/[ >]/.test(sExp))
			{
				var aParent=[];
				var aChild=[];
				
				var arr=sExp.split(/[ >]+/);
				
				aChild=[oParent];
				
				for(i=0;i<arr.length;i++)
				{
					aParent=aChild;
					aChild=[];
					for(j=0;j<aParent.length;j++)
					{
						aChild=aChild.concat(getEle(arr[i], aParent[j]));
					}
				}
				
				aResult=aChild;
			}
			//#xxx .xxx xxx
			else
			{
				switch(sExp.charAt(0))
				{
					case '#':
						return [document.getElementById(sExp.substring(1))];
					case '.':
						return getByClass(oParent, sExp.substring(1));
					default:
						return [].append(oParent.getElementsByTagName(sExp));
				}
			}
		}

		return aResult;
	}
	//设置样式
	$$.fn.setStyle = function(obj, json){
		if(obj.length)
			for(var i=0;i<obj.length;i++) this.setStyle(obj[i], json);
		else
		{
			if(arguments.length==2)	//json
				for(var i in json) this.setStyle(obj, i, json[i]);
			else	//name, value
			{
				switch(arguments[1].toLowerCase())
				{
					case 'opacity':
						obj.style.filter='alpha(opacity:'+arguments[2]+')';
						obj.style.opacity=arguments[2]/100;
						break;
                    case 'zIndex':
                        obj.style.arguments[1] = arguments[2];
                        break;
					default:
						if(typeof arguments[2]=='number')
						{
							obj.style[arguments[1]]=arguments[2]+'px';
						}
						else
						{
							obj.style[arguments[1]]=arguments[2];
						}
						break;
				}
			}
		}
	};
	//获取非行间样式
	$$.fn.getStyle = function (obj,attr){    //获取非行间样式，obj是对象，attr是值
        if(obj.currentStyle){         //Ie
            return obj.currentStyle[attr];
        }else{
            return window.defaultView&&window.defaultView.getComputedStyle(obj,null)[attr];
        }
	};
	// 通过className获取元素
	$$.fn.getByClass = function(oParent,iClass){
		var oParent = oParent || document;
        //console.log(oParent);
		var re=new RegExp('\\b'+iClass+'\\b', 'i');
		var iEle = oParent.getElementsByTagName('*');
        //console.log(iEle);
		var temp = [];
		for(var i = 0;i<iEle.length;i++){
			if(re.test(iEle[i].className)){
				temp.push(iEle[i]);
			}
		}
		return temp;
	};

	// 添加class
	$$.addClass = function(obj,iClass){
		var re=new RegExp('\\b'+iClass+'\\b', 'i');

		if(re.test(obj.className))return;
		obj.className = (obj.className+' '+iClass).match(/\S+/g).join(' ');
	};

	// 添加class
	$$.removeClass = function(obj,iClass){
		var re=new RegExp('\\b'+iClass+'\\b', 'g');
	    if(obj){
            obj.className = obj.className.replace(re, '').replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
        }
	};


	//随机函数
	$$.rnd = function(n,m){
		return Math.random()*(m-n)+n;
	};
	/**
	 * description: 判断是否为一个空对象
	 * @param  {object}  obj [注入一个对象]
	 * @return {Boolean}     [true：为空,false: 不为空]
	 */
	$$.isNullObject = function(obj){
		for(var i=0 in obj){
			if(obj.hasOwnProperty(i)){
				return false;
			}
		}
		return true;
	};

	//获取距离屏幕边界定位
	$$.fn.getScreenPos = function(obj){
		//var obj = this.getByClass(obj);
		//console.log(obj);
		var res = {l:0,t:0};
		while(obj){
			res.l += obj.offsetLeft || 0;
			res.t += obj.offsetTop || 0;

			//得到当前定位的父级
			obj=obj.offsetParent;
			//console.log(obj);
		}
		return res;
	};

	//获取距离父级定位
	$$.fn.getPos = function(obj){
		var res = {l:0,t:0};
		res.l = obj.offsetLeft || 0;
		res.t = obj.offsetTop || 0;
		return res;
	};
	/**
	 * [isTypeOf 检测类型]
	 * @param  {[object]}  obj
	 * @param  {[type]}  type [注入一个类型]
	 * @return {Boolean}      [true:为真]
	 */
	$$.fn.isTypeOf = function(obj,type){
		return (typeof obj === type)?true:false;
	};

	/**
	 * [startMove 动画]
	 * @param  {[type]} obj        [ilem]
	 * @param  {[type]} oTarget    [json对象]
	 * @param  {[type]} iType      [ iType:1为普通运动，iType:2为弹性运动 number类型]
	 * @param  {[type]} fnCallBack [回调]
	 * @param  {[type]} fnDuring   [description]
	 * @return {[type]}            [description]
	 */
	$$.an.startMove = function(obj, oTarget, iType, fnCallBack, fnDuring){
		var fnMove=null;
		var _this = this;
		if(obj.timer)
		{
			clearInterval(obj.timer);
		}

		switch(iType)
		{
			case 1:
				fnMove=this.moveBuffer;
				break;
			case 2:
				fnMove=this.moveFlex;
				break;
		}

		obj.timer=setInterval(function (){
			fnMove.call(_this, obj, oTarget, fnCallBack, fnDuring);
		}, 15);
	};
/****************************************************动画库开始**********************************************************/
	/**
	 * 减速运动
	 */
	 $$.an.moveBuffer = function(obj, oTarget, fnCallBack, fnDuring)
		{
			var bStop=true;
			var attr='';
			var speed=0;
			var cur=0;
			
			for(attr in oTarget)
			{
				//通过这个元素获取当前的元素
				if(attr=='opacity'){
					cur=Math.round(parseFloat(this.css(obj,attr))*100);   //round主要是去除浮点数 比如7.00000001
				}
				else{
					cur=parseInt(this.css(obj,attr));
				}
				if(oTarget[attr]!=cur)
				{
					bStop=false;
					
					speed=(oTarget[attr]-cur)/10;

					speed=speed>0?Math.ceil(speed):Math.floor(speed);
					
					this.css(obj, attr, cur+speed);
				}
			}
			
			if(fnDuring)fnDuring.call(obj);
			
			if(bStop)
			{
				clearInterval(obj.timer);
				obj.timer=null;
				if(fnCallBack)fnCallBack.call(obj);
			}
		}
		/**
		 * 弹性运动
		 */
		$$.an.moveFlex = function(obj, oTarget, fnCallBack, fnDuring)
		{
			var bStop=true;
			var attr='';
			var speed=0;
			var cur=0;
			for(attr in oTarget)
			{
				if(!obj.oSpeed)obj.oSpeed={};
				if(!obj.oSpeed[attr])obj.oSpeed[attr]=0;
				//通过这个元素获取当前的元素
				if(attr=='opacity'){
					cur=Math.round(parseFloat(this.css(obj,attr))*100);   //round主要是去除浮点数 比如7.00000001
				}
				else{
					cur=parseInt(this.css(obj,attr));
				}	
				if(Math.abs(oTarget[attr]-cur)>1 || Math.abs(obj.oSpeed[attr])>1)
				{
					bStop=false;
					
					obj.oSpeed[attr]+=(oTarget[attr]-cur)/5;
					obj.oSpeed[attr]*=0.7;
					var maxSpeed=65;
					if(Math.abs(obj.oSpeed[attr])>maxSpeed)
					{
						obj.oSpeed[attr]=obj.oSpeed[attr]>0?maxSpeed:-maxSpeed;
					}
	
					this.css(obj, attr, cur+obj.oSpeed[attr]);
				}else{
					//最后一步没有走完手动赋值
					this.css(obj, attr, oTarget[attr]);
				}
			}
			
			if(fnDuring)fnDuring.call(obj);
			
			if(bStop)
			{
				clearInterval(obj.timer);
				obj.timer=null;
				if(fnCallBack)fnCallBack.call(obj);
			}
		}
		/**
		 * 弹性运动调用的css
		 */
		$$.an.css = function(obj, attr, value)
		{
			if(arguments.length==2)
				return parseFloat(obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr]);
			else if(arguments.length==3)
				switch(attr)
				{
					case 'width':
					case 'height':
					case 'paddingLeft':
					case 'paddingTop':
					case 'paddingRight':
					case 'paddingBottom':
						value=Math.max(value,0);
					case 'left':
					case 'top':
					case 'right':
					case 'bottom':
					case 'marginLeft':
					case 'marginTop':
					case 'marginRight':
					case 'marginBottom':
						obj.style[attr]=value+'px';
						break;
					case 'opacity':
						obj.style.filter="alpha(opacity:"+value+")";
						obj.style.opacity=value/100;
						break;
					default:
						//如background
						obj.style[attr]=value;
				}
			
			return function (attr_in, value_in){css(obj, attr_in, value_in)};
		}
/****************************************************动画库结束**********************************************************/
/****************************************************弹出层开始**********************************************************/
	//配置文件
	$$.layer.options = {
		width:"300px",
		height:"80px",
		color:"#FFF",
		backgroundColor:"blue",
		position: "fixed",
		zIndex:"9999",
		right:"-250px",
		top:"20px",
		padding:"10px"
	};
    $$.layer.state = false;//控制弹出
	//创建layer弹出
	$$.layer.create = function(str,icon){
        //0,提示 1,正确 2,错误
        var options = [
            {src:'glyphicon-bell',bgColor:'#286091'},
            {src:'glyphicon-bell',bgColor:'#286091'},
            {src:'glyphicon-bell',bgColor:'#c56a68'},
        ];
        switch (icon.toString()){
            case '0':
                this.options.backgroundColor = options[icon].bgColor;
                break;
            case '1':
                this.options.backgroundColor = options[icon].bgColor;
                break;
            case '2':
                this.options.backgroundColor = options[icon].bgColor;
                break;
        }
		var html = document.createElement('div');
        html.setAttribute('id','layer_msg');
        html.setAttribute('class','animated');
		var img = document.createElement('span');
		img.setAttribute('alt','提示');
		img.setAttribute('class','tipImage glyphicon'+' '+options[icon].src);
		var span1 = document.createElement('span');
		span1.setAttribute('class','tipTitle');
		var text1 = document.createTextNode('提示信息');
		span1.appendChild(text1);
		var span2 = document.createElement('span');
		span2.setAttribute('class','tipMsg');
		span2.innerHTML = str;
		html.appendChild(img);
		html.appendChild(span1);
		html.appendChild(span2);
		$$.fn.setStyle(html,this.options);
		document.body.appendChild(html);
		return html;
	};
	$$.layer.msg = function(str){
        var timr;
        if(this.state){
            $$.addClass(document.getElementById('layer_msg'),'swing');
            setTimeout(function(){
                $$.removeClass(document.getElementById('layer_msg'),'swing');
            },500);
            return;
        }
        var _self = this;
        var icon;//0,提示 1,正确 2,错误
        if(arguments.length==2){
            for(var i in arguments[1]){
                if(arguments[1].hasOwnProperty(i)){
                    switch(i.toLowerCase()){
                        case 'icon':
                            icon = arguments[1][i];
                            break;
                        case 'time':
                            timr = arguments[1][i];
                            break;
                        default:
                            break;
                    }
                }
            }
        }
		var layer = this.create(str,icon);
		$$.an.startMove(layer,{right:0,opacity:100},2,function(){
            _self.state = true; //判断是否已经弹出
            var widths =  parseInt(_self.options.width);
			setTimeout(function(){
                $$.an.startMove(layer,{right:30},1,function(){
                    $$.an.startMove(layer,{right:-widths,opacity:0},1,function(){
                        document.body.removeChild(layer);
                        _self.state = false; //判断是否已经弹出
                    });
                });
			},timr||3000);
		});
	};
/****************************************************弹出层结束**********************************************************/
/****************************************************轮播开始**********************************************************/
    //遮罩
	$$.an.mark = function(attr){
		//var temp = attr && attr instanceof Array && attr.length && ;
		var temp = [
			{src:'imgs/1.jpg',title:''}
		],url=arguments[1]||'http://121.43.101.74:8080/warehouse/';
		if(typeof attr[0]==='string'){
			for(var i = 0;i<attr.length;i++){
				temp[i] = {src:attr[i],title:''}
			}
		}else if(typeof attr[0]==='object'){
			for(var i = 0;i<attr.length;i++){
				temp[i] = {src:attr[i].src,title:attr[i].title}
			}
		}

		var mark = document.createElement('div'),
			fragment = document.createDocumentFragment(),
			oDiv = document.createElement('div'),
			oPrev = document.createElement('div'),             //上一步
			oNext = document.createElement('div'),             //下一步
			oText = document.createElement('div'),             //文字说明
			oLength = document.createElement('div'),             //第几张图
			oBigUl = document.createElement('ul'),                //轮播父窗口  big_pic
			oSmalldiv = document.createElement('div'),         //small_pic
			oSmallUl = document.createElement('ul'),           //small_pic
			oMarkLeft = document.createElement('a'),
			oMarkRight = document.createElement('a'),
			textBg = document.createElement('div'),           //small_pic
			span = document.createElement('span'),           //close
			nowZIndex= 2,                                      //当前层
			now=0;                                             //当前对象
		span.className = 'glyphicon glyphicon-remove-sign';
		//添加样式
		$$.addClass(mark,'znsMark');
		$$.addClass(oDiv,'znsPlay');
		$$.addClass(oBigUl,'big_pic');
		$$.addClass(oSmalldiv,'small_pic');
		$$.addClass(oPrev,'prev');
		//$$.addClass(oPrev,'glyphicon glyphicon-menu-left');
		$$.addClass(oNext,'next');
		//$$.addClass(oNext,'glyphicon glyphicon-menu-right');
		$$.addClass(oText,'text');
		$$.addClass(oLength,'length');
		$$.addClass(oMarkLeft,'mark_left');
		$$.addClass(oMarkRight,'mark_right');
		$$.addClass(textBg,'bg');
		$$.addClass(span,'close');
		oLength.innerHTML = 1+'/'+temp.length;
		oText.innerHTML = temp[0].title||'';
		//组装大图
		for(var i = 0,ii=temp.length;i<ii;i++){
			var oLi = document.createElement('li');                //li
			if(i==0){
				$$.fn.setStyle(oLi,{zIndex:1});
			}
			var oImg = document.createElement('img');                //img
			oImg.setAttribute('src',url+temp[i].src);
			oImg.setAttribute('alt',temp[i].title||'');
			oImg.setAttribute('width','100%');
			oImg.setAttribute('height','100%');
			oLi.appendChild(oImg);
			fragment.appendChild(oLi);
		}
		oBigUl.appendChild(oPrev);
		oBigUl.appendChild(oNext);
		oBigUl.appendChild(oMarkLeft);
		oBigUl.appendChild(oMarkRight);
		textBg.appendChild(oText);
		textBg.appendChild(oLength);
		oBigUl.appendChild(textBg);

		oBigUl.appendChild(fragment);                        //插入大图
		//组装小图
		for(var i = 0,ii=temp.length;i<ii;i++){
			var oLi = document.createElement('li');                //li
			if(i==0){
				$$.fn.setStyle(oLi,{opacity:100});
			}
			var oImg = document.createElement('img');                //img
			oImg.setAttribute('src',url+temp[i].src);

			oLi.appendChild(oImg);
			fragment.appendChild(oLi);
		}
        oSmallUl.appendChild(fragment);                      //插入小图

        oSmalldiv.appendChild(oSmallUl);
        oDiv.appendChild(oBigUl);
        oDiv.appendChild(span);
        oDiv.appendChild(oSmalldiv);
        mark.appendChild(oDiv);
        //展示
        document.body.appendChild(mark);

        //动画开始
        var aSmallLi= oSmallUl.getElementsByTagName('li');
        var aBigLi= oBigUl.getElementsByTagName('li');
        oSmallUl.style.width = aSmallLi.length*(aSmallLi[0].offsetWidth+10)+'px';
        //左右按钮
        oPrev.onmouseover=oMarkLeft.onmouseover=function ()
        {
            $$.an.startMove(oPrev, {opacity:100},1);
        };
        oPrev.onmouseout=oMarkLeft.onmouseout=function ()
        {
            $$.an.startMove(oPrev, {opacity:0},1);
        };
        oNext.onmouseover=oMarkRight.onmouseover=function ()
        {
            $$.an.startMove(oNext, {opacity:100},1);
        };
        oNext.onmouseout=oMarkRight.onmouseout=function ()
        {
            $$.an.startMove(oNext, {opacity:0},1);
        };
        //大图切换
        for(var i=0;i<aSmallLi.length;i++)
        {
            aSmallLi[i].index=i;
            aSmallLi[i].onclick=function ()
            {
                if(this.index==now)return;

                now=this.index;

                tab();
            };

            aSmallLi[i].onmouseover=function ()
            {
                $$.an.startMove(this, {opacity:100},1);
            };
            aSmallLi[i].onmouseout=function ()
            {
                if(this.index!=now)
                {
                    $$.an.startMove(this, {opacity:60},1);
                }
            };
        }

        //公共方法
        function tab()
        {
            aBigLi[now].style.zIndex=nowZIndex++;
            $$.an.startMove(textBg, {bottom:-textBg.offsetHeight,opacity:0},1);
            for(var i=0;i<aSmallLi.length;i++)
            {
                $$.an.startMove(aSmallLi[i], {opacity:60},1);
            }
            oLength.innerHTML = now+1+'/'+temp.length;
            oText.innerHTML = aBigLi[now].getElementsByTagName('img')[0].getAttribute('alt');
            $$.an.startMove(aSmallLi[now], {opacity:100},1);

            aBigLi[now].style.height=0;
            $$.an.startMove(aBigLi[now], {height:320},1,function(){
                $$.an.startMove(textBg, {bottom:0,opacity:50},1);
            });

            if(now==0)
            {
                $$.an.startMove(oSmallUl, {left:0},1);
            }
            else if(now==aSmallLi.length-1)
            {
                $$.an.startMove(oSmallUl, {left:-(now-2)*(aSmallLi[0].offsetWidth+10)},1);
            }
            else
            {
                $$.an.startMove(oSmallUl, {left:-(now-1)*(aSmallLi[0].offsetWidth+10)},1);
            }
        };

        oPrev.onclick=function ()
        {
            now--;
            if(now==-1)
            {
                now=aSmallLi.length-1;
            }

            tab();
        };

        oNext.onclick=function ()
        {
            now++;
            if(now==aSmallLi.length)
            {
                now=0;
            }

            tab();
        };

        //关闭
        span.onclick = function(ev){
            var ev = ev || event;
            window.event?ev.cancelBubble = true:ev.stopPropagation();
            mark && document.body.removeChild(mark);
        };

        oDiv.onclick = function(ev){
            var ev = ev||event;
            window.event?ev.cancelBubble = true:ev.stopPropagation();
        };

        mark.onclick = function(){
			mark && document.body.removeChild(mark);
        };
    };


/****************************************************轮播结束**********************************************************/
    /**
     * 自适应高度
     */
    $$.fn.autoHeight = function(){
		var comHeight;
        comHeight = $(window).height() || $(document).height();
        var res = $(arguments[0]).offset().top + arguments[1] || 0;
        $(arguments[0]).height(comHeight-res);
		/*$(window).resize(function(){

		});*/
    };


	/**
	 * 兼容amd规范
	 */
	if(typeof define === 'function'&&define.amd){
		define('$$',[],function(){
			return $$;
		});
	}
	return $$;
})({});


