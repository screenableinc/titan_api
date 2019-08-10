var target = 300;

var progress_template="                                    <div class=\"progress-card\">\n" +
	"                                        <div class=\"d-flex justify-content-between mb-1\">\n" +
	"                                            <span class=\"text-muted\">---label---</span>\n" +
	"                                            <span class=\"text-muted fw-bold\"> ---value---</span>\n" +
	"                                        </div>\n" +
	"                                        <div class=\"progress mb-2\" style=\"height: 7px;\">\n" +
	"                                            <div class=\"progress-bar ---bg---\" role=\"progressbar\" style=\"width: ---width---%\" aria-valuenow=\"---percentage---\" aria-valuemin=\"0\" aria-valuemax=\"100\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"78%\"></div>\n" +
	"                                        </div>\n" +
	"                                    </div>"

var row="<tr>\n" +
	"                                        <td>---id---</td>\n" +
	"                                        <td>---timestamp---</td>\n" +
	"                                        <td>---severity---</td>\n" +
	"                                        <td>---class---</td>\n" +
	"                                        <td>---method---</td>\n" +
	"                                        <td>---message---</td>\n" +
	"                                    </tr>"
function activate_circles(val) {

	Circles.create({
		id: 'task-complete',
		radius: 75,
		value: val,
		maxValue: 100,
		width: 8,
		text: function (value) {
			return value + '%';
		},
		colors: ['#eee', '#1D62F0'],
		duration: 400,
		wrpClass: 'circles-wrp',
		textClass: 'circles-text',
		styleWrapper: true,
		styleText: true
	})
}



function get_data(){
	$.ajax({
		type: "GET", //rest Type
		 //mispelled
		url: "./analytics/data",
		async: false,
		contentType: "application/json; charset=utf-8",
		success: function (msg) {
			var data =JSON.parse(msg);
			$("#daus").text(data.length)
			//by default program is selected categoy in select
			loadDataByProgram(data)
			activate_circles((data.length/target)*100)

			$("#category").on("change", function (e) {
				var currValue = $(e.currentTarget).val()
				if(currValue==="Program"){
					loadDataByProgram(data)
				}else if(currValue==="Mode"){
					loadDataByMode(data)
				}else if(currValue==="Year"){
					loadDataByYear(data)
				}

			})




		}
	});

	$.ajax({
		type:"GET",
		url:"./analytics/errors",
		async: false,
		contentType: "application/json; charset=utf-8",
		success: function (msg) {
			loadErrors(JSON.parse(msg))
		}
	})
}

function loadErrors(data) {
	var html = ""
	for (var i = 0; i < data.length; i++) {
		var row_template = row
		row_template=row_template.replace("---id---",data[i]["student_id"]).replace("---timestamp---",data[i]["timestamp"]).replace("---class---",data[i]["class_origin"]).replace("---severity---",data[i]["severity"]).replace("---method---",data[i]["function_origin"]).replace("---message---",data[i]["error_message"])
		html=html+row_template
	}

	$("#errorsbody").html(html)
}

function loadDataByYear(data) {
	var classes =['bg-info', 'bg-success', 'bg-primary','bg-warning']
	var years = [];
	console.log(data)

	for (var i = 0; i < data.length; i++) {


		if (years.indexOf(data[i]["year"]) == -1) {
			years.push(data[i]["year"]);
		}
	}

	var new_temp = ""

	for (var i = 0; i < years.length; i++) {
		var html = progress_template
		var rand_int =Math.floor(Math.random() * 4);

		//get how many times it occurs
		var value = g(years, years[i])
		var percentage = (value/data.length)*100

		html = html.replace("---value---", value).replace("---percentage---",percentage).replace("---label---",years[i]).replace("---width---",percentage);
		html = html.replace("---bg---", classes[rand_int])
		new_temp=new_temp+html
		console.log(percentage,value)
	}



	$("#data").html(new_temp)
}

function loadDataByMode(data) {
	var classes =['bg-info', 'bg-success', 'bg-primary','bg-warning']
	var modes = [];
	console.log(data)

	for (var i = 0; i < data.length; i++) {


		if (modes.indexOf(data[i]["mode"]) == -1) {
			modes.push(data[i]["mode"]);
		}
	}

	var new_temp = ""

	for (var i = 0; i < modes.length; i++) {
		var html = progress_template
		var rand_int =Math.floor(Math.random() * 4);

		//get how many times it occurs
		var value = g(modes, modes[i])
		var percentage = (value/data.length)*100
		html = html.replace("---value---", value).replace("---percentage---",percentage).replace("---label---",modes[i]).replace("---width---",percentage);
		html = html.replace("---bg---", classes[rand_int])
		new_temp=new_temp+html
		console.log(percentage,value)
	}



	$("#data").html(new_temp)
}

function loadDataByProgram(data){


	var classes =['bg-info', 'bg-success', 'bg-primary','bg-warning']
	var programs = [];
	console.log(data)

	for (var i = 0; i < data.length; i++) {


		if (programs.indexOf(data[i]["program"]) == -1) {
			programs.push(data[i]["program"]);
		}
	}

	var new_temp = ""

	for (var i = 0; i < programs.length; i++) {
		var html = progress_template
		var rand_int =Math.floor(Math.random() * 4);

		//get how many times it occurs
		var value = g(programs, programs[i])
		var percentage = (value/data.length)*100
		html = html.replace("---value---", value).replace("---percentage---",percentage).replace("---label---",programs[i]).replace("---width---",percentage);
		html = html.replace("---bg---", classes[rand_int])
		new_temp=new_temp+html
		console.log(percentage,value)
	}



	$("#data").html(new_temp)
}


function g(array,value){
	var n = -1;
	var i = -1;
	do {
		n++;
		i = array.indexOf(value, i+1);
	} while (i >= 0  );
	console.log(value)

	return n;
}

get_data()

$.notify({
	icon: 'la la-bell',
	title: 'Bootstrap notify',
	message: 'Turning standard Bootstrap alerts into "notify" like notifications',
},{
	type: 'success',
	placement: {
		from: "bottom",
		align: "right"
	},
	time: 1000,
});

// monthlyChart

Chartist.Pie('#monthlyChart', {
	labels: ['50%', '20%', '30%'],
	series: [50, 20, 30]
}, {
	plugins: [
	Chartist.plugins.tooltip()
	]
});

// trafficChart
var chart = new Chartist.Line('#trafficChart', {
	labels: [1, 2, 3, 4, 5, 6, 7],
	series: [
	[5, 9, 7, 8, 5, 3, 5],
	[6, 9, 5, 10, 2, 3, 7],
	[2, 7, 4, 10, 7, 6, 2]
	]
}, {
	plugins: [
	Chartist.plugins.tooltip()
	],
	low: 0,
	height: "245px",
});

// salesChart
var dataSales = {
	labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	series: [
	[5, 4, 3, 7, 5, 10, 3, 4, 8, 10, 6, 8],
	[3, 2, 9, 5, 4, 6, 4, 6, 7, 8, 7, 4]
	]
}

var optionChartSales = {
	plugins: [
	Chartist.plugins.tooltip()
	],
	seriesBarDistance: 10,
	axisX: {
		showGrid: false
	},
	height: "245px",
}

var responsiveChartSales = [
['screen and (max-width: 640px)', {
	seriesBarDistance: 5,
	axisX: {
		labelInterpolationFnc: function (value) {
			return value[0];
		}
	}
}]
];

Chartist.Bar('#salesChart', dataSales, optionChartSales, responsiveChartSales);

$(".mapcontainer").mapael({
	map : {
		name : "world_countries",
		zoom: {
			enabled: true,
			maxLevel: 10
		},
		defaultPlot: {
			attrs: {
				fill: "#004a9b"
				, opacity: 0.6
			}
		}, 
		defaultArea: {
			attrs: {
				fill: "#e4e4e4"
				, stroke: "#fafafa"
			}
			, attrsHover: {
				fill: "#59d05d"
			}
			, text: {
				attrs: {
					fill: "#505444"
				}
				, attrsHover: {
					fill: "#000"
				}
			}
		}
	},
	areas: {
				// "department-56": {
				// 	text: {content: "Morbihan", attrs: {"font-size": 10}},
				// 	tooltip: {content: "<b>Morbihan</b> <br /> Bretagne"}
				// },
				"ID": {
					tooltip: {content: "<b>Indonesia</b> <br /> Tempat Lahir Beta"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}
				},
				"RU": {
					tooltip: {content: "<b>Russia</b>"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}					
				},
				"US": {
					tooltip: {content: "<b>United State</b>"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}					
				},
				"AU": {
					tooltip: {content: "<b>Australia</b>"},
					attrs: {
						fill: "#59d05d"
					}
					, attrsHover: {
						fill: "#59d05d"
					}					
				}
			},
		});