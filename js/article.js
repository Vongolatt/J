$(function () {
	$.ajax({
		url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/query/article',
		type: 'GET',
		dataType: 'json',
		data: {
			page:1,
			limit:10,
		},
	})
	.done(function(dt) {
		//错误时返回;
		if (dt.status!=200) {
			$('#main-content').html('请求内容失败，请稍后重试');
			return false;
		}
		dt=dt.data.articles;
		var str='';
		//生成文章列表
		for (var i = 0; i < dt.length; i++) {
			str+='<section class="article">';
			str+='<a href="article_details.html?'+dt[i]._id+'"><img src="'+dt[i].cover+'"></a>';
			str+='<div class="wrap">';
			str+='<a href="article_details.html?'+dt[i]._id+'"><h2>'+dt[i].title+'</h2></a>';
			str+='<p>'+dt[i].content+'</p>';
			str+='<div><div class="left">';
			str+='<img src="'+dt[i].user.avatar+'">';
			str+='<span>'+dt[i].user.name+'</span>';
			str+='<span>'+moment(dt[i].create_time).format('YYYY-MM-DD HH:mm:ss')+'</span>';
			str+='</div>';
			str+='<div class="right">';
			str+='<img src="../images/like.png" class="like">';
			str+='<span class="num">+1</span>';
			str+='<span>'+dt[i].praise_sum+'</span>';
			str+='<img src="../images/saw.png">';
			str+='<span>'+dt[i].preview_sum+'</span>';
			str+='</div></div>';
			str+='</div></section>';			
		}
		//写入文章内容
		$('#main-content').html(str);
	})
	.fail(function() {
		$('#main-content').html('请求内容失败，请稍后重试');
	});
	
})