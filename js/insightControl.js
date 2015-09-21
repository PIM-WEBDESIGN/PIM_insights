var insightManager = {
	init : function(){	
		insightManager.bindEvents();
		insightManager.moduleAppendAtDashboard('s0');
		insightManager.moduleAppendAtDashboard('dp0');
		insightManager.moduleAppendAtDashboard('p0');
	},	
	id : "",
	elements : [],
	bindEvents :  function(){
		
		$(document).on('click','img',function(){
			var id = $(this).attr('id');
			insightManager.moduleAppendAtDashboard(id);
			$($(this).parent().parent()).remove();
		});
		
		$(document).on('click','i',function(){
			if($($(this).parent()).attr('type') == "button"){
				
				var id = $($(this).parent().parent()).attr('id');
				insightManager.moduleRevertBack(id);
				$($(this).parent().parent().parent().parent()).remove();
			}
		});
		
		
		$(document).on('click','.right',function(){
			var id = $($(this).parent()).attr('id');
			console.log(id)
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
		
		
		
		$('.top-nav li a').click(function(e) {
			e.preventDefault();
			$('a').removeClass('active');
			$(this).addClass('active');
		});
		
		$(".btn-slide").click(function(){
			$(".btn-slide").toggleClass("click");
			$(".tabPanel").toggleClass("active");
			$("#arrow").toggleClass("fa-angle-double-right");
			$("#arrow").toggleClass("fa-angle-double-left");
			
		});
		
		$('button.btn-box-tool').click(function(){
			$(this).next('.col-md-4.col-sm-12').hide();
		});
		
		
		
		
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
		else{
			headingName = mapper["promos"][id];
			activeTemp = "promos";
		}
		
		var salesTemp =  '<div class="box box-primary" draggable="true" ondragstart="insightManager.ondragstart(event)" >'+
					'<div class="box-header with-border">'+
						'<h3 class="box-title">  <i class="fa fa-shopping-cart"></i>'+ headingName +'</h3>';
		
		
		var digitalTemp =   '<div  class="box box-warning" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
					'<div class="box-header with-border">'+
						'<h3 class="box-title">  <i class="fa fa-lightbulb-o" ></i>'+ headingName +'</h3>';
						
		var promosTemp = 	'<div  class="box box-success" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
					'<div class="box-header with-border">'+
						'<h3 class="box-title">  <i class="fa fa-shopping-cart"></i>'+ headingName +'</h3>';
						
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
		}
		else if(activeTemp == "digital"){
			temp = digitalTemp +  commonTemp;
		}
		else{
			temp = promosTemp +  commonTemp;
		}
		
		$('.row').append(temp);
		var tempList = list;
		
		tempList.sort(function(a, b) {
			return parseFloat(b.val) - parseFloat(a.val);
		});
		
		var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":16,"gridLineColor":"#353b37"};
		
		var data = {
					title : "Product Sale(Brand wise)",
					xAxisLabel :"Current Status",
					yAxisLabel :"Product",
					yAxisData : [],
					key: [
							{
								name: 'Product',
								data: [],
								color : "#00FFFF"
							}
							
						]
				}
		/*
		AdvancedBarData["yData"] = [];
		AdvancedBarData["xData"] = [];
		*/
		for(var i =0 ;  i < 5 ; i++){
			data["yAxisData"].push(tempList[i].pn);
			data["key"][0]['data'].push(tempList[i].val);
		}
		/*
		
		  var data  =  AdvancedBarData;
		  var stocChart30=$("#chart_" + id).stocCharts(textStyleConfg);
		  stocChart30.barWithLogo(cnfg);
		
		*/
		var stocChart55=$("#chart_" + id).stocCharts(textStyleConfg);
		stocChart55.horizontalStackedBarChartAnalysis(data);
	},
	appendFullList :  function(container,id){
		//list 
		$(container).empty();
		var tempList =  list ; 
		tempList.sort(function(a, b) {
			return parseFloat(b.val) - parseFloat(a.val);
		});
		var temp = "";
		for(var i = 0 ; i < tempList.length ; i++ ){
			temp += ' <div class="list-row"><div class="list-cell">'+tempList[i].pn+'</div><div class="list-cell">'+tempList[i].val+'</div></div>';
		}
		console.log(temp);
		$(container).append(temp);
		console.log($(container));
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
		else{
			headingName = mapper["promos"][id] ;
			container = $($('.tabPanel').find('.promos'));
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
		console.log('on drop');
		var tabPanel = $('.tabPanel').find('#'+insightManager.id);
		$($(tabPanel).parent().parent()).remove();
		insightManager.moduleAppendAtDashboard(id);
	}
	
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
	*/
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
];/*
var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
*/
var AdvancedBarData={
    "title":"Top sales List",
    "yData":[],
    'xData':[],
    "imagePathArray":["img/images/img5.png","img/images/img10.png","img/images/img3.png","img/images/img6.png","img/images/img7.png"],
    "color":["#e67a77"],
    "yIndicationLabel":"Profit(in Billion $)",
    "xIndicationLabel":"Company"
    
    /*
    "yData":[3,5,6],
    "xData":[1,2,3],
    "imagePathArray":["/img/images/img5.jpg","./img/logos/2.jpg","./img/logos/3.jpg"],
    "color":["cyan"]
    */
  }
  
  var colorArray=["#A3BFDB"];
  var xFieldName="product";
  var yFieldName="sales";
  var axisColor="black";

  var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
  var cnfg={"data":AdvancedBarData};	
	
window.onload =  function(){
	insightManager.init();
	
$('.button-list-group').on('click', function(){
    $(this).siblings().removeClass('btn-info')
    $(this).addClass('btn-info');

})


	
}