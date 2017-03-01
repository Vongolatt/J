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
// $.ajax({
// 	url: 'http://192.168.1.8:8081/api/posts/list?page=1&limit=10',
// 	type: 'GET',
// 	dataType: 'json',
// 	data: {   },
// })
// .done(function() {
// 	console.log("success");
// })
// .fail(function() {
// 	console.log("error");
// })
// .always(function() {
// 	console.log("complete");
// });
