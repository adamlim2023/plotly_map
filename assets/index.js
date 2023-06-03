var data = [{
  type:'scattermapbox',
  lat:['45.5017'],
  lon:['-73.5673'],
  mode:'markers',
  marker: {
    size:14
  },
  text:['Montreal']
}]

var layout = {
  autosize: true,
  hovermode:'closest',
  mapbox: {
    bearing:0,
    center: {
      lat:45,
      lon:-73
    },
    pitch:0,
    zoom:5
  },
}

Plotly.setPlotConfig({
  mapboxAccessToken: "pk.eyJ1IjoicGluazExMTFtYXBzIiwiYSI6ImNsaWQ0cmtndjBsZzIzZm4yN2U2NXYwYnoifQ.9PB39FfjdT-FE9TZWbkNMA"
})

Plotly.newPlot('myDiv', data, layout)
