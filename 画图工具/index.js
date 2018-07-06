window.onload = function(){
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	var arr = [];
	var tools = document.querySelectorAll('.aside .tool');
	var style = document.getElementsByName('style'); //填充or边框
	var strokeColor = document.getElementById('strokeCheck'); //边框颜色
	var fillColor = document.getElementById('fillCheck'); //填充颜色
	var shape = document.getElementsByName('shape'); //凸多边形or凹多边形
	var bianshu = document.querySelector('#bianshu'); //获取多边形边数
	var file = document.querySelector('.fileUp'); //上传文件
	var pictures = document.querySelectorAll('.picture');
	var make = document.querySelector('.aside .make');
	var lineW = document.querySelector('.aside .lineWidth');
	var size = document.querySelector('.aside .size');
	var backTo = document.querySelector('.aside .back');
	var text = document.querySelector('.aside .font');
	var fontsize = document.querySelector('.aside .fontsize'); //插入文字字号大小
	var box = document.querySelector('.box');


	var clear = document.querySelector('.aside button:last-child');

	var type = 'pencil';

	tools[0].onclick = function(){
		type = 'pencil';
		canvas.style.cursor = 'auto';
	}
	tools[1].onclick = function(){
		type = 'line';
		canvas.style.cursor = 'crosshair';
	}
	tools[2].onclick = function(){
		type = 'circle';
		canvas.style.cursor = 'crosshair';
	}
	tools[3].onclick = function(){
		type = 'square';
		canvas.style.cursor = 'crosshair';
	}
	tools[4].onclick = function(){
		type = 'more';
		canvas.style.cursor = 'crosshair';
	}
	tools[5].onclick = function(){
		type = 'rubber';
		canvas.style.cursor = 'url("rubber.ico"),auto';
	}
	text.onclick = function(){
		type = 'text';
		canvas.style.cursor = 'text';
	}

	var sx,sy,mx,my;


	
	var flag = true;

	
	canvas.onmousedown = function(e){
		for(let i = 0 ; i < style.length ; i++){
			if(style[i].checked){
				var bort = style[i].value;
			}
		}
		if(bort == 'stroke'){
			ctx.strokeStyle = strokeColor.value;
		}else if(bort == 'fill'){
			ctx.fillStyle = fillColor.value;
		}
		ctx.lineWidth = lineW.value;
		var e = e || event;
		sx = e.offsetX;
		sy = e.offsetY;
		var num = 0;
		if(num == 0){
			var tsx = sx;
			var tsy = sy;
			num = 1;
		}
		if(type == 'rubber'){
			var rubberSize = lineW.value;
			ctx.clearRect(sx-rubberSize/2,sy-rubberSize/2,rubberSize,rubberSize);
			canvas.onmousemove = function(e){
				var e = e || event;
				mx = e.offsetX;
				my = e.offsetY;
				ctx.clearRect(mx-rubberSize/2,my-rubberSize/2,rubberSize,rubberSize);
			}
			document.onmouseup = function(){
				canvas.onmousemove = null;
				this.onmouseup = null;
				arr.push(ctx.getImageData(0,0,1200,570));
			}
		}else if(type == 'text'){
			if(flag){
				alert('输入完成请按回车。');
				flag = !flag;
			}
			var input = document.createElement('input');
			input.classList.add('wenben');
			input.style.left = sx+'px';
			input.style.top = sy+'px';
			box.appendChild(input);
			input.onkeydown = function(e){
				var e = e || event;
				if(e.keyCode == 13 && input.value != ""){
					var fcontent = input.value;
					box.removeChild(input);
					ctx.font = `${fontsize.value}px 微软雅黑`;
					ctx.fillText(fcontent,sx,sy);
					arr.push(ctx.getImageData(0,0,1200,570));
				}
			}
			input.onblur = function(e){
				if(this.value != ""){
					var fcontent = input.value;
					box.removeChild(input);
					ctx.font = `${fontsize.value}px 微软雅黑`;
					ctx.fillText(fcontent,tsx,tsy);
					num = 0;
					arr.push(ctx.getImageData(0,0,1200,570));
				}else{
					box.removeChild(input);
				}
			}
		}else if(type == 'pencil'){
			ctx.beginPath();
			ctx.moveTo(sx,sy);
			this.onmousemove = function(e){
				var e = e || event;
				mx = e.offsetX;
				my = e.offsetY;
				ctx.clearRect(0,0,1200,570);
				if(arr.length > 0){
					ctx.putImageData(arr[arr.length-1],0,0);
				}
				ctx.lineTo(mx,my);
				ctx.stroke();
			}
			document.onmouseup = function(){
				canvas.onmousemove = null;
				this.onmouseup = null;
				arr.push(ctx.getImageData(0,0,1200,570));
			}
		}else{
			canvas.onmousemove = function(e){
				ctx.beginPath();
				ctx.moveTo(sx,sy);
				var e = e || event;
				mx = e.offsetX;
				my = e.offsetY;
				ctx.clearRect(0,0,1200,570);
				if(arr.length > 0){
					ctx.putImageData(arr[arr.length-1],0,0);
				}
				if(type == 'line'){
					ctx.lineTo(mx,my);
					ctx.stroke();
				}else if(type == 'circle'){
					ctx.beginPath();
					ctx.arc(sx,sy,Math.pow(Math.pow(mx-sx,2)+Math.pow(my-sy,2),1/2),0,2*Math.PI);
					if(bort == 'stroke'){
						ctx.stroke();
					}else if(bort == 'fill'){
						ctx.fill();
					}
				}else if(type == 'square'){
					ctx.rect(sx,sy,mx-sx,my-sy);
					if(bort == 'stroke'){
						ctx.stroke();
					}else if(bort == 'fill'){
						ctx.fill();
					}
				}else if(type == 'more'){
					for(let i = 0 ; i < shape.length ; i++){
						if(shape[i].checked){
							var tora = shape[i].value;
						}
					}
					var bian = bianshu.value;
					if(tora == 'tu'){
						var r = Math.sqrt(Math.pow(mx-sx,2)+Math.pow(my-sy,2));
						var angle = Math.PI*2/bian;
						if(my >= sy){
							var cot = Math.atan((mx-sx)/(my-sy));
						}else{
							var cot = Math.atan((mx-sx)/(my-sy))-Math.PI;
						}
						ctx.moveTo(mx,my);
						for(let i = 1 ; i < bian ; i++){
							ctx.lineTo(sx+Math.sin(i*angle+cot)*r,sy+Math.cos(i*angle+cot)*r);
						}
						ctx.closePath();
						if(bort == 'stroke'){
							ctx.stroke();
						}else if(bort == 'fill'){
							ctx.fill();
						}
					}else if(tora == 'ao'){
						var r = Math.sqrt(Math.pow(mx-sx,2)+Math.pow(my-sy,2));
						var angle = Math.PI/bian;
						if(my >= sy){
							var cot = Math.atan((mx-sx)/(my-sy));
						}else{
							var cot = Math.atan((mx-sx)/(my-sy))-Math.PI;
						}
						ctx.moveTo(mx,my);
						for(let i = 1 ; i < bian*2 ; i++){
							if(i%2==0){
								ctx.lineTo(sx+Math.sin(i*angle+cot)*r,sy+Math.cos(i*angle+cot)*r);
							}else{
								ctx.lineTo(sx+Math.sin(i*angle+cot)*r/2,sy+Math.cos(i*angle+cot)*r/2);
							}
						}
						ctx.closePath();
						if(bort == 'stroke'){
							ctx.stroke();
						}else if(bort == 'fill'){
							ctx.fill();
						}
					}
				}
				document.onmouseup = function(){
					canvas.onmousemove = null;
					this.onmouseup = null;
					arr.push(ctx.getImageData(0,0,1200,570));
				}
			}
		}
	}

	
	file.onchange = function(){
		var data = this.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(data);
		reader.onload = function(){
			var image = new Image();
			image.src = this.result;
			image.onload = function(){
				ctx.drawImage(image,0,0,1200,570,0,0,1200,570);
				var img = ctx.getImageData(0,0,1200,570);
				arr.push(ctx.getImageData(0,0,1200,570));
				pictures[0].onclick = function(){
					for(var i = 0 ; i < img.width*img.height ; i++){
						var grey = img.data[4*i+0]*0.299+img.data[4*i+1]*0.578+img.data[4*i+2]*0.114;
						img.data[4*i+0] = grey;
						img.data[4*i+1] = grey;
						img.data[4*i+2] = grey;
					}
					ctx.clearRect(0,0,1200,570);
					ctx.putImageData(img,0,0);
					arr.push(ctx.getImageData(0,0,1200,570));
				}
				pictures[1].onclick = function(){
					for(var i = 0 ; i < img.width*img.height ; i++){
						img.data[4*i+0] = 255-img.data[4*i+0];
						img.data[4*i+1] = 255-img.data[4*i+1];
						img.data[4*i+2] = 255-img.data[4*i+2];
					}
					ctx.clearRect(0,0,1200,570);
					ctx.putImageData(img,0,0);
					arr.push(ctx.getImageData(0,0,1200,570));
				}
				pictures[2].onclick = function(){
					var num = prompt("请输入马赛克块大小：");
					var height = img.height;
					var width = img.width;
					for(var k = 0 ; k < height/num ; k++){
						for(var j = 0 ; j < width/num ; j++){
							var item = ctx.getImageData(j*num,k*num,num,num);
							var r = 0;
							var g = 0;
							var b = 0;
							for(var m = 0 ; m < num*num ; m++){
								r += item.data[m*4+0];
								g += item.data[m*4+1];
								b += item.data[m*4+2];
							}
							for(var n = 0 ; n < num*num ; n++){
								item.data[n*4+0] = parseInt(r/(num*num));
								item.data[n*4+1] = parseInt(g/(num*num));
								item.data[n*4+2] = parseInt(b/(num*num));
							}
							ctx.putImageData(item,j*num,k*num);
						}
					}
					arr.push(ctx.getImageData(0,0,1200,570));
				}
			}
		}
	}


	make.onclick = function(){
		var dataa = canvas.toDataURL('image/png');
		var a = document.createElement('a');
		var imge = new Image();
		a.href = dataa;
		a.download = 'canvas.png';
		imge.src = dataa;
		a.appendChild(imge);
		document.body.appendChild(a);
	}

	backTo.onclick = function(){
		ctx.clearRect(0,0,1200,570);
		arr.pop();
		if(arr.length > 0){
			ctx.putImageData(arr[arr.length-1],0,0);
		}else{
			alert('不能再撤销了！');
		}
	}

	clear.onclick = function(){
		ctx.clearRect(0,0,1200,570);
		arr = [];
	}

}