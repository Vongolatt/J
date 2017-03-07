var _page =1;
$(function(){
	loadArticle(_page);
	//页面拉到底部加载评论;
	var start_time =new Date();
	$(window).scroll(function(event) {
		var loading = document.querySelector('.loading');
		if(loading.getBoundingClientRect().top+loading.offsetHeight<document.body.clientHeight){
			//比较两次请求时间是否过短 
			var cur_time = new Date();
			if (cur_time-start_time<1000) return;
			//延时加载评论列表
			setTimeout(loadArticle,1000);
			start_time = cur_time;
		}
	});
	if(localStorage.token){
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
})
function loadArticle(){
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
		if (dt.status!=200||dt.data.articles.length==0) {
			$('.loading').html('没有更多文章');
			return false;
		}
		dt=dt.data.articles;
		var str='';
		//生成文章列表
		for (var i = 0; i < dt.length; i++) {
			str+='<h1>文章(<span>'+dt.length+'</span>)</h1>';
			str+='<section class="article">';
			str+='<a href="article_details.html?user_id='+dt[i]._id+'&index='+i+'&page='+_page+'"><img id="'+_page+''+i+'" src="../images/314e251f95cad1c85db27e6c773e6709c93d5174.jpg"></a>';
			str+='<div class="wrap">';
			str+='<a href="article_details.html?user_id='+dt[i]._id+'index='+i+'page='+_page+'"><h2>'+dt[i].title+'</h2></a>';
			str+='<p>'+dt[i].content+'</p>';
			str+='<div><div class="left">';
			str+='<img src="http://192.168.1.8:8700/B1Q1tzZqx/'+dt[i].user.avatar+'">';
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
			preLoad_images(dt[i].cover,_page+''+i);		
		}
		//写入文章内容
		$('#main-content').append(str);
		_page++;
	})
	.fail(function() {
		$('.loading').html('您还没有登陆');
	});	
}