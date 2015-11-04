var insightManager = {
	hostname : "",
	previousChannel : "",
	hostnameDigital : "",
	groupId : "",
	noDataAvailable : "<img src='img/noDataAvailable.png'/>",
	totalSalesPerChannelJson : {},
	metaData : [],
	id : "",
	elements : [],
	salesChartArray : [],
	sessionStorageJson : {},
	currentActiveChannel : "",
	currentMonth  : {"competition" :{"month" : "" , "year" : ""} , "basket" : {"month" : "" , "year" : ""} , "amazon" : {"month" : "" , "year" : ""} , "banya" : {"month" : "" , "year" : ""}},
	currentYear   : {},
	doc : new jsPDF('p','pt', [1200,8000]),
	hitApiForSession : function(){
		/*
			$.ajax({
			url: "http://52.6.40.198/IDB2SQL2/app/session/sessionvalidate",
			type: "GET",
			headers : {"groupId" : 1},
			contentType: "application/json; charset=utf-8",
			crossDomain: true,
			async:true, 
			statusCode : {
			401 :function(){
			alert('please login into');
			} 
			},
			success: function(data){
			console.log("in success");
			insightManager.init();
			},
			error: function(data, status, xhr){
			console.log("in error");
			console.log(status);
			console.log(data);
			console.log(xhr);
			}
			});
		*/
		insightManager.init();
	},
	setTotalSalesvalue : function(){
		var api = "/app/sale/channel/getTotalSaleInfo";  
		var url = insightManager.hostname + api;
		$.ajax({
			url: url,
			method: "GET",
			headers : {"groupId" : insightManager.groupId},
			data : {"sortorder" :  "desc" , "month" : insightManager.currentMonth , "year" : insightManager.currentYear},
			contentType: "application/json; charset=utf-8",
			crossDomain: true,
			async:true,  
			success: function(data){
				
				var response  = JSON.parse(data);
				var array = response["data"];
				var totalVal = 0;
				
				console.log(array);
				
				for(var i=0; i <array.length ; i++){
					//console.log(array[i]["saleValue"]);
					insightManager.totalSalesPerChannelJson[channelIdMapping[array[i]["channelCode"]]] = parseFloat(array[i]["saleValue"]);
					totalVal += parseFloat(array[i]["saleValue"]); 		
				}
				insightManager.totalSalesPerChannelJson["competition"] = parseFloat(totalVal);
				//alert(totalVal);
				$('#totalSales').append(" ");
				//$('#totalSales').append(totalVal);
				
				insightManager.interpolateTotalSalesValue(totalVal);
			},	
			error: function(){
				
			}
		});
	},
	init : function(){	
		
		insightManager.groupId = 5;
		insightManager.bindEvents();
		insightManager.currentActiveChannel = "competition";
		insightManager.previousChannel = "competition";
		insightManager.hostname = "http://52.6.40.198/IDB2SQL2";
		insightManager.hostnameDigital = "http://52.6.40.198"
		var protocol = window.location.protocol;
		var location = window.location.host;		
		
		//insightManager.hostnameDigital = protocol + "//" + location;
		//insightManager.hostname = protocol + "//" + location + "/IDB2SQL2";	
		insightManager.setTotalSalesvalue();
		
		insightManager.metaData.push("brand","city");
		
		if(sessionStorage.getItem('jsonOfIds') === null || sessionStorage.getItem('jsonOfIds') === undefined){
			$($('#' + insightManager.currentActiveChannel ).find('#addAll')).trigger('click');
		}
		else{
			//console.log(Object.keys(JSON.parse(sessionStorage.getItem('jsonOfIds'))).length);
			if(Object.keys(JSON.parse(sessionStorage.getItem('jsonOfIds'))).length < 1 ){
				//console.log("no item in session storage");
			}
			else{
				//console.log("items in session storage");
				insightManager.sessionStorageJson = JSON.parse(sessionStorage.getItem('jsonOfIds'));
				//console.log(insightManager.sessionStorageJson);
				if(insightManager.sessionStorageJson.hasOwnProperty(insightManager.currentActiveChannel)){
					for(var key in insightManager.sessionStorageJson){
						insightManager.sessionStorageJson[key]["rendered"] = false;		
					} 
					insightManager.customizeDashboard(insightManager.sessionStorageJson,insightManager.currentActiveChannel);			
				}
				
			}	
		}
	},	
	interpolateTotalSalesValue : function(value){
		
		$($(document).find('.txt').parent()).remove();
		console.log(value);
		
		var start_val = 0,
		duration = 4000,
		
		end_val = [];
		end_val.push(value);
		
		var qSVG = d3.select("#totalSales").append("svg").attr("width", 100).attr("height", 20);
		
		qSVG.selectAll(".txt")
		.data(end_val)
		.enter()
		.append("text")
		.text(start_val)
		.attr("class", "txt")
		.attr("x", 5)
		.attr('fill','white')
		.attr('font-family','swis721_ltex_btlight')
		.attr('font-size','15px')
		.attr("y", function(d, i) {
			return 18;//50 + i * 30
		})
		.transition()
		.duration(3000)
        .tween("text", function(d) {
            var i = d3.interpolate(this.textContent, d),
			prec = (d + "").split("."),
			round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
			
            return function(t) {
                this.textContent = Math.round(i(t) * round) / round;
			};
		});
	},
	changeDate : function(){
		var val = $('#dtp').val();
		
		var month = val.substring(0,3);
		var year  = val.substring(4,val.length);
		
		console.log("month	" + month)
		console.log("year	" + year)
		
		insightManager.currentMonth = month;
		insightManager.currentYear = year;
		
	},
	bindEvents :  function(){
		
		$('#saveAsPDF').on('click',function(){
			
			var svgs = $('#' + insightManager.currentActiveChannel +' .row').find('svg');
			
			var length = svgs.length;
			//console.log(length);
			insightManager.pdfGenerator(svgs,length,function(){
				insightManager.doc.save(insightManager.currentActiveChannel + '.pdf');
			});
			
		});
		
		/*
			$('#dtp').on('change', function(){
			//console.log('sasa');
			var val = $('#month').val();
			
			var month = val.substring(0,3);
			var year  = val.substring(4,val.length);
			
			console.log("month	" + month)
			console.log("year	" + year)
			
			insightManager.currentMonth = month;
			insightManager.currentYear = year;
			
			});
		*/
		/*
			$(document).on('mousedown','.optionsList',function(){
			if(this.options.length > 5){
			$(this).attr("size",5);
			}
			$(this).css('background-image','none');
			
			});
		*/
		/*
			$(document).on('blur','.optionsList',function(){
			$(this).attr("size",0);
			$(this).css('background-image','url("img/drop-down-arrow.png")');
			});
		*/
		
		
		$(document).on('change','.optionsList',function(){
			
			//$(this).attr("size",0);
			//$(this).css('background-image','url("img/drop-down-arrow.png")');
			
			
			var id = $(this).attr('id');
			var value = $(this).val();
			var parameters  = {}; 
			var chartId = id.replace("options_" , "");
			var url = "";
			var chartType = "";
			//alert(chartId);
			if(headingAndApiMapper[insightManager.currentActiveChannel]["sales"].hasOwnProperty(chartId)){
				parameters["sortorder"] = headingAndApiMapper[insightManager.currentActiveChannel]["sales"][chartId]["sortorder"]; 
				parameters["channelid"] = headingAndApiMapper[insightManager.currentActiveChannel]["sales"][chartId]["channelid"]; 
				url = insightManager.hostname + headingAndApiMapper[insightManager.currentActiveChannel]["sales"][chartId]["api"];
				chartType = headingAndApiMapper[insightManager.currentActiveChannel]["sales"][chartId]["chartType"]; 
				//alert(url);
				//chartType = "sales";
			}
			if(chartType == "sales2" || chartType == "sales8"){
				var type = "brand";
			}
			else{
				var type = "city";
			}
			
			
			$("#chart_"+chartId).empty();
			
			insightManager.hitSpecialBrandOptionsApi(url,chartId,chartType,parameters,type,value);
			
			
		});
		
		$(document).on('click','.tab-content img',function(){
			var id = $(this).attr('id');
			insightManager.moduleAppendAtDashboard(id,insightManager.currentActiveChannel);
			$($(this).parent().parent()).remove();
		});
		
		$(document).on('click','.delete',function(){
			var id = $($(this).parent()).attr('id');
			insightManager.moduleRevertBack(id);
			//console.log($($(this).parent().parent().parent()).remove());
			$($(this).parent().parent().parent()).remove();
		});
		
		
		$(document).on('click','.right',function(){
			$(this).siblings().removeClass('btn-info')
			$(this).addClass('btn-info');
			var id = $($(this).parent()).attr('id');
			
			if($(this).parent().parent().siblings('.b-custom-select_mod')){
				$(this).parent().parent().siblings('.b-custom-select_mod').css('display','none');	
			}
			else{
				
			}
			
			$($(document).find('#chart_' + id )).css('display','none');
			
			
			$($(document).find("#chart_list_" + id )).css('display','block');
			//console.log($(this).parent());
			var container = $($('#chart_list_' + id ).find('.list-table'));
			insightManager.appendFullList(container,id);		
		});
		
		$(document).on('click','.left',function(){
			$(this).siblings().removeClass('btn-info')
			$(this).addClass('btn-info');
			if($(this).parent().parent().siblings('.b-custom-select_mod')){
				////console.log('sanchit');
				$(this).parent().parent().siblings('.b-custom-select_mod').css('display','block');	
			}
			else{
				
			}
			
			var id = $($(this).parent()).attr('id');			
			//console.log(id)
			$($(document).find("#chart_list_" + id )).css('display','none');
			$($(document).find('#chart_' + id )).css('display','block');
		});
		
		
		$(document).on('click','.top-nav li a',function(e) {
			e.preventDefault();
			
			var $target = $(this).attr('data');
			$('a').removeClass('active');
			$(this).addClass('active');
			
			$('#' + insightManager.previousChannel).find('.row').empty();
			$('#' + insightManager.previousChannel).css('display','none');
			//$($(".show-data").find('.row')).remove();
			//$(".show-data").css('display','none');
			
			
			
			setTimeout(function(){	
				$('#' + $target).css('display','block'); 		
				insightManager.currentActiveChannel = $target;
				insightManager.previousChannel =  insightManager.currentActiveChannel;
				insightManager.interpolateTotalSalesValue(insightManager.totalSalesPerChannelJson[$target]);
				if(insightManager.sessionStorageJson.hasOwnProperty($target)){
					insightManager.customizeDashboard(insightManager.sessionStorageJson,insightManager.currentActiveChannel);		
				}
				else{
					insightManager.sessionStorageJson[$target] = {};
					insightManager.sessionStorageJson[$target]["rendered"] = false;
					$($('#' + insightManager.currentActiveChannel ).find('#addAll')).trigger('click');
				}
				
			},0);
			
		});
		
		$('.btn-slide').on('click',function(){
			//alert('clicked');
			$(".btn-slide").toggleClass("click");
			$(".tabPanel").toggleClass("active");
			$(".arrow").toggleClass('fa-angle-double-right','fa-angle-double-left');		
		});
		
		$('.nav-toggle').on('click',function(){
			//alert('clicked');
			$(".top-nav").toggleClass("display-nav");
		});
		
		$(document).on('click','#addAll',function(){
			
			var json = {};
			//console.log('sanchit');
			var parent = $(this).parent().parent();
			var id = $($($(parent).find('.nav')).find('.active')).attr("id");
			//console.log(id);
			var length = $($($(parent).find('.tab-content .' + id)).find('img')).length;
			//console.log(length);
			for(var i = 0 ; i < length ; i++){
				if(json[insightManager.currentActiveChannel] === undefined ){
					json[insightManager.currentActiveChannel] = {};
				}
				var imgId = $($($('#' + insightManager.currentActiveChannel).find('.tab-content .' + id)).find('img')[i]).attr('id');
				//console.log(imgId);
				json[insightManager.currentActiveChannel][imgId] = {"activeTemp" : id };
			}
			json[insightManager.currentActiveChannel]["rendered"] = false;
			//console.log(json);
			insightManager.customizeDashboard(json,insightManager.currentActiveChannel);
		});
		
		$('#deleteAll').on('click',function(){
			console.log('delete all triggerd');
			var chartsDivArray = $($('#' + insightManager.currentActiveChannel).find('.row')).find('.chart');
			for(var i = 0 ; i < chartsDivArray.length ; i++){
				var chartId = $(chartsDivArray[i]).attr('id');
				id = chartId.replace("chart_","");
				console.log(id);
				insightManager.moduleRevertBack(id);
				//$(id).parent().parent().empty();
				$('#'+chartId).parent().parent().remove();
			}
			
		});
		
		/*
			$("#importFile").on('change',function(e){
			
			var nameArr	= e.target.files.item(0).name.split(/[\s.]+/);			
			var json = {};
			var reader = new FileReader();
			var name = e.target.files.item(0).name;
			////console.log("name	" + name);
			reader.onload = function(evt) {
			// //console.log(" e : " + e);
			var data = evt.target.result;
			// //console.log("data	: " + (data));
			//var xlsx = XLSX.read(data, {type: 'binary'});
			var arr = String.fromCharCode.apply(null, new Uint8Array(data));
			var xlsx = XLSX.read(btoa(arr), {type: 'base64'});
			process_xlsx(xlsx,function(jsonval){
			//console.log(jsonval);
			for(var j=0;j<jsonval['Amazon'].length;j++){
			////console.log(jsonval['Amazon'][j]);
			insightManager.salesChartArray.push(jsonval['Amazon'][j]);
			
			}
			
			//console.log("done");
			
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
			////console.log(rObjArr);
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
		
		if(length > 0){
			var svgString = new XMLSerializer().serializeToString(svgs[length - 1]);
			
			var myString = $(svgs[length-1]).attr('id');
			if(myString !=  undefined){
				//console.log(length);
				//console.log($(svgs[length-1]));
				//console.log(myString);
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
					////console.log(png);
					
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
				length =  length-1;
				insightManager.pdfGenerator(svgs, length ,callback);
			}
			
			
		}
		else{
			callback();
		}
		
	},
	customizeDashboard : function(json,key){
		//for(var key in json){
		if(json[key]["rendered"]){
			
		}
		else{
			//json[key]["rendered"]  = true; 
			for(var id in json[key]){
				if(id == "rendered"){
					
				}
				else{
					insightManager.currentActiveChannel = key;
					insightManager.moduleAppendAtDashboard(id,insightManager.currentActiveChannel);	
					$('#'+key + ' .chart-thum').find('#' + id).parent().parent().remove();	
				}
			}	
		}			
	},
	moduleAppendAtDashboard : function(id,activeChannel){
		//alert("activeChannel  :	" + activeChannel);
		var activeTemp = "";
		var temp ;
		var url = "";
		var parameters = {};
		//console.log(id);
		if(id in headingAndApiMapper[activeChannel]["sales"]){
			
			var headingName = headingAndApiMapper[activeChannel]["sales"][id]["name"];
			
			var chartType = headingAndApiMapper[activeChannel]["sales"][id]["chartType"];
			if(activeChannel == "competition"){
				if(chartType == "sales2" || chartType == "sales1"){
					
				}	
				else{
					if(headingAndApiMapper[activeChannel]["sales"][id].hasOwnProperty("api")){
						url = insightManager.hostname + headingAndApiMapper[activeChannel]["sales"][id]["api"]; 	
					}
					if(headingAndApiMapper[activeChannel]["sales"][id].hasOwnProperty("sortorder")){
						parameters["sortorder"]  = 	headingAndApiMapper[activeChannel]["sales"][id]["sortorder"];
					}
				}
			}
			else{
				
				if(headingAndApiMapper[activeChannel]["sales"][id].hasOwnProperty("api")){
					var url = insightManager.hostname + headingAndApiMapper[activeChannel]["sales"][id]["api"]; 	
				}
				
				if(headingAndApiMapper[activeChannel]["sales"][id].hasOwnProperty("sortorder")){
					parameters["sortorder"]  = 	headingAndApiMapper[activeChannel]["sales"][id]["sortorder"];
				}
				
				if(headingAndApiMapper[activeChannel]["sales"][id].hasOwnProperty("salecriteria")){
					parameters["salecriteria"] = headingAndApiMapper[activeChannel]["sales"][id]["salecriteria"];	
				} 
				
				if(headingAndApiMapper[activeChannel]["sales"][id].hasOwnProperty("channelid")){
					parameters["channelid"] = headingAndApiMapper[activeChannel]["sales"][id]["channelid"];
				}	
				
			}
			activeTemp = "sales";	
		}
		else if(id in headingAndApiMapper[activeChannel]["digital"]){
			
			var headingName = headingAndApiMapper[activeChannel]["digital"][id]["name"];
			var url = insightManager.hostnameDigital +  headingAndApiMapper[activeChannel]["digital"][id]["api"];
			activeTemp = "digital";
			var chartType = headingAndApiMapper[activeChannel]["digital"][id]["chartType"];
			
		}
		else if(id in headingAndApiMapper[activeChannel]["promos"]){
			
			var headingName = headingAndApiMapper[activeChannel]["promos"][id]["name"];
			//var url = headingAndApiMapper[activeChannel]["promos"][id]["api"];
			activeTemp = "promos";
			var chartType = headingAndApiMapper[activeChannel]["promos"][id]["chartType"];
			
		}
		else{
			
		}
		
		if(insightManager.sessionStorageJson[activeChannel] === undefined){
			insightManager.sessionStorageJson[activeChannel] = {};
			insightManager.sessionStorageJson[activeChannel] = {"rendered" : false};
		}
		
		insightManager.sessionStorageJson[activeChannel][id] = {"activeTemp" : activeTemp};
		//insightManager.sessionStorageJson[id] = activeTemp;
		
		sessionStorage.setItem("jsonOfIds" , JSON.stringify(insightManager.sessionStorageJson));
		
		var salesTemp =  '<div class="box box-primary" draggable="true" ondragstart="insightManager.ondragstart(event)" >'+
		'<div class="box-header with-border">'+
		'<i class="fa fa-shopping-cart"></i><h3 class="box-title"> '+ headingName +'</h3>';
		
		
		var digitalTemp =   '<div  class="box box-warning" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
		'<div class="box-header with-border">'+
		'<i class="fa fa-lightbulb-o" ></i><h3 class="box-title">'+ headingName +'</h3>';
		
		var promosTemp = 	'<div  class="box box-success" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
		'<div class="box-header with-border">'+
		'<i class="fa fa-shopping-cart"></i><h3 class="box-title">'+ headingName +'</h3>';
		var commonTemp = "";
		
		//alert( id );
		if(activeTemp == "sales" && (chartType == "sales2" || chartType == "sales3" || chartType == "sales8" || chartType == "sales11" ) && insightManager.currentActiveChannel != "competition"){
			var firstTemp = '<div class="box-tools pull-right" id="'+ id +'">'+
			'<button type="button" class="btn btn-box-tool" data-widget="remove"><button  class="btn btn-info btn-xs btn-toggle-left button-list-group left" > <i class="fa fa-line-chart"></i>'+
			'</button><button class="btn  btn-xs btn-toggle-right button-list-group right"> <i class="fa fa-list-ul"></i>'+
			'</button> <i class="fa fa-times delete"></i>'+
			'</button>'+
			'</div>'+
			'</div>';
			
			var selectTemp  = "<select class='optionsList' id='options_"+id+"' ></select>"; 
			
			var body = '<div class="box-body ">'+
			'<div class="chart text-center" id="chart_'+ id +'">'+	
			'</div>'+
			'<div class="list-outer-div" style="display : none" id="chart_list_' + id +'" >'+
			'<div class="list-table"> </div>'+
			'</div>'+	
			'</div>'+
			'</div>'; 
			
			commonTemp = firstTemp + selectTemp + body;
			////console.log(commonTemp);
		}
		else if(chartType == "sales9"){
			salesTemp =  '<div class="box box-primary box-big" draggable="true" ondragstart="insightManager.ondragstart(event)" >'+
			'<div class="box-header with-border">'+
			'<i class="fa fa-shopping-cart"></i><h3 class="box-title"> '+ headingName +'</h3>'
			
			commonTemp = '<div class="box-tools pull-right" id="'+ id +'">'+
			'<button type="button" class="btn btn-box-tool" data-widget="remove"><button  class="btn btn-info btn-xs btn-toggle-left button-list-group left" > <i class="fa fa-line-chart"></i>'+
			'</button><button class="btn  btn-xs btn-toggle-right button-list-group right"> <i class="fa fa-list-ul"></i>'+
			'</button> <i class="fa fa-times delete"></i>'+
			'</button>'+
			'</div>'+
			'</div>'+
			'<div class="box-body ">'+
			'<div class="chart text-center heatMapClass" id="chart_'+ id +'">'+	
			'</div>'+
			'<div class="list-outer-div" style="display : none" id="chart_list_' + id +'" >'+
			'<div class="list-table"> </div>'+
			'</div>'+	
			'</div>'+
			'</div>';
		}
		else{
			commonTemp = '<div class="box-tools pull-right" id="'+ id +'">'+
			'<button type="button" class="btn btn-box-tool" data-widget="remove"><button  class="btn btn-info btn-xs btn-toggle-left button-list-group left" > <i class="fa fa-line-chart"></i>'+
			'</button><button class="btn  btn-xs btn-toggle-right button-list-group right"> <i class="fa fa-list-ul"></i>'+
			'</button> <i class="fa fa-times delete"></i>'+
			'</button>'+
			'</div>'+
			'</div>'+
			'<div class="box-body ">'+
			'<div class="chart text-center" id="chart_'+ id +'">'+	
			'</div>'+
			'<div class="list-outer-div" style="display : none" id="chart_list_' + id +'" >'+
			'<div class="list-table"> </div>'+
			'</div>'+	
			'</div>'+
			'</div>'; 
		}
		
		
		
		
		if(activeTemp == "sales"){
			var temp = salesTemp + commonTemp;
			
			$("#" +activeChannel).find('.row').prepend(temp);
			
			if(activeChannel == "competition"){
				if(chartType == "sales1" || chartType == "sales2" || chartType == "sales4"){
					var array = [];
					insightManager.drawCompetitionSalesChart(array,id,chartType);	
				}
				else{
					insightManager.hitApiForCompetition(url,id,chartType,parameters);
				}
			}
			else{	
				if(chartType == "sales2" || chartType == "sales3" || chartType == "sales8" || chartType == "sales11" ){
					
					if(chartType == "sales2" || chartType == "sales8"){
						var temp = brands;
						var type = "brand";
						var typeVal = "lays";
					}
					else{
						var temp =  cities;
						var type = "city";
						var typeVal = "banglore";
					}
					
					for(var i= 0 ; i < temp.length ;  i++){
						
						$("#options_"+id).append("<option val='"+ temp[i] +"' >"+temp[i]+"</option>");	
						
					}
					
					
					insightManager.hitSpecialBrandOptionsApi(url,id,chartType,parameters,type,typeVal);
					
					
					$($(document).find('#options_' + id)).CustomSelect({visRows:5, search:true, modifier: 'mod'});
					
					$($($($(document).find('#options_' + id)).parent()).find('.b-custom-select__title__input')).val(temp[0]);
					
					
				}
				else{
					insightManager.hitApiForSales(url,id,chartType,parameters);
				}
				
			}
			
			//$($(document).find('#options_' + id)).CustomSelect();
			//$($(document).find('#options_' + id)).CustomSelect({visRows:10, search:true, modifier: 'mod'});
			
		}
		else if(activeTemp == "digital"){
			var temp = digitalTemp + commonTemp;
			//$($('#' +  activeChannel).find('.row')).append(temp);
			$("#" +activeChannel).find('.row').prepend(temp);
			////console.log($("#" +activeChannel).find('.row').find("#chart_dp3").css('width'));
			
			insightManager.hitApiForDigital(url,id,chartType);
		}
		else if(activeTemp == "promos"){
			var temp = promosTemp +  commonTemp;
			$($('#' +  activeChannel).find('.row')).prepend(temp);
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
		else{
			
		}
		
		var type = fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"];
		var temp = "";
		
		
		if(insightManager.currentActiveChannel == "competition"){
			if(type == "sales1"){
				var tempList = comparisonAnalysisData;
				for(var key in tempList){
					temp += ' <div class="list-row"><div class="list-cell">'+key+'</div><div class="list-cell">'+tempList[key]["salesValue"]+'</div></div>';
				}	
			}
			else if(type == "sales2"){
				var tempList = comparisonAnalysisData;
				for(var key in tempList){
					temp += ' <div class="list-row"><div class="list-cell">'+key+'</div><div class="list-cell">'+tempList[key]["salesValue"]+'</div></div>';
				}
			}
			else if(type == "sales3"){
				var tempList = fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"];
				for(var i = 0 ; i < tempList.length ; i++ ){
					temp += ' <div class="list-row"><div class="list-cell">'+tempList[i]["channelName"]+'</div><div class="list-cell">'+tempList[i]["saleValue"]+'</div></div>';
				}		
			}	
			else if(type == "sales4"){
				
				var tempList = fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"];
				console.log(tempList);
				for(var key in tempList){
					temp += ' <div class="list-row"><div class="list-cell">'+key+'</div><div class="list-cell">'+tempList[key]["percentageMonthGrowth"]+'</div></div>';
				}		
			}
			else{
				
			}
		} 
		else{
			
			
			//console.log(fullListMapperWithApi[insightManager.currentActiveChannel][id]);
			
			if(type == "sales2" || type == "sales8" || type == "sales3" || type == "sales11" ){
				
				var products = fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"]["products"];
				var sales    = fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"]["sales"];
				
				for(var i = 0 ; i < products.length ; i++ ){
					temp += ' <div class="list-row"><div class="list-cell">'+products[i]+'</div><div class="list-cell">'+sales[i]+'</div></div>';
				}			
				
			}
			else if(type == "sales9"){
				
			}
			else{
				var headingKey = headingAndApiMapper[insightManager.currentActiveChannel][currentType][id]["string"];
				var totalVal = headingAndApiMapper[insightManager.currentActiveChannel][currentType][id]["value"];
				//console.log(fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"]);	
				var tempList =  fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"]; 
				for(var i = 0 ; i < tempList.length ; i++ ){
					temp += ' <div class="list-row"><div class="list-cell">'+tempList[i][headingKey]+'</div><div class="list-cell">'+tempList[i][totalVal]+'</div></div>';
				}
			}
			
		}
		
		$(container).append(temp);
		////console.log($(container));
	},
	attachEventsWithTemplate : function(id){
		
	},
	hitApiForCompetition    : function(url,id,chartType,parameters){
		//console.log(parameters);
		$.ajax({
			url: url,
			method: "GET",
			headers : {"groupId" : insightManager.groupId},
			data : {"sortorder" :  parameters["sortorder"] , "month" : insightManager.currentMonth , "year" : insightManager.currentYear},
			contentType: "application/json; charset=utf-8",
			crossDomain: true,
			async:true,  
			success: function(data){
				
				var response  = JSON.parse(data);
				var array = response["data"];
				
				array.sort(function(a, b) {
					return parseFloat(b['saleValue']) - parseFloat(a['saleValue']);
				});
				
				//console.log(array);
				
				
				if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
				}
				if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
				}
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = array;
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = chartType;
				insightManager.drawCompetitionSalesChart(array,id,chartType);
			},	
			error: function(){
				
			}
		});
		
		
		
	},
	drawCompetitionSalesChart : function(array,id,chartType){
		switch(chartType){
			case "sales1" : {
				
				var data =  {
					title : "",
					titleColor : "gray",
					yAxisLabel : "Sales(in "+'\u20B9'+")",
					yAxisUnit : "",
					yAxisEstimateData : [],
					yAxisEstimateDataUnit : 'Estimated',
					yAxisActualData : [],
					currencyUnit:"",
					yAxisActualDataUnit : 'Actual',
					xAxisLabel : "Channels",
					xAxisData : []
				}
				
				for(var key in comparisonAnalysisData){
					data["yAxisEstimateData"].push(parseFloat(comparisonAnalysisData[key]["salesValue"]));
					data["yAxisActualData"].push(parseFloat(comparisonAnalysisData[key]["plannedSalesValue"]));
					data["xAxisData"].push(key);
				}
				
				
				
				
				var cnfg={"data":data};
				
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":11,"background":"none","font-color":"#a7a7a7","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":15,"gridLineColor":"#353b37"};
				var stocChart37=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart37.comparisonAnalysis(cnfg);	
				
				// will be shifted when api will be there
				if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
				}
				if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
				}
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = comparisonAnalysisData;
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = chartType;
				
				break;
			}
			case "sales2" : {
				var data =  {
					title : "",
					yAxisLabel : "Sales(in "+'\u20B9'+")",
					yAxisUnit : "",
					yAxisEstimateData : [],
					yAxisEstimateDataUnit : 'August',
					yAxisActualData : [],
					yAxisActualDataUnit : 'September',
					currencyUnit:"",
					xAxisLabel : "Channels",
					xAxisData : [],
					legendArray : ['Prev Month Sales','This Month Sales']
				}
				
				for(var key in comparisonAnalysisData){
					data.yAxisEstimateData.push(parseInt(comparisonAnalysisData[key]["lastMonthSale"]));
					data.yAxisActualData.push(parseInt(comparisonAnalysisData[key]["salesValue"]));
					data.xAxisData.push(key);
				}
				
				
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#000","legendTextColor":"gray","font-weight":400,"xLabelColor":"gray","yLabelColor":"gray","chartTitleColor":"gray","titleFontSize":15,"gridLineColor":"#edece6"};
				var stocChart46=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart46.ThreeDComparisionAnalysis(data);
				
				
				if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
				}
				if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
				}
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = comparisonAnalysisData;
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = chartType;
				
				break;
			}
			case "sales3" : {
				var data =  {
					title : "",
					yAxisLabel : "Sales(in "+'\u20B9'+")",
					yAxisUnit : "",
					toolTipUnit : "",
					yAxisData : [],
					xAxisLabel : "Channels",
					xAxisData : [],
					currencyUnit:"",
					barColor : "#68aad1"
				}
				var length =  array.length;
				if(length > 5){
					length = 5;	
				}
				
				for(var i = 0 ; i < length ; i++ ){
					data.xAxisData.push(array[i]["channelName"]);
					data.yAxisData.push(parseFloat(array[i]["saleValue"]));
				}
				
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"black","legendTextColor":"black","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#edece6"};
				var stocChart10=$("#chart_" +id).stocCharts(textStyleConfg);
				stocChart10.drawThreeDBarChart(data);
				/*
					var data = {
					title : "Total Products Sale In Rupees",
					xAxisLabel :"channel",
					yAxisLabel :"Product sale",
					xAxisData :[],
					yAxisData :[],
					color :["#00FFFF"]
					
					}
					
					for(var i = 0 ; i < array.length ; i++ ){
					data.xAxisData.push(array[i]["channelName"]);
					data.yAxisData.push(parseFloat(array[i]["saleValue"]));
					}
					
					var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
					
					var stocChart55=$("#chart_" +id).stocCharts(textStyleConfg);
					stocChart55.simpleBarChartAnalysis(data);
				*/	//console.log("after");
				break;
			}
			case "sales4" : {
				var data = 
				{
					"xAxisData" : [43.09,11.03,5.09,306.83,59.80],
					"color" : ["#b4ff53","#ff555b","#e555ff","#4470b7","#717171"],
					"labelColor":["#b4ff53","#ff555b","#e555ff","#4470b7","#717171"],
					"icon" : ["small/amazon.png","small/srs.png","small/basket.png","small/grocermax.png","small/kada.png"],
					"key" : ["Amazon","Srs","Big-Basket","Grocermax","Kada"],
					"backColor" :"#d1cfd0",
					"unit" : "%"
				}
				/*
					var textStyleConfg={"font-description":10,"font-size-heading":12,"font-color-heading":"white","font-family":"swis721_ltex_btlight","font-size":11,"background":"none","font-color":"black","tick-font-color":"black","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
				*/
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":12,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":14,"font-number-color":"#000","font-number-family":"'Maven Pro',sans-serif","font-number-weight":800,"font-rank-size":16,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicBarChartWithPercentageAnalysis(data);
				
				
				if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
				}
				if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
				}
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = comparisonAnalysisData;
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = chartType;
				
				break;
				//var stocChart43=$("#chart_" + id).stocCharts(textStyleConfg);
				//stocChart43.threeDRoundedBarChartAnalysis(data);
				
				/*
					var data = {
					"yAxisData" : [43.09,11.03,5.09,306.83,59.80],
					"lowerColorArray":["#b4ff53","#ff555b","#e555ff","#4470b7","#717171"],
					"upperColor":"#e6e6e6",
					"imagesArray" :["small/amazon.png","small/srs.png","small/basket.png","small/grocermax.png","small/kada.png"],
					"threeDPathColor":"#f7fbf4",
					"xAxisData" : ["","","","",""],
					"unit" : "%"
					}
					
					var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":8,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"black","titleFontSize":8,"gridLineColor":"#353b37"};
					/*
					if(responseArray.length > 5){
					var length = 5 ;
					}
					else{
					var length = responseArray.length;
					}
					for(var i =0 ; i < length ;  i++){
					data['yAxisData'].push(parseFloat(responseArray[length - 1 -i]['total']));
					data['xAxisData'].push(responseArray[length - 1 -i]['brandbypim']);
					}
					
					var stocChart43=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart43.threeDRoundedBarChartAnalysis(data);
					break;
				*/
			}
		}
	},
	moduleRevertBack :  function(id){
		
		delete insightManager.sessionStorageJson[insightManager.currentActiveChannel][id];
		sessionStorage.setItem("jsonOfIds" , JSON.stringify(insightManager.sessionStorageJson));
		var headingName = "";
		var container ;
		
		
		if(id in headingAndApiMapper[insightManager.currentActiveChannel]["sales"]){
			headingName = headingAndApiMapper[insightManager.currentActiveChannel]["sales"][id]["name"]; 
			var imageName = headingAndApiMapper[insightManager.currentActiveChannel]["sales"][id]["chartType"];
			if(insightManager.currentActiveChannel == "competition"){
				imageName = "competition" + imageName;
			}
			
			var midtemplate = '<img src="thum/' + imageName + '.jpg" id="'+id+'" alt="" >';
			container = $($('#' + insightManager.currentActiveChannel + ' .tabPanel').find('.sales'));
		}
		else if(id in headingAndApiMapper[insightManager.currentActiveChannel]["digital"]){
			
			headingName = headingAndApiMapper[insightManager.currentActiveChannel]["digital"][id]["name"]; 
			var imageName = headingAndApiMapper[insightManager.currentActiveChannel]["digital"][id]["chartType"];
			if(insightManager.currentActiveChannel == "competition"){
				imageName = "competition" + imageName;
			}
			
			var midtemplate = '<img src="thum/' + imageName + '.jpg" id="'+id+'" alt="" >';
			container = $($('#' + insightManager.currentActiveChannel + ' .tabPanel').find('.digital'));
		}
		else if(id in headingAndApiMapper[insightManager.currentActiveChannel]["promos"]){
			headingName = headingAndApiMapper[insightManager.currentActiveChannel]["promos"][id]["name"];
			var imageName = headingAndApiMapper[insightManager.currentActiveChannel]["promos"][id]["chartType"];
			if(insightManager.currentActiveChannel == "competition"){
				imageName = "competition" + imageName;
			}
			
			var midtemplate = '<img src="thum/' + imageName + '.jpg" id="'+id+'" alt="" >';
			container = $($('#' + insightManager.currentActiveChannel + ' .tabPanel').find('.promos'));
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
		//console.log(event.target.id);
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
	hitSpecialBrandOptionsApi :  function(url,id,chartType,parameters,specialParam,specialParamVal){
		if(specialParam == "brand" ){
			var paramsJson = {"sortorder" :  parameters["sortorder"] , "channelid" : parameters["channelid"] , "brand" : specialParamVal , "month" : insightManager.currentMonth , "year" : insightManager.currentYear };	
		}
		else{
			//alert(specialParam);
			var paramsJson = {"sortorder" :  parameters["sortorder"] , "channelid" : parameters["channelid"] , "city" : specialParamVal , "month" : insightManager.currentMonth , "year" : insightManager.currentYear}		
		}
		
		$.ajax({
			url: url,
			type: "GET",
			headers : {"groupId" : 5},
			data : paramsJson,
			contentType: "application/json; charset=utf-8",
			crossDomain: true,
			async:true,  
			success: function(data){
				var response  = JSON.parse(data);
				//console.log(response);
				if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
				}
				if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
					fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
				}
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = response;
				fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = chartType;
				insightManager.drawSalesChart(response,id,chartType);
			},	
			error: function(){
				
			}
		});
	},
	hitApiForSales : function(url,id,chartType,parameters){
		
		if(chartType == "sales1" || chartType == "sales9" || chartType == "sales10"){
			$.ajax({
				url: url,
				type: "GET",
				headers : {"groupId" : insightManager.groupId},
				data : {"sortorder" :  parameters["sortorder"] , "channelid" : parameters["channelid"] , "month" : insightManager.currentMonth , "year" : insightManager.currentYear},
				contentType: "application/json; charset=utf-8",
				crossDomain: true,
				async:true,  
				success: function(data){
					var response  = JSON.parse(data);
					var array = response;
					
					if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
						fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
					}
					if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
						fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
					}
					fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = array["data"];
					fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = chartType;
					insightManager.drawSalesChart(array,id,chartType);
				},	
				error: function(){
					
				}
			});		
		}
		
		else{
			$.ajax({
				url: url,
				type: "GET",
				headers : {"groupId" : 5},
				data : {"sortorder" :  parameters["sortorder"] , "channelid" : parameters["channelid"] ,"salecriteria" : parameters["salecriteria"] , "month" : insightManager.currentMonth , "year" : insightManager.currentYear},
				contentType: "application/json; charset=utf-8",
				crossDomain: true,
				async:true,  
				success: function(data){
					var response  = JSON.parse(data);
					var array = response["data"];
					
					if(fullListMapperWithApi[insightManager.currentActiveChannel] === undefined){
						fullListMapperWithApi[insightManager.currentActiveChannel] = {};	
					}
					if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
						fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
					}
					fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = array;
					fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = "sales";
					insightManager.drawSalesChart(array,id,chartType);
				},	
				error: function(){
					
				}
			});
		}
		
	},
	drawSalesChart : function(responseArray,id,chartType){
		//alert(chartType);
		switch(chartType){
			case "sales1" :{
				//console.log(responseArray);
				responseArray = responseArray["data"];
				if(responseArray.length > 0){
					/*var data = 
						{
						"rank":[],
						"icon":[],
						"yAxisData":[],
						"title": [],
						"description":[],
						"color":["#d5be8c","#fce9a7","#8dceb6","#f26748","#757547"],
						"backColor":"#fffceb",
						"unit" : ""
						};
						
						var length = responseArray.length;
						if(length > 5){
						length = 5;	
						}
						
						
						
						for(var i = 0 ; i < length ; i++){
						
						data["description"].push(responseArray[i]["brandName"]);
						var array = responseArray[i]["brandName"].split(" ");
						
						var imageName = array[0].toLowerCase();
						data["yAxisData"].push((i+1).toString());
						data["title"].push(responseArray[i]["saleValue"]);
						data["icon"].push('small/' + imageName + '.png');
						}
						
						
						var textStyleConfg={"font-description":10,"font-size-heading":10,"font-color-heading":"black","font-family":"swis721_ltex_btlight","font-size":18,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
						var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
						stocChart55.infographicStepUpChartAnalysis(data);
					*/
					//console.log(responseArray);
					var colorArray = ["#42a5f5","#ef5350","#5c6bc0","#66bb6a","#888888"];
					var data = 
					{
						"rank" : [],
						"icon" : [],
						"yAxisData" : [],
						"description" : [],
						"color" : [],
						"rotateText" : "true",
						"backColor" :"#d1cfd0",
						
					}
					var length = responseArray.length;
					if(length > 5){
						length = 5;	
					}
					
					var string = {
						1 : "I",
						2 : "II",
						3 : "III",
						4 : "IV",
						5 : "V"
					}
					
					for(var i = 0 ; i < length ; i++){
						
						data["description"].push(responseArray[i]["brandName"]);
						var array = responseArray[i]["brandName"].split(" ");
						var imageName = array[0].toLowerCase();
						data["yAxisData"].push(parseFloat(responseArray[i]["saleValue"]));
						data["icon"].push('small/' + imageName + '.png');
						data["rank"].push(string[i+1]);
						data["color"].push(colorArray[i]);
					}
					
					//console.log(data["rank"]);
					/*
						var textStyleConfg={"font-description":12,"description-color":"black","font-size-heading":10,"font-color-heading":"black","font-family":"swis721_ltex_btlight","font-size":11,"background":"none","font-color":"black","tick-font-color":"black","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
					*/
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#333","legendTextColor":"white","font-weight":400,"xLabelColor":"#333","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#333","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":12,"font-number-color":"#333","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":14,"font-rank-color":"#333","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.infographicBarChartCardStandAnalysis(data);
					
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
				}
				
				break;
			}
			case "sales2" : {
				
				if(responseArray["products"].length > 0){
					var colorArray = ["#f3aa1f","#cb1b6e","#7e3d97","#318dcc","#3dbfb7"];
					
					var data = 
					{
						"rank" : [],
						"icon" : [],
						"yAxisData" : [],
						"title" : ["","","","","",""],
						"description" : [],
						"color" : [],
						"backColor" :"#d1cfd0",
						"pieBackColor" : "#503721",
						"innerArcColor" : "#fce9a7",
						
					}
					
					var array1 = responseArray["products"];
					var array2 = responseArray["sales"];
					
					//data["yAxisData"] = array2.slice(0,5);
					//data["description"] = array1.slice(0,5);
					
					var length = array1.length;
					if(length > 5 ){
						length = 5;	
					}
					
					
					for(var i = 0 ; i <  length ; i++){
						data["rank"].push(i+1);
						data["color"].push(colorArray[i]);
						data["yAxisData"].push(parseFloat(array2[i]));
						data["description"].push(array1[i]);
						var array = array1[i].split(" ");
						var imageName = array[0].toLowerCase();
						data["icon"].push('small/' + imageName + '.png');
					}
					/*
					var textStyleConfg={"font-description":8,"font-size-heading":20,"font-color-heading":"white","font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};*/
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":14,"font-number-color":"#000","font-number-family":"'Maven Pro',sans-serif","font-number-weight":800,"font-rank-size":14,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.infographicBartWithPieChartAnalysis(data);
					
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
				}
				
				break;
			}
			case "sales3" :{
				
				if(responseArray["products"].length > 0){
					var colorArray = ["#42a5f5","#ef5350","#5c6bc0","#66bb6a","#ec407a"];
					/*
						var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":11,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#000","titleFontSize":10,"gridLineColor":"#353b37"};
					*/
					
					var data =
					{
						title : "",
						barData: [],
						commonColor : "#ffffff", 
						upperEclipsColor : "gray",
						xAxisLabel : "Products",
						yAxisLabel :"Sales",
						upperPathHeight : 30,
						cylinderHeight : 300,
						"imagesArray" :[],
						"lowerTextDes" :[],
						unit : "%"  
					};
					
					var array1 = responseArray["products"];
					var array2 = responseArray["sales"];
					
					//data["yAxisData"] = array2.slice(0,5);
					//data["description"] = array1.slice(0,5);
					
					var length = array1.length;
					if(length > 5 ){
						length = 5;	
					}
					
					var string = {
						1 : "I",
						2 : "II",
						3 : "III",
						4 : "IV",
						5 : "V"
					}
					
					for(var i = 0 ; i <  length ; i++){
						var json = {};
						
						json["yTick"] = string[length - i];
						json["yData"] = parseFloat(array2[length - 1 - i]);
						json["color"] = colorArray[i];
						
						data.barData.push(json);
						var array = array1[length - 1 - i].split(" ");
						var imageName = array[0].toLowerCase();
						data["imagesArray"].push('small/' + imageName + '.png');
						data["lowerTextDes"].push(array1[length - 1 - i]);
					}
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":9,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":9,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":16,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.threeDShutterStackAnalysis(data);		
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
				}
				break;
			}
			case "sales4" :{
				console.log(responseArray);
				if(responseArray.length > 0){
					//var colorArray = ["#d5be8c","#fce9a7","#8dceb6","#f26748","#757547"];
					var colorArray = ["#eb866a","#0f5092","#75606f","#067b82","#757547"];
					
					var data = 
					{
						"rank":[],
						"icon":[],
						"yAxisData":[],
						"title" : [],
						"description":[],
						"color":[],
						"backColor":"#fffceb",
						"unit" : "",
						"mainTitle" : "",
						"currencyUnit":"\u20B9"
					}
					
					var length = responseArray.length;
					if(length > 5){
						length = 5;	
					}
					
					
					var string = {
						1 : "I",
						2 : "II",
						3 : "III",
						4 : "IV",
						5 : "V"
					}
					
					for(var i = 0 ; i < length ; i++){
						data["yAxisData"].push(parseFloat(responseArray[i]["saleValue"]));
						data["title"].push("");
						data["rank"].push(string[i+1]);
						data["color"].push(colorArray[i]);
						data["description"].push(responseArray[i]["productName"]);
						var array = responseArray[i]["productName"].split(" ");
						var imageName = array[0].toLowerCase();
						data["icon"].push('small/' + imageName + '.png');
					}
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#fff","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":10,"font-number-color":"#000","font-number-family":"'Maven Pro',sans-serif","font-number-weight":500,"font-rank-size":14,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":500};
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.infographicBarChartAnalysis(data);
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
				}
				break;
			}
			case "sales7" :{
				if(responseArray.length > 0){
					var colorArray = ["#42a5f5","#ef5350","#5c6bc0","#66bb6a","#888888"];
					var data = 
					{
						"rank" : [],
						"icon" : [],
						"title" : [],
						"description" : [],
						"color" : [],
						"backColor" : "#dadada",
						"unit": "%",
						"leftTitle":"sales quantity",
						"rightTitle":"product name"
					}
					var length = responseArray.length;
					if(length > 5){
						length = 5; 
					}
					//console.log(responseArray);
					for(var i = 0 ; i < length ; i++){
						
						data["title"].push(responseArray[i]["saleValue"]); 
						data["description"].push(responseArray[i]["productName"]);  
						data["color"].push(colorArray[i]);
						var array = responseArray[i]["productName"].split(" ");
						var imageName = array[0].toLowerCase();
						data["icon"].push('small/' + imageName + '.png');
						//data["icon"].push("");
						data["rank"].push((i+1).toString());
					}
					
					//console.log(data);
					/*
						var textStyleConfg={"font-description":11,"font-size-heading":12,"font-color-heading":"#000","font-family":'swis721_ltex_btlight',"font-size":16,"background":"none","font-color":"#000","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":12,"gridLineColor":"#353b37"};
					*/
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#fff","font-description-family":"'Roboto', sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":15,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":700,"font-rank-size":16,"font-rank-color":"#333","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.infographicTilledBarChartAnalysis(data);
					
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable); 
				}
				break;
			}
			case "sales8" : {
				/*
					if(responseArray["products"].length > 0){
					var colorArray = ["#b4ff53","#ff555b","#e555ff","#4470b7","#717171"]; 
					
					var data = {
					"key":[],
					"description":[],
					"icon" : [],
					"centerIcon" : "img/logo_colored/img2.png",
					"color" : "white"
					
					}
					
					
					
					
					////////////////////////////
					var length = responseArray["products"].length;
					if(length > 5){
					length = 5;	
					}
					//console.log(responseArray);
					for(var i = 0 ; i < length ; i++){
					
					data["key"].push(responseArray["sales"][i]);	
					data["description"].push(responseArray["products"][i]);		
					//	data["color"].push(colorArray[i]);
					//	var array = responseArray[i]["productName"].split(" ");
					//	var imageName = array[0].toLowerCase();
					//	data["icon"].push('small/' + imageName + '.png');
					data["icon"].push("");
					//	data["rank"].push((i+1).toString());
					}
					var array = responseArray["products"][0].split(" ")
					var imageName = array[0].toLowerCase();
					data["centerIcon"] = ('small/' + imageName + '.png');
					var textStyleConfg={"font-description":10,"font-size-heading":14,"font-color-heading":"black","font-family":'swis721_ltex_btlight',"font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.infographicCircleChartAnalysis(data);
					
					}
					else{
					
					$('#chart_' + id).append(insightManager.noDataAvailable);	
					}
				break;*/
				if(responseArray["products"].length > 0){
					var data = {
						title : "",
						xAxisLabel :"",
						yAxisLabel :"Sales(in \u20B9)",
						xAxisData : [],
						yAxisData : [],
						color :["#00FFFF"]
						
					}  
					
					
					
					var array1 = responseArray["products"];
					var array2 = responseArray["sales"];
					
					var length =  array1.length;
					if(length > 5 ){
						length = 5;	
					}
					
					for(var i= 0 ; i < length ; i++){
						data.yAxisData.push(parseFloat(array2[i]));
						data.xAxisData.push(array1[i]);		
					}
					
					if(length > 0){
						
						var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
						
						var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
						stocChart55.simpleBarChartAnalysis(data);
						
					}
					
					
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
				}
				break;
				
			}
			case "sales9" : {
				
				console.log(responseArray);
				
				var brandArray = responseArray["brand-array"];
				var citiesArray = responseArray["city-arry"];
				
				if(citiesArray.length > 0){
					var productNamesArray = [];
					var newDataJson= {};
					
					for(var key in brandArray){
						productNamesArray.push(key);	
					}	
					
					var j = 0;
					
					for(var key in brandArray){
						if( j < 5){
							for(var i = 0 ; i <  citiesArray.length ; i++){
								if(newDataJson[citiesArray[i]] == undefined){
									newDataJson[citiesArray[i]]  = [];
								}
								newDataJson[citiesArray[i]].push(brandArray[key][i]);
							}
							j++;
						}
					}
					
					
					var heatMapData = {
						data:newDataJson,
						xLabel:"Cities",
						yLabel:"Brands",
						yAxisValue:productNamesArray.slice(0,5),
						pointerImage:"img/hand-icon2.png"
						//pointerImage:"http://stocinn.github.io/stocweb/img/pointer.png",
					};
					/*
						var cfgHeatMap = {
						
						colorLow: '#5c6b6b',
						colorMed: '#535c5c',
						colorHigh: '#2f3939',
						yAxisLabelSpacing: 80
						}
					*/
					
					var cfgHeatMap = {
						
						colorLow: '#41B6C4',
						colorMed: '#C6E9B2',
						colorHigh: '#EDF8B1',
						yAxisLabelSpacing: 80,
						xLabelRotate :"false"
					}	
					
					var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":"13px","background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"black","font-weight":300,"xLabelColor":"#000","yLabelColor":"black","chartTitleColor":"black","gridLineColor":"#353b37"};
					//var yAxisValue = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
					//var xAxisValue = ['Akash', 'Rajiv', 'Mohit', 'Gaurav', 'Gurjant'];
					
					
					var stocChart4=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart4.drawHeatMapChart("#chart_" + id, heatMapData,cfgHeatMap);
					
					
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
				}
				
				/*
					data:{
					Rajiv:[18,20,22,16,10],
					Akash:[10,29,21,50,22],
					Mohit:[11,26,23,9,27],
					Gurjant:[13,16,29,18,21],
					Guarav:[18,12,23,14,8]
					},
				*/
				break;
				
			}
			
			case "sales10" :{
				var array = responseArray["data"];
				
				if(array.length > 0){
					var data = {
						title : "Sales(in \u20B9)",
						xAxisLabel :"",
						yAxisLabel :"cities",
						yAxisData : [],
						key: [
							{
								name: '',
								data: [],
								color : "#33d0ad"
							}
						]
					}  
					
					if(responseArray.length > 5){
						var length = 5 ;
					}
					else{
						var length = array.length;
					}
					
					for(var i =0 ; i < length ;  i++){
						data['yAxisData'].push(array[length - 1 - i]['city']);//tempList[i]['SKU-ID'];
						data.key[0]['data'].push(parseFloat(array[length - 1 - i]['saleValue']));
					}
					
					
					var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#000","legendTextColor":"#a7a7a7","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#edece6"};
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.horizontalStackedBarChartAnalysis(data);
					
					
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
				}
				break;
			}
			case "sales11" : {
				if(responseArray["sales"].length > 0){
					
					var colorArray = ["#f15c5e","#797a7c","#f8b75d","#55b8be","#1fb7cf"];
					/*var data = {
						
						"rank":[],
						"icon":[],
						"name":[],
						"description":[],
						"innerCircleColor":[],
						"outerCircleColor" :"#dddee2",
						"leftLabel":"Sales(in \u20B9)",
						"rightLabel":"Products"
						}
						
						var length = responseArray["sales"].length;
						
						
						if(length > 5){
						length = 5;	
						}
						//console.log(responseArray);
						for(var i = 0 ; i < length ; i++){
						
						data["name"].push(responseArray["sales"][i]);	
						data["description"].push(responseArray["products"][i]);		
						data["innerCircleColor"].push(colorArray[i]);
						var array = responseArray["products"][i].split(" ");
						var imageName = array[0].toLowerCase();
						data["icon"].push('small/' + imageName + '.png');
						//data["icon"].push("");
						data["rank"].push((i+1).toString());
					}	*/
					var data = 
					{
						"rank" : [],
						"key" : [],
						"title" : [],
						"description" : [],
						"color" : []
					}
					
					var length = responseArray["sales"].length;
					
					if(length > 5){
						length = 5;	
					}
					//console.log(responseArray);
					for(var i = 0 ; i < length ; i++){
						
						data["key"].push(responseArray["sales"][i]);	
						data["description"].push(responseArray["products"][i]);		
						data["color"].push(colorArray[i]);
						data["title"].push('');
						//data["icon"].push("");
						data["rank"].push((i+1).toString());
					}
					/*
						var textStyleConfg={"font-description":11,"font-size-heading":12,"font-color-heading":"white","font-family":"swis721_ltex_btlight","font-size":16,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
					*/
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#fff","font-description-family":"'Roboto', sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":11,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":16,"font-rank-color":"#333","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
					
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.infographicSmoothPathAnalysis(data);
					
				}
				else{
					//console.log(chartType);
					$('#chart_' + id).append(insightManager.noDataAvailable);	
					
				}
				break;
				
			}
			
		}
	},
	hitApiForDigital : function(url,id,chartType){
		if(chartType == "digital1" || chartType == "digital2" || chartType == "digital3"){
			$.ajax({
				url: url,
				type: "GET",
				headers : {"groupId" : insightManager.groupId},
				contentType: "application/json; charset=utf-8",
				crossDomain: true,
				async:true,  
				success: function(data){
					//console.log(data);
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
					if(fullListMapperWithApi[insightManager.currentActiveChannel][id] === undefined){
						fullListMapperWithApi[insightManager.currentActiveChannel][id] = {};	
					}
					fullListMapperWithApi[insightManager.currentActiveChannel][id]["data"] = responseArray;
					fullListMapperWithApi[insightManager.currentActiveChannel][id]["type"] = "digital";
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
				//console.log(responseArray);
				/***
					REAL DATA WHEN API WILL WORK
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
					data['yAxisData'].push(parseFloat(responseArray[i]['total']));
					data['title'].push("");
					data['description'].push(responseArray[i]['categoryid']);
					}
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":9,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":9,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400};
					
				*/
				
				// DUMMY DATA
				
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
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":14,"font-number-color":"#000","font-number-family":"'Maven Pro',sans-serif","font-number-weight":800,"font-rank-size":14,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				/////////////////////////////
				
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
					data.key[0]['data'].push(parseFloat(responseArray[length - 1 - i]['total']));
				}
				
				
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#000","chartTitleColor":"#000","titleFontSize":16,"gridLineColor":"#353b37"};
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.horizontalStackedBarChartAnalysis(data);
				break;
			}
			case "digital3" : {
				//console.log(responseArray);
				/**
					var data = {
					"yAxisData" : [],
					"lowerColorArray":["#d4155b","#f99320","#484848","#87179d","#0071bd"],
					"upperColor":"#e6e6e6",
					"imagesArray" :["img/logos/img5.png","img/logos/img1.png","img/logos/img3.png","img/logos/img6.png","img/logos/img7.png"],
					"threeDPathColor":"#f7fbf4",
					"xAxisData" : [],
					"unit" : ""
					}
					
					var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":9,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":9,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400};
					
					if(responseArray.length > 5){
					var length = 5 ;
					}
					else{
					var length = responseArray.length;
					}
					for(var i =0 ; i < length ;  i++){
					data['yAxisData'].push(parseFloat(responseArray[length - 1 -i]['total']));
					data['xAxisData'].push(responseArray[length - 1 -i]['brandbypim']);
					}
				*/
				
				//////////////////////// DUMMY DAtA
				
				var data = {
					"yAxisData" : [60,90,80,58,86],
					"lowerColorArray":["#ed1e79","#fbb03b","#666666","#92278f","#0071bd","#cc886d","#356aa0"],
					"upperColor":"#e6e6e6",
					"imagesArray" :["img/logo_colored/img1.png","img/logo_colored/img9.png","img/logo_colored/img6.png","img/logo_colored/img5.png","img/logo_colored/img7.png"],
					"threeDPathColor":"#f7fbf4",
					"xAxisData" : ["Pepsi","Lipton","Diet Pepsi","Mirinda","Kurkure"],
					"unit" : "%"
				}
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#333","legendTextColor":"white","font-weight":400,"xLabelColor":"#333","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#222","font-description-family":"Open Sans, sans-serif","font-description-weight":400,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":11,"font-number-color":"#333","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":14,"font-rank-color":"#333","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				
				/////////////////////////
				var stocChart43=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart43.threeDRoundedBarChartAnalysis(data);
				break;	
			}
			case "digital4" : {
				
				var data= {
					dountKey :['no rating','<3 ratung','>3 rating'],
					dountData : [12000,8850,10000],
					label : 'Cost',
					colorArray : ['#00ccca','#7f00ff','#5bd100'],
					unit : "%",
					factor :"% Share"
					
				};
				
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"black","font-weight":400,"xLabelColor":"black","yLabelColor":"black","chartTitleColor":"black","gridLineColor":"#353b37"};
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
				/*
				var textStyleConfg={"font-description":10,"font-size-heading":12,"font-color-heading":"black","font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};*/
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#333","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":9,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":14,"font-rank-color":"#333","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				
				//console.log($("#chart_" + id));
				
				stocChart55.infographicRankStandAnalysis(data);
				break;
			}
			case "digital6" : {
				/*
					var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"white","titleFontSize":12,"gridLineColor":"#353b37"};
				*/
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":9,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":16,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				var data =
				{
					title : "",
					barData: [{
						"yTick": "III",
						"yData": 35,	
						"color": "#ed7a06"
						}, {
						"yTick": "II",
						"yData": 32,
						"color": "#b21a5c"
						}, {
						"yTick": "I",
						"yData": 30,
						"color": "#333333"
					}
					],
					commonColor : "#ffffff", 
					upperEclipsColor : "gray",
					xAxisLabel : "Country",
					yAxisLabel :"Visit(in Millons)",
					upperPathHeight : 30,
					cylinderHeight : 400,
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
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"#a7a7a7","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":9,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#fff","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":9,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":16,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
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
					factor :"space share"
				}
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"black","font-weight":400,"xLabelColor":"black","yLabelColor":"black","chartTitleColor":"black","gridLineColor":"#353b37"};
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
					"outerCircleColor" :"#dddee2",
					"leftLabel":"products	 quantity",
					"rightLabel":"brand 	name"
				}
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#fff","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"#333","font-heading-family":"Open Sans, sans-serif","font-heading-weight":600,"font-number-size":9,"font-number-color":"#fff","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":14,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.rankWiseInformaticChartAnalysis(data);
				break;
			}
		}		
	},
	drawPromosChart : function(id,chartType){
		
		switch(chartType){
			case "promos1" :{
				//console.log(id);
				var gaugeChartData =  {
					"data" :[{"totalValue":100,"valAchieve":40.34}],
					"colorArray" : ["#a70328","#c1e0f7"],
					"toolTipMsg":"",
					"meterLabel" : ["Min","Max"]
				}
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"white","tick-font-color":"#a7a7a7","legendTextColor":"#a7a7a7","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
				
				
				
				var chartId = $('#' + insightManager.currentActiveChannel).find("#chart_" + id); 
				//var stockChart15=$("#chart_" + id).stocCharts(textStyleConfg);
				//console.log(chartId);
				var stockChart15=chartId.stocCharts(textStyleConfg);
				stockChart15.gaugeGraph(gaugeChartData);
				break;
			}
			case "promos2":{
				/*
					var data = {
					"key" : 3,
					"color" : "#ef2f1a"
					}
					
					for(var i= 0 ; i < insightManager.metaData ;  i++){
					$("#options_" + id).append($("<option val ='"+ insightManager.metaData +"' >"+insightManager.metaData+"</option>"));	
					}
					
					var textStyleConfg={"font-description":8,"font-size-heading":12,"font-color-heading":"black","font-family":"swis721_ltex_btlight","font-size":30,"background":"none","font-color":"white","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicTrianglePathAnalysis(data);*/
				
				var data = 
				{
					"xAxisData" : [50,70,88,95,100],
					"color" : ["#42a5f5","#ef5350","#5c6bc0","#66bb6a","#26a69a","#f3aa1f","#cb1b6e","#7e3d97","#318dcc","#3dbfb7","#503721"],
					"icon" : ["logo_colored/img1.png","logo_colored/img9.png","logo_colored/img6.png","logo_colored/img5.png","logo_colored/img7.png"],
					"key" : ["product abc","product abc","product abc","product abc","product abc"],
					"backColor" :"#d1cfd0",
					"unit" : "%"
				}
				
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":11,"font-number-color":"#000","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":14,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicBarChartWithCylinderAnalysis(data);
				break;
			}
			case "promos3" : {
				var data = 
				{
					"rank":["01","02","03","04","05"],
					"icon":["small/pepsi.png","small/lays.png","small/kurkure.png","small/lipton.png","small/mirinda.png"],
					"yAxisData":[65,78,90,64,50],
					"title": ["","","","",""],
					"description":["pepsi","lays","kurkure","lipton","mirinda"],
					"color":["#d5be8c","#fce9a7","#8dceb6","#f26748","#757547","#503721"],
					"backColor":"#fffceb",
					"unit" : "",
					"mainTitle" : "brand promotions",
					"currencyUnit":"\u20B9"
				}
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#000","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#000","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":11,"font-number-color":"#000","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":14,"font-rank-color":"white","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicBarChartAnalysis(data);
				break;
			}
			case "promos4" : {
				var data =  {
					title : "Estimated v/s Actual Promotions",
					titleColor : "gray",
					yAxisLabel : "Promotions",
					yAxisUnit : "",
					yAxisEstimateData : [300,390,300,270,200,230,180],
					yAxisEstimateDataUnit : 'Estimated',
					yAxisActualData : [330,450,320,250,230,270,140],
					yAxisActualDataUnit : 'Actual',
					xAxisLabel : "promotions",
					xAxisData : ["pepsi","lays","kurkure","lipton","mirinda","7Up","Gatorade"]
				}
				
				var cnfg={"data":data};
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"	","font-weight":400,"xLabelColor":"black","yLabelColor":"black","chartTitleColor":"black","titleFontSize":15,"gridLineColor":"#353b37"};
				var stocChart37=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart37.comparisonAnalysis(cnfg);	
				break;
			}
			case "promos5" : {
				var data = {
					title : "",
					titleColor : "gray",
					yAxisUnit : "%",
					yAxisLabel : "scope",
					yAxisData : [28,55,42,65,20,35],
					xAxisLabel : "Month",
					xAxisData : ["Mirinda","pepsi","Kurkure","7UP","Duke","Mtn Dew"]
				}
				
				var cnfg={"data":data};
				var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
				var stocChart36=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart36.musicSpikesAnalysis(cnfg);
				break;
			}
			case "promos6" : {
				/*
					var data = {
					title : "Product Promotion(Brand wise)",
					xAxisLabel :"Brand",
					yAxisLabel :"Active promotions",
					xAxisData : ["Pepsi","Mirinda","Mountain Dew","Kurkure","Lipton"],
					yAxisData : [50, 30, 40, 37, 20],
					color :["#00FFFF"]
					
					}  
					
					var textStyleConfg={"font-family":"swis721_ltex_btlight","font-size":12,"background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
					
					var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
					stocChart55.simpleBarChartAnalysis(data);
				break;*/
				
				var data = 
				{
					"rank" : ["01","02","03","04","05"],
					"icon" : ["img/logo_colored/img1.png","img/logo_colored/img9.png","img/logo_colored/img6.png","img/logo_colored/img5.png","img/logo_colored/img7.png"],
					"yAxisData" : [35,50,70,100],
					"description" : ["product infographics design for products according to brand","product infographics design","product infographics design","product infographics design","product infographics design"],
					"color" : ["#f3aa1f","#cb1b6e","#7e3d97","#318dcc","#3dbfb7","#503721"],
					"rotateText" : "true",
					"backColor" :"#d1cfd0",
					
				}
				
				var textStyleConfg={"font-family":"'Roboto', sans-serif","font-size":12,"background":"none","font-color":"white","tick-font-color":"#333","legendTextColor":"white","font-weight":400,"xLabelColor":"#333","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37","font-description-size":11,"font-description-color":"#333","font-description-family":"Open Sans, sans-serif","font-description-weight":100,"font-heading-size":11,"font-heading-color":"black","font-heading-family":"Open Sans, sans-serif","font-heading-weight":10,"font-number-size":12,"font-number-color":"#333","font-number-family":"'Maven Pro',sans-serif","font-number-weight":400,"font-rank-size":14,"font-rank-color":"#333","font-rank-family":"'Roboto', sans-serif","font-rank-weight":600};
				
				var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
				stocChart55.infographicBarChartCardStandAnalysis(data);
				break;
			}
		}
		
		
	}
};


var headingAndApiMapper  =  {
	"amazon" : {
		"digital" : {
			"adp0":{"name" : "products not listed" , "api" : "/insight/api/product/count/not-listed","chartType":"digital1","value":"total","string":"categoryid" },
			"adp1": {"name" : "products listed" , "api" : "/insight/api/product/count/listed","chartType":"digital2" ,"value":"total","string":"productbrand"},
			"adp2":{"name" : "out of stock products" , "api" : "/insight/api/product/count/oos","chartType":"digital3","value":"total","string":"brandbypim"},
			"adp3": {"name" :"% of products with no rating, < 3 rating and >3" , "chartType" : "digital4"},
			"adp4": {"name" :"First rank of pepsi product" , "chartType" : "digital5"},
			"adp5": {"name" :"Competition Products with prices lower than PepsiCo products" , "chartType" : "digital6"},
			"adp6": {"name" :"% of products with content mismatch on a channel" , "chartType" : "digital7"},
			"adp7": {"name" :"Share of space of competition vs pepsi in a category on a channel" , "chartType" : "digital8"},
			"adp8": {"name" :"Best sellers which recently went out of stock on Amazon" , "chartType" : "digital9"}
		},
		"sales" : {
			"as0" :{"name" : "Total sales per channel -  brand wise" , "api" :"/app/sale/brand/getTotalSaleInfo" , "chartType" : "sales1" ,"sortorder" :"desc","channelid":1 , "string" : "brandName"  , "value" : "saleValue"},
			
			"as1" : {"name" : "Top performer products Specific Brand Wise " , "api" : "/app/sale/brand/getProductSaleByBrandName" , "chartType" : "sales2" , "sortorder" : "desc" , "channelid" :  1 },  			
			
			"as3" : {"name" : "Top performer products " ,"api" :"/app/sale/product/getSaleInfo" , "chartType" : "sales4" ,"sortorder" :"desc","channelid" : 1 , "salecriteria" : "" , "string" : "productName"  , "value" : "saleValue"},		
			
			"as6" : {"name" : "Worst performer products ","api" : "/app/sale/product/getSaleInfo" , "chartType" : "sales7" ,"sortorder" :"asc","channelid" : 1 , "salecriteria" : "", "string" : "productName"  , "value" : "saleValue"},
			
			"as7" : {"name" : "Worst performer products brand wise","api" : "/app/sale/brand/getProductSaleByBrandName" , "chartType" : "sales8" ,"sortorder" :"asc","channelid" : 1 ,"string" : "productName"  , "value" : "saleValue"},
			
			"as8" : {"name" : "Top and worst performer brands - channel wise"},
			"as9" : {"name" : "Top and worst performer brands - city wise"},
			"as10" : {"name" : "% share of sales"},
			"as11": {"name" : "Competition best sellers on a channel with price comparison"},
			"as12": {"name" : "Regional Gap"}
		},
		"promos" : {
			"ap0" : {"name" : "Tracking accuracy of a promotion","chartType" : "promos1" },
			"ap1" : {"name" : "Out of Stock Products under a promotion","chartType" : "promos2" },
			"ap2" : {"name" : "Products with price higher than a competition in a promotion","chartType" : "promos3" },
			"ap3" : {"name" : "Promotions run by competition, brand wise","chartType" : "promos4" },
			"ap4" : {"name" : "scope of increasing/decreasing the product prices","chartType" : "promos5" },
			"ap5" : {"name" : "Number of active promotions on a channel, brand wise","chartType" : "promos6" }
		}	
	},
	"basket" : {
		"digital" : {
			"bbdp0":{"name" : "products not listed" , "api" : "/insight/api/product/count/not-listed","chartType":"digital1","value":"total","string":"categoryid" },
			"bbdp1": {"name" : "products listed" , "api" : "/insight/api/product/count/listed","chartType":"digital2" ,"value":"total","string":"productbrand"},
			"bbdp2":{"name" : "out of stock products" , "api" : "/insight/api/product/count/oos","chartType":"digital3","value":"total","string":"brandbypim"},
			"bbdp3": {"name" :"% of products with no rating, < 3 rating and >3" , "chartType" : "digital4"},
			"bbdp4": {"name" :"First rank of pepsi product" , "chartType" : "digital5"},
			"bbdp5": {"name" :"Competition Products with prices lower than PepsiCo products" , "chartType" : "digital6"},
			"bbdp6": {"name" :"% of products with content mismatch on a channel" , "chartType" : "digital7"},
			"bbdp7": {"name" :"Share of space of competition vs pepsi in a category on a channel" , "chartType" : "digital8"},
			"bbdp8": {"name" :"Best sellers which recently went out of stock on Amazon" , "chartType" : "digital9"}
		},
		"sales" : {
			"bbs0" :{"name" : "Total sales per channel -  brand wise" , "api" :"/app/sale/brand/getTotalSaleInfo" , "chartType" : "sales1" ,"sortorder" :"desc","channelid":8 , "string" : "brandName"  , "value" : "saleValue" },
			
			"bbs1" : {"name" : "Top performer products Brand Wise " , "api" : "/app/sale/brand/getProductSaleByBrandName" , "chartType" : "sales2" , "sortorder" : "desc" , "channelid" :  8 ,  "string" : "brandName"  , "value"  : "saleValue" },  			
			
			"bbs2" : {"name" : "Top performer products City Wise " , "api" : "/app/sale/city/getProductSaleByCityName" , "chartType" : "sales3" , "sortorder" : "desc" , "channelid" :  8 ,  "string" : "brandName"  , "value"  : "saleValue" },
			
			"bbs3" : {"name" : "Top performer products " ,"api" :"/app/sale/product/getSaleInfo" , "chartType" : "sales4" ,"sortorder" :"desc","channelid" : 8 , "salecriteria" : "" , "string" : "productName"  , "value" : "saleValue"},		
			
			"bbs4" : {"name" : "% shares of category" , "api" : "" , "chartType" : "sales5" , "sortorder" : "desc" , "channelid" : 8},
			
			"bbs6" : {"name" : "Worst performer products ","api" : "/app/sale/product/getSaleInfo" , "chartType" : "sales7" ,"sortorder" :"asc","channelid" : 8 , "salecriteria" : "", "string" : "productName"  , "value" : "saleValue"},
			
			"bbs7" : {"name" : "Worst performer products brand wise","api" : "/app/sale/brand/getProductSaleByBrandName" , "chartType" : "sales8" ,"sortorder" :"asc","channelid" : 8 ,"string" : "productName"  , "value" : "saleValue"},
			
			"bbs8" : {"name" : "City vs Brand","api" : "/app/sale/brand/getheatmapdata" , "chartType" : "sales9" ,"sortorder" :"desc","channelid" : 8 ,"string" : "productName"  , "value" : "saleValue"},
			
			"bbs9" : {"name" : "Total Sales Info CITY wise","api" : "/app/sale/city/getTotalSaleInfo" , "chartType" : "sales10" ,"sortorder" :"desc","channelid" : 8 ,"string" : "city"  , "value" : "saleValue"},
			
			"bbs10" : {"name" : "Worst Sales Info in CITY ","api" : "/app/sale/city/getProductSaleByCityName" , "chartType" : "sales11" , "sortorder" : "asc" , "channelid" :  8 ,  "string" : "brandName"  , "value"  : "saleValue"}
		},
		"promos" : {
			"bbp0" : {"name" : "Tracking accuracy of a promotion","chartType" : "promos1" },
			"bbp1" : {"name" : "Out of Stock Products under a promotion","chartType" : "promos2" },
			"bbp2" : {"name" : "Products with price higher than a competition in a promotion","chartType" : "promos3" },
			"bbp3" : {"name" : "Promotions run by competition, brand wise","chartType" : "promos4" },
			"bbp4" : {"name" : "scope of increasing/decreasing the product prices","chartType" : "promos5" },
			"bbp5" : {"name" : "Number of active promotions on a channel, brand wise","chartType" : "promos6" }
		}	
	},
	"banya" : {
		"digital" : {
			"bdp0":{"name" : "products not listed" , "api" : "/insight/api/product/count/not-listed","chartType":"digital1","value":"total","string":"categoryid" },
			"bdp1": {"name" : "products listed" , "api" : "/insight/api/product/count/listed","chartType":"digital2" ,"value":"total","string":"productbrand"},
			"bdp2":{"name" : "out of stock products" , "api" : "/insight/api/product/count/oos","chartType":"digital3",	"value":"total","string":"brandbypim"},
			"bdp3": {"name" :"% of products with no rating, < 3 rating and >3" , "chartType" : "digital4"},
			"bdp4": {"name" :"First rank of pepsi product" , "chartType" : "digital5"},
			"bdp5": {"name" :"Competition Products with prices lower than PepsiCo products" , "chartType" : "digital6"},
			"bdp6": {"name" :"% of products with content mismatch on a channel" , "chartType" : "digital7"},
			"bdp7": {"name" :"Share of space of competition vs pepsi in a category on a channel" , "chartType" : "digital8"},
			"bdp8": {"name" :"Best sellers which recently went out of stock on Amazon" , "chartType" : "digital9"}
		},
		"sales" : {
			"bs0" :{"name" : "Total sales per channel -  brand wise" , "api" :"/app/sale/brand/getTotalSaleInfo" , "chartType" : "sales1" ,"sortorder" :"desc","channelid" : 7 , "string" : "brandName"  , "value" : "saleValue" },
			
			"bs1" : {"name" : "Top performer products Specific Brand Wise " , "api" : "/app/sale/brand/getProductSaleByBrandName" , "chartType" : "sales2" , "sortorder" : "desc" , "channelid" :  7 ,  "string" : "brandName"  , "value"  : "saleValue" },  			
			
			"bs3" : {"name" : "Top performer products " ,"api" :"/app/sale/product/getSaleInfo" , "chartType" : "sales4" ,"sortorder" :"desc","channelid" : 7 , "salecriteria" : "" , "string" : "productName"  , "value" : "saleValue"},		
			
			"bs6" : {"name" : "Worst performer products ","api" : "/app/sale/product/getSaleInfo" , "chartType" : "sales7" ,"sortorder" :"asc","channelid" : 7 , "salecriteria" : "", "string" : "productName"  , "value" : "saleValue"},
			
			"bs7" : {"name" : "Worst performer products brand wise","api" : "/app/sale/brand/getProductSaleByBrandName" , "chartType" : "sales8" ,"sortorder" :"asc","channelid" : 7 ,"string" : "productName"  , "value" : "saleValue"}
		},
		"promos" : {
			"bp0" : {"name" : "Tracking accuracy of a promotion","chartType" : "promos1" },
			"bp1" : {"name" : "Out of Stock Products under a promotion","chartType" : "promos2" },
			"bp2" : {"name" : "Products with price higher than a competition in a promotion","chartType" : "promos3" },
			"bp3" : {"name" : "Promotions run by competition, brand wise","chartType" : "promos4" },
			"bp4" : {"name" : "scope of increasing/decreasing the product prices","chartType" : "promos5" },
			"bp5" : {"name" : "Number of active promotions on a channel, brand wise","chartType" : "promos6" }
		}
	},
	"competition" : {
		"sales" : {
			"cas0":{"name" : "Planned vs achieved sales numbers against a channel" , "api" : "" ,"chartType":"sales1"},
			"cas1":{"name" : "Month on month growth of a channel" , "api" :"","chartType":"sales2"},
			"cas2":{"name" : "Total Sales Of Channels" , "api" : "/app/sale/channel/getTotalSaleInfo" , "sortorder":"desc" , "chartType" : "sales3"},
			"cas3":{"name" : "% Growth in Month" ,"api" : "" , "chartType" : "sales4"}
		}
	}	
};

var fullListMapperWithApi = {
	
};

var optionsMapper = {
	"as0":{
		"brand" : {	
			"api" : ""
		},
		"city"  :{
			"api" : ""	
		}
	}	
}

var comparisonAnalysisData = {
	"amazon" : {
		"salesValue" : 2291039,
		"plannedSalesValue" : 3610000,
		"lastMonthSale" : 1591888,
		"percentageAchieved" : 63.46,
		"percentageMonthGrowth" : 43.92
	},
	"basket" : {
		"salesValue" : 5621531,
		"plannedSalesValue" : 5880000,
		"lastMonthSale" : 5349152.21,
		"percentageAchieved" : 95.60,
		"percentageMonthGrowth" : 5.09
	},
	"healthyWorld" : {
		"salesValue" : 34580,
		"plannedSalesValue" : 40000,
		"lastMonthSale" : 33902,
		"percentageAchieved" : 86.45,
		"percentageMonthGrowth" : 2.00
	},
	"grocermax" : {
		"salesValue" : 421988,
		"plannedSalesValue" : 180000,
		"lastMonthSale" : 103725.4,
		"percentageAchieved" : 234.44,
		"percentageMonthGrowth" : 306.83
	},
	"kada" : {
		"salesValue" : 28299,
		"plannedSalesValue" : 20000,
		"lastMonthSale" : 17709,
		"percentageAchieved" : 141.50,
		"percentageMonthGrowth" : 59.80
	},
	"srs" : {
		"salesValue" : 158042,
		"plannedSalesValue" : 190000,
		"lastMonthSale" : 142337,
		"percentageAchieved" : 83.18,
		"percentageMonthGrowth" : 11.03
	},	
	
}

var channelIdMapping = { 1 : "amazon" , 8 : "basket" , 7 : "banya" }; 

var brands = ["LAYS","MIRINDA","7UP","LIPTON ICE TEA","HIMALAYAN","PEPSI DIET","UNCLE CHIPPS","MOUNTAIN DEW","TROPICANA","GATORADE","KURKURE","TROPICANA SLICE","CHEETOS","QUAKER","PEPSI","LEHAR NAMKEEN","SLICE","AQUAFINA"];

var cities = ["BANGLORE","HYDRABAD","MUMBAI","DELHI","CHENNAI","PUNE","MYSORE"];

var string = {
	1 : "I",
	2 : "II",
	3 : "III",
	4 : "IV",
	5 : "V"
}

window.onload =  function(){
	insightManager.hitApiForSession();	
}

// 9871727675
//SCO 466/457     -----     35C
// 			