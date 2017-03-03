$(function () {
if (!localStorage.token) {
	localStorage.token= "27f099ee0468fd9b9d5cf086bff5f6da370b3d9e";
	localStorage.img = 'https://unsplash.it/1080/720?image=688';
}
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
	$('.like').hover(function() {
		if ($(event.target).hasClass('check')) return;
		event.target.src = '../images/like_mark.png';
	}, function() {
		if ($(event.target).hasClass('check')) return;
		event.target.src = '../images/like.png';
	})
	.click(function(event) {
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
		var login_info = '<img src='+localStorage.img+' alt="">';
			login_info+= '<span>lvlu<img src="../images/pull_down.png" alt="">';
			login_info+='<div class="hid">';
			login_info+='<a href="user.html" class="icon icon1"></a>';
			login_info+='<a href="user_config.html" class="icon icon2"></a>';
			login_info+='<a href="" class="icon icon3"></a>';
			login_info+='</div></span>';
			login_info+='<a href="../user/write.html"><img src="../images/write.png" alt="写文章"></a>';
		$('#header').children('div').first().html(login_info);
	}
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
