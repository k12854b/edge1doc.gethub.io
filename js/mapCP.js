var map = L.map('map', {
  zoomControl:true, maxZoom:28, minZoom:1
}).fitBounds([[36.497707721002115,2.859998948578614],[36.52261845189628,2.9068709798290717]]);
var hash = new L.Hash(map);
map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
function removeEmptyRowsFromPopupContent(content, feature) {
var tempDiv = document.createElement('div');
tempDiv.innerHTML = content;
var rows = tempDiv.querySelectorAll('tr');
for (var i = 0; i < rows.length; i++) {
   var td = rows[i].querySelector('td.visible-with-data');
   var key = td ? td.id : '';
   if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
       rows[i].parentNode.removeChild(rows[i]);
   }
}
return tempDiv.innerHTML;
}
document.querySelector(".leaflet-popup-pane").addEventListener("load", function(event) {
var tagName = event.target.tagName,
  popup = map._popup;
// Also check if flag is already set.
if (tagName === "IMG" && popup && !popup._updated) {
  popup._updated = true; // Set flag to prevent looping.
  popup.update();
}
}, true);
var bounds_group = new L.featureGroup([]);
function setBounds() {
}
map.createPane('pane_base_eg1_0');
map.getPane('pane_base_eg1_0').style.zIndex = 400;
var img_base_eg1_0 = 'data/base_eg1_0.png';
var img_bounds_base_eg1_0 = [[36.492869908326,2.8628336253425],[36.521527392166,2.9033631439345]];
var layer_base_eg1_0 = new L.imageOverlay(img_base_eg1_0,
                                    img_bounds_base_eg1_0,
                                    {pane: 'pane_base_eg1_0'});
bounds_group.addLayer(layer_base_eg1_0);
map.addLayer(layer_base_eg1_0);
function pop_roads_edge1_1(feature, layer) {
  var popupContent = '<table>\
          <tr>\
              <td colspan="2">' + (feature.properties['id'] !== null ? autolinker.link(feature.properties['id'].toLocaleString()) : '') + '</td>\
          </tr>\
      </table>';
  layer.bindPopup(popupContent, {maxHeight: 400});
  var popup = layer.getPopup();
  var content = popup.getContent();
  var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
  popup.setContent(updatedContent);
}

function style_roads_edge1_1_0() {
  return {
      pane: 'pane_roads_edge1_1',
      opacity: 1,
      color: 'rgba(255,255,255,1.0)',
      dashArray: '',
      lineCap: 'square',
      lineJoin: 'bevel',
      weight: 3.0,
      fillOpacity: 0,
      interactive: true,
  }
}
map.createPane('pane_roads_edge1_1');
map.getPane('pane_roads_edge1_1').style.zIndex = 401;
map.getPane('pane_roads_edge1_1').style['mix-blend-mode'] = 'normal';
var layer_roads_edge1_1 = new L.geoJson(json_roads_edge1_1, {
  attribution: '',
  interactive: true,
  dataVar: 'json_roads_edge1_1',
  layerName: 'layer_roads_edge1_1',
  pane: 'pane_roads_edge1_1',
  onEachFeature: pop_roads_edge1_1,
  style: style_roads_edge1_1_0,
});
bounds_group.addLayer(layer_roads_edge1_1);
map.addLayer(layer_roads_edge1_1);
function pop_clip_129_buildings_2(feature, layer) {
  var popupContent = '<table>\
          <tr>\
              <td colspan="2">' + (feature.properties['latitude'] !== null ? autolinker.link(feature.properties['latitude'].toLocaleString()) : '') + '</td>\
          </tr>\
          <tr>\
              <td colspan="2">' + (feature.properties['longitude'] !== null ? autolinker.link(feature.properties['longitude'].toLocaleString()) : '') + '</td>\
          </tr>\
          <tr>\
              <td colspan="2">' + (feature.properties['area_in_me'] !== null ? autolinker.link(feature.properties['area_in_me'].toLocaleString()) : '') + '</td>\
          </tr>\
          <tr>\
              <td colspan="2">' + (feature.properties['confidence'] !== null ? autolinker.link(feature.properties['confidence'].toLocaleString()) : '') + '</td>\
          </tr>\
          <tr>\
              <td colspan="2">' + (feature.properties['full_plus_'] !== null ? autolinker.link(feature.properties['full_plus_'].toLocaleString()) : '') + '</td>\
          </tr>\
      </table>';
  layer.bindPopup(popupContent, {maxHeight: 400});
  var popup = layer.getPopup();
  var content = popup.getContent();
  var updatedContent = removeEmptyRowsFromPopupContent(content, feature);
  popup.setContent(updatedContent);
}

function style_clip_129_buildings_2_0() {
  return {
      pane: 'pane_clip_129_buildings_2',
      opacity: 1,
      color: 'rgba(0,0,0,1.0)',
      dashArray: '',
      lineCap: 'butt',
      lineJoin: 'miter',
      weight: 1.0, 
      fill: true,
      fillOpacity: 1,
      fillColor: 'rgba(255,255,255,1.0)',
      interactive: true,
  }
}
map.createPane('pane_clip_129_buildings_2');
map.getPane('pane_clip_129_buildings_2').style.zIndex = 402;
map.getPane('pane_clip_129_buildings_2').style['mix-blend-mode'] = 'normal';
var layer_clip_129_buildings_2 = new L.geoJson(json_clip_129_buildings_2, {
  attribution: '',
  interactive: true,
  dataVar: 'json_clip_129_buildings_2',
  layerName: 'layer_clip_129_buildings_2',
  pane: 'pane_clip_129_buildings_2',
  onEachFeature: pop_clip_129_buildings_2,
  style: style_clip_129_buildings_2_0,
});
bounds_group.addLayer(layer_clip_129_buildings_2);
map.addLayer(layer_clip_129_buildings_2);
setBounds();
L.ImageOverlay.include({
  getBounds: function () {
      return this._bounds;
  }
});
// Overlaying cloud map 
var cloud = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
}).addTo(map);
//leaflet control
  var baseMaps = {
  'map':map
  }
  var overlayMaps ={
  'cloud':cloud,
  }
  L.control.layers(baseMaps,overlayMaps).addTo(map);
//leaflet draw
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
            var drawnItems = [];
              map.on("draw:created", function(e)
              {
                var type = e.layerType;
              var layer = e.layer;
              alert(JSON.stringify(drawnItems));
              });
        //edit colors
        var ctlStyle;
  
        ctlStyle = L.control.styleEditor({position:'topleft'}).addTo(map);
        function latLngToString(ll) {
          return "["+ll.lat.toFixed(5)+","+ll.lng.toFixed(5)+"]";
        }
        map.on(L.Draw.Event.CREATED, function (e) {
          const layer = e.layer;
          fDrawGroup.addLayer(layer);});

//save and send data to server 
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
  fetch('/save-geojson', {
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
