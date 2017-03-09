$(function(){
	//请求省级联接口
	(function(){
		$.ajax({
			url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/query/city/province',
			type: 'GET',
			dataType: 'json',
		})
		.done(function(d) {
			//错误时返回
			if (d.status!=200) {
				$('#province').html('<option>无法加载城市信息请刷新重试</option>');
				return;
			}
			//添加省级选项
			var dt = d.data.provinces;
			var str = '<option>请选择</option>';
			for (var i = 0; i < dt.length; i++) {
				str+= '<option data-id='+dt[i].ProID+'>';
				str+= dt[i].name;
				str+= '</option>';
			}
			$('#province').append(str);
		})
		.fail(function() {
			$('#province').html('<option>无法加载城市信息请刷新重试</option>')
		});
	})();
	//请求市级联接口
	$('#province').change(function(event) {
		$('#city').remove();
		//取到所选省
		var id = this.selectedOptions[0].dataset.id;
		if (id===undefined) return;

		var str = '<select id="city" class="form-control">';
		$.ajax({
			url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/query/city',
			type: 'GET',
			dataType: 'json',
			data: {parent: id},
		})
		.done(function(d) {
			//错误时返回
			if (d.status!=200) {
				str = '<select class="form-control">请求失败</select>';
				return;
			}			
			//添加城市选项
			str+='<option>请选择</option>'
			var dt = d.data.citys;
			for (var i = 0; i < dt.length; i++) {
				str+= '<option>';
				str+= dt[i].name;
				str+= '</option>';
			}
			str+='</select>';
		})
		.fail(function() {
			str = '<select class="form-control">请求失败</select>';
		})
		.always(function() {
			$('#province').after(str);
		});	
	});
	//请求星座接口
	(function(){
		$.ajax({
			url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/query/constellation',
			type: 'GET',
			dataType: 'json',
		})
		.done(function(d) {
			//错误时返回
			if (d.status!=200) {
				$('#constellation').html('<option>无法加载星座信息请刷新重试</option>');
				return;
			}
			//添加星座选项
			var dt = d.data.constellations;
			var str = '<option>请选择</option>';
			for (var i = 0; i < dt.length; i++) {
				str+= '<option>';
				str+= dt[i].val;
				str+= '</option>';
			}
			$('#constellation').append(str);
		})
		.fail(function() {
			$('#constellation').html('<option>无法加载星座信息请刷新重试</option>')
		});
	})();
	//上传头像
	$('.up').click(function(event) {
		$('#upload').click();
	});
	//判断是否上传文件
	$('#upload').change((function() {
		var imgURL;
		return function(){
			if (this.files.length==0) return;
			//获取文件信息
			var file = this.files[0];
			// 获取 window 的 URL 工具
	      	var URL = window.URL || window.webkitURL;
			//清空原来的图片预览
			URL.revokeObjectURL(imgURL);
	      	// 通过 file 生成目标 url
	      	imgURL = URL.createObjectURL(file);
	      	// 用这个 URL 产生一个 <img> 将其显示出来
			var str='<img src="'+imgURL+'" alt="">';
			//将预览图片插入文档流
			$('#main-content').find('.up').html(str);
		}
	})());
	//整合数据
	$('button').click(function(event) {
		var formData = new FormData();
		formData.append('token',localStorage.token);

		if ($('#name').val()!='') formData.append('name',$('#name').val());
		
		if ($('#city').val()!='请选择'&&$('#city').val()!=undefined) {
			formData.append('city',$('#province').val()+$('#city').val());
		}
		else if ($('#province').val()!='请选择') {
			formData.append('city',$('#province').val());
		}
		if ($("input[name='sex']:checked").val()!='') formData.append('gender',$("input[name='sex']:checked").val());
		var file = $('#upload')[0].files[0];
		if (file!=undefined) formData.append('avatar',file);
		if ($('#constellation').val()!='请选择') formData.append('constellation',$('#constellation').val());
		$.ajax({
			url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/account/profile',
			type: 'POST',
			dataType: 'json',
			data: formData,
			processData: false,  // 告诉jQuery不要去处理发送的数据
  			contentType: false   // 告诉jQuery不要去设置Content-Type请求头
		})
		.done(function(dt) {
			localStorage.clear();
			tip(dt.message,function () {window.location.href = '../login.html'});
		})
		.fail(function() {
			tip('更新资料失败,请稍后重试')
		});
		
	});
})