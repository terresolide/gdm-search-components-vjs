<template>
<span class="gdm-map">
<div id="fmtMap" class="mtdt-small"></div>
</span>
</template>
<script>
var L = require("leaflet");
L.Control.Fmtlayer = require('formater-metadata-vjs/src/modules/leaflet.control.fmtlayer.js')
L.Control.Fullscreen = require('formater-metadata-vjs/src/modules/leaflet.control.fullscreen.js')
export default {
  name: 'GdmMap',
  components: {
  },
  props: {
    featureCollection: {
      type: Object,
      default:null
    },
    bbox: {
      type: Object,
      default: null
    },
    fullscreen: {
      type: String,
      default: null
    },
    removeHeight: {
      type: Number,
      default: null
    },
    images: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      map: null,
      controlLayer: null,
      featureGroup: null,
      bboxLayer: null,
      defaultRectangleOptions: {
        interactive: false,
        fillColor:'orange', 
        fillOpacity:0.05, 
        stroke: true, 
        weight:1, 
        color: 'orange'
      },
      selectListener: null,
      highlightListener: null,
      highlightedLayer: null,
      // selected layer
      selectedLayer: null,
      fullscreenLayer: null,
      imageLayers: []
    }
  },
  watch: {
    featureCollection(newCollections) {
      console.log(newCollections)
       this.initFeatureCollection()
    },
    removeHeight (newValue) {
      if (this.fullscreenLayer) {
        this.fullscreenLayer.setRemoveHeight(newValue)
      }
    }
  },
  created () {
    this.highlightListener = this.changeHighlightedLayer.bind(this)
    document.addEventListener('gdm:processHighlight', this.highlightListener)
     this.selectListener = this.selectLayer.bind(this)
    document.addEventListener('gdm:processSelect', this.selectListener)
  },
  mounted () {
    this.initialize()
  },
  destroyed () {
    document.removeEventListener('gdm:processHighlight', this.highlightListener)
    this.highlightListener = null
    document.removeEventListener('gdm:processSelect', this.selectListener)
    this.selectListener = null
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
   toggleImageLayer (index, checked) {
     if (checked) {
       this.imageLayers[index].addTo(this.map)
     } else {
       this.imageLayers[index].remove()
     }
     console.log(this.controlLayer)
     console.log('add layer dans map ', index)
   },
   changeHighlightedLayer (event) {
      var id = event.detail.id
      this.unHighlightLayer()
      this.highlightLayer(id)
    },
    initialize () {
      var container = this.$el.querySelector('#fmtMap');
      this.map = L.map( container, {scrollWheelZoom: false}).setView([51.505, -0.09], 1);
      this.controlLayer = new L.Control.Fmtlayer(null, null,{position: 'topleft'})
      this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
      this.controlLayer.addTo(this.map)
      if (this.fullscreen) {
        this.fullscreenLayer = new L.Control.Fullscreen(this.fullscreen, {lang: this.$i18n.locale, removeHeight: this.removeHeight})
        this.fullscreenLayer.addTo(this.map)
      }
      this.map.getPane('overlayPane').style.pointerEvents = 'auto'
      this.initBbox()
      this.initFeatureCollection()
      this.initImageLayers()
    },
    initBbox () {
      if (this.bboxLayer) {
        this.bboxLayer.clearLayers()
        this.bboxLayer = null
      }
      if (this.map && this.bbox) {
        this.bboxLayer = L.geoJSON(this.bbox, {
          style: function (feature) {
            return {
              interactive: false,
              fillColor:'red', 
              fillOpacity:0.05, 
              stroke: true, 
              weight:1, 
              color: 'red'
            }
          }
        }).addTo(this.map)
        this.controlLayer.addOverlay(this.bboxLayer, 'bbox')
      }
      if (this.bboxLayer) {
        this.map.fitBounds(this.bboxLayer.getBounds())
	    } 
        
    },
    initFeatureCollection () {
      if (this.featureGroup) {
        this.featureGroup.clearLayers()
        this.featureGroup = null
      }
      if (this.map && this.featureCollection && this.featureCollection.type) {
        var self = this
        this.featureGroup =  L.geoJSON(this.featureCollection, {
          style: function (feature) {
           return self.defaultRectangleOptions;
           },
           onEachFeature: function (feature, layer) {
             layer.className = 'row' + feature.properties.id
             layer.id = feature.properties.id
             var html = ''
             if (typeof feature.properties.processusName !== 'undefined') {
               html += '<h3>' + feature.properties.processusName + '</h3>'
                
             }
             html += '<div><label>Id</label>: ' + layer.id + '</div>'
             if (feature.properties.token) {
                html += '<div><label>token</label>: ' + feature.properties.token + '</div>'
             }
             html += '<div><label>email</label>: ' + feature.properties.email + '</div>'
             html += '<div><label>service</label>: ' + feature.properties.serviceName + '</div>'
             layer.bindPopup(html)
             layer.on('click', function () {
               this.openPopup()
               var event = new CustomEvent('gdm:selectProcessLayer', {detail: {id: layer.id}})
               document.dispatchEvent(event)
             
             })
           },
           interactive: true,
           zIndex: 100
         }).addTo(this.map);
        if (this.featureGroup && this.featureGroup.getLayers().length > 0) {
            this.map.fitBounds(this.featureGroup.getBounds())
        } else {
          this.map.fitBounds([[-60,-120],[75,130]])
        }
      }
    },
    initImageLayers () {
      if (this.images && this.images.length > 0) {
        
        var _this = this
        this.images.forEach(function (image, index) {
          _this.initImageLayer(image, index)
        })
        
      }
    },
    initImageLayer (image, index) {
      var bounds = this.bboxLayer.getBounds()
      var ext = image.src.match(/\.[0-9a-z]+$/i)
      console.log(ext)
      if (ext[0] === '.mp4') {
        var layer = L.videoOverlay(image.src, bounds, {interactive: true, opacity:0.7})
        
      } else {
        var layer = L.imageOverlay(image.src, bounds, {opacity: 0.7})
      }
      var _this = this
      layer.on('add', function () {
        if (ext[0] === '.mp4') {
	        layer.getElement().currentTime = 0
	        layer.getElement().play()
        }
        _this.$emit('imageAdded', index)
      })
      layer.on('remove', function () {
        _this.$emit('imageRemoved', index)
      })
      this.imageLayers.push(layer)
      // layer.addTo(_this.map)
      this.controlLayer.addOverlay(layer, image.name)
    },
    highlightLayer (id)
    {
      if (this.featureGroup.getLayers().length === 0) {
        return
      }
      this.highlightedLayer = this.featureGroup.getLayers().find( (el => el.id === id))
      if (this.highlightedLayer) {
        this.highlightedLayer.setStyle({fillColor: 'red', color: 'red'})
      }

    },
    selectLayer (event) {
      var id = event.detail.id
      var selectedId = this.selectedLayer ? this.selectedLayer.id : null
      this.unselectLayer()
      if (id && id !== selectedId) {
        this.selectedLayer = this.featureGroup.getLayers().find( (el => el.id === id))
        if (this.selectedLayer) {
          this.selectedLayer.setStyle({fillColor: 'red', color: 'red'})
          this.selectedLayer.openPopup()
        }
      }
      if (this.selectedLayer) {
        this.map.fitBounds(this.selectedLayer.getBounds(), {paddingTopLeft: [ 30, 120], maxZoom: 10})
      } else {
        this.map.fitBounds(this.featureGroup.getBounds())
      }
    },
    unHighlightLayer()
    {
      var selectedId = this.selectedLayer ? this.selectedLayer.id : null
      if (this.highlightedLayer && this.highlightedLayer.id !== selectedId) {
        this.highlightedLayer.setStyle(this.defaultRectangleOptions)
        this.highlightedLayer = null
      }
    },
    unselectLayer() {
      if (this.selectedLayer) {
        this.selectedLayer.setStyle(this.defaultRectangleOptions)
        this.selectedLayer.closePopup()
        this.selectedLayer = null
      }
    }
  
  }
}
</script>
<style src="formater-commons-components-vjs/src/assets/css/formater-icon.css"></style>
<style>
.research-map{
  float:left;
  margin-right: 10px;
}

div[id="fmtMap"]{
 position:relative;
 width: 100%;
 min-height: 200px;
 z-index: 0;
}
div[id="fmtMap"].mtdt-small {
 max-height:200px;
}
div[id="fmtMap"].mtdt-small .leaflet-top .leaflet-control{
   margin-top: 3px;
}
div[id="fmtMap"].mtdt-small .leaflet-left .leaflet-control{
   margin-left: 3px;
}
div[id="fmtMap"].mtdt-small.leaflet-control .leaflet-control-zoom-in, 
div[id="fmtMap"].mtdt-small .leaflet-control .leaflet-control-zoom-out{
  font-size:16px;
}
div[id="fmtMap"].mtdt-small .leaflet-bar a,
div[id="fmtMap"].mtdt-small .leaflet-control a{
 width: 15px;
 height:15px;
 line-height:15px;
 }
 div[id="fmtMap"].mtdt-fullscreen{
   min-height:400px;
   width:100%;
   font-size: 16px;
 }
 div[id="fmtMap"] a.leaflet-control-layers-toggle{
  background-image: none;
  color: black;
  text-decoration: none;
  text-align:center;
 }
  div[id="fmtMap"] a.leaflet-control-layers-toggle::before{
   font-family:Formater;
   content: "\e806";
  }
  

    div[id="fmtMap"] .leaflet-control-layers-expanded {
          padding: 3px 5px;
   }
    div[id="fmtMap"] section.leaflet-control-layers-list input[type=radio],
     div[id="fmtMap"] section.leaflet-control-layers-list input[type=checkbox]{
     display:none;
 }
    div[id="fmtMap"] section.leaflet-control-layers-list  input[type=radio] + span:before {
     font-family: FontAwesome;
     content: "\f10c";
     opacity:0.8;
     cursor: pointer;
     
  }
  div[id="fmtMap"] section.leaflet-control-layers-list input[type=radio]:checked + span:before {
     content: "\f111";
     opacity:1;
     
  }
  div[id="fmtMap"] section.leaflet-control-layers-list  input[type=checkbox] + span:before {
     font-family: FontAwesome;
     content: "\f096";
     opacity:0.8;
     cursor: pointer;
  }
    
  div[id="fmtMap"] section.leaflet-control-layers-list input[type=checkbox]:checked + span:before {
     content: "\f046";
     opacity:1;
     
  }

 div[id="fmtMap"] .leaflet-control-layers-base label span{
   vertical-align: middle;
 }
 
 div[id="fmtMap"].mtdt-fullscreen{
   min-height:300px;
   font-size: 16px;
 }
 div[id="fmtMap"].mtdt-fullscreen a.leaflet-control-layers-toggle{
   width: 30px;
   height: 30px;
   border-radius: 2px;
   line-height: 30px;
 }
 div[id="fmtMap"].mtdt-fullscreen a.leaflet-control-layers{
   border-radius: 2px;
   }
   
     div[id="fmtMap"].mtdt-small .leaflet-popup-content{

   font-size: 10px;
 }
  div[id="fmtMap"].mtdt-fullscreen .leaflet-popup-content{

   font-size: 14px;
 }
 div[id="fmtMap"] .leaflet-popup-content h3 {
   margin: 0 0 5px 0;
 }
  div[id="fmtMap"] .leaflet-popup-content label {
   font-weight:700;
 }
 div[id="fmtMap"] .leaflet-pane > svg path {
  pointer-events: auto;
 }
 div[id="fmtMap"] h3 {
   color: inherit;
 }
</style>