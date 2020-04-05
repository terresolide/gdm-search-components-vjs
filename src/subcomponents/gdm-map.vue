<template>
<span class="gdm-map">
<div id="fmtMap" class="mtdt-small"></div>
</span>
</template>
<script>
var L = require("leaflet");
L.Control.Fmtlayer = require('formater-metadata-vjs/src/leaflet.control.fmtlayer.js')
L.Control.Fullscreen = require('formater-metadata-vjs/src/leaflet.control.fullscreen.js')
export default {
  name: 'GdmMap',
  components: {
  },
  props: {
    featureCollection: {
      type: Object,
      default:null
    }
  },
  data () {
    return {
      map: null,
      controlLayer: null,
      featureGroup: null,
      defaultRectangleOptions: {
        interactive: false,
        fillColor:'orange', 
        fillOpacity:0.05, 
        stroke: true, 
        weight:1, 
        color: 'orange'
      }
    }
  },
  watch: {
    featureCollection(newCollection) {
      if (this.featureGroup) {
        this.featureGroup.clearLayers()
        this.featureGroup = null
      }
      if (this.map && newCollection && newCollection.type) {
        var self = this
        this.featureGroup =  L.geoJSON(newCollection, {
          style: function (feature) {
           return self.defaultRectangleOptions;
           }
         }).bindPopup(function (layer) {
             return layer.feature.properties.name;
         }).addTo(this.map);
        this.map.fitBounds(this.featureGroup.getBounds())
      }
      
    }
  },
  created () {
    
  },
  mounted () {
    this.initialize()
  },
  methods: {
    initialize () {
      var container = this.$el.querySelector('#fmtMap');
      this.map = L.map( container, {scrollWheelZoom: false}).setView([51.505, -0.09], 1);
      this.controlLayer = new L.Control.Fmtlayer(null, null,{position: 'topleft'})
      this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
      this.controlLayer.addTo(this.map)
       var fullscreen = new L.Control.Fullscreen('fmtLargeMap', this.$i18n.locale)
    fullscreen.addTo(this.map)

    }
  
  }
}
</script>
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
</style>