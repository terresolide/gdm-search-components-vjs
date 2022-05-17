<template>
<span class="gdm-map">
  <div v-if="tio && tio.searching" style="position:fixed;top:50%;left:50%;z-index:3002;color:#333;" class="fa fa-spinner fa-spin fa-2x fa-fw"></div>
   
 <tio-graph v-if="tio.img" v-show="tio.showGraph" :dates="tio.img.dates" :ns-values="tio.ptValues.ns" :ew-values="tio.ptValues.ew" 
   :keys="tio.img.keys" :maximum="tio.img.max" :lang="lang" @close="tio.showGraph=false"></tio-graph>

	 <div id="fmtMap" class="mtdt-small"></div>
	 <div class="gdm-mouseposition" >{{mouseposition}}</div>

 </span>
</template>
<script>
var L = require("leaflet");
L.Control.Gdmlayer = require('../modules/leaflet.control.gdmlayer.js')
L.Control.Fullscreen = require('formater-metadata-vjs/src/modules/leaflet.control.fullscreen.js')
L.Control.Legend = require('formater-metadata-vjs/src/modules/leaflet.control.legend.js')
require('../modules/leaflet.control.opacity.js')
require('leaflet-imageoverlay-rotated')
// import GdmSerieNavigation from './gdm-serie-navigation.vue'
import Tio from 'gdm-tio-vjs/src/modules/leaflet.imageOverlay.rotated.tio.js'
L.ImageOverlay.Rotated.Tio = Tio
const TioGraph = () => import('gdm-tio-vjs/src/tio-graph.vue')
export default {
  name: 'GdmMap',
  components: {
  //  GdmSerieNavigation,
    TioGraph
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
    tile: {
      type: Array,
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
    },
    series: {
      type: Object,
      default: null
    },
    serieIndex: {
      type: Number,
      default: 0
    },
    serviceName: {
      type: String,
      default: null
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  data () {
    return {
      map: null,
      controlLayer: null,
      controlLegend:null,
      controlOpacity: null,
      featureGroup: null,
      bboxLayer: null,
      bboxTile: null,
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
      mouseposition: null,
      // selected layer
      selectedLayer: null,
      fullscreenLayer: null,
      imageLayers: [],
      countImages: 0,
      tio: {
        ptValues: {
          ns: [],
          ew: []
        },
        showGraph: false,
        img: null,
        searching: false
      }
    }
  },
  watch: {
    featureCollection(newCollections) {
       this.initFeatureCollection()
    },
    removeHeight (newValue) {
   
      if (this.fullscreenLayer) {
        this.fullscreenLayer.setRemoveHeight(newvalue)
      }
    },
    images (newImages, old) {
       this.initImageLayers(newImages)
    },
    serieIndex (index) {
      this.serieDateChange(index)
    }
  },
  created () {
    if (this.tile) {
      this.bboxTile = [
        [this.tile[1], this.tile[0]],
        [this.tile[3], this.tile[2]]
      ]
    }
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
   toggleImageLayer (e, checked) {
     var index = e.index
     if (checked) {
      // this.imageLayers[index].addTo(this.map)
       var _this = this
       this.imageLayers.forEach(function (image, i) {
         if (i === index ) {
             if (e.hasOwnProperty('indexImage')) {
               image.indexImage = e.indexImage
               image.legend = image.images[e.indexImage].legend
              _this.controlLegend.removeLegend(index)
             _this.controlLegend.addLegend(0, index, image.images[e.indexImage].legend)
               image.setUrl(image.images[e.indexImage].png)
               // _this.$set(_this.imageLayers, i, image)
                _this.controlLayer._update()
             }
             image.addTo(_this.map)
         } else {
           if (_this.map.hasLayer(image)) {
             image.remove()
           }
         }
       })
     } else {
       this.imageLayers[index].remove()
     }
   },
   serieDateChange (index) {
     var _this = this
     var i = this.imageLayers.findIndex(layer => _this.map.hasLayer(layer))
     if (i < 0) {
       return
     }
      
     if (this.imageLayers[i].type === 'serie' || this.imageLayers[i].type === 'list') {
       var image = this.series[this.imageLayers[i].name].images[index]
       this.$emit('loadingLayer', true)
       this.imageLayers[i].setUrl(image.png)
     }
   },
//    toggleSerieLayer (name, checked) {
//      if (this.serieLayers[name]) {
//        this.serieLayers[name].remove()
//        this.serieLayers[name] = null
//        delete this.serieLayers[name]
//      }
//      var image = this.series[name].images[this.serieIndex]
//      if (checked) {
//        var bounds = [
//          [image.bbox[1], image.bbox[0]],
//          [image.bbox[3], image.bbox[2]]]
//        this.serieLayers[name] = L.imageOverlay(image.png, bounds, {opacity: this.controlOpacity.getValue()})
//        this.serieLayers[name].addTo(this.map)
//      }  
//    },
   changeHighlightedLayer (event) {
      var id = event.detail.id
      this.unHighlightLayer()
      this.highlightLayer(id)
    },
    initialize () {
      var container = this.$el.querySelector('#fmtMap');
      this.map = L.map( container, {scrollWheelZoom: false}).setView([51.505, -0.09], 1);
      this.controlLayer = new L.Control.Gdmlayer(null, null,{position: 'topleft'})
      this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
      if (this.serviceName && (this.serviceName === 'GDM-OPT-ICE' || this.serviceName === 'MPIC-OPT-ICE')) {
          var options = {
            layers: 'GLIMS_GLACIERS',
            format: 'image/png'
          }
          var glacierLayer = L.tileLayer.wms('https://www.glims.org/mapservice?', options)
          this.controlLayer.addOverlay(glacierLayer, 'GLIMS Glaciers')
      }
      this.controlLayer.addTo(this.map)
      if (this.fullscreen) {
        this.fullscreenLayer = new L.Control.Fullscreen(this.fullscreen, {lang: this.$i18n.locale, removeHeight: this.removeHeight, mouseWheel: true})
        this.fullscreenLayer.addTo(this.map)
      }
      this.controlLegend = new L.Control.Legend(this.$i18n.locale, function (uuid) { return 'i' + uuid;})
      this.controlLegend.addTo(this.map)
      // deploy legend by default
      this.controlLegend._container.classList.add('expand')
      this.controlOpacity = new L.Control.Opacity(this.$i18n.locale)
      this.controlOpacity.addTo(this.map)
      this.map.getPane('overlayPane').style.pointerEvents = 'auto'
      this.initBbox()
      this.initFeatureCollection()
      this.initImageLayers(this.images)
      var _this = this
      this.map.on('mousemove', function (e) {
        var lat = Math.round(e.latlng.lat * 10000) / 10000
        var lng = Math.round(e.latlng.lng * 10000) / 10000
        _this.mouseposition = 'Latlng(' + lat + ', ' + lng + ')'
        _this.$emit('mousemove', _this.mouseposition)
      })
      this.map.on('mouseout', function (e) {
        _this.mouseposition = null
      })
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
        // this.controlOpacity.setBbox(this.bboxLayer)
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
    initImageLayers (images) {
      // see if done
      if (this.imageLayers.length > 0) {
        return
      }
    
      if (images && images.length > 0) {
        
        var _this = this
        images.forEach(function (image, index) {
          _this.initImageLayer(image, index)
        })
        this.controlOpacity.setLayers(this.imageLayers)
      }
    },
    initImageLayer (image, index) {
      if (image.bbox) {
        var bounds = [[image.bbox[1], image.bbox[0]], [image.bbox[3], image.bbox[2]]]
      } else if (this.bboxTile && image.title.charAt(0) === 'T') {
        var bounds = this.bboxTile
//       } else if (image.bounds){
//          var bounds = [[image.bounds.pointTL[1], image.bounds.pointTL[0]],
//                        [image.bounds.pointBR[1], image.bounds.pointBR[0]]]
      } else {
        var bounds = this.bboxLayer.getBounds()
      }
//       var ext = image.src.match(/\.[0-9a-z]+$/i)
//       console.log(ext)
      var _this = this
      if (image.mp4) {
        var layer = L.videoOverlay(image.mp4, bounds, {interactive: true, opacity:this.controlOpacity.getValue()})
        
      } else if (image.png && !image.bounds) {
          var layer = L.imageOverlay(image.png, bounds, {opacity: this.controlOpacity.getValue()})
      } else if (image.png && image.bounds) {
        var layer = new L.ImageOverlay.Rotated(image.png, [image.bounds.pointTL[1], image.bounds.pointTL[0]], 
        [image.bounds.pointTR[1], image.bounds.pointTR[0]],
        [image.bounds.pointBL[1], image.bounds.pointBL[0]],
        {opacity: 0.5})
      } else if (image.root) {
        var layer = new L.ImageOverlay.Rotated.Tio(image.root)
        layer.on('TIO:RESET', function (resp) {
          _this.tio.ptValues = {ew: [], ns: []}
          _this.tio.showGraph = false
        })
        layer.on('TIO:DATA', function (resp) {
          _this.$set(_this.tio.ptValues, resp.dimension, resp.values)
          _this.tio.showGraph = true
        })
        layer.on('TIO:SEARCHING', function (event) {
          _this.tio.searching = event.searching
        })
        layer.on('TIO:READY', function (data) {
          //_this.images = this.images
          _this.controlLayer.addOverlay(this, 'Inversion')
          _this.$emit('tioReady', {layer: layer, index: index})
        })
        this.tio.img = layer
        
      }
      if (image.legend) {
        layer.legend = image.legend
      }
      if (image.first) {
        layer.first = image.first
      }
      layer.type = image.type ? image.type : 'image'
      layer.name = image.title
      layer.on('load', function (e) {
        _this.$emit('loadingLayer', false)
      })
      layer.on('add', function () {
        if (image.mp4) {
	        layer.getElement().currentTime = 0
	        layer.getElement().play()
        }
//         if (_this.images[index].legend) {
//           _this.controlLegend.addLegend(0, index, _this.images[index].legend)
//         }else 
          if (this.legend) {
          _this.controlLegend.addLegend(0, index, this.legend)
        }
        // remove the others
//         _this.imageLayers.forEach(function (image, i) {
//           if (i !== index && _this.map.hasLayer(image)) {
//             image.remove()
//           }
//         })
        _this.countImages = _this.countImages + 1
        if (_this.countImages > 0) {
          _this.controlOpacity.setVisible(true)
        } else {
          _this.controlOpacity.setVisible(false)
        }
        _this.$emit('imageAdded', {index: index, indexImage: layer.indexImage})
      })
      layer.on('remove', function () {
        if (_this.images[index].legend || this.legend) {
          _this.controlLegend.removeLegend(index)
        }
      
        _this.countImages = _this.countImages -1
        if (_this.countImages > 0) {
          _this.controlOpacity.setVisible(true)
        } else {
          _this.controlOpacity.setVisible(false)
        }
        _this.$emit('imageRemoved', index)
      })
      this.imageLayers.push(layer)
      // layer.addTo(_this.map)
      if (!image.root) {
         this.controlLayer.addOverlay(layer, image.title, 'common')
      }
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
        this.map.fitBounds(this.selectedLayer.getBounds(), {maxZoom: 10})
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
<style src="leaflet/dist/leaflet.css"></style>
<style src="formater-metadata-vjs/src/assets/css/fontello.css"></style>

<style src="formater-commons-components-vjs/src/assets/css/formater-icon.css"></style>
<style>
.gdm-mouseposition {
     position:absolute;
     bottom:5px;
     left:3px;
     font-size:11px;
     padding: 0 5px;
     color: #333;
     z-index:1;
     background: rgba(255, 255, 255, 0.7);
   }
.research-map{
  float:left;
  margin-right: 10px;
}
div.map-container {
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
 div[id="fmtMap"] .lfh-control-fullscreen {
   cursor:pointer;
   }
  div[id="fmtMap"] .lfh-control-legend {
   cursor: pointer;
   background: white;
   display:none;
 }
 div[id="fmtMap"] .lfh-control-opacity {
  background:white;
  display:block;
 }
 div[id="fmtMap"] .lfh-control-opacity.hidden {
  display:none;
  
 }
 div[id="fmtMap"] .lfh-control-opacity.expand {
  padding:5px;
 }
 div[id="fmtMap"] .lfh-control-opacity a.icon-progress{
   background-image: url("../assets/images/progress2.png");
   background-size: cover;
   pointer-events:auto;
   cursor:pointer;
   display:block;
 }
 div[id="fmtMap"] .lfh-control-opacity.expand a.icon-progress{
   display:none;
 }
 div[id="fmtMap"] .lfh-control-opacity div{
   display:none;
 }
 div[id="fmtMap"] .lfh-control-opacity strong{
   display:block;
   text-align:right;
   cursor:pointer;
 }
 div[id="fmtMap"] .lfh-control-opacity input{
   pointer-events:auto;
 }
  div[id="fmtMap"] .lfh-control-opacity.expand div {
    display:block;
  }
  div[id="fmtMap"] .lfh-control-legend img{
    display:block;
    max-height:250px;
    max-width: 300px;
  }
   div[id="fmtMap"]  div.lfh-control-legend{
    display:block;
  }
    div[id="fmtMap"]  div.lfh-control-legend.hidden,
    div[id="fmtMap"]  div.lfh-control-legend.opacity{
    display:none;
  }
 
 div[id="fmtMap"].mtdt-small .lfh-control-legend img{
   max-width:120px;
   max-height:100px;
 }
 div[id="fmtMap"] .lfh-control-legend img{
    display: none;
  }
/*  div[id="fmtMap"] .lfh-control-legend a{
   display:block;
 } */
  div[id="fmtMap"] .lfh-control-legend.expand img{;
   display:block;
   margin-left:5px;
 }
   div[id="fmtMap"] .lfh-control-legend.expand img:first-child{
    margin-left:0px;
   }
  div[id="fmtMap"] .lfh-control-legend.expand a{
   display:none;
 
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