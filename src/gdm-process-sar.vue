<i18n>
{
  "fr": {
    "title": "Visualisation des résultats"
  },
  "en": {
    "title": "Result vizualisation"
  }
}
</i18n>
<template>
   <span class="gdm-sar-visu">
    <div id="fmtLargeMap">
     <gdm-serie-navigation v-if="series" :series="series" :serie-index="serieIndex" :serie-name="serieName" :color="color" :lang="lang"
       :fullscreen="true" :loading="loadingLayer"  @dateChange="dateSerieChange"></gdm-serie-navigation>
     <div v-if="mouseposition" class="gdm-mouseposition" >{{mouseposition}}</div>
   </div>
   <div>
     <h3 :style="{color: color}">{{$t('title')}}</h3>
     <div>
	     <div style="width:45%;display:inline-block;float:right;vertical-align:top;">
	         <gdm-process-result  :result="result" :series="series" service-name="GDM-SAR"
	          :lang="lang" :color="color" :images="imageLayers" :serie-index="serieIndex" 
	          @toggleImage="toggleImage"  @dateSerieChange="dateSerieChange" >
	         </gdm-process-result>
	     </div>
	     <div style="max-width:50%;height:500px;">
	        <gdm-map ref="map" :bbox="bbox" fullscreen="fmtLargeMap" :remove-height="0" @mousemove="mousemove"></gdm-map>
	     </div>
     </div>
   </div>
   </span>
</template>
<script>
import GdmMap from './subcomponents/gdm-map.vue'
import GdmSerieNavigation from './subcomponents/gdm-serie-navigation.vue'
import GdmProcessResult from './subcomponents/gdm-process-result.vue'
export default {
  name: 'GdmProcessSar',
  components: {GdmMap, GdmProcessResult, GdmSerieNavigation},
  props: {
    url: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: '#191970'
    },
    lang: {
      type: String,
      default: 'fr'
    }
  },
  data() {
    return {
      bbox: null,
      series: null,
      serieIndex: null,
      imageLayers: null,
      mouseposition: null,
      loadingLayer: false,
      result:{}
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      if (this.url) {
        this.$http.get(this.url)
        .then((resp) => {this.treatment(resp)},
            (resp) => {alert('Loaded result failed: ' + resp.status)})
      }
    },
    mousemove (val) {
      this.mouseposition = val
    },
    dateSerieChange (index) {
      if (!this.loadingLayer) {
        this.serieIndex = index
      }
    },
    treatment(resp) {
      this.result = resp.body
      console.log(this.result.footprint)
      this.bbox = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [this.result.footprint]
          }
      }
      if (resp.body.series) {
        this.series = resp.body.series
      }
      if (resp.body.Common_Product) {
         
      }
    },
    createSarImage (bbox, dir, name, image) {
      var image = {}
      image.title = name
      if(!image.bbox) {
         image.bbox = bbox
      }
      image.type = type
      if (image.legend) {
         image.legend = dir + image.legend
      }
      if (text) {
        image.first = text
        text = null
      }
      
      image.checked = false
      return image
    },
    toggleImage (e) {
      if (!this.imageLayers || this.imageLayers === 'undefined') {
        return
      }
      var image = this.imageLayers[e.index]
      if (e.hasOwnProperty('indexImage')) {
        if (image.checked && image.indexImage === e.indexImage) {
          image.checked = false
        } else {
          image.checked = true
          image.indexImage = e.indexImage
          // this.$refs.map.toggleImageLayer(e, image.checked)
        }
      } else {
        image.checked = !image.checked
        this.serieName = image.title
//        this.$set(this.imageLayers, e, image)
//        this.$refs.map.toggleImageLayer(e, image.checked)
      }
      this.$set(this.imageLayers, e.index, image)
      this.$refs.map.toggleImageLayer(e, image.checked)
    }
  }
}
</script>
<style>
div[id="fmtLargeMap"] {
  width:calc(100% - 6px);
  top:0;
  left:0;
  margin-bottom:0px;
  position:fixed;
  z-index:3000;
}
div.gdm-map {
  max-height:500px;
}
.gdm-sar-visu div[id="fmtMap"].mtdt-small{
   max-height:500px;
}
.gdm-sar-visu div[id="fmtMap"] {
  min-height:50vh;
  height:500px;
}
div[id="fmtLargeMap"] .gdm-serie-navigation {
   position: absolute;
   bottom: 5px;
   left: 50%;
   transform: translate(-50%, 0);
   z-index: 10000;
   } 
div.gdm-mouseposition {
  font-size:14px;
  left:120px;
}
</style>