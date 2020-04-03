<template>
<span class="gdm-map">
<div id="gdmMap"></div>
</span>
</template>
<script>
var L = require("leaflet");
L.Control.Fmtlayer = require('formater-metadata-vjs/src/leaflet.control.fmtlayer.js')
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
      featureGroup: null
    }
  },
  watch: {
    featureCollection(newCollection) {
      if (this.featureGroup) {
        this.featureGroup.clearLayers()
        this.featureGroup = null
      }
      if (this.map && newCollection) {
        console.log('add to map')
        this.featureGroup =  L.geoJSON(newCollection, {
          style: function (feature) {
            console.log(feature)
           return {color: '#ff0000'};
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
      var container = this.$el.querySelector('#gdmMap');
      this.map = L.map( container, {scrollWheelZoom: false}).setView([51.505, -0.09], 1);
      this.controlLayer = new L.Control.Fmtlayer(null, null,{position: 'topright'})
      this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
      this.controlLayer.addTo(this.map)

    }
  
  }
}
</script>
<style>
.research-map{
  float:left;
  margin-right: 10px;
}
div[id="gdmMap"] {
 position:relative;
 width: 248px;
 height: 200px;
}
</style>