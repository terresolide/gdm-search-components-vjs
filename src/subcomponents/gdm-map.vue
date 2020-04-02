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
      controlLayer: null
    }
  },
  computed: {
    features () {
      var featureGroup = null
      if (this.map && this.featureCollection) {
        console.log('add to map')
        featureGroup = this.features =  L.geoJSON(this.featureCollection, {
          style: function (feature) {
            console.log(feature)
           return {color: '#ff0000'};
           }
		     }).bindPopup(function (layer) {
		         return layer.feature.properties.name;
		     }).addTo(this.map);
      }
      return featureGroup
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
//       if (this.featureCollection) {
// 	      this.features =  L.geoJSON(this.featureCollection, {
// 	        style: function (feature) {
// 	             console.log(feature)
// 	            return {color: '#ff0000'};
// 	        }
// 		    }).bindPopup(function (layer) {
// 		        return layer.feature.properties.name;
// 		    }).addTo(this.map);
//       }

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
 width: 400px;
 height: 300px;
}
</style>