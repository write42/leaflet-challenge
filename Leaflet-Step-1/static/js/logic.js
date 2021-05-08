function circleColor(mag) {
  var color = "";
  switch (true) {
    case (mag >= -10 && mag < 10):
      color = '#00FF00';
      break;
    case (mag >= 10 && mag < 30):
      color = '#B3FF00';
      break;
    case (mag >= 30 && mag < 50):
      color = '#F0FF00';
      break;
    case (mag >= 50 && mag < 70):
      color = '#FFB100';
      break;
    case (mag >= 70 && mag < 90):
      color = '#FF8300';
      break;
    case (mag >= 90):
      color = '#FF1300';
      break;
    default:
      color = '#000000';
      break;
  }

  console.log(color)
  return color;
}

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(queryUrl).then(function(response){
    //console.log(response)
    features = response.features
    function featurePop(featureData,layer){
        layer.bindPopup("<h3>"+featureData.properties.place +
        "</h3><hr><p>"+ new Date(featureData.properties.time)+"</p>")
    }
 
    var earthquakes = L.geoJSON(features, {
        onEachFeature: featurePop,
    
        pointToLayer: (featureData, latlng) => 
        {
          //console.log(featureData)
          //return L.marker(latlng)
          var depth = featureData.geometry.coordinates[2]
          console.log(depth)
          console.log(typeof depth)
          return L.circle(latlng,
            {radius: featureData.properties.mag*10000,
            color:'black',
            fillColor: circleColor(depth)}
            )
        }
    });
    
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  var baseMaps = {
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({
    position:'bottomright'
  });

  legend.onAdd = function(myMap){
    var div = L.DomUtil.create('div','legend');
    labels = ['<strong>Depth</strong>']
    categories = ['-10-10','10-30','30-50','50-70','70-90','90+'];
    colors = ['#00FF00','#B3FF00','#F0FF00','#FFB100','#FF8300','#FF1300']
    for (var i=0; i < categories.length; i++) {
      div.innerHTML += 
      '<i style ="background:' + colors[i] + '"></i>' +
      categories[i] + (categories[i+1] ? '&ndash;' + categories[i+1] + '<br>': '+');
    }
    //div.innerHTML = labels.join('</br>')
    return div;
  };
  legend.addTo(myMap);
})
