function saveDrawnFeatures() {
  const drawnItems = fDrawGroup.getLayers();
  drawnItems.forEach(layer => {
    const geoJson = layer.toGeoJSON();
    const styleSettings = ctlStyle.getStyle(); // Assuming ctlStyle.getStyle() gives you the current style settings

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
  fetch('/save-geojson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(geoJsonData)
  })
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch((error) => console.error('Error:', error));
}