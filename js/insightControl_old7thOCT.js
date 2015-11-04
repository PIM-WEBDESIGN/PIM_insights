var insightManager = {
	init : function(){	
		insightManager.bindEvents();
		insightManager.currentActiveChannel = "amazon";
		if(sessionStorage.getItem('jsonOfIds') === null || sessionStorage.getItem('jsonOfIds') === undefined){
			
		}
		else{
			console.log(Object.keys(JSON.parse(sessionStorage.getItem('jsonOfIds'))).length);
			if(Object.keys(JSON.parse(sessionStorage.getItem('jsonOfIds'))).length < 1 ){
				console.log("no item in session storage");
			}
			else{
				console.log("items in session storage");
				insightManager.sessionStorageJson = JSON.parse(sessionStorage.getItem('jsonOfIds'));
				insightManager.customizeDashboard(insightManager.sessionStorageJson);		
			}	
		}
	},	
	id : "",
	elements : [],
	salesChartArray : [],
	sessionStorageJson : {},
	currentActiveChannel : "amazon",
	//doc : new jsPDF('p','pt','letter'),
	doc : new jsPDF('p','pt', [1200,8000]),
	bindEvents :  function(){
		
		$('#saveAsPDF').on('click',function(){
			
			var svgs = $('#amazon .row').find('svg');
			
			var length = svgs.length;
			
			insightManager.pdfGenerator(svgs,length,function(){
				insightManager.doc.save('text.pdf');
			});
			
			
			
			/*
				var doc = new jsPDF();
				var specialElementHandlers = {
				'#editor': function (element, renderer) {
				return true;
				}
				};
				
				doc.addHTML($('#' + insightManager.currentActiveChannel + " .row"),function() {
				doc.save('web.pdf');
				});
				
				doc.fromHTML($('#' + insightManager.currentActiveChannel + " .row").html(), 15, 15, {
				'width': 800,
				'elementHandlers': specialElementHandlers
				});
				doc.save('sample-file.pdf');
			*/
			
		});
		
		$(document).on('click','.tab-content img',function(){
			var id = $(this).attr('id');
			insightManager.moduleAppendAtDashboard(id,insightManager.currentActiveChannel);
			$($(this).parent().parent()).remove();
		});
		
		$(document).on('click','.delete',function(){
			var id = $($(this).parent()).attr('id');
			insightManager.moduleRevertBack(id);
			$($(this).parent().parent().parent()).remove();
			
		});
		
		
		$(document).on('click','.right',function(){
			$(this).siblings().removeClass('btn-info')
			$(this).addClass('btn-info');
			var id = $($(this).parent()).attr('id');
			$($(document).find('#chart_' + id )).css('display','none');
			$($(document).find("#chart_list_" + id )).css('display','block');
			console.log($(this).parent());
			var container = $($('#chart_list_' + id ).find('.list-table'));
			insightManager.appendFullList(container,id);		
		});
		
		$(document).on('click','.left',function(){
			$(this).siblings().removeClass('btn-info')
			$(this).addClass('btn-info');
			var id = $($(this).parent()).attr('id');			
			console.log(id)
			$($(document).find('#chart_' + id )).css('display','block');
			$($(document).find("#chart_list_" + id )).css('display','none');
			
		});
		
		
		$(document).on('click','.top-nav li a',function(e) {
			e.preventDefault();
			console.log('s');
			var $target = $(this).attr('data');
			$('a').removeClass('active');
			$(this).addClass('active');
			$(".show-data").css('display','none');
			$('#' + $target).css('display','block');
			insightManager.currentActiveChannel = $target;
			console.log(insightManager.currentActiveChannel);
			//insightManager.bindEvents();
		});
		
		$('.btn-slide').on('click',function(){
			//alert('clicked');
			$(".btn-slide").toggleClass("click");
			$(".tabPanel").toggleClass("active");
			$("#arrow").toggleClass("fa-angle-double-right");
			$("#arrow").toggleClass("fa-angle-double-left");
			
		});
		
		$('#addAll').on('click',function(){
			
			var json = {};
			
			var id = $($('.tabPanel .nav').find('.active')).attr("id");
			var length = $($('.tab-content .' + id).find('img')).length;
			
			console.log($($('.tab-content .' + id).find('img')));
			for(var i = 0 ; i < length ; i++){
				if(json[insightManager.currentActiveChannel] === undefined ){
					json[insightManager.currentActiveChannel] = {};
				}
				var imgId = $($('.tab-content .' + id).find('img')[i]).attr('id');
				json[insightManager.currentActiveChannel][imgId] = {"activeTemp" : id };
			}
			insightManager.customizeDashboard(json);
		});
		/*
			$("#importFile").on('change',function(e){
			
			var nameArr	= e.target.files.item(0).name.split(/[\s.]+/);			
			var json = {};
			var reader = new FileReader();
			var name = e.target.files.item(0).name;
			//console.log("name	" + name);
			reader.onload = function(evt) {
			// console.log(" e : " + e);
			var data = evt.target.result;
			// console.log("data	: " + (data));
			//var xlsx = XLSX.read(data, {type: 'binary'});
			var arr = String.fromCharCode.apply(null, new Uint8Array(data));
			var xlsx = XLSX.read(btoa(arr), {type: 'base64'});
			process_xlsx(xlsx,function(jsonval){
			console.log(jsonval);
			for(var j=0;j<jsonval['Amazon'].length;j++){
			//console.log(jsonval['Amazon'][j]);
			insightManager.salesChartArray.push(jsonval['Amazon'][j]);
			
			}
			
			console.log("done");
			
			insightManager.salesChartArray.sort(function(a, b) {
			return parseFloat(b['Sales Volume']) - parseFloat(a['Sales Volume']);
			});
			});
			};
			//reader.readAsBinaryString(f);
			reader.readAsArrayBuffer(e.target.files.item(0));
			$("#importFile").val("");
			});
			
			var process_xlsx = function(xlsx,callback){
			var jsonData = "";
			var csvData = "";  
			csvData = to_json(xlsx,callback);
			};
			var to_json =  function(workbook,callback){
			var result = {};
			workbook.SheetNames.forEach(function(sheetName) {
			var rObjArr = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			//console.log(rObjArr);
			if(rObjArr.length > 0){
			result[sheetName] = rObjArr;
			}
			});
			callback(result);
			//return result;
			};
		*/
		/**     default funtionailities of tab */
	},
	pdfGenerator : function(svgs,length,callback){
		
		console.log(length);
		
		if(length > 0){
			var svgString = new XMLSerializer().serializeToString(svgs[length - 1]);
			var myString = $(svgs[length-1]).attr('id');
			
			myString = myString.replace("-svg",'');
			myString = myString.replace("chart_",'');
			
			if(headingAndApiMapper[insightManager.currentActiveChannel]["sales"].hasOwnProperty(myString)){
				var text = headingAndApiMapper[insightManager.currentActiveChannel]["sales"][myString]["name"]; 	
			}
			else if(headingAndApiMapper[insightManager.currentActiveChannel]["promos"].hasOwnProperty(myString)){
				var text = headingAndApiMapper[insightManager.currentActiveChannel]["promos"][myString]["name"];
			}
			else if(headingAndApiMapper[insightManager.currentActiveChannel]["digital"].hasOwnProperty(myString)){
				var text = headingAndApiMapper[insightManager.currentActiveChannel]["digital"][myString]["name"];
			}
			else{
			
			}
			
			var canvas = document.getElementById("canvas");			
			var ctx = canvas.getContext("2d");	
			ctx.clearRect(0, 0,425,320);
			
			var DOMURL = self.URL || self.webkitURL || self;
			var img = new Image();
			var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
			var url = DOMURL.createObjectURL(svg);
			
			img.onload = function(){
				ctx.drawImage(img, 0, 0);
				var png = canvas.toDataURL("image/png");
				console.log(png);
				
				var modulo = (length - 1) % 3 ; 
				
				var  x = (modulo) * 300 + 50; 
				
				var y =  parseInt( (length -1)  / 3) * 400  + 50 ; 
				
				
				
				insightManager.doc.addImage(png,"JPEG",x,y,300,300);
				length = length - 1;
				insightManager.pdfGenerator(svgs,length,callback);
				DOMURL.revokeObjectURL(png);
			};
			img.src = url;
			
		}
		else{
			callback();
		}
	},
	customizeDashboard : function(json){
		console.log(json);
		for(var key in json){
			for(var id in json[key]){
				insightManager.currentActiveChannel = key;
				insightManager.moduleAppendAtDashboard(id,insightManager.currentActiveChannel);
				$($('#'+id).parent().parent()).remove();
			}
		}
	},
	moduleAppendAtDashboard : function(id,activeChannel){
		console.log(activeChannel);
		var activeTemp = "";
		var temp ;
		if(id in headingAndApiMapper[activeChannel]["sales"]){
			var headingName = headingAndApiMapper[activeChannel]["sales"][id]["name"];
			var url = headingAndApiMapper[activeChannel]["sales"][id]["api"];
			var chartType = headingAndApiMapper[activeChannel]["sales"][id]["chartType"];
			activeTemp = "sales";
		}
		else if(id in headingAndApiMapper[activeChannel]["digital"]){
			var headingName = headingAndApiMapper[activeChannel]["digital"][id]["name"];
			var url = headingAndApiMapper[activeChannel]["digital"][id]["api"];
			activeTemp = "digital";
			var chartType = headingAndApiMapper[activeChannel]["digital"][id]["chartType"];
			
		}
		else if(id in headingAndApiMapper[activeChannel]["promos"]){
			var headingName = headingAndApiMapper[activeChannel]["promos"][id]["name"];
			//var url = headingAndApiMapper[activeChannel]["promos"][id]["api"];
			activeTemp = "promos";
			var chartType = headingAndApiMapper[activeChannel]["promos"][id]["chartType"];
		}
		else if(id in headingAndApiMapper[activeChannel]["competitionAnalysis"]){
			var headingName = headingAndApiMapper["competitionAnalysis"][id];
			//var url = headingAndApiMapper[activeChannel]["competitionAnalysis"][id]["api"];
			activeTemp = "competitionAnalysis";
			//sessionStorage.arrayOfIds[id] =  "competitionAnalysis";
		}
		else{
			
		}
		
		if(insightManager.sessionStorageJson[activeChannel] === undefined){
			insightManager.sessionStorageJson[activeChannel] = {};
		}
		
		insightManager.sessionStorageJson[activeChannel][id] = {"activeTemp" : activeTemp};
		//insightManager.sessionStorageJson[id] = activeTemp;
		
		sessionStorage.setItem("jsonOfIds" , JSON.stringify(insightManager.sessionStorageJson));
		
		var salesTemp =  '<div class="box box-primary" draggable="true" ondragstart="insightManager.ondragstart(event)" >'+
		'<div class="box-header with-border">'+
		'<h3 class="box-title"> <i class="fa fa-shopping-cart"></i>'+ headingName +'</h3>';
		
		
		var digitalTemp =   '<div  class="box box-warning" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
		'<div class="box-header with-border">'+
		'<h3 class="box-title"> <i class="fa fa-lightbulb-o" ></i>'+ headingName +'</h3>';
		
		var promosTemp = 	'<div  class="box box-success" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
		'<div class="box-header with-border">'+
		'<h3 class="box-title"> <i class="fa fa-shopping-cart"></i>'+ headingName +'</h3>';
		
		var competitionAnalysisTemp =   '<div  class="box box-warning" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
		'<div class="box-header with-border">'+
		'<h3 class="box-title"> <i class="fa fa-lightbulb-o" ></i>'+ headingName +'</h3>';
		
		var commonTemp = '<div class="box-tools pull-right" id='+ id +'>'+
		'<button type="button" class="btn btn-box-tool" data-widget="remove"><button  class="btn btn-info btn-xs btn-toggle-left button-list-group left" > <i class="fa fa-line-chart"></i>'+
		'</button><button class="btn  btn-xs btn-toggle-right button-list-group right"> <i class="fa fa-list-ul"></i>'+
		'</button> <i class="fa fa-times delete"></i>'+
		'</button>'+
		'</div>'+
		'</div>'+
		'<div class="box-body ">'+
		'<div class="chart" id="chart_'+ id +'">'+	
		'</div>'+
		'<div class="list-outer-div" style="display : none" id="chart_list_' + id +'" >'+
		'<div   class="list-table"> </div>'+
		'</div>'	
		'</div><!-- /.box-body -->'+
		'</div>'; 
		
		if(activeTemp == "sales"){
			temp = salesTemp +  commonTemp;
			
			//$($("#" + activeChannel).find('.row')).append(temp);
			$($('#' +  activeChannel).find('.row')).append(temp);
			insightManager.hitApiForSales(url,1,id,chartType);
		}
		else if(activeTemp == "digital"){
			temp = digitalTemp +  commonTemp;
			$($('#' +  activeChannel).find('.row')).append(temp);
			insightManager.hitApiForDigital(url,1,id,chartType);
		}
		else if(activeTemp == "promos"){
			temp = promosTemp +  commonTemp;
			$($('#' +  activeChannel).find('.row')).append(temp);
			insightManager.drawPromosChart(id,chartType);
		}
		else{
			
		}
	},
	appendFullList :  function(container,id){
		//list 
		$(container).empty();
		var currentType = ""
		if(headingAndApiMapper[insightManager.currentActiveChannel]["sales"].hasOwnProperty(id)){
			currentType = "sales";
		}
		else if(headingAndApiMapper[insightManager.currentActiveChannel]["digital"].hasOwnProperty(id)){
			currentType = "digital";
		}
		else if(headingAndApiMapper[insightManager.currentActiveChannel]["promos"].hasOwnProperty(id)){
			currentType = "promos";
		}
		else if(headingAndApiMapper[insightManager.currentActiveChannel]["competitionAnalysis"].hasOwnProperty(id)){
			currentType = "competitionAnalysis";
		}
		else{
			
		}
		
		var headingKey = headingAndApiMapper[insightManager.currentActiveChannel][currentType][id]["string"];
		var totalVal = headingAndApiMapper[insightManager.currentActiveChannel][currentType][id]["value"];
		
		
		var tempList =  fullListMapperWithApi[insightManager.currentActiveChannel][id]; 
		var type = fullListMapperWithApi[insightManager.currentActiveChannel]["type"];
		var temp = "";
		
		console.log(fullListMapperWithApi[insightManager.currentActiveChannel][id]);
		
		for(var i = 0 ; i < tempList.length ; i++ ){
			temp += ' <div class="list-row"><div class="list-cell">'+fullListMapperWithApi[insightManager.currentActiveChannel][id][i][headingKey]+'</div><div class="list-cell">'+fullListMapperWithApi[insightManager.currentActiveChannel][id][i][totalVal]+'</div></div>';
		}
		
		console.log(temp);
		$(container).append(temp);
		//console.log($(container));
	},
	attachEventsWithTemplate : function(id){
		
	},
	getDataFromApi : function(url,groupId){
		
	},
	moduleRevertBack :  function(id){
		
		delete insightManager.sessionStorageJson[insightManager.currentActiveChannel][id];
		sessionStorage.setItem("jsonOfIds" , JSON.stringify(insightManager.sessionStorageJson));
		var headingName = "";
		var container ;
		if(id in headingAndApiMapper[insightManager.currentActiveChannel]["sales"]){
			headingName = headingAndApiMapper[insightManager.currentActiveChannel]["sales"][id]["name"]; 
			var midtemplate = '<img src="thum/digital9.jpg" id="'+id+'" alt="" >';
			container = $($('#' + insightManager.currentActiveChannel + ' .tabPanel').find('.sales'));
		}
		else if(id in headingAndApiMapper[insightManager.currentActiveChannel]["digital"]){
			headingName = headingAndApiMapper[insightManager.currentActiveChannel]["digital"][id]["name"]; 
			var imageName = headingAndApiMapper[insightManager.currentActiveChannel]["digital"][id]["chartType"];
			var midtemplate = '<img src="thum/' + imageName + '.jpg" id="'+id+'" alt="" >';
			container = $($('#' + insightManager.currentActiveChannel + ' .tabPanel').find('.digital'));
		}
		else if(id in headingAndApiMapper[insightManager.currentActiveChannel]["promos"]){
			headingName = headingAndApiMapper[insightManager.currentActiveChannel]["promos"][id]["name"];
			var imageName = headingAndApiMapper[insightManager.currentActiveChannel]["promos"][id]["chartType"];
			var midtemplate = '<img src="thum/' + imageName + '.jpg" id="'+id+'" alt="" >';
			container = $($('#' + insightManager.currentActiveChannel + ' .tabPanel').find('.promos'));
		}
		else if(id in headingAndApiMapper[insightManager.currentActiveChannel]["competitionAnalysis"]){
			headingName = headingAndApiMapper[insightManager.currentActiveChannel]["competitionAnalysis"][id]["name"] ;
			var midtemplate = '<img src="thum/competitionAnalysis.png" id="'+id+'" alt="" >';
			container = $($('#' + insightManager.currentActiveChannel + ' .tabPanel').find('.competitionAnalysis'));
		}
		else{
			
		}
		
		var firsttemplate = '<div class="chart-thum" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
		'<div class="thum-box">';
		
		var lasttemplate = '<h2 class="boxtitle">'+ headingName +'</h2> </div>'+
		'</div>';
		
		var template = firsttemplate + midtemplate + lasttemplate;
		container.append(template);
		
	},
	ondragstart :  function(event){
		console.log(event.target.id);
		event.dataTransfer.effectAllowed='move';
		event.dataTransfer.setData('id',event.target.id);
		insightManager.id = event.target.id;	
	},
	ondragover :  function(event){
		event.preventDefault();
	},
	ondrop:function(event){
		event.preventDefault();	
		event.stopPropagation();
		var id =  event.dataTransfer.getData('id');
		var tabPanel = $('.tabPanel').find('#'+insightManager.id);
		$($(tabPanel).parent().parent()).remove();
		insightManager.moduleAppendAtDashboard(id,insightManager.currentActiveChannel);
	},
	hitApiForSales : function(url,groupId,id,chartType){
		
		if(chartType == "sales1" || chartType == "sales2"){
			$.ajax({
				url: url,
				type: "GET",
				headers : {"groupId" : 1},
				contentType: "application/json; charset=utf-8",
				crossDomain: true,
				async:true,  
				success: function(data){
					var response  = JSON.parse(data);
					var array = response["data"];
					
					array.sort(function(a, b) {
						return parseFloat(b['saleValue']) - parseFloat(a['saleValue']);
					});
					
					console.log(array);
					
					insightManager.drawSalesChart(array,id,chartType);
					if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
						fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
					}
					fullListMapperWithApi[insightManager.currentActiveChannel][id] = array;
					fullListMapperWithApi[insightManager.currentActiveChannel]["type"] = "sales";
					
				},	
				error: function(){
					
				}
			});		
		}
		else{
			insightManager.drawSalesChart(array,id,chartType);			
		}
		
	},
	drawSalesChart : function(responseArray,id,chartType){
		switch(chartType){
			case "sales1" : {
				
				console.log(responseArray);
				//if(responseArray.length > 0){
				var data = {
					"rank":["01","02","03","04","05"],
					"icon":["img/logos/img1.png","img/logos/img9.png","img/logos/img6.png","img/logos/img5.png","img/logos/img6.png"],
					"name":[],
					"description":[],
					"innerCircleColor":["#d35454","#2d459b","#0289c9","#01a765","#e3e3e3"],
					"outerCircleColor" :"#dddee2"
				}	
				if(responseArray.length == 0){
					alert("no data available for this chart");	
				}
				else{
					
					if(responseArray.length > 5){
						var length = 5 ;
					}
					else{
						var length = responseArray.length;
					}
					for(var i = 0 ; i < length ; i++){
						data["name"].push(responseArray[i]["saleValue"].toString()); 
						data["description"].push(responseArray[i]["city"]);
					} 
					
					var textStyleConfg={"font-family":"arial","font-size":8,"background":"none","font-color":"white","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":14,"gridLineColor":"#353b37"};
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.rankWiseInformaticChartAnalysis(data);
				}
				break;
				
			}
			case "sales2" : {
				if(responseArray.length > 0){
					
					var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":8,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":8,"gridLineColor":"#353b37"};
					var data =
					{
						title : "Foreign Visitors Rate",
						barData: [{
							"yTick": "01 Step",
							"yData": 80,
							"color": "#FF0F00"
							}, {
							"yTick": "02 Step",
							"yData": 148,
							"color": "#FF6600"
							}, {
							"yTick": "03 Step",
							"yData": 121,
							"color": "#7FFFD4"
							}, {
							"yTick": "04 Step",
							"yData": 100,
							"color": "#FCD202"
							}, {
							"yTick": "05 Step",
							"yData": 180,
							"color": "#F8FF01"
						}],
						commonColor : "#ffffff", 
						upperEclipsColor : "gray",
						xAxisLabel : "Country",
						yAxisLabel :"Visit(in Millons)",
						upperPathHeight : 28,
						cylinderHeight : 350,
						"imagesArray" :["img/logos/img5.png","img/logos/img1.png","img/logos/img3.png","img/logos/img6.png","img/logos/img7.png"],
						"lowerTextDes" :[],
						unit : "%"  
					};
					if(responseArray.length > 5){
						var length = 5 ;
					}
					else{
						var length = responseArray.length;
					}
					console.log(responseArray);
					for(var i =0 ; i < length ;  i++){
						data.barData[i]['yTick'] =  responseArray[length -1 -i]['skuId'];
						data.barData[i]['yData'] =  responseArray[length - 1 -i]['saleValue'];
						data['lowerTextDes'].push(responseArray[length - 1 -i]['saleDate']);
					}
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.threeDShutterStackAnalysis(data);	
					
				}
				else{
					alert("no data available for chart");	
				}
			}
			case "sales3" :{
				
			}
			case "sales4" :{
				
			}
			case "sales5" :{
				
			}
			case "sales6" :{
				
			} 
			/*
				var data = 
				{
				"rank":["01","02","03","04","05"],
				"icon":["img/logos/img1.png","img/logos/img9.png","img/logos/img6.png","img/logos/img5.png","img/logos/img7.png"],
				"yAxisData":[65,78,90,64,50],
				"title": ["product abc","product abc","product abc","product abc","product abc"],
				"description":["product infographics design for products according to brand","product infographics design","product infographics design","product infographics design","product infographics design"],
				"color":["#d5be8c","#fce9a7","#8dceb6","#f26748","#757547","#503721"],
				"backColor":"#fffceb",
				"unit" : ""
				}
				var textStyleConfg={"font-description":8,"font-size-heading":16,"font-color-heading":"white","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicBarChartAnalysis(data);
				
				}
				/*
				
			*/
			/*
				var data = 
				{
				"rank" : ["01","02","03","04","05"],
				"icon" : ["img/logo_colored/img1.png","img/logo_colored/img9.png","img/logo_colored/img6.png","img/logo_colored/img5.png","img/logo_colored/img7.png"],
				"yAxisData" : [35,50,70,90,100],
				"title" : ["product abc","product abc","product abc","product abc","product abc"],
				"description" : ["product infographics design for products according to brand","product infographics design","product infographics design","product infographics design","product infographics design"],
				"color" : ["#f3aa1f","#cb1b6e","#7e3d97","#318dcc","#3dbfb7","#503721"],
				"backColor" :"#d1cfd0",//
				"pieBackColor" : "#503721",
				"innerArcColor" : "#fce9a7",
				
				}
				var textStyleConfg={"font-description":8,"font-size-heading":20,"font-color-heading":"white","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
			stocChart55.infographicBartWithPieChartAnalysis(data);*/
			/*var data = 
				{
				"rank" : ["01","02","03","04","05"],
				"icon" : ["img/logo_colored/img1.png","img/logo_colored/img9.png","img/logo_colored/img6.png","img/logo_colored/img5.png","img/logo_colored/img7.png"],
				"title" : ["product abc","product abc","product abc","product abc","product abc"],
				"description" : ["product infographics design for products according to brand","product infographics design","product infographics design","product infographics design","product infographics design"],
				"bulbImage" :"img/logo_colored/bulb.png",
				"cylinderColor" : "#c9c9c7",
				"pathColor" : "#FFFFFF",
				"unit" : "%"
				}
				
				var textStyleConfg={"font-description":8,"font-size-heading":12,"font-color-heading":"black","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
			stocChart55.infographicRankStandAnalysis(data);*/
			
			
		}
	},
	hitApiForDigital : function(url,groupId,id,chartType){
		if(chartType == "digital1" || chartType == "digital2" || chartType == "digital3"){
			$.ajax({
				url: url,
				type: "GET",
				headers : {"groupId" : 5},
				contentType: "application/json; charset=utf-8",
				crossDomain: true,
				async:true,  
				success: function(data){
					console.log(data);
					var responseArray = [];
					for(var i = 0 ;  i < data.length ; i++){
						if(data[i]["channel_name"] == insightManager.currentActiveChannel){
							responseArray.push(data[i]);
						}
					}
					responseArray.sort(function(a, b) {
						return parseFloat(b['total']) - parseFloat(a['total']);
					});
					insightManager.drawDigitalChart(responseArray,id,chartType);
					if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
						fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
					}
					fullListMapperWithApi[insightManager.currentActiveChannel][id] = responseArray;
					fullListMapperWithApi[insightManager.currentActiveChannel]["type"] = "digital";
				},
				error: function(){
					
				}
			});
		}
		else{
			insightManager.drawDigitalChart("",id,chartType);			
		}
		
	},
	drawDigitalChart : function(responseArray,id,chartType){
		switch(chartType){
			case "digital1": {
				console.log(responseArray);
				var data = 
				{
					"rank" : ["01","02","03","04","05"],
					"icon" : ["img/logo_colored/img1.png","img/logo_colored/img9.png","img/logo_colored/img6.png","img/logo_colored/img5.png","img/logo_colored/img7.png"],
					"yAxisData" : [],
					"title" : [],
					"description" : [],
					"color" : ["#f3aa1f","#cb1b6e","#7e3d97","#318dcc","#3dbfb7","#503721"],
					"backColor" :"#d1cfd0",//
					"pieBackColor" : "#503721",
					"innerArcColor" : "#fce9a7",
					
				}
				if(responseArray.length > 5){
					var length = 5 ;
				}
				else{
					var length = responseArray.length;
				}
				for(var i =0 ; i < length ;  i++){
					data['yAxisData'].push(responseArray[i]['total']);
					data['title'].push("");
					data['description'].push(responseArray[i]['categoryid']);
				}
				
				
				var textStyleConfg={"font-description":8,"font-size-heading":20,"font-color-heading":"black","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"black","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicBartWithPieChartAnalysis(data);
				break;
				
			}	
			case "digital2" : {
				
				var data = {
					title : "Product Sale(Brand wise)",
					xAxisLabel :"Current Status",
					yAxisLabel :"Product",
					yAxisData : [],
					key: [
						{
							name: '',
							data: [],
							color : "#7FFFD4"
						}
					]
				}  
				
				if(responseArray.length > 5){
					var length = 5 ;
				}
				else{
					var length = responseArray.length;
				}
				
				for(var i =0 ; i < length ;  i++){
					data['yAxisData'].push(responseArray[length - 1 - i]['productbrand']);//tempList[i]['SKU-ID'];
					data.key[0]['data'].push(responseArray[length - 1 - i]['total']);
				}
				
				
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.horizontalStackedBarChartAnalysis(data);
				break;
			}
			case "digital3" : {
				console.log(responseArray);
				
				var data = {
					"yAxisData" : [],
					"lowerColorArray":["#1ab977","#ee1d79","#7FFFD4","#f1b02e","#fe0000"],
					"upperColor":"#e6e6e6",
					"imagesArray" :["img/logos/img5.png","img/logos/img1.png","img/logos/img3.png","img/logos/img6.png","img/logos/img7.png"],
					"threeDPathColor":"#f7fbf4",
					"xAxisData" : [],
					"unit" : ""
				}
				
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":8,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
				
				if(responseArray.length > 5){
					var length = 5 ;
				}
				else{
					var length = responseArray.length;
				}
				for(var i =0 ; i < length ;  i++){
					data['yAxisData'].push(responseArray[length - 1 -i]['total']);
					data['xAxisData'].push(responseArray[length - 1 -i]['brandbypim']);
				}
				
				var stocChart43=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart43.threeDRoundedBarChartAnalysis(data);
				break;	
			}
			case "digital4" : {
				var data= {
					dountKey :['Kurkure','7UP','Mountain Dew'],
					dountData : [12000,8850,10000],
					label : 'Cost',
					colorArray : ['#e67a77','#95d7bb','#aec785'],
					unit : "%",
					factor :"% Share"
					
				};
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"black","font-weight":400,"xLabelColor":"black","yLabelColor":"black","chartTitleColor":"black","gridLineColor":"#353b37"};
				var stocChart49=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart49.threeDPieChartWithLegendAnalysis(data);
				break;
			}
			case "digital5" : {
				var data = 
				{
					"rank" : ["03","02","01"],
					"icon" : ["img/logo_colored/img9.png","img/logo_colored/img4.png","img/logo_colored/img2.png"],
					"title" : ["Rank 15","Rank 12","Rank 10"],
					"description" : ["Gatorade","Kurkure","Pepsi"],
					"bulbImage" :"img/logo_colored/bulb.png",
					"cylinderColor" : "#c9c9c7",
					"pathColor" : "#FFFFFF",
					"unit" : "%"
				}
				
				var textStyleConfg={"font-description":10,"font-size-heading":12,"font-color-heading":"black","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicRankStandAnalysis(data);
				break;
			}
			case "digital6" : {
				
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":12,"gridLineColor":"#353b37"};
				var data =
				{
					title : "",
					barData: [{
						"yTick": "III",
						"yData": 35,	
						"color": "#FF0F00"
						}, {
						"yTick": "II",
						"yData": 32,
						"color": "#FF6600"
						}, {
						"yTick": "I",
						"yData": 30,
						"color": "#7FFFD4"
					}
					],
					commonColor : "#ffffff", 
					upperEclipsColor : "gray",
					xAxisLabel : "Country",
					yAxisLabel :"Visit(in Millons)",
					upperPathHeight : 30,
					cylinderHeight : 450,
					"imagesArray" :["img/logos/img2.png","img/logo_colored/coke.png","img/logo_colored/thumsUp.png"],
					"lowerTextDes" :["500ml","500ml","500ml"],
					unit : "%"  
				};
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.threeDShutterStackAnalysis(data);	
				break;	
			}
			case "digital7" : {
				var gaugeChartData =  {
					"data" :[{"totalValue":100,"valAchieve":40.34}],
					"colorArray" : ["#a70328","#c1e0f7"],
					"toolTipMsg":"",
					"meterLabel" : ["Min","Max"]
				}
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"#a7a7a7","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"}; 
				var stockChart15=$("#chart_" + id).stocCharts(textStyleConfg);
				stockChart15.gaugeGraph(gaugeChartData);
				break;
			}
			case "digital8" : {
				var data = 
				{
					dountData : [65,35],
					dountKey : ["Other than Pepsi Products","Pepsi Products"],
					colorArray : ['#a7a7a7','#95d7bb'],
					unit : "%",
					factor :"Students"
				}
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"black","font-weight":400,"xLabelColor":"black","yLabelColor":"black","chartTitleColor":"black","gridLineColor":"#353b37"};
				var stocChart49=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart49.threeDDountChartWithLegendAnalysis(data);
				break;
			}
			case "digital9" :{
				var data = {
					
					"rank":["01","02","03","04","05"],
					"icon":["img/logos/img1.png","img/logos/img9.png","img/logos/img6.png","img/logos/img5.png","img/logos/img4.png"],
					"name":["9","7","6","4","2"],
					"description":["7UP","Mountain Dew","Lays","Lipton","Kurkure"],
					"innerCircleColor":["#d35454","#2d459b","#0289c9","#01a765","#503721"],
					"outerCircleColor" :"#dddee2"
				}
				var textStyleConfg={"font-family":"arial","font-size":12,"background":"none","font-color":"white","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":14,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.rankWiseInformaticChartAnalysis(data);
				break;
			}
		}		
	},
	drawPromosChart : function(id,chartType){
		switch(chartType){
			case "promos1" :{
				var gaugeChartData =  {
					"data" :[{"totalValue":100,"valAchieve":40.34}],
					"colorArray" : ["#a70328","#c1e0f7"],
					"toolTipMsg":"speed",
					"meterLabel" : ["Min","Max"]
				}
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"#a7a7a7","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"}; 
				var stockChart15=$("#chart_" + id).stocCharts(textStyleConfg);
				stockChart15.gaugeGraph(gaugeChartData);
				break;
			}
			case "promos2":{
				var data = {
					"key" : 3,
					"color" : "#ef2f1a"
				}
				
				var textStyleConfg={"font-description":8,"font-size-heading":12,"font-color-heading":"black","font-family":"arial","font-size":30,"background":"none","font-color":"white","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicTrianglePathAnalysis(data);
				break;
			}
			case "promos3" : {
				var data = 
				{
					"rank":["01","02","03","04","05"],
					"icon":["img/logos/img1.png","img/logos/img9.png","img/logos/img6.png","img/logos/img5.png","img/logos/img7.png"],
					"yAxisData":[65,78,90,64,50],
					"title": ["product abc","product abc","product abc","product abc","product abc"],
					"description":["product infographics design for products according to brand","product infographics design","product infographics design","product infographics design","product infographics design"],
					"color":["#d5be8c","#fce9a7","#8dceb6","#f26748","#757547","#503721"],
					"backColor":"#fffceb",
					"unit" : ""
				}
				var textStyleConfg={"font-description":8,"font-size-heading":16,"font-color-heading":"white","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicBarChartAnalysis(data);
				break;
			}
			case "promos4" : {
				var data =  {
					title : "Last Year Data , Estimated v/s Actual Profit",
					titleColor : "gray",
					yAxisLabel : "Profit",
					yAxisUnit : "Million",
					yAxisEstimateData : [300,390,300,270,200,230,180],
					yAxisEstimateDataUnit : 'Estimated',
					yAxisActualData : [330,450,320,250,230,270,140],
					yAxisActualDataUnit : 'Actual',
					xAxisLabel : "Years",
					xAxisData : [2008,2009,2010,2011,2012,2013,2014]
				}
				
				var cnfg={"data":data};
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":15,"gridLineColor":"#353b37"};
				var stocChart37=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart37.comparisonAnalysis(cnfg);	
				break;
			}
			case "promos5" : {
				var data = {
					title : "Last 15 day's temperature readings",
					titleColor : "gray",
					yAxisUnit : "\u00B0"+"C",
					yAxisLabel : "Temperature",
					yAxisData : [28,55,42,65,20,35],
					xAxisLabel : "Month",
					xAxisData : ["Mirinda","pepsi","Kurkure","7UP","Duke","Mtn Dew"]
				}
				
				var cnfg={"data":data};
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
				var stocChart36=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart36.musicSpikesAnalysis(cnfg);
				break;
			}
			case "promos6" : {
				
				var data = {
					title : "Product Sale(Brand wise)",
					xAxisLabel :"Brand",
					yAxisLabel :"Product sale",
					xAxisData : ["Pepsi","Mirinda","Mountain Dew","Kurkure","Lipton"],
					yAxisData : [50, 30, 40, 37, 20],
					color :["#00FFFF"]
					
				}  
				
				var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.simpleBarChartAnalysis(data);
				break;
			}
		}
		
		
	},
	drawCompetitionAnalysisChart : function(id){
		
		var tempList = insightManager.salesChartArray;
		
		var data = {
			title : "Product Sale(Brand wise)",
			xAxisLabel :"Brand",
			yAxisLabel :"Product sale",
			xAxisData : [],
			yAxisData : [],
			color :["#00FFFF"]
			
		}  
		
		var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
		
		var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
		stocChart55.simpleBarChartAnalysis(data);
	},
	
};


var headingAndApiMapper  =  {
	"amazon" : {
		"digital" : {
			"dp0":{"name" : "products not listed" , "api" : "http://52.6.40.198/insight/api/product/count/not-listed","chartType":"digital1","value":"total","string":"categoryid" },
			"dp1": {"name" : "products listed" , "api" : "http://52.6.40.198/insight/api/product/count/listed","chartType":"digital2" ,"value":"total","string":"productbrand"},
			"dp2":{"name" : "out of stock products" , "api" : "http://52.6.40.198/insight/api/product/count/oos","chartType":"digital3","value":"total","string":"brandbypim"},
			"dp3": {"name" :"% of products with no rating, < 3 rating and >3" , "chartType" : "digital4"},
			"dp4": {"name" :"First rank of pepsi product" , "chartType" : "digital5"},
			"dp5": {"name" :"Competition Products with prices lower than PepsiCo products" , "chartType" : "digital6"},
			"dp6": {"name" :"% of products with content mismatch on a channel" , "chartType" : "digital7"},
			"dp7": {"name" :"Share of space of competition vs pepsi in a category on a channel" , "chartType" : "digital8"},
			"dp8": {"name" :"Best sellers which recently went out of stock on Amazon" , "chartType" : "digital9"}
		},
		"sales" : {
			"s0":{"name" : "products Wise Sales Info" , "api" : "http://192.168.1.21:8080/IDB2SQL2/app/sale/product/getSaleInfo","chartType":"sales1","value":"saleValue","string":"city"},
			"s1": {"name": "brand Wise Sales Info" , "api" : "http://192.168.1.21:8080/IDB2SQL2/app/sale/brand/getSaleInfo","chartType":"sales2","value":"saleValue","string":"productEAN"},
			"s2" : {"name" : "Top performer products, channel wise, brand wise, city wise"},
			"s3" : {"name" : "Worst performer products, channel wise, brand wise, city wise"},
			"s4" : {"name" : "Top and worst performer brands, channel wise, city wise"},
			"s5" : {"name" : "% share of sales"}
		},
		"promos" : {
			"p0" : {"name" : "Tracking accuracy of a promotion","chartType" : "promos1" },
			"p1" : {"name" : "Out of Stock Products under a promotion","chartType" : "promos2" },
			"p2" : {"name" : "Products with price higher than a competition in a promotion","chartType" : "promos3" },
			"p3" : {"name" : "Promotions run by competition, brand wise, city wise, channel wise","chartType" : "promos4" },
			"p4" : {"name" : "scope of increasing/decreasing the product prices","chartType" : "promos5" },
			"p5" : {"name" : "Number of active promotions on a channel, brand wise, city wise","chartType" : "promos6" }
		},
		"competitionAnalysis":{
			"ca0"  : "default competitionAnalysis",
			"ca1" : "competitionAnalysis 1",
			"ca2" : "competitionAnalysis 2",
			"ca3"  :  "competitionAnalysis 3"
		}		
	},
	"basket" : {
		"digital" : {
			"dp0":{"name" : "products not listed" , "api" : "http://52.6.40.198/insight/api/product/count/not-listed","chartType":"digital1","value":"total","string":"categoryid" },
			"dp1": {"name" : "products listed" , "api" : "http://52.6.40.198/insight/api/product/count/listed","chartType":"digital2" ,"value":"total","string":"productbrand"},
			"dp2":{"name" : "out of stock products" , "api" : "http://52.6.40.198/insight/api/product/count/oos","chartType":"digital3","value":"total","string":"brandbypim"}
		},
		"sales" : {
			"s0":{"name" : "products Wise Sales Info" , "api" : "http://192.168.1.21:8080/IDB2SQL2/app/sale/product/getSaleInfo","chartType":"sales1","value":"saleValue","string":"productEAN"},
			"s1": {"name": "brand Wise Sales Info" , "api" : "http://192.168.1.21:8080/IDB2SQL2/app/sale/brand/getSaleInfo","chartType":"sales2","value":"saleValue","string":"productEAN"}
		},
		"promos" : {
			"p0" : "default Promos",
			"p1" : "promo 1",
			"p2"  : "promo 2",
			"p3" : "promo 3"	
		},
		"competitionAnalysis":{
			"ca0"  : "default competitionAnalysis",
			"ca1" : "competitionAnalysis 1",
			"ca2" : "competitionAnalysis 2",
			"ca3"  :  "competitionAnalysis 3"
		}		
	},
	"banya" : {
		"digital" : {
			"dp0":{"name" : "products not listed" , "api" : "http://52.6.40.198/insight/api/product/count/not-listed","chartType":"digital1","value":"total","string":"categoryid" },
			"dp1": {"name" : "products listed" , "api" : "http://52.6.40.198/insight/api/product/count/listed","chartType":"digital2" ,"value":"total","string":"productbrand"},
			"dp2":{"name" : "out of stock products" , "api" : "http://52.6.40.198/insight/api/product/count/oos","chartType":"digital3","value":"total","string":"brandbypim"}
		},
		"sales" : {
			"s0":{"name" : "products Wise Sales Info" , "api" : "http://192.168.1.21:8080/IDB2SQL2/app/sale/product/getSaleInfo","chartType":"sales1","value":"saleValue","string":"productEAN"},
			"s1": {"name": "brand Wise Sales Info" , "api" : "http://192.168.1.21:8080/IDB2SQL2/app/sale/brand/getSaleInfo","chartType":"sales2","value":"saleValue","string":"productEAN"}
		},
		"promos" : {
			"p0" : "default Promos",
			"p1" : "promo 1",
			"p2"  : "promo 2",
			"p3" : "promo 3"	
		},
		"competitionAnalysis":{
			"ca0"  : "default competitionAnalysis",
			"ca1" : "competitionAnalysis 1",
			"ca2" : "competitionAnalysis 2",
			"ca3"  :  "competitionAnalysis 3"
		}		
	}
};

var fullListMapperWithApi = {
	"amazon" : {
		"dp3" : {
			
		},
		"dp4" : {
			
		},
		"dp5" : {
			
		},
		"dp6" : {
			
		},
		"dp7" : {
			
		},
		"dp8" : {
			
		},
	}
};

window.onload =  function(){
	insightManager.init();	
	
	
}													