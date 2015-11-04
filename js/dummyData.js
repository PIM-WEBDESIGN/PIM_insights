

// Latttttttuuuuuuuuu
var data = 
{
	"rank" : ["01","02","03","04"],
	"icon" : ["img/logo_colored/img1.png","img/logo_colored/img9.png","img/logo_colored/img6.png","img/logo_colored/img5.png","img/logo_colored/img7.png"],
	"title" : ["product abc","product abc","product abc","product abc","product abc"],
	"description" : ["product infographics design for products according to brand","product infographics design","product infographics design","product infographics design","product infographics design"],
	"bulbImage" :"img/logo_colored/bulb.png",
	"cylinderColor" : "#c9c9c7",
	"pathColor" : "#FFFFFF",
	"unit" : "%"
}

var textStyleConfg={"font-description":8,"font-size-heading":12,"font-color-heading":"black","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
var stocChart55=$("#advanceChartContainer").stocCharts(textStyleConfg);
stocChart55.infographicRankStandAnalysis(data);

////////////warning

var data = {
	"key" : 3,
	"color" : "#ef2f1a",
	"image" : ""
}

var textStyleConfg={"font-description":8,"font-size-heading":12,"font-color-heading":"black","font-family":"arial","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"black","titleFontSize":10,"gridLineColor":"#353b37"};
var stocChart55=$("#advanceChartContainer").stocCharts(textStyleConfg);
stocChart55.infographicTrianglePathAnalysis(data);


///// horzontal bar chart 

var data = {
	title : "Product Sale(Brand wise)",
	xAxisLabel :"Current Status",
	yAxisLabel :"Product",
	yAxisData : ["Pepsi","Mountain Dew","Lipton","Kurkure"],
	key: [
		{
			name: '',
			data: [50, 30, 40, 37],
			color : "#ff0010"
		},
		{
			name: '',
			data: [0, 40, 32, 25],
			color : "#fff600"
		}, 
		{
			name: '',
			data: [0, 43, 0, 22],
			color : "#00ff00"
		}
		
	]
}  
var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"#a7a7a7","tick-font-color":"#a7a7a7","legendTextColor":"white","font-weight":400,"xLabelColor":"#a7a7a7","yLabelColor":"#a7a7a7","chartTitleColor":"#a7a7a7","titleFontSize":12,"gridLineColor":"#353b37"};
var stocChart55=$("#line1").stocCharts(textStyleConfg);
stocChart55.horizontalStackedBarChartAnalysis(data);




///////////////transitPie data//////////////
var dataSet= {
	key :['Kurkure','7UP','Mountain Dew'],
	value : [12000,8850,10000],
	label : 'Cost',
	color : ['#e67a77','#95d7bb','#aec785'],
	innerRadius:0,
	legendOrient : "right"
	
};

var textStyleConfg={"font-family":"Gotham, 'Helvetica Neue', Helvetica, Arial, sans-serif","font-size":10,"background":"none","font-color":"white","font-weight":300,"axisTextColor":"purple","legendTextColor":"#a7a7a7","gridLineColor":"#353b37"}; 
var stocChart5=$("#line1").stocCharts(textStyleConfg);
//var colorPieArray=["#7cb5ec","#434348","#90ed7d","orange","green","cyan"];
stocChart5.drawPieChartWithTransition(dataSet);







/////////////gauge Graph////////////
var gaugeChartData =  {
    "data" :[{"totalValue":100,"valAchieve":40.34}],
    "colorArray" : ["#a70328","#c1e0f7"],
    "toolTipMsg":"speed",
    "meterLabel" : ["Min","Max"]
}
var textStyleConfg={"font-family":" 'Maven Pro',sans-serif","font-size":12,"background":"none","font-color":"black","tick-font-color":"#a7a7a7","legendTextColor":"#a7a7a7","font-weight":400,"xLabelColor":"white","yLabelColor":"white","chartTitleColor":"white","titleFontSize":16,"gridLineColor":"#353b37"}; 
var stockChart15=$("#line1").stocCharts(textStyleConfg);
stockChart15.gaugeGraph(gaugeChartData);


///////////////////////////// music spikes
////
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
  var stocChart36=$("#line1").stocCharts(textStyleConfg);
  stocChart36.musicSpikesAnalysis(cnfg);
  
  
//////////////// comparison chart
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
  var stocChart37=$("#line1").stocCharts(textStyleConfg);
  stocChart37.comparisonAnalysis(cnfg);