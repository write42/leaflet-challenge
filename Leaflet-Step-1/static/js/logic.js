var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(queryUrl).then(function(response){
    //console.log(response)
    features = response.features
    function featurePop(featureData,layer){
        layer.bindPopup("<h3>"+featureData.properties.place +
        "</h3><hr><p>"+ new Date(featureData.properties.time)+"</p>")
    }
    var color = "";
    function circleColor(mag) {
      switch (true) {
        case (x >= -10 && x < 10):
          color = '00FF00';
          break;
        case (x >= 10 && x < 30):
          color = 'B3FF00';
          break;
        case (x >= 30 && x < 50):
          color = 'F0FF00';
          break;
        case (x >= 50 && x < 70):
          color = 'FFB100';
          break;
        case (x >= 70 && x < 90):
          color = 'FF8300';
          break;
        case (x >= 90):
          color = 'FF1300';
          break;
        default:
          color = '000000';
          break;
      }
    }
    var earthquakes = L.geoJSON(features, {
        onEachFeature: featurePop,
    
        pointToLayer: (featureData, latlng) => 
        {
          console.log(featureData)
          //return L.marker(latlng)
          //depth of earthquake = featureData.geometry.coordinates[2]
          return L.circle(latlng,
            {radius: featureData.properties.mag*10000}
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
    "Street Map": streetmap,
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

  var info = L.control({
    position:'bottomright'
  });

  info.onAdd = function(){
    var div = L.DomUtil.create('div','legend');
    return div;
  };
  info.addTo(myMap);
})
