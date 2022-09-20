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
 <div>
     <label>Date début</label> <input type="date" v-model="params.starttime" @change="change('starttime')"/>
     <label style="margin-left:50px">Date fin</label> <input type="date" v-model="params.endtime" @change="change('endtime')"/>
 </div>
 <div id="map"></div>
 </span>
</template>
<script>
var L = require("leaflet");
L.Control.Gdmlayer = require('./modules/leaflet.control.gdmlayer.js')

require('leaflet-draw')
import usgsSearch from './modules/usgs-search.js'




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
  //  moment.locale(this.lang)
  },
  mounted () {
    this.initMap()
    this.initDrawControl()
    usgsSearch.setLang(this.lang)
     usgsSearch.addTo(this.map, this.controlLayer)
    
   
  },
  destroyed () {
  },
  data() {
    return {
      map: null,
      controlLayer: null,
      drawControl: null,
      drawLayers: null,
      usgs: usgsSearch,
//       groupFeatures: {
//         "4": null,
//         "5": null,
//         "6": null,
//         "7": null,
//         "8": null
//       },
//       done: {
//         "4": false,
//         "5": false,
//         "6": false,
//         "7": false,
//         "8": false
//       },
      params: {
        starttime: null,
        endtime: null,
        bbox: null
      }
//       searchIndex: 0
      
    }
  },
  methods: {
    change (prop) {
      var obj = {}
      obj[prop] = this.params[prop]
      usgsSearch.setParams(obj)
    },
    initMap () {
      var container = this.$el.querySelector('#map');
      this.map = L.map( container, {scrollWheelZoom: true}).setView([51.505, -0.09], 2);
      this.controlLayer = new L.Control.Gdmlayer(null, null,{position: 'topright'})
      this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map)
      this.controlLayer.addTo(this.map)
     
      // usgsSearch.addToControl(this.controlLayer)

    },
//     search (key, index) {
//       if ((this.done[key] === 1 && index === 1) || this.done[key] > 1) {
//         return
//       }
//       var magn = parseInt(key)
//       var params = {
//         minmagnitude: magn,
//         offset: index
//       }
//       if (this.params.starttime) {
//         params.starttime = this.params.starttime
//         if (!this.params.endtime) {
//           var date = moment(this.params.starttime, "YYYY-MM-DD").add(30, 'days')
//           params.endtime = date.format('YYYY-MM-DD')
//         }
//       }
//       if (this.params.endtime) {
//         params.endtime = this.params.endtime
//         if (!this.params.starttime) {
//           var date = moment(this.params.endtime, "YYYY-MM-DD").subtract(30, 'days')
//           params.starttime = date.format('YYYY-MM-DD')
//         }
//       }
//       if (magn < 8) {
//         params.maxmagnitude = magn + 1
//       }
//       if (this.params.bbox) {
//         params.minlatitude = this.params.bbox.south
//         params.maxlatitude = this.params.bbox.north
//         params.minlongitude = this.params.bbox.west
//         params.maxlongitude = this.params.bbox.east
//       }
      
//       this.done[key] = 1
//       var token = this.searchIndex
//       usgsSearch.search(params)
//       .then(resp => {this.display(resp, key, index, token)})
//     },
    drawValidBbox (bounds) {
      this.drawLayers.clearLayers()
      if (!bounds) {
        return null
      }
      let bbox = { north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getSouthWest().lng
      }
      // valid bbox
      if (bbox.east > 180 || bbox.west < -180) {
         var delta = bbox.east - bbox.west
         if ( delta > 360) {
           bbox.east = 180
           bbox.west = -180
         }else {
           bbox.west = L.modLng(bbox.west);
           bbox.west = bbox.west === 180 ? -180 : bbox.west
           bbox.east = Math.min(bbox.west + delta, 180)
         }
      }
      // draw or redraw if bbox change
      var bounds = [[bbox.south, bbox.west], [bbox.north, bbox.east]]
      var rectangle = L.rectangle(bounds, {color: '#ff0000'})
      this.drawLayers.addLayer(rectangle)
      bounds = this.drawLayers.getBounds()
      
      this.map.fitBounds(bounds, {padding: [20, 20]})
      return bbox;
    },
    initDrawControl() {
      if (this.lang === 'fr') {
        L.drawLocal = require('formater-commons-components-vjs/src/leaflet/leaflet.draw.fr.js')
      }
      if (this.drawControl) {
        return
      }
      this.drawLayers = new L.FeatureGroup()
      this.map.addLayer(this.drawLayers)
      this.drawControl = new L.Control.Draw({
        draw: {
          rectangle: {
            shapeOptions: {
              color: '#ff0000'
            }
          },
          circlemarker: false,
          circle: false,
          marker: false,
          polygon: false,
          polyline: false
        },
        edit: {
          featureGroup: this.drawLayers
        }
      })
      this.drawControl.addTo(this.map)
      var self = this
      this.map.on(L.Draw.Event.CREATED, function (e) {
        let layer = e.layer
        let bounds = e.layer.getBounds()
        self.params.bbox = self.drawValidBbox(bounds)
        usgsSearch.setParams({bbox:  self.params.bbox})
      //  self.drawIntersection()
        // trigger event fmt:selectAreaChange
//         let event = new CustomEvent('fmt:selectAreaChange', {detail: self.bbox})
//         document.dispatchEvent(event)
      })
    
      this.map.on(L.Draw.Event.EDITED, function (e) {
        let bounds
        e.layers.eachLayer(function (layer) {
          bounds = layer.getBounds()
        })
         self.params.bbox = self.drawValidBbox(bounds)
         usgsSearch.setParams({bbox:  self.params.bbox})
        // self.drawIntersection()
        // trigger event fmt:selectAreaChange
//         let event = new CustomEvent('fmt:selectAreaChange', {detail: self.bbox})
//         document.dispatchEvent(event)
      })
    
      this.map.on(L.Draw.Event.DELETED , function (e) {
        var returnedBbox = { 
          north: '',
          south: '',
          east: '',
          west: ''
        }
        // self.bbox is null
        self.params.bbox = self.drawValidBbox(null)
        usgsSearch.setParams({bbox:  self.params.bbox})
       // self.drawIntersection()
        // trigger event fmt:selectAreaChange
//         let event = new CustomEvent('fmt:selectAreaChange', {detail: returnedBbox})
//         document.dispatchEvent(event)
      })
    },
//     initEarthquakeLayers () {
       
//        for (var key in this.groupFeatures) {
//          this.initGroup(key)
//        }
//     },
//     reset () {
//       this.searchIndex = this.searchIndex + 1
//       for (var key in this.done) {
//         this.done[key] = 0
//       }
//       this.resetEarthquakeLayers()
//     },
//     resetEarthquakeLayers () {
//       for (var key in this.groupFeatures) {
//         this.groupFeatures[key].clearLayers()
//         if (this.map.hasLayer(this.groupFeatures[key])) {
//           this.groupFeatures[key].remove()
//         }
//       }
//     },
//     initGroup (key) {
//       var self = this
//       this.groupFeatures[key] = L.layerGroup()
//       this.groupFeatures[key].on('add', function (e) {
//         self.search(key, 1)
//       })
//       if (key === "4") {
//         this.groupFeatures[key].first = this.$i18n.t('earthquakes')
//       }
// //       var title = key + '≤ Magn <' + (parseInt(key) + 1)
// //       if (key === '8') {
// //         title = key + '≤ Magn '
// //       }
//      // this.groupFeatures[key].addTo(this.map)
//       this.controlLayer.addOverlay(this.groupFeatures[key], usgsSearch.title(key))
//     },
//     display (collection, key, index, token) {
//       if (token !== this.searchIndex) {
//         return
//       }
//       // this.groupFeatures["5"] = L.layerGroup()
//       var self = this
//       // this.groupFeatures["5"].addTo(this.map)
//       var color = usgsSearch.color(key)
//       collection.features.forEach(function (feature) {
//         var coord = feature.geometry.coordinates
//         var date = moment.unix(feature.properties.time / 1000).format('ll')
//         var place = 'No Name'
//         if (feature.properties.place) {
//           place = feature.properties.place
//         }
//         var content = '<h3 style="color: '+ color + '">' + place + '</h3>'
//         content += '<div><b>Date</b>: ' + date + '</div>'
//         content += '<div style="font-weight:700;font-size:1.1rem;">Magnitude: ' + feature.properties.mag + '</div>'
//         var layer = L.circle([coord[1], coord[0]], {
//               color: color,
//               radius:usgsSearch.radius(feature.properties.mag)
//         })
//         layer.bindPopup(content)
//         self.groupFeatures[key].addLayer(layer)
//       })
//       if (collection.metadata.count < 200 && index < 1000) {
//         this.done[key] = 2
//       } else {
//         this.search(key, index + 200)
//       }
//     }
  }
}
</script>
<style src="leaflet-draw/dist/leaflet.draw.css"></style>
<style src="leaflet/dist/leaflet.css"></style>
<style src="./assets/css/earthquakes.css"></style>
<style>
/* div.leaflet-left.leaflet-top a.leaflet-control-layers-toggle {
  width: 30px;
  height: 30px;
  line-height: 30px;
  background-image: url('./assets/images/earthquakes.png')
}
div.leaflet-left.leaflet-top a.leaflet-control-earthquakes {
  width: 30px;
  height: 30px;
  line-height: 30px;
  background-image: url('./assets/images/earthquakes-2.png')
}
div.leaflet-popup-content h3 {
  margin: 0 0 5px 0;
  color:darkred;
}*/
div[id="map"] {
  position:relative;
 width: 100%;
 min-height: 500px;
 z-index: 0;
}
div[id="map"].mtdt-small .leaflet-bar a{
 background-image:none;
 width: 20px;
 height:20px;
 line-height:20px;
 }
 div[id="map"] a.leaflet-draw-draw-rectangle:before{
  content:"\f04d";
  font-family: "FontAwesome"
}
div[id="map"] a.leaflet-draw-edit-edit:before{
  content:"\f040";
  font-family: "FontAwesome"
}
div[id="map"] a.leaflet-draw-edit-remove:before{
  content:"\f1f8";
  font-family: "FontAwesome"
}
 /** menu leaflet draw */
  div[id="map"] .leaflet-container .leaflet-draw-section a {
    color: #fff;
    font-weight: 700;
  }
    div[id="map"] .leaflet-draw-actions li a {
    color: #fff;
  }
  div[id="map"] .leaflet-draw-actions li {
    display: block;
    margin: 0 0 1px 0;
    border-radius: 0;
  }
  div[id="map"] .leaflet-draw-actions {
    background: #555;
    margin-left:5px;
    padding: 2px;
    -webkit-border-radius: 0 4px 4px 4px;
    border-radius: 0 4px 4px 4px;
  }
  div[id="map"] .leaflet-draw-actions li:first-child a{
    -webkit-border-radius: 0 4px 0 0;
    border-radius: 0 4px 0 0;
  }
  div[id="map"] .leaflet-draw-actions li:last-child a{
    -webkit-border-radius: 0 0px 4px 4px;
    border-radius: 0 0px 4px 4px;
  }
 
</style>