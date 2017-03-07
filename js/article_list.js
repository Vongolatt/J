$(function () {
	//页面主题部分;
	(function(){
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
			dt=dt.data.articles[index];
			// 生成文章详情;
			var str='<h4>'+dt.title+'</h4>';
			str+='<span class="share"><img src="../images/share.png">';
			str+='<div class="hid">';
			str+='<span>请使用微信扫一扫</span><img src="" alt="">';
			str+='</div></span>';
			str+='<div class="wrap"><div class="left">';
			//判断头像来源
			if (dt.user.avatar.indexOf('http')===-1) {
				str+='<img src="http://192.168.1.8:8700/B1Q1tzZqx/'+dt.user.avatar+'">';
			}
			else{str+='<img src="'+dt.user.avatar+'">';}
			str+='<span>'+dt.user.name+'</span><span>'+moment(dt.create_time).format('YYYY-MM-DD HH:mm:ss')+'</span>';
			str+='</div>';
			str+='<div class="right">';
			str+='<img src="../images/like.png" class="like"><span class="num">+1</span><span>'+dt.praise_sum+'</span><img src="../images/saw.png"><span>'+dt.preview_sum+'</span>';
			str+='</div></div>';
			str+='<img id="cover" src="../images/314e251f95cad1c85db27e6c773e6709c93d5174.jpg">';
			str+='<div class="article"><p>'+dt.content+'<p></div>';
			//我要评论
			str+='<div class="comment">';
			str+='<h5>文章点评</h5>';
			str+='<textarea placeholder="我有话要说"></textarea>';
			str+='<button class="btn">提&nbsp;&nbsp;&nbsp;&nbsp;交</button></div>';
			preLoad_images(dt.cover,'cover');
			$('#main-content').prepend(str);
		})
		.fail(function() {
			document.querySelector('#main-content').innerHTML= '请求失败，稍后重试'
		});	
	})();
	//页面拉到底部加载评论;
	var start_time =new Date();
	$(window).scroll(function(event) {
		var loading = document.querySelector('.loading');
		if(loading.getBoundingClientRect().top+loading.offsetHeight<document.body.clientHeight){
			//比较两次请求时间是否过短 
			var cur_time = new Date();
			if (cur_time-start_time<1000) return;
			//延时加载评论列表
			setTimeout(get_commenList,1000);
			start_time = cur_time;
		}
	});
	//我要评论
	$('#main-content').on('click', '.btn', function() {
		//取到评论内容
		var comment_content = document.querySelector('textarea').value;
		//添加评论;
		$.ajax({
		url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/account/comment/add',
		type: 'POST',
		dataType: 'json',
		data: {
			token:localStorage.token,
			article:_id,
			content:comment_content,
		},
		})
		.done(function(dt) {
			if (dt.status!=200) {//motaikuang
				return;
			}
			// 清空评论列表
			$('.comment').children('section').remove();
			// 重新加载评论列表;
			page=1;
			get_commenList ()
		});	
	});
})
//取到用户id;
var _id = getQueryString('user_id');
var index =getQueryString('index');
var page = getQueryString('page');

function get_commenList (){
//加载评论列表;
	$.ajax({
	url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/query/comment',
	type: 'GET',
	dataType: 'json',
	data: {
		article:_id,
		page:page,
		limit:10,
	},
	})
	.done(function(dt) {
		//错误时返回;
		if (dt.status!=200||dt.data.comments.length==0) {
			$('.loading').html('没有更多评论');
			return false;
		}
		dt=dt.data.comments;
		var str ='';
		for (var i = 0; i < dt.length; i++) {
			str+='<section>';
			str+='<div class="left">';
			str+='<img src="'+dt[i].user.avatar+'" alt="">';
			str+='<span>'+dt[i].user.name+'</span>';
			str+='<span>'+moment(dt[i].create_time).format('YYYY-MM-DD HH:mm:ss')+'</span>';
			str+='<div class="right">';
			str+='<img src="../images/like.png" class="like"><span class="num">+1</span>';
			str+='<span>'+dt[i].praise_sum+'</span></div>';
			str+='<p>'+dt[i].content+'</p>';
			str+='</div></section>';						
		}
		//插入文档
		$('.comment').append(str);
		page++;
	})
	.fail(function() {
		$('.comment').append('没有更多评论');
	});	
}	
