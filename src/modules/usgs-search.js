/* eslint no-extend-native: 0 */
/* eslint camelcase: 0 */

import moment from 'moment'
var L = require("leaflet");
L.Control.Earthquakes = L.Control.extend({
  initialize: function (options) {
    this.handler = options.funct
    this.name = options.name
    L.Control.prototype.initialize.call(this, options)
  },
  handler: null,
  name: null,
  onAdd: function(map) {
    var el = L.DomUtil.create('div', 'leaflet-bar earthquakes');
    var div = L.DomUtil.create('a', 'leaflet-control-earthquakes')
    div.setAttribute('title', 'reset')
    el.appendChild(div)
    var _this = this
    L.DomEvent.on(el, 'click', function (e) {
      if (_this.handler) {
        _this.handler()
      }
    }, _this);

    return el;
  }
});
L.control.earthquakes = function(opts) {
  return new L.Control.Earthquakes(opts);
}
L.Control.earthquakeslayer = L.Control.Layers.extend({
   options: {
     position: 'topleft',
   },
    _addItem: function (obj) {
      if (obj.layer.first) {
        // insert the title if there is a first attribute (containing title)
        var div = document.createElement('b')
        div.innerHTML = obj.layer.first
        this._overlaysList.appendChild(div)
      }
      L.Control.Layers.prototype._addItem.call(this, obj)
    }
 })

export default {
  lang: 'en',
  api: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
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
  },
  params: {
    starttime: null,
    endtime: null,
    bbox: null
  },
  searchIndex: 0,
  setLang (lang) {
    this.lang = lang
    moment.locale(this.lang)
  },
  addTo (map) {
    this.map = map
    this.initEarthquakeLayers()
    this.addControl()
  },
  addControl () {
    this.controlLayer =  new L.Control.earthquakeslayer(null, null,{position: 'topleft'})
    this.controlLayer.addTo(this.map)
    for (var key in this.groupFeatures) {
      this.controlLayer.addOverlay(this.groupFeatures[key], this.title(key))
    }
    var self = this
    L.control.earthquakes({
      position: 'topleft',
      name: this.lang === 'fr' ? 'Initialiser couche séismes' : 'Reset earthquake layers',
      funct: function (e) {self.reset(true)}
    }).addTo(this.map);
//    var self = this
//    this.controlLayer.addOverlay({button: true, layer:null, title: this.lang === 'fr' ? 'initialiser' : 'reset', funct: function () {
//      self.reset(true)
//    }})
   
  },
  setParams (params) {
    var toReset = false
    for (var key in params) {
      this.params[key] = params[key]
      if (key === 'starttime' || key === 'endtime') {
        toReset = true
      }
    }
    this.reset(toReset)
  },
  radius (mag) {
    var magn = Math.floor(mag)
    switch (magn) {
      case 4:
        return 200
      case 5: 
        return 500
      case 6: 
        return 1000
      case 7:
        return 5000
      case 8:
        return 20000
      case 9:
        return 50000
    }
  },
  color (mag) {
    var magn = Math.floor(mag)
    switch (magn) {
      case 4:
        return '#FF5C00'
      case 5: 
        return '#FF2B00'
      case 6: 
        return '#b44010'
      case 7:
        return '#ae0000'
      case 8:
      case 9:
        return 'darkred'
    }
  },
  search (key, index) {
      if ((this.done[key] === 1 && index === 1) || this.done[key] > 1) {
        return
      }
      var magn = parseInt(key)
      var params = {
        minmagnitude: magn,
        offset: index
      }
      if (this.params.starttime) {
        params.starttime = this.params.starttime
        if (!this.params.endtime) {
          var date = moment(this.params.starttime, "YYYY-MM-DD").add(30, 'days')
          params.endtime = date.format('YYYY-MM-DD')
        }
      }
      if (this.params.endtime) {
        params.endtime = this.params.endtime
        if (!this.params.starttime) {
          var date = moment(this.params.endtime, "YYYY-MM-DD").subtract(30, 'days')
          params.starttime = date.format('YYYY-MM-DD')
        }
      }
      if (magn < 8) {
        params.maxmagnitude = magn + 1
      }
      if (this.params.bbox) {
        params.minlatitude = this.params.bbox.south
        params.maxlatitude = this.params.bbox.north
        params.minlongitude = this.params.bbox.west
        params.maxlongitude = this.params.bbox.east
      }
      
      this.done[key] = 1
      var token = this.searchIndex
      this.fetch(params)
      .then(resp => this.display(resp, key, index, token))
     
    },
    initEarthquakeLayers () {
       
       for (var key in this.groupFeatures) {
         this.initGroup(key)
       }
    },
    reset (full) {
      this.searchIndex = this.searchIndex + 1
      for (var key in this.done) {
        this.done[key] = 0
      }
      if (full) {
        this.resetEarthquakeLayers()
      } 
    },
    resetEarthquakeLayers () {
      for (var key in this.groupFeatures) {
        this.groupFeatures[key].clearLayers()
        if (this.map.hasLayer(this.groupFeatures[key])) {
            this.groupFeatures[key].remove()
        }
      }
    },
    initGroup (key) {
      var self = this
      this.groupFeatures[key] = L.layerGroup()
      this.groupFeatures[key].on('add', function (e) {
        self.search(key, 1)
      })
      if (key === "4") {
        this.groupFeatures[key].first = this.lang === 'fr' ? 'Séismes' : 'Earthquakes'
      }
      if (key === "8") {
        var self = this
        this.groupFeatures[key].last = {
          button: true,
          title: this.lang === 'fr' ? 'initialiser' : 'reset', 
          funct: function () {
            self.reset(true)
          }
        }
      }
//       var title = key + '≤ Magn <' + (parseInt(key) + 1)
//       if (key === '8') {
//         title = key + '≤ Magn '
//       }
     // this.groupFeatures[key].addTo(this.map)
      
    },
    display (collection, key, index, token) {
      if (token !== this.searchIndex) {
        return
      }
      // this.groupFeatures["5"] = L.layerGroup()
      var self = this
      // this.groupFeatures["5"].addTo(this.map)
      var color = this.color(key)
      collection.features.forEach(function (feature) {
        var coord = feature.geometry.coordinates
        var date = moment.unix(feature.properties.time / 1000).format('ll')
        var place = 'No Name'
        if (feature.properties.place) {
          place = feature.properties.place
        }
        var content = '<h3 style="color: '+ color + '">' + place + '</h3>'
        content += '<div><b>Date</b>: ' + date + '</div>'
        content += '<div style="font-weight:700;font-size:1.1rem;">Magnitude: ' + feature.properties.mag + '</div>'
        var layer = L.circle([coord[1], coord[0]], {
              color: color,
              radius: self.radius(feature.properties.mag)
        })
        layer.bindPopup(content)
        self.groupFeatures[key].addLayer(layer)
      })
      if (collection.metadata.count < 200 && index < 2000) {
        this.done[key] = 2
      } else {
        this.search(key, index + 200)
      }
    },
    fetch (params) {
      var url = this.api + '?format=geojson&limit=200'
      for (var key in params) {
        url += '&' + key + '=' + params[key]
      }
      return new Promise((successCallback, failureCallback) => {
         fetch(url)
         .then(
          response => successCallback(response.json()),
          response => failureCallback(response)
        )
      })
  },
  title (key) {
    var title = key + '< Magn ≤' + (parseInt(key) + 1)
    if (key === '8') {
      title = key + '< Magn '
    }
    return title
  }
}
