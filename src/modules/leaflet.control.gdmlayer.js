/**
 * L control tiles with given default tiles
 */
 /* eslint no-undef: 0 */


 L.Control.Gdmlayer = L.Control.Layers.extend({
   options: {
     position: 'topleft',
   },
   bbox: null,
   tiles: {
     osm: {
       name: 'OSM',
       url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
       attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
     },
//     osmFr: {
//       name: 'OpenStreetMap France',
//       url: '//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
//       attribution: 'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>'
//     },
//     opentopomap: {
//       name: 'OpenStreetMap Topo',
//       url: '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
//       attribution: 'Kartendaten: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//     },
     arcgisTopo: {
       name: 'ArcGIS',
       url: '//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
       attribution: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
     }
   },
   initialize: function ( baseLayers, overlays, options) {
     
     L.Control.Layers.prototype.initialize.call(this, baseLayers, overlays, options)
     // Default tiles allready in control
     for (var key in this.tiles) {
       var layer = L.tileLayer(this.tiles[key].url, {attribution: this.tiles[key].attribution})
       this.tiles[key].layer = layer
       this.addBaseLayer(layer, this.tiles[key].name)
     }
   },
   addBboxLayer () {
     return
     this.bbox = L.layerGroup()
     this.bbox.addTo(this._map)
     this.addOverlay(this.bbox, 'bbox', true)
   },
   setBboxLayer (bboxLayer) {
     return
     if (this.bbox) {
        this.bbox.clearLayers()
     } else {
        this.addBboxLayer()
     }
     if (bboxLayer) {
        this.bbox.addLayer(bboxLayer)
     }
   },
   removeBboxLayer () {
     return
     if (this.bbox) {
       this.bbox.clearLayers()
     }
   },
   /**
    * Overwrite _addItem to insert title before group of images
    * (single image or serie image)
    */
   _addItem: function (obj) {
      if (obj.layer.first) {
        // insert the title if there is a first attribute (containing title)
        var div = document.createElement('b')
        div.innerHTML = obj.layer.first
        this._overlaysList.appendChild(div)
      }
      L.Control.Layers.prototype._addItem.call(this, obj)
   },
   /**
    * Overwrite _onInputClick to remove the other layers (serie or image)
    * when add a layer with type (serie or image)
    */
   _onInputClick: function (e) {
     // get 'layerId' clicked and  if it is an exclusive layer (with type property)
     var layerId = e.target.layerId
     var layer = this._getLayer(layerId).layer
     var isExclusive = layer.hasOwnProperty('type')
     var inputs = this._layerControlInputs,
         input, layer;
     var addedLayers = [],
         removedLayers = [];
     this._handlingClick = true;

     for (var i = inputs.length - 1; i >= 0; i--) {
       input = inputs[i];
       layer = this._getLayer(input.layerId).layer;
 
       if (input.checked && (input.layerId === layerId || !isExclusive)) {
         addedLayers.push(layer);
//       } else if (!input.checked) {
//         removedLayers.push(layer);
       } else if (!input.checked || (layer.type && isExclusive)) {
         input.checked = false
         removedLayers.push(layer);
       }
     }

     // Bugfix issue 2318: Should remove all old layers before readding new ones
     for (i = 0; i < removedLayers.length; i++) {
       if (this._map.hasLayer(removedLayers[i])) {
         this._map.removeLayer(removedLayers[i]);
       }
     }
     for (i = 0; i < addedLayers.length; i++) {
       if (!this._map.hasLayer(addedLayers[i])) {
         this._map.addLayer(addedLayers[i]);
       }
     }

     this._handlingClick = false;

     this._refocusOnMap();
   }
 })
 module.exports = L.Control.Gdmlayer
