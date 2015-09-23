var insightManager = {
	init : function(){	
		insightManager.bindEvents();
		//insightManager.moduleAppendAtDashboard('s0');
		//insightManager.moduleAppendAtDashboard('dp0');
		//insightManager.moduleAppendAtDashboard('p0');
		//insightManager.moduleAppendAtDashboard('ca0');
	},	
	id : "",
	elements : [],
	salesChartArray : [], 
	bindEvents :  function(){
		
		$(document).on('click','img',function(){
			var id = $(this).attr('id');
			insightManager.moduleAppendAtDashboard(id);
			$($(this).parent().parent()).remove();
		});
		
		$(document).on('click','.delete',function(){
			
			var id = $($(this).parent()).attr('id');
			insightManager.moduleRevertBack(id);
			$($(this).parent().parent().parent()).remove();
			
		});
		
		
		$(document).on('click','.right',function(){
			var id = $($(this).parent()).attr('id');
			$($(document).find('#chart_' + id )).css('display','none');
			$($(document).find("#chart_list_" + id )).css('display','block');
			var container = $($('#chart_list_' + id ).find('.list-table'));
			insightManager.appendFullList(container,id);		
		});
		
		$(document).on('click','.left',function(){
			var id = $($(this).parent()).attr('id');			
			console.log(id)
			$($(document).find('#chart_' + id )).css('display','block');
			$($(document).find("#chart_list_" + id )).css('display','none');
			
		});
		
		/**     default funtionailities of tab */
		$('#myTabs a').click(function (e) {
			e.preventDefault()
			$(this).tab('show')
		})
		
	
		$(document).on('click','.top-nav li a',function(e) {
			e.preventDefault();
			$('a').removeClass('active');
			$(this).addClass('active');
		});
		
		
		$('button.btn-box-tool').click(function(){
			$(this).next('.col-md-4.col-sm-12').hide();
		});
		
		
		$(document).on('click','.btn-slide',function(){
			
			$(".btn-slide").toggleClass("click");
			$(".tabPanel").toggleClass("active");
			$("#arrow").toggleClass("fa-angle-double-right");
			$("#arrow").toggleClass("fa-angle-double-left");
			
		});
		
		$(document).on('click','.button-list-group',function(){
			$(this).siblings().removeClass('btn-info')
			$(this).addClass('btn-info');
		});
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
		
		/**     default funtionailities of tab */
	},
	moduleAppendAtDashboard : function(id){
		
		var activeTemp = "";
		var temp ;
		if(id in mapper["sales"]){
			headingName = mapper["sales"][id]; 
			activeTemp = "sales";
		}
		else if(id in mapper["digital"]){
			headingName = mapper["digital"][id]; 
			activeTemp = "digital";
		}
		else if(id in mapper["promos"]){
			headingName = mapper["promos"][id];
			activeTemp = "promos";
		}
		else{
			headingName = mapper["competitionAnalysis"][id];
			activeTemp = "competitionAnalysis";
		}
		
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
		'<button type="button" class="btn btn-box-tool" data-widget="remove"><button  class="btn btn-info btn-xs btn-toggle-left button-list-group left" > Top Performers </button><button class="btn  btn-xs btn-toggle-right button-list-group right">View Complete List  </button> <i class="fa fa-times delete"></i>'+
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
			$('.row').append(temp);
			insightManager.drawSalesChart(id);
		}
		else if(activeTemp == "digital"){
			temp = digitalTemp +  commonTemp;
			$('.row').append(temp);
			insightManager.drawDigitalChart(id);
		}
		else if(activeTemp == "promos"){
			temp = promosTemp +  commonTemp;
			$('.row').append(temp);
			insightManager.drawPromosChart(id);
		}
		else{
			temp = competitionAnalysisTemp +  commonTemp;
			$('.row').append(temp);
			insightManager.drawCompetitionAnalysisChart(id);
		}
	},
	attachEvent : function(){
		
		
		
		
	},
	appendFullList :  function(container,id){
		//list 
		$(container).empty();
		var tempList =  insightManager.salesChartArray ; 
		
		var temp = "";
		for(var i = 0 ; i < tempList.length ; i++ ){
			temp += ' <div class="list-row"><div class="list-cell">'+tempList[i]['Description']+'</div><div class="list-cell">'+tempList[i]['Sales Volume']+'</div></div>';
		}
		console.log(temp);
		$(container).append(temp);
		console.log($(container));
	},
	attachEventsWithTemplate : function(id){
		
	},
	moduleRevertBack :  function(id){
		
		var headingName = "";
		var container ;
		if(id in mapper["sales"]){
			headingName = mapper["sales"][id]; 
			container = $($('.tabPanel').find('.sales'));
		}
		else if(id in mapper["digital"]){
			headingName = mapper["digital"][id]; 
			container = $($('.tabPanel').find('.digital'));
		}
		else if(id in mapper["promos"]){
			headingName = mapper["promos"][id] ;
			container = $($('.tabPanel').find('.promos'));
		}
		else{
			headingName = mapper["competitionAnalysis"][id] ;
			container = $($('.tabPanel').find('.competitionAnalysis'));
		}
		
		var template = '<div class="chart-thum" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
		'<div class="thum-box">'+
		'<img src="img/chart.png" id="'+id+'" alt="" >'+
		'<h2 class="boxtitle">'+ headingName +'</h2> </div>'+
		'</div>';
		
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
		insightManager.moduleAppendAtDashboard(id);
	},
	drawSalesChart : function(id){
		
		var tempList = insightManager.salesChartArray;
		console.log(insightManager.salesChartArray);
		
		var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":8,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":"bold","xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":14,"gridLineColor":"#353b37"};
		
		
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
				"color": "#FF9E01"
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
			"imagesArray" :["logo/img5.png","logo/img1.png","logo/img3.png","logo/img6.png","logo/img7.png"],
			"lowerTextDes" :[],
			unit : "%"  
		};
		for(var i =0 ; i < 5 ;  i++){
			data.barData[i]['yTick'] =  tempList[i]['SKU-ID'];
			data.barData[i]['yData'] =  tempList[i]['Sales Volume'];
			data['lowerTextDes'].push(tempList[i]['Description']);
		}
		
		var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
		stocChart55.threeDShutterStackAnalysis(data);
		
		
	},
	drawDigitalChart : function(id){
		var data = {
			"yAxisData" : [],
			"lowerColorArray":["#1ab977","#ee1d79","#942284","#f1b02e","#fe0000"],
			"upperColor":"#e6e6e6",
			"imagesArray" :["logo/img5.png","logo/img1.png","logo/img3.png","logo/img6.png","logo/img7.png"],
			"threeDPathColor":"#f7fbf4",
			"xAxisData" : [],
			"unit" : "%"
		}
		
		var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":8,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
		
		var tempList = insightManager.salesChartArray;
		
		for(var i =0 ; i < 5 ;  i++){
			data['yAxisData'].push(tempList[i]['Sales Volume']);//tempList[i]['SKU-ID'];
			data['xAxisData'].push(tempList[i]['Description']);
		}
		
		var stocChart43=$("#chart_" + id).stocCharts(textStyleConfg);
		stocChart43.threeDRoundedBarChartAnalysis(data);
		
		
	},
	drawPromosChart : function(id){
		var tempList = insightManager.salesChartArray;
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
		
		for(var i =0 ; i < 5 ;  i++){
			data['yAxisData'].push(tempList[i]['Description']);//tempList[i]['SKU-ID'];
			data.key[0]['data'].push(tempList[i]['Sales Volume']);
		}
		
		
		var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
		var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
		stocChart55.horizontalStackedBarChartAnalysis(data);
		
		
		
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
		for(var i =0 ; i < 5 ;  i++){
			data['yAxisData'].push(tempList[i]['Sales Volume']);//tempList[i]['SKU-ID'];
			data['xAxisData'].push(tempList[i]['Description']);
		}
		
		
		var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#000","tick-font-color":"#000","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
		
		var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
		stocChart55.simpleBarChartAnalysis(data);
		
		
	},
	
};


var mapper  =  {
	"digital" : {
		"dp0" : "default Digital",	
		"dp1": "Not listed products",
		"dp2": "out of stock products",
		"dp3": "Best sellers",
		"dp4": "Product with inconsistent/bad ratings",
		"dp5": "First rank of pepsi's product",
		"dp6": "Competition Products",
		"dp7": "category on a channel",
		"dp8": "brand wise list",
		"dp9": "List of products",
		"dp10": "List of products"	
	},
	"sales" : {
		"s0"  :  "default Sales",
		"s1": "Total sales per channel",
		"s2": "Top performer products",
		"s3": "Worst performer products",
		"s4": "share of sales",
		"s5": "Competition best sellers"
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
	
};
/*
	var apiMapper = {
	"dp0" : 
    "dp1": 
    "dp2": 
    "dp3": 
    "dp4": 
    "dp5": 
    "dp6": 
    "dp7": 
    "dp8": 
    "dp9": 
    "dp10":
	"s0" :
    "s1" : 
    "s2" : 
    "s3" : 
    "s4" : 
    "s5" : 
	"p0" : 
	"p1" : 
	"p2" :
	"p3" :
	} 
	
	var data =  {
	title : "Last 10 year sales",
	yAxisLabel : "Sales",
	yAxisUnit : "Crores",
	toolTipUnit : "Year",
	yAxisData : [275,300,320,250,230,270,140,190,300,370],
	xAxisLabel : "Years",
	xAxisData : [2005,2006,2007,2008,2009,2010,2011,2012,2013,2014],
	barColor : "#68aad1"
	};	
	var list = [
	{
	pn : "7 Up" ,
	val :  853
	},
	{
	pn : "Diet Pepsi",
	val :  568,
	},
	{
	pn : "Gatorade",
	val:2021
	},
	{
	pn : "Kurkure",
	val :2513	
	},
	{
	pn : "Lay's",
	val :849	
	},
	{
	pn:"Lay's",
	val:8252
	},
	{
	pn : "Lipton",
	val : 3124	
	},
	{
	pn :"Mirinda",
	val:473	
	},
	{
	pn : "Mountain Dew",
	val :1271
	},
	{
	pn : "Pepsi",
	val :416 	
	},
	{
	pn : "Quaker Oats",
	val:1216
	},
	{
	pn : "Tropicana",
	val:5305	
	}
	];
	var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
	
	var AdvancedBarData={
    "title":"Top sales List",
    "yData":[],
    'xData':[],
    "imagePathArray":["logo/img5.png","logo/img10.png","logo/img3.png","logo/img6.png","logo/img7.png"],
    "color":["#e67a77"],
    "yIndicationLabel":"Profit(in Billion $)",
    "xIndicationLabel":"Company"
    
	
	}
	
	var colorArray=["#A3BFDB"];
	var xFieldName="product";
	var yFieldName="sales";
	var axisColor="black";
	
	var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
	var cnfg={"data":AdvancedBarData};	
*/
window.onload =  function(){
	insightManager.init();
	
}