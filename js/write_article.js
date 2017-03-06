$(function(){
	//弹出上传文件框
	$('.upload-background').click(function(event) {
		$('#upload').click();
	});
	//判断是否上传文件
	$('#upload').change(function(event) {
		if (this.files.length==0) return;
		//保存图片
		
	});
})