map.on("draw:created", function(e) {
  var type = e.layerType;
  var layer = e.layer;

  // Convert the drawn layer to GeoJSON
  var geoJsonLayer = layer.toGeoJSON();

  // Prepare data for sending to the database (modify as needed)
  const data = {
    type: "Feature",
    geometry: geoJsonLayer.geometry,
    properties: geoJsonLayer.properties || {}, // Add any additional properties from the drawn feature
  };

  // Send data to the database using Fetch API (replace with your logic)
  fetch("/save-feature", {
    method: "POST",
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(responseData => {
      console.log("Feature saved to database:", responseData);
    })
    .catch(error => console.error("Error saving feature:", error));
});