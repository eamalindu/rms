//Reusable Component
//this external Charts can be used for multiple instances
//instead of writing multiple code segments we can minimize the codes by writing a common function that can be used at any place
const generateChart=(elementID,title,categories,yAxis,series)=>{

    // Function to create a Highcharts column chart
    Highcharts.chart(elementID, {
        chart: {
            // Define the type of chart as 'column'
            type: 'column',
            // Set the background color of the chart
            backgroundColor: '#ffffff'
        },
        title: {
            // Set the chart title
            text: title
        },
        xAxis: {
            // Define categories for the x-axis
            categories: categories,
            // Enable crosshair for better visibility
            crosshair: true
        },
        yAxis: {
            // Set the minimum value for the y-axis
            min: 0,
            title: {
                // Set the title for the y-axis
                text: yAxis
            }
        },
        tooltip: {
            // Define the header format for the tooltip
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            // Define the point format for the tooltip, showing y-axis value
            pointFormat: '<tr><td style="color:#3788d8;padding:0">' + yAxis + ': </td>' +
                '<td style="padding:0"><b>&nbsp;{point.y}</b></td></tr>',
            // Define the footer format for the tooltip
            footerFormat: '</table>',
            // Share the tooltip among all series
            shared: true,
            // Use HTML to format the tooltip
            useHTML: true
        },
        plotOptions: {
            column: {
                // Define padding between columns
                pointPadding: 0.2,
                // Define border width of columns
                borderWidth: 0
            }
        },
        // Define the data series for the chart
        series: series
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
            pointFormat: '<tr><td style="color:#3788d8;padding:0">{point.name}: </td>' +
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
                colors: series.map(() => ({
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                    stops: [
                        [0, '#5ecde1'],
                        [1, '#2caee2']
                    ]
                }))
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
                '<td style="padding:0"><b>&nbsp;Rs.{point.y} {yAxis}</b></td></tr>',
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
