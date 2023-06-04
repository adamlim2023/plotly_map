d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2015_06_30_precipitation.csv', function (err, rows) {
  function unpack(rows, key) {
    return rows.map(function (row) { return row[key]; });
  }

  console.log(rows)

  scl = [[0, 'blue'], [1, 'red']];

  var data = [{
    type: 'scattermapbox',
    mode: 'markers',
    text: unpack(rows, 'Globvalue'),
    lon: unpack(rows, 'Lon'),
    lat: unpack(rows, 'Lat'),
    marker: {
      color: unpack(rows, 'Globvalue'),
      colorscale: scl,
      cmin: 0,
      cmax: 1.4,
      reversescale: true,
      opacity: 0.5,
      size: 10,
      colorbar: {
        thickness: 5,
        titleside: 'right',
        outlinecolor: 'rgba(68,68,68)',
        ticks: 'outside',
        ticklen: 20,
        shoticksuffix: 'last',
        ticksuffix: 'value',
        dtick: 0.1
      }
    },
    name: 'NA Precipitation'
  }];

  layout = {
    font: {
      color: 'white'
    },
    dragmode: 'zoom',
    mapbox: {
      center: {
        lat: 38.03697222,
        lon: -90.70916722
      },
      domain: {
        x: [0, 1],
        y: [0, 1]
      },
      style: 'dark',
      zoom: 2
    },
    margin: {
      r: 0,
      t: 0,
      b: 0,
      l: 0,
      pad: 0
    },
    paper_bgcolor: '#191A1A',
    plot_bgcolor: '#191A1A',
    showlegend: false
  };

  Plotly.setPlotConfig({
    mapboxAccessToken: "pk.eyJ1IjoicGluazExMTFtYXBzIiwiYSI6ImNsaWQ0cmtndjBsZzIzZm4yN2U2NXYwYnoifQ.9PB39FfjdT-FE9TZWbkNMA"
  })

  Plotly.newPlot('map', data, layout);
});
