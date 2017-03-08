$(function () {
	//页面主题部分;	
	if (!sessionStorage.content) {$('#main-content').html('<p>页面错误<a href="article.html" style="color:#000;">返回文章列表</a></p>');return;}
	(function(){
		// 生成文章详情;
		var str='<h4>'+sessionStorage.title+'</h4>';
		str+='<span class="share"><img src="../images/share.png">';
		str+='<div class="hid">';
		str+='<span id="qrcode">请使用微信扫一扫</span>'
		str+='</div></span>';
		str+='<div class="wrap"><div class="left">';
		str+='<img src="'+sessionStorage.avatar+'">';
		str+='<span>'+sessionStorage.name+'</span><span>'+sessionStorage.time+'</span>';
		str+='</div>';
		str+='<div class="right">';
		str+='<img src="../images/like.png" class="like"><span class="num">+1</span><span>'+sessionStorage.praise_sum+'</span><img src="../images/saw.png"><span>'+sessionStorage.preview_sum+'</span>';
		str+='</div></div>';
		str+='<img id="cover" src="'+sessionStorage.img+'">';
		str+='<div class="article"><p>'+sessionStorage.content+'</p></div>';
		//我要评论
		str+='<div class="comment">';
		str+='<h5>文章点评</h5>';
		str+='<textarea placeholder="我有话要说"></textarea>';
		str+='<button class="btn">提&nbsp;&nbsp;&nbsp;&nbsp;交</button></div>';
		$('#main-content').prepend(str);
		$('.hid').qrcode({
			width:130,height:130,correctLevel:0,text:window.location.href
		});  
	})();
	//页面拉到底部加载评论;
	var start_time =new Date();
	$(window).scroll(function(event) {
		var loading = document.querySelector('.loading');
		if(loading.getBoundingClientRect().top+loading.offsetHeight<document.body.clientHeight){
			//比较两次请求时间是否过短 
			var cur_time = new Date();
			if (cur_time-start_time<1000||$('.loading').text()=='没有更多评论') return;
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
			if (dt.status!=200) {
				tip(dt.message);
				return;
			}
			// 清空评论列表
			$('.comment').children('section').remove();
			// 重新加载评论列表;
			_page=1;
			get_commenList ()
		});	
	});
})
//取到用户id;
var _id = getQueryString('user_id');
var _page = 1;
function get_commenList (){
//加载评论列表;
	$.ajax({
	url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/query/comment',
	type: 'GET',
	dataType: 'json',
	data: {
		article:_id,
		page:_page,
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
			//判断头像来源
			if (dt[i].user.avatar.indexOf('http')===-1) {
				str+='<img src="http://192.168.1.8:8700/B1Q1tzZqx/'+dt[i].user.avatar+'">';
			}
			else{str+='<img src="'+dt[i].user.avatar+'">';}
			str+='<span>'+dt[i].user.name+'</span>';
			var duration_time = (moment().unix()-dt[i].create_time/1000);
			str+='<span>'+moment.duration(duration_time,'seconds').humanize(true);+'</span>';
			str+='<div class="right">';
			str+='<img src="../images/like.png" class="like"><span class="num">+1</span>';
			var praise_sum = dt[i].praise_sum||0;
			str+='<span>'+praise_sum+'</span></div>';
			str+='<p>'+dt[i].content+'</p>';
			str+='</div></section>';
			// console.log(.format('YYYY-MM-DD HH:mm:ss'))						
		}
		//插入文档
		$('.comment').append(str);
		if (dt.length<10) $('.loading').html('没有更多评论');
		_page++;
	})
	.fail(function() {
		$('.comment').append('没有更多评论');
	});	
}	
