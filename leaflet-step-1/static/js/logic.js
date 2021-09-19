// Geojson url
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

// storing our url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// create map object
var myMap = L.map("mapid", {
    center: [38, -100],
    zoom: 5
  });
  
  // Add a tile layer 
  L.tileLayer("https://api.mapbox.com/v4/{id}/page.html?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.mapbox-streets-v8",
    accessToken: API_KEY
  }).addTo(myMap);

// D3 retrieval
d3.json(url, function(data){
    // Add the new markers 
    for (var i = 0; i < data.features.length; i++){
        // Coordinates for markers
        coordinates = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
        // Colors for each marker
        var color = '';
        var depth = data.features[i].geometry.coordinates[2];
        switch(true){
            case (depth > -10 && depth < 10):
                color = '#13eb2d'
                break;
            case (depth >= 10 && depth < 30):
                color = '#8ace00'
                break;
            case (depth >= 30 && depth < 50):
                color = '#baae00'
                break;
            case (depth >= 50 && depth < 70):
                color = '#da8800'
                break;
            case ( depth >= 70 && depth < 90):
                color = '#ed5b00'
                break;
            case (depth >= 90):
                color = '#f2181f'
                break;
        }

        // Variables for your popup
        var loc = data.features[i].properties.place
        var mag = data.features[i].properties.mag

        // Create and add circles for each earthquake report 
        L.circle(coordinates, {
            opacity: .5,
            fillOpacity: 0.75,
            weight: .5,
            color: 'black',
            fillColor: color,
            radius: 7000 * data.features[i].properties.mag
    }).bindPopup(`<p align = "left"> <strong>Location:</strong> ${loc} <br> <strong>Magnitude:</strong> ${mag} </p>`).addTo(myMap)

    newMarker = L.layer
}});

var legend = L.control({position: 'bottomright'});


legend.onAdd = function (){
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    var colors = [
        'rgb(19, 235, 45)',
        'rgb(138, 206, 0)',
        'rgb(186, 174, 0)',
        'rgb(218, 136, 0)',
        'rgb(237, 91, 0)',
        'rgb(242, 24, 31)'
        ];
    var labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    grades.forEach(function(grade, index){
        labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 20px"+ "; height: 15px" + "\"></li>" + "<li>" + grade + "</li></div>");
    })
  
    div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    return div;

};

legend.addTo(myMap);
