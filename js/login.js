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
					if (dt.status!=200) {
						tip(dt.message);
						return;
					}
					var i=60;
					$('#captch').prop('disabled', true).html('60s');
					setInterval(function(){
						i--;
						$('#captch').html(i+'s');
					},1000);
				})
				.fail(function(dt) {
					tip(dt.message);
				});
			}
		else {
			//手机不合法
			$('.help-block')[0].innerHTML='<ul class="list-unstyled"><li>请输入手机号</li></ul>';
		}
	});	
	$('#login,#register,#rest').click(function(event) {
		var form =  document.getElementById("register-form")||document.getElementById("rest-form");
		var formdata=[];
		//登陆参数
		formdata[1] = {
			account:form[0].value,
			password:form[1].value
		}
		//注册参数
		formdata[0] = {
			phone:form[0].value,
			password:form[3].value,
			captcha:form[1].value
		}
		//重设密码参数
		var obj = {
			'http://www.j.com/project/J/register.html':formdata[0],
			'http://www.j.com/project/J/login.html':formdata[1],
			'http://www.j.com/project/J/reset.html':formdata[0]
		}
		$.ajax({
			url: form.action,
			type: 'POST',
			dataType: 'json',
			data:obj[window.location.href],
		})
		.done(function(dt) {
			if (dt.status!=200) {
				tip(dt.message);
				return;
			}
			//重新注册登录时先清楚个人信息;
			if (window.location.href!='http://www.j.com/project/J/reset.html') {
				localStorage.clear();
			}
			dt = dt.data.user;
			//存储个人信息;
			localStorage.token = dt.token;
			localStorage.avatar = dt.avatar;
			localStorage.background = dt.background;
			localStorage.city = dt.city;
			localStorage.constellation = dt.constellation;
			localStorage.gender = dt.gender;
			localStorage.name = dt.name;
			//判断个人信息是否完整,不完整跳转到个人设置;
			if (localStorage.avatar=='undefined') {window.location.href = 'user/user_config.html'}
			else{window.location.href ='article/article.html'}
		})
		.fail(function(dt) {
			tip(dt.message);
		});
	});
});
