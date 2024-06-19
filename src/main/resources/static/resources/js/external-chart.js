//Reusable Component
//this external Charts can be used for multiple instances
//instead of writing multiple code segments we can minimize the codes by writing a common validator that can be used at any place

const generateChart=(elementID,title,categories,yAxis,series)=>{

    Highcharts.chart(elementID, {
        chart: {
            type: 'column',
            backgroundColor: '#ffffff'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: yAxis
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:rebeccapurple;padding:0">'+yAxis+': </td>' +
                '<td style="padding:0"><b>&nbsp;{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: series,

    });

}

const generateMonochromePieChart = (elementID, title,axisName, series) => {
    const totalAmount = series.reduce((total, point) => total + point.y, 0);
    Highcharts.chart(elementID, {
        chart: {
            type: 'pie',
            backgroundColor: '#ffffff'
        },
        title: {
            text: title
        },
        subtitle: {
            text: 'Total '+axisName+' : ' + totalAmount
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">'+axisName+'</span><table>',
            pointFormat: '<tr><td style="color:rebeccapurple;padding:0">{point.name}: </td>' +
                '<td style="padding:0"><b>&nbsp;{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y}',
                    connectorColor: 'silver'
                },
                colors: (function () {
                    var colors = [],
                        base = Highcharts.getOptions().colors[0],
                        i;

                    for (i = 0; i < 10; i += 1) {
                        colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
                    }
                    return colors;
                }())
            }
        },
        series: [{
            name: 'Values',
            data: series
        }]
    });
}

const generateLineChart = (elementID, title, categories, yAxis, series) => {
    Highcharts.chart(elementID, {
        chart: {
            type: 'line',
            backgroundColor: '#ffffff'
        },
        title: {
            text: title
        },
        xAxis: {
            categories: categories,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: yAxis
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y} {yAxis}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                },
                enableMouseTracking: true
            }
        },
        series: series
    });
}
