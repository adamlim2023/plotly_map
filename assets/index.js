mapboxgl.accessToken = 'pk.eyJ1IjoicGluazExMTFtYXBzIiwiYSI6ImNsaWQ0cmtndjBsZzIzZm4yN2U2NXYwYnoifQ.9PB39FfjdT-FE9TZWbkNMA';
var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

const categories = {
  "Capture fisheries production (metric tons)": "Wild Capture production",
  "Aquaculture production (metric tons)": "Aquaculture production",
};

var scls = {
  "Capture fisheries production (metric tons)": [[0, 'rgb(255, 0, 0)'], [1, 'rgb(255, 255, 0)']],
  "Aquaculture production (metric tons)": [[0, 'rgb(0, 255, 0)'], [1, 'rgb(255, 255, 0)']],
}

function unpack(rows, key) {
  return rows.map(function (row) { return row[key]; });
}

function render(category, year) {
  console.log(year)
  d3.csv('/assets/data.csv', function (err, rows) {
    var years = [...new Set(unpack(rows, 'Year'))].map(function (item) {
      return item * 1
    }).sort();

    $('#year').attr('min', years[0]);
    $('#year').val(year);
    $('#year-container p').text(year);
    $('#year').attr('max', years[years.length - 1]);

    const filteredRowsByYear = rows.filter(function (row) { return row.Year * 1 === year * 1 });
    var coordinates = {};
    var countryArray = unpack(rows, 'Entity');
    var countries = [...new Set(countryArray)];

    countries.map(function (country) {
      mapboxClient.geocoding.forwardGeocode({
        query: country,
        types: ['country'],
        limit: 1
      })
        .send()
        .then(function (response) {
          if (response && response.body && response.body.features && response.body.features.length) {
            var feature = response.body.features[0];
            coordinates[country] = {
              lat: feature.center[1],
              lng: feature.center[0],
            }
          }
        });
    })

    setTimeout(function () {
      var lats = [];
      var lons = [];
      var labels = [];
      filteredRowsByYear.map(function (row) {
        var country = row.Entity;
        if (coordinates[country]) {
          lats.push(coordinates[country].lat);
          lons.push(coordinates[country].lng);
          labels.push(row.Entity + ': ' + (row[category] === "" ? 0 : row[category]))
        }
      });

      var data = [{
        type: 'scattermapbox',
        name: categories[category],
        text: labels,
        lat: lats,
        lon: lons,
        hoverinfo: "text",
        marker: {
          color: unpack(rows, 'Aquaculture production (metric tons)'),
          colorscale: scls[category],
          cmin: 0,
          cmax: 1.4,
          reversescale: true,
          opacity: 0.5,
          size: 10,
          colorbar: {
            thickness: 20,
            titleside: 'bottom',
            outlinecolor: 'rgba(68,68,68)',
            ticklen: 5,
            shoticksuffix: 'last',
            dtick: 1
          }
        },
      }];

      var layout = {
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
        showlegend: true,
        annotations: [{
          x: 0,
          y: 0,
          xref: 'paper',
          yref: 'paper',
          text: 'Source: <a href="https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh" style="color: rgb(255,255,255)">NASA</a>',
          showarrow: false
        }]
      };

      Plotly.setPlotConfig({
        mapboxAccessToken: "pk.eyJ1IjoicGluazExMTFtYXBzIiwiYSI6ImNsaWQ0cmtndjBsZzIzZm4yN2U2NXYwYnoifQ.9PB39FfjdT-FE9TZWbkNMA"
      });

      Plotly.newPlot('map', [data[0]], layout);
    }, 1000);
  });
}

$(document).ready(function () {
  render('Capture fisheries production (metric tons)', 1960);

  $('#category').change(function (e) {
    render(e.target.value, $('#year').val() * 1);
  });

  $('#year').change(function (e) {
    render($('#category').val(), e.target.value * 1);
  })
});