$(function () {
	//开始是假用来判断瀑布流多次相应ajax时阻止请求;
	var start_time = new Date();
	//请求文章列表
	loadArticle(_page);
	//lazyload
	$(window).scroll(function(event) {
		var loading = document.querySelector('.loading');
		if(loading.getBoundingClientRect().top+loading.offsetHeight<document.body.clientHeight){
			//比较两次请求时间是否过短 
			var cur_time = new Date();
			if (cur_time-start_time<1000) return;
			//延时加载
			setTimeout(function () {
				loadArticle(_page);
			},1000);
			start_time = cur_time;
		}
	});
	//跳转文章详情
	$('#main-content').on('click', 'a', function(event) {
		var target = $(event.target).parents('section');
		sessionStorage.img = target.find('img').attr('src');
		sessionStorage.avatar = target.find('.left').children('img').attr('src');
		sessionStorage.name = target.find('.left').children('span')[0].textContent;
		sessionStorage.time = target.find('.left').children('span')[1].textContent;
		sessionStorage.title = target.find('h2').text();
		sessionStorage.content = target.find('p').text();
		sessionStorage.praise_sum = target.find('.right').children('span')[1].textContent;;
		sessionStorage.preview_sum = target.find('.right').children('span')[2].textContent;;
	});
});
var _page = 1;
function loadArticle (page) {
	$.ajax({
		url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/query/article',
		type: 'GET',
		dataType: 'json',
		data: {
			page:page,
			limit:10,
		},
	})
	.done(function(dt) {
		//错误时返回;
		if (dt.status!=200||dt.data.articles.length==0) {
			$('.loading').html('没有更多文章');
			return false;
		}
		dt=dt.data.articles;
		var str='';
		//生成文章列表
		for (var i = 0; i < dt.length; i++) {
			str+='<section class="article">';
			str+='<a target="_blank" href="article_details.html?user_id='+dt[i]._id+'&index='+i+'&page='+page+'"><img id="'+page+''+i+'" src="../images/314e251f95cad1c85db27e6c773e6709c93d5174.jpg"></a>';
			str+='<div class="wrap">';
			str+='<a target="_blank" href="article_details.html?user_id='+dt[i]._id+'index='+i+'page='+page+'"><h2>'+dt[i].title+'</h2></a>';
			str+='<p>'+dt[i].content+'</p>';
			str+='<div><div class="left">';
			//判断头像来源
			if (dt[i].user.avatar.indexOf('http')===-1) {
				str+='<img src="http://192.168.1.8:8700/B1Q1tzZqx/'+dt[i].user.avatar+'">';
			}
			else{str+='<img src="'+dt[i].user.avatar+'">';}
			str+='<span>'+dt[i].user.name+'</span>';
			str+='<span>'+moment(dt[i].create_time).format('YYYY-MM-DD HH:mm:ss')+'</span>';
			str+='</div>';
			str+='<div class="right">';
			str+='<img src="../images/like.png" class="like">';
			str+='<span class="num">+1</span>';
			var praise_sum = dt[i].praise_sum||0;
			str+='<span>'+praise_sum+'</span>';
			var preview_sum = dt[i].preview_sum || 0;
			str+='<img src="../images/saw.png">';
			str+='<span>'+preview_sum+'</span>';
			str+='</div></div>';
			str+='</div></section>';
			preLoad_images(dt[i].cover,page+''+i);		
		}
		//写入文章内容
		$('#main-content').append(str);
		_page++;
	})
	.fail(function() {
		$('#main-content').html('请求内容失败，请稍后重试');
	})
}

