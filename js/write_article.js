$(function(){
	//弹出上传文件框
	$('.wrap').on('click', '.up', function(event) {
		$('#upload').click();
	});
	//判断是否上传文件
	$('#upload').change((function(event) {
		var _imgURL;
		return function(){
			if (this.files.length==0) return;
			//获取文件信息
			var _file = this.files[0];
			// 获取 window 的 URL 工具
	      	var URL = window.URL || window.webkitURL;
			//清空原来的图片预览
			URL.revokeObjectURL(_imgURL);
	      	// 通过 file 生成目标 url
	      	_imgURL = URL.createObjectURL(_file);
	      	// 用这个 URL 产生一个 <img> 将其显示出来
			var str='<img src="'+_imgURL+'" alt="">';
				str+='<div class="change-view width">更换图片</div>';
			//将预览图片插入文档流
			$('#main-content').find('.up').html(str).removeClass('upload-background').addClass('width');
		}
	})());
	//发表文章
	$('#header').on('click', 'img', function(event) {
		if (!localStorage.token) {tip('请先登录',function () {
			window.location.href = '../login.html';
		}); return;}
		var file = $('#upload')[0].files[0];
		if (file==undefined) {tip('请上传封面'); return;}
		var formData = new FormData();
		formData.append('cover', file);
		formData.append('token',localStorage.token);
		formData.append('title',document.querySelector('#title').value);
		formData.append('content',document.querySelector('textarea').value);
		console.log(formData);
		$.ajax({
		url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/account/article/add',
		type: 'POST',
		dataType: 'json',
		data: formData,
		processData: false,  // 告诉jQuery不要去处理发送的数据
  		contentType: false   // 告诉jQuery不要去设置Content-Type请求头
		})
		.done(function() {
			window.location.href= 'user.html';
		});
		
	});
})