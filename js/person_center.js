$(function(){
	loadArticle(1);
	//页面拉到底部加载评论;
	$(window).scroll(throttle (loadArticle));
	//加载个人信息
	if(localStorage.token){
		//预加载背景图
		if (localStorage.background) {
			var temp_img = new Image();
			//图片加载成功后，替换临时图片
			temp_img.onload = function(){
				$('.bg').css('background-image','url('+temp_img.src+')');
			}
			//加载失败
			temp_img.onerror = function(){
					$('.bg').attr('src', '../images/u=3083093071,1461152719&fm=23&gp=0.jpg');
			}
			temp_img.src =  localStorage.background;
		}
		var str = "";
		if (localStorage.gender=="男") {str+='<img src="../images/boy.png" alt="" class="sex">'}
		if (localStorage.gender=="女") {str+='<img src="../images/girl.png" alt="" class="sex">'}
		var avatar = localStorage.avatar|| "";
		str+='<img src="http://192.168.1.8:8700/B1Q1tzZqx/'+localStorage.avatar+'" alt="">';
		str+='<span>'+localStorage.name+'</span></br>';
		var constellation =localStorage.constellation||"";
		var city = localStorage.city ||"";		
		str+='<span>'+city+'&nbsp;&nbsp;&nbsp;'+constellation+'</span>';
		$('.wrap').append(str);
	}
	//跳转文章详情
	$('#main-content').on('click', 'a', function(event) {
		var target = $(event.target).parents('section');
		sessionStorage.img = target.find('img').attr('src');
		sessionStorage.avatar = target.find('.left').children('img').attr('src');
		sessionStorage.name = target.find('.left').children('span')[0].textContent;
		sessionStorage.time = target.find('.left').children('span')[1].textContent;
		sessionStorage.title = target.find('h2').text();
		sessionStorage.content = target.find('p').text();
		sessionStorage.praise_sum = 0;
		sessionStorage.preview_sum = 0;
	});
})
function loadArticle(_page){
	$.ajax({
		url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/account/article/query',
		type: 'GET',
		dataType: 'json',
		data: {
			token:localStorage.token,
			page:_page,
			limit:10
	}
	})
	.done(function(dt) {
		//错误时返回;
		if (dt.status!=200) {
			$('.loading').html('您还没有登陆   <a href="../login.html">现在登陆</a>');
			return false;
		}
		dt=dt.data.articles;
		if (dt.length==0) return;
		var str='';
		str+='<h1>文章(<span>'+dt.length+'</span>)</h1>';
		//生成文章列表
		for (var i = 0; i < dt.length; i++) {
			str+='<section class="article">';
			str+='<a target="_blank" href="../article/article_details.html?user_id='+dt[i]._id+'&index='+i+'&page='+_page+'"><img id="'+_page+''+i+'" src="../images/314e251f95cad1c85db27e6c773e6709c93d5174.jpg"></a>';
			str+='<div class="wrap">';
			str+='<a target="_blank" href="../article/article_details.html?user_id='+dt[i]._id+'index='+i+'page='+_page+'"><h2>'+dt[i].title+'</h2></a>';
			str+='<p>'+dt[i].content+'</p>';
			str+='<div><div class="left">';
			str+='<img src="http://192.168.1.8:8700/B1Q1tzZqx/'+dt[i].user.avatar+'">';
			str+='<span>'+dt[i].user.name+'</span>';
			str+='<span>'+moment(dt[i].create_time).format('YYYY-MM-DD HH:mm:ss')+'</span>';
			str+='</div>';
			str+='<div class="right">';
			str+='<img src="../images/like.png" class="like">';
			str+='<span class="num">+1</span>';
			str+='<span>0</span>';
			str+='<img src="../images/saw.png">';
			str+='<span>0</span>';
			str+='</div></div>';
			str+='</div></section>';
			preLoad_images(dt[i].cover,_page+''+i);				
		}
		//写入文章内容
		$('#main-content').append(str);
		if (dt.length<10) $('.loading').html('没有更多文章');
	})
	.fail(function() {
		$('.loading').html('您还没有登陆');
	});	
}