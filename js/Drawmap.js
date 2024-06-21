var fDrawGroup= new L.FeatureGroup();
            map.addLayer(fDrawGroup);
          var drawControl = new L.Control.Draw(
                {
                  draw: {
                    polyline: true,
                    polygon: true,
                    rectangle: false,
                    circle: true,
                    marker: true,
                    circlemarker: false
                },
                edit: {
                        featureGroup: fDrawGroup,
                        remove: false
                      }
                }
              );
              
            map.addControl(drawControl);
            
              map.on("draw:created", function(e)
              {
                var type = e.layerType;
                var layer = e.layer;

                // Convert the drawn layer to GeoJSON
                var geoJsonLayer = layer.toGeoJSON();

                // Add the GeoJSON object to your array
                drawnItems.push(geoJsonLayer);

                // Optionally, you can add the layer to a feature group on the map
                fDrawGroup.addLayer(layer);

                // You can do further processing with the GeoJSON object if needed
                console.log("GeoJSON object:", geoJsonLayer);

                // Example: Alerting the GeoJSON string representation
                alert(JSON.stringify(geoJsonLayer));
              });
        //edit colors
        var ctlStyle;
  
        ctlStyle = L.control.styleEditor({position:'topleft'}).addTo(map);
        function latLngToString(ll) {
          return "["+ll.lat.toFixed(5)+","+ll.lng.toFixed(5)+"]";
        }
           