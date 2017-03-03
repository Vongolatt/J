$(function(){
	//获取验证码
	$('#captch').click(function(event) {
	var mobile =document.getElementById('mobile').value;

		if (/^1\d{10}$/.test(mobile)) {
			// 手机合法成功请求验证码
			$.ajax({
				url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/captcha/sms',
				type: 'POST',
				dataType: 'json',
				data: {phone:mobile},
				})
				.done(function(dt) {
					console.log(dt);
					var i=60;
					$('#captch').prop('disabled', true).html('60s');
					setInterval(function(){
						i--;
						$('#captch').html(i+'s');
					},1000);
				})
				.fail(function(dt) {
					console.log('数据错误，稍后重试');
				});
			}
			else {
				//手机不合法
			$('.help-block')[0].innerHTML='<ul class="list-unstyled"><li>请输入手机号</li></ul>';
		}
	});		
});
	// $.ajax({
	// 	url: 'http://192.168.1.8:8700/B1Q1tzZqx/v1/account/register',
	// 	type: 'POST',
	// 	dataType: 'json',
	// 	data: {param1: 'value1'},
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
