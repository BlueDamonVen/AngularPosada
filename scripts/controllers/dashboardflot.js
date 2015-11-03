'use strict';

/**
 * @ngdoc function
 * @name bearpms3App.controller:DashboardflotCtrl
 * @description
 * # DashboardflotCtrl
 * Controller of the bearpms3App
 */
angular.module('bearpms3App')
  .controller('dashboardFlotCtrl', function ($scope) {
    //
	var data1 = [
		[gd(2015, 1, 1), 838], [gd(2015, 1, 2), 749], [gd(2015, 1, 3), 634], [gd(2015, 1, 4), 1080], [gd(2015, 1, 5), 850], [gd(2015, 1, 6), 465], [gd(2015, 1, 7), 453], [gd(2015, 1, 8), 646], [gd(2015, 1, 9), 738], [gd(2015, 1, 10), 899], [gd(2015, 1, 11), 830], [gd(2015, 1, 12), 789]
	];
	
	var data2 = [
		[gd(2015, 1, 1), 342], [gd(2015, 1, 2), 721], [gd(2015, 1, 3), 493], [gd(2015, 1, 4), 403], [gd(2015, 1, 5), 657], [gd(2015, 1, 6), 782], [gd(2015, 1, 7), 609], [gd(2015, 1, 8), 543], [gd(2015, 1, 9), 599], [gd(2015, 1, 10), 359], [gd(2015, 1, 11), 783], [gd(2015, 1, 12), 680]
	];
	
	var series = new Array();

	series.push({
		data: data1,
		bars: {
			show : true,
			barWidth: 24 * 60 * 60 * 12000,
			lineWidth: 1,
			fill: 1,
			align: 'center'
		},
		label: 'Revenues'
	});
	series.push({
		data: data2,
		color: '#e84e40',
		lines: {
			show : true,
			lineWidth: 3,
		},
		points: { 
			fillColor: "#e84e40", 
			pointWidth: 1,
			show: true 
		},
		label: 'Orders'
	});

	$.plot("#graph-bar", series, {
		colors: ['#03a9f4', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#95a5a6'],
		grid: {
			tickColor: "#f2f2f2",
			borderWidth: 0,
			hoverable: true,
			clickable: true
		},
		legend: {
			noColumns: 1,
			labelBoxBorderColor: "#000000",
			position: "ne"       
		},
		shadowSize: 0,
		xaxis: {
			mode: "time",
			tickSize: [1, "month"],
			tickLength: 0,
			// axisLabel: "Date",
			axisLabelUseCanvas: true,
			axisLabelFontSizePixels: 12,
			axisLabelFontFamily: 'Open Sans, sans-serif',
			axisLabelPadding: 10
		}
	});

	var previousPoint = null;
	$("#graph-bar").bind("plothover", function (event, pos, item) {
		if (item) {
			if (previousPoint != item.dataIndex) {

				previousPoint = item.dataIndex;

				$("#flot-tooltip").remove();
				var x = item.datapoint[0],
				y = item.datapoint[1];

				showTooltip(item.pageX, item.pageY, item.series.label, y );
			}
		}
		else {
			$("#flot-tooltip").remove();
			previousPoint = [0,0,0];
		}
	});

    //
  });
