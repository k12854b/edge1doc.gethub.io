function saveDrawnFeatures() {
  const drawnItems = fDrawGroup.getLayers();
  drawnItems.forEach(layer => {
    const geoJson = layer.toGeoJSON();

    // Retrieve the style settings from the layer itself
    const styleSettings = layer.options;
    
    const properties = {
      style: styleSettings
    };

    const geometry = geoJson.geometry;

    const geoJsonData = {
      "type": "Feature",
      "properties": properties,
      "geometry": geometry
    };

    sendGeoJsonToServer(geoJsonData);
  });
}

function sendGeoJsonToServer(geoJsonData) {
  fetch('http://localhost:3000/save-geojson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(geoJsonData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}
// Fetch GeoJSON data from the server and add it to the map
function loadGeoJsonData() {
  fetch('http://localhost:3000/get-geojson')
    .then(response => response.json())
    .then(data => {
      const geoJsonLayer = L.geoJson(data, {
        onEachFeature: function(feature, layer) {
          // Apply the style from the properties
          if (feature.properties && feature.properties.style) {
            layer.setStyle(feature.properties.style);
          }

          // Bind popup or any other interaction here
          if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
          }
        }
      }).addTo(map);

      // Fit the map bounds to the new GeoJSON layer
      map.fitBounds(geoJsonLayer.getBounds());
    })
    .catch(error => console.error('Error loading GeoJSON data:', error));
}

// Call this function to load and display the GeoJSON data
loadGeoJsonData();