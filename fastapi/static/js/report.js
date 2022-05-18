function plot_binning_histogram(element_id, histogram_data) {
    let {title_name, legend_names, x_points, y_points_by_legend_names} = histogram_data;
    let {layout_parameters} = histogram_data;
    // legend_names is array, such as [FPS, training_tme]
    // x_points is (1 * N)
    // y_points_by_legend_names is (legend_names.length * N)
    let data = new Array(legend_names.length);
    for (let legend_idx = 0; legend_idx < legend_names.length; legend_idx++) {
        let legend_name = legend_names[legend_idx];
        let y_points_by_legend_name = y_points_by_legend_names[legend_idx];
        data[legend_idx] = {
            histfunc: "sum",
            y: y_points_by_legend_name,
            x: x_points,
            type: "histogram",
            name: legend_name
        }
    }
    let layout = {
        ...layout_parameters,
        title: title_name
    };
    let config = {responsive: true}
    Plotly.newPlot(element_id, data, layout, config);
}

function plot_heatmap(element_id, heatmap_data) {
    // x_points: (N)
    // y_points: (M)
    // z_matrix: (N * M)
    let {title_name, x_points, y_points, z_matrix} = heatmap_data;
    let {layout_parameters} = heatmap_data;
    var colorscaleValue = [
        [0, '#F50F00'],
        [1, '#FFFFFF'],
        [2, '#120BF5']
    ];

    var data = [{
        x: x_points,
        y: y_points.reverse(),
        z: z_matrix.reverse(),
        type: 'heatmap',
        colorscale: colorscaleValue,
        showscale: false
    }];

    var layout = {
    ...layout_parameters,
    title: title_name,
    annotations: [],
    xaxis: {
        ticks: '',
        side: 'top'
    },
    yaxis: {
        ticks: '',
        ticksuffix: ' ',
        // width: 700,
        // height: 700,
        // autosize: false
    }
    };

    for ( var i = 0; i < y_points.length; i++ ) {
        for ( var j = 0; j < x_points.length; j++ ) {
            var currentValue = z_matrix[i][j];
            if (currentValue != 0.0) {
                var textColor = 'white';
            }else{
                var textColor = 'black';
            }
            var result = {
                xref: 'x1',
                yref: 'y1',
                x: x_points[j],
                y: y_points[i],
                text: z_matrix[i][j],
                font: {
                    family: 'Arial',
                    size: 12,
                    color: 'rgb(50, 171, 96)'
                },
                showarrow: false,
                font: {
                    color: textColor
                }
            };
            layout.annotations.push(result);
        }
    }
    let config = {responsive: true}
    Plotly.newPlot(element_id, data, layout, config);
}

// So far, useless!
function plot_table(element_id, table_data) {
    // M: number of rows; N: number of columns
    // columns_value is array (N * M)
    // headers is ([[head1], [head2], ...[headN]])
    let {columns_value, headers} = table_data;
    var data = [{
        type: 'table',
        columnorder: [1,2],
        columnwidth: [250,250],
        header: {
          values: headers,
           align: ["center", "center"],
           height: 30,
          line: {width: 1, color: '#506784'},
          fill: {color: '#119DFF'},
          font: {family: "Arial", size: 16, color: "white"}
        },
        cells: {
          values: columns_value,
          align: ["center", "center"],
           height: 30,
          line: {color: "#506784", width: 1},
        //    fill: {color: ['#25FEFD', 'white']},
            fill: {color: '#25FEFD'},
          font: {family: "Arial", size: 11, color: ["#506784"]}
        }
    }]
    let layout = {
        width: 500,
        height: 300,
    }
    Plotly.newPlot(element_id, data, layout);
}

function plot_pie(element_id, pie_data) {
    let {labels, values} = pie_data;
    let {layout_parameters} = pie_data;

    var data = [{
        type: "pie",
        values: values,
        labels: labels,
        textinfo: "label+percent",
        textposition: "outside",
        automargin: true
      }]
      
      var layout = {
        ...layout_parameters,
        margin: {"t": 0, "b": 0, "l": 0, "r": 0},
        showlegend: false
        }
      
      Plotly.newPlot(element_id, data, layout)
}