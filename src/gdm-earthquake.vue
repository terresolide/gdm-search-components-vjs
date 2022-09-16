<i18n>
{
  "fr": {
    "earthquakes": "Séismes"
  },
  "en": {
    "earthquakes": "Earthquakes"
  }
}
</i18n>
<template>
 <span class="gdm-earthquake">
 <h2 v-if="title">{{title}}</h2>
 <div id="map"></div>
 </span>
</template>
<script>
var L = require("leaflet");
L.Control.Gdmlayer = require('./modules/leaflet.control.gdmlayer.js')
import usgsSearch from './modules/usgs-search.js'
import moment from 'moment'
export default {
  name: 'GdmEarthquake',
  components: {
  },
  props: {
    title: {
      type: String,
      default: null
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
  },
  mounted () {
    this.initMap()
    this.initEarthquakeLayers()
  },
  destroyed () {
  },
  data() {
    return {
      map: null,
      controlLayer: null,
      groupFeatures: {
        "4": null,
        "5": null,
        "6": null,
        "7": null,
        "8": null
      },
      done: {
        "4": false,
        "5": false,
        "6": false,
        "7": false,
        "8": false
      }
      
    }
  },
  methods: {
    initMap () {
      var container = this.$el.querySelector('#map');
      this.map = L.map( container, {scrollWheelZoom: true}).setView([51.505, -0.09], 2);
      this.controlLayer = new L.Control.Gdmlayer(null, null,{position: 'topright'})
      this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
      this.controlLayer.addTo(this.map)

    },
    search (key) {
      if (this.done[key]) {
        return
      }
      var magn = parseInt(key)
      var params = {
        minmagnitude: magn
      }
      if (magn < 8) {
        params.maxmagnitude = magn + 1
      }
      this.done[key] = true
      usgsSearch.search(params)
      .then(resp => {this.display(resp, key)})
    },
    initEarthquakeLayers () {
       
       for (var key in this.groupFeatures) {
         this.initGroup(key)
       }
    },
    initGroup (key) {
      var self = this
      this.groupFeatures[key] = L.layerGroup()
      this.groupFeatures[key].on('add', function (e) {
        self.search(key)
      })
      if (key === "4") {
        this.groupFeatures[key].first = this.$i18n.t('earthquakes')
      }
      var title = key + '≤ Magn <' + (parseInt(key) + 1)
      if (key === '8') {
        title = key + '≤ Magn '
      }
     // this.groupFeatures[key].addTo(this.map)
      this.controlLayer.addOverlay(this.groupFeatures[key], title)
    },
    display (collection, key) {
      // this.groupFeatures["5"] = L.layerGroup()
      var self = this
      // this.groupFeatures["5"].addTo(this.map)
      collection.features.forEach(function (feature) {
        var coord = feature.geometry.coordinates
        var date = moment.unix(feature.properties.time / 1000).format('ll')
        console.log(date)
        var content = '<h3>' + feature.properties.place + '</h3>'
        content += '<div><b>Date</b>: ' + date + '</div>'
        content += '<div><b>Magn</b>: ' + feature.properties.mag + '</div>'
        var layer = L.circle([coord[1], coord[0]], {
              color: 'darkred',
              radius:usgsSearch.radius(feature.properties.mag)
        })
        layer.bindPopup(content)
        self.groupFeatures[key].addLayer(layer)
      })
    }
  }
}
</script>
<style src="leaflet/dist/leaflet.css"></style>
<style>
div.leaflet-popup-content h3 {
  margin: 0 0 5px 0;
  color:darkred;
}
div[id="map"] {
  position:relative;
 width: 100%;
 min-height: 500px;
 z-index: 0;
}
</style>