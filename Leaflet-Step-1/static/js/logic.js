var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(queryUrl).then(function(response){
    //console.log(response)
    features = response.features

    function onEachFeature(featureData,layer){
        layer.bindPopup("<h3>"+featureData.properties.place +
        "</h3><hr><p>"+ new Date(featureData.properties.time)+"</p>")
    }
})