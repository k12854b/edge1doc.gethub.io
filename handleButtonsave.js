const socket = io('http://localhost:3000'); // Initialize socket connection

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('receive-geojson', (geoJsonData) => {
  console.log('New GeoJSON data received', geoJsonData);
  addGeoJsonToMap(geoJsonData);
});

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

function sendDrawnFeatures() {
  const drawnItems = fDrawGroup.getLayers();
  drawnItems.forEach(layer => {
    const geoJson = layer.toGeoJSON();

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
    socket.emit('send-geojson', geoJsonData); // Emit to the server via WebSocket
  });
}

function addGeoJsonToMap(geoJsonData) {
  const geoJsonLayer = L.geoJson(geoJsonData, {
    onEachFeature: function (feature, layer) {
      if (feature.properties && feature.properties.style && typeof layer.setStyle === 'function') {
        layer.setStyle(feature.properties.style);
      }
      if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
      }
    }
  }).addTo(map);

  map.fitBounds(geoJsonLayer.getBounds());
}