const saveFeaturesButton = document.getElementById('save-features-btn');
const drawnItems = []; // Assuming this array stores the drawn features

// Add an event listener for the save button click
saveFeaturesButton.addEventListener('click', handleSaveFeatures);

// Add event listener for new drawings
map.on("draw:created", function(e) {
  var type = e.layerType;
  var layer = e.layer;

  // Convert the drawn layer to GeoJSON and add to drawnItems array
  var geoJsonLayer = layer.toGeoJSON();
  drawnItems.push(geoJsonLayer);
  
  // Optionally add the layer to a feature group (if needed)
  // featureGroup.addLayer(layer);
});

function handleSaveFeatures() {
  // Check if there are any drawn features before saving
  if (drawnItems.length === 0) {
    alert('No features drawn yet. Please draw some features before saving.');
    return;
  }

  // Loop through drawn items and send each one to the server
  drawnItems.forEach(geoJsonLayer => {
    const data = {
      type: "Feature",
      geometry: geoJsonLayer.geometry,
      properties: geoJsonLayer.properties || {}, // Add any additional properties from the drawn feature
    };

    fetch("/save-feature", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(responseData => {
      console.log("Feature saved to database:", responseData);
    })
    .catch(error => console.error("Error saving feature:", error));
  });

  // Clear the drawn features array after saving (optional)
  drawnItems.length = 0;
}