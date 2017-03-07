$(function () {
	//页面加载后执行一次滚动监听；
	scrollListern();
	//返回顶部
	$('#backTop').click(function(event) {
		$('html,body').animate({
			scrollTop: 0,},
			'slow', function() {
			event.target.style.display = 'none';
		});
	});
	$(window).scroll(function(event) {
		//滚动监听
		scrollListern();
	});
	//悬浮提示
	$('#main-content').on('mouseover mouseout','.like',function() {
		if ($(event.target).hasClass('check')) return;
		if(event.type == "mouseover"){
			event.target.src = '../images/like_mark.png';
		}
		else if(event.type == "mouseout"){
			event.target.src = '../images/like.png';
		}
	})
	.on('click','.like',function() {
		//请求接口
		//成功后
		event.target.src = '../images/like_mark.png';
		//提示点击信息
		if ($(event.target).hasClass('check')) {
			alert('您已经点赞！');
			event.target.nextElementSibling.classList.remove('check');
		}
		else {
			event.target.nextElementSibling.classList.add('check');
			event.target.classList.add('check');			
		}
	});
	//判断登陆状态;
	if (localStorage.token) {
		//登陆成功显示用户信息;
		var login_info = '<img src=http://192.168.1.8:8700/B1Q1tzZqx/'+localStorage.avatar+' alt="">';
			login_info+= '<span>'+localStorage.name+'<img src="../images/pull_down.png" alt="">';
			login_info+='<div class="hid">';
			login_info+='<a href="../user/user.html" class="icon icon1"></a>';
			login_info+='<a href="../user/user_config.html" class="icon icon2"></a>';
			login_info+='<a href="" id="quit" class="icon icon3"></a>';
			login_info+='</div></span>';
			if (window.location.href == 'http://www.j.com/project/J/user/write.html') {
				login_info+='<a href="javascript:;"><img src="../images/publish.png" alt="发布"></a>';
			}
			else{login_info+='<a href="../user/write.html"><img src="../images/write.png" alt="写文章"></a>';}
		$('#header').children('div').first().html(login_info);
	}
	//退出登录
	$('#header').on('click', '#quit', function(event) {
		localStorage.clear();
	});
//jq结尾
});
function scrollListern (argument) {
	//返回顶部
	if (document.body.scrollTop>200) {
		$('#backTop').css('display', 'block');
	}
	else{
		$('#backTop').css('display', 'none');
	}
	//导航栏滚动变化
	if (document.body.scrollTop>80) {
		$('#header').addClass('scroll');
	}
	else {
		$('#header').removeClass('scroll');
	}
}
//定义切取url参数的函数
function getQueryString(name) {  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i").exec(window.location.search.substr(1));   
        if (reg != null) return reg[2];  
        return null;  
}
//预加载图片
function preLoad_images(img_src,id){
	var temp_img = new Image();
	//图片加载成功后，替换临时图片
	temp_img.onload = function(){
		$('#'+id).attr('src', temp_img.src);
	}
	//加载失败
	temp_img.onerror = function(){
		$('#'+id).attr('src', '../images/u=3083093071,1461152719&fm=23&gp=0.jpg');
	}
	//预加载图片
	if (img_src.indexOf('http')===-1) {
		temp_img.src = 'http://192.168.1.8:8700/B1Q1tzZqx/'+ img_src;
	}
	else {
		temp_img.src =  img_src;
	}
}
function tip (message,fun) {
	bootbox.alert({ 
		size: "small",
		title: "提示",
		message: message, 
		callback: fun
	}) 
}