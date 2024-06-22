//sending geojson data to server
        function latLngToString(ll) {
          return "[" + ll.lat.toFixed(5) + "," + ll.lng.toFixed(5) + "]";
        }
        
        function handleButtonClick() {
          const type = document.getElementById('type').value;
          const coordinatesInput = document.getElementById('coordinates').value;
        
          let coordinates;
          try {
            coordinates = JSON.parse(coordinatesInput);
          } catch (error) {
            console.error('Invalid JSON input', error);
            return;
          }
        
          // Get style settings from the global ctlStyle variable
          const styleSettings = ctlStyle.getStyle(); // Assuming ctlStyle.getStyle() gives you the current style settings
        
          const properties = {
            style: styleSettings
          };
        
          const geometry = {
            type: type,
            coordinates: coordinates
          };
        
          // Validate properties and coordinates
          if (properties && geometry.coordinates && geometry.coordinates.length > 0) {
            sendGeoJsonToServer(properties, geometry);
          } else {
            console.error('Properties or coordinates are not defined');
          }
        }
        function sendGeoJsonToServer() {
            // Assuming `geoJsonData` is generated dynamically by the user's actions.
        const geoJsonData = {
          "type": "Feature",
          "properties": properties,
          "geometry": geometry
        };

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