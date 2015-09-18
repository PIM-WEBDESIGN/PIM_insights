var insightManager = {
	init : function(){	
		insightManager.bindEvents();
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
				console.log(id);
				insightManager.moduleRevertBack(id);
				$($(this).parent().parent().parent().parent()).remove();
			}
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
		}
		else if(id in mapper["digital"]){
			headingName = mapper["digital"][id]; 
			temp = digitalTemp;
		}
		else{
			headingName = mapper["promos"][id] ;
			temp =  promosTemp;
		}
		
		var salesTemp =  '<div class="box box-primary" draggable="true" ondragstart="insightManager.ondragstart(event)" >'+
					'<div class="box-header with-border">'+
						'<h3 class="box-title"> <i class="fa fa-shopping-cart"></i>'+ headingName +'</h3>'+
						'<div class="box-tools pull-right" id='+ id +'>'+
							'<button type="button" class="btn btn-box-tool" data-widget="remove" ><i class="fa fa-times delete"></i></button>'+
						'</div>'+
					'</div>'+
					'<div class="box-body">'+
						'<div class="chart" id="chart_'+ id +'">'+
							//'<img src="img/chart.png" alt=""/>'+
						'</div>'+
					'</div><!-- /.box-body -->'+
				'</div>'; 
		
		var digitalTemp =   '<div class="box box-warning" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
					'<div class="box-header with-border">'+
						'<h3 class="box-title"> <i class="fa fa-lightbulb-o" ></i>'+ headingName +'</h3>'+
						'<div class="box-tools pull-right" id='+ id +'>'+
							'<button type="button" class="btn btn-box-tool" data-widget="remove" ><i class="fa fa-times delete"></i></button>'+
						'</div>'+
					'</div>'+
					'<div class="box-body">'+
						'<div class="chart" id="chart_'+ id +'">'+
							//<'<img src="img/chart.png" alt=""/>'+
						'</div>'+
					'</div><!-- /.box-body -->'+
				'</div>'; 
				
		var promosTemp = 	'<div class="box box-success" draggable="true" ondragstart="insightManager.ondragstart(event)">'+
					'<div class="box-header with-border">'+
						'<h3 class="box-title"> <i class="fa fa-shopping-cart"></i>'+ headingName +'</h3>'+
						'<div class="box-tools pull-right" id='+ id +'>'+
							'<button type="button" class="btn btn-box-tool" data-widget="remove" ><i class="fa fa-times delete"></i></button>'+
						'</div>'+
					'</div>'+
					'<div class="box-body">'+
						'<div class="chart" id="chart_'+ id +'">'+
							//'<img src="img/chart.png" alt=""/>'+
						'</div>'+
					'</div><!-- /.box-body -->'+
				'</div>';
		if(activeTemp == "sales"){
			temp = salesTemp;
		}
		else if(activeTemp == "digitalTemp"){
			temp = digitalTemp;
		}
		else{
			temp = promosTemp;
		}
		$('.row').append(temp);
		
		
		var stocChart10=$("#chart_" + id).stocCharts(textStyleConfg);
		stocChart10.drawThreeDBarChart(data);

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

var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"};
	
	
	
window.onload =  function(){
	insightManager.init();
}