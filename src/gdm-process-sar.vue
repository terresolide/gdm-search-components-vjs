<i18n>
{
  "fr": {
    "commons": "Produits communs",
    "interferograms": "Interférogrammes",
    "time_serie": "Séries temporelles",
    "title": "Visualisation des résultats"
  },
  "en": {
    "commons": "Common products",
    "interferograms": "Interferograms",
    "time_serie": "Time series",
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
     <h2 :style="{color: color}">{{theTitle}}</h2>
     <div>
	     <div style="width:45%;display:inline-block;text-align:left;float:right;vertical-align:top;">
	         <gdm-process-result  :result="result" :series="series" service-name="GDM-SAR"
	          :lang="lang" :color="color" :images="imageLayers" :serie-index="serieIndex" 
	          @toggleImage="toggleImage"  @dateSerieChange="dateSerieChange" >
	         </gdm-process-result>
	     </div>
	     <div style="max-width:50%;height:500px;">
	        <gdm-map ref="map" :bbox="bbox" :images="imageLayers" @imageAdded="imageAdded"
	        :series="series" :serie-index="serieIndex" :lang="lang"  @loadingLayer="loadingChange" @dateChange="dateSerieChange"
	        @imageRemoved="imageRemoved" fullscreen="fmtLargeMap" :remove-height="8" @mousemove="mousemove"></gdm-map>
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
    title: {
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
  computed: {
    theTitle () {
      if (this.title) {
        return this.title
      } else {
        return this.$i18n.t('title')
      }
    }
  },
  data() {
    return {
      bbox: null,
      series: null,
      serieName: null,
      serieIndex: null,
      imageLayers: [],
      mouseposition: null,
      loadingLayer: false,
      result:{}
    }
  },
  created () {
    this.$i18n.locale = this.lang
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
       console.log(index)
      //if (!this.loadingLayer) {
        this.serieIndex = index
      //}
    },
    loadingChange (value) {
      this.loadingLayer = value
    },
    treatment(resp) {
      this.result = resp.body
      console.log(resp.body)
      var dir = this.result.dir
      console.log(this.result.footprint)
      this.bbox = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [this.result.footprint]
          }
      }
     
      if (resp.body.commons) {
        var text = this.$i18n.t('commons')
        for(var key in resp.body.commons) {
          if (key.indexOf('geo') >=0) {
            console.log(resp.body.commons[key])
            var image = this.createSarImage(key, resp.body.commons[key], text, 'image')
            console.log(image)
            text = null
            this.imageLayers.push(image)
          }
        }
      }
      if (resp.body.interferograms) {
        var text = this.$i18n.t('interferograms')
        for(var key in resp.body.interferograms) {
          if (key.indexOf('geo') >= 0) {
           
            var image = {
                first: text,
                type: 'list',
                checked: false,
                title: key,
                name: key,
                bbox: this.result.bbox
            }
            text = null
            var images = []
            for(var i in resp.body.interferograms[key]) {
              images.push({
                startDate: resp.body.interferograms[key][i].startDate,
                completionDate: resp.body.interferograms[key][i].completionDate,
                png: dir + resp.body.interferograms[key][i].png
              })
            }
            image.png = dir + resp.body.interferograms[key][0].png
            image.legend = dir + resp.body.interferograms[key][0].legend
            if (!this.series) {
              this.series = {}
            } 
            this.series[key]= {
                images: images
            }
            this.imageLayers.push(image)
          }
        }
      }
      if (resp.body.series) {
        var text = this.$i18n.t('time_serie')
        for(var key in resp.body.series) {
          if (key.indexOf('geo') >= 0) {
            if (!this.series) {
              this.series = {}
            } 
            var image = resp.body.series[key]
            image.type = 'serie'
	          if (resp.body.series[key].serie) {
	           
	           
	            var images = []
	            for(var i in resp.body.series[key].serie) {
	              images.push({
	                date: resp.body.series[key].serie[i].date,
	                png: dir + resp.body.series[key].serie[i].png
	              })
	            }
	            if (images.length > 0) {
		            this.series[key]= {
		                images: images
		            }
		           
		            delete image.serie
	            }
            }
            image.checked = false
            image.png = dir + image.png
            image.tif = dir + (image.tif || image.tiff)
            image.legend = dir + image.legend
            image.title = key
            image.name = key
            image.first = text
            text = null
            if (!image.bbox) {
              image.bbox = this.result.bbox
            }
           
            this.imageLayers.push(image)
          }
        }
      }
    },
    createSarImage (name, image, group, type) {
      var dir = this.result.dir
      image.title = name
      if(!image.bbox) {
         image.bbox = this.result.bbox
      }
      image.type = 'image'
      if (image.legend) {
         image.legend = dir + image.legend
      }
      if (image.png) {
        image.png = dir + image.png
      }
      image.tif = dir + (image.tif || image.tiff)
      if (group) {
        image.first = group
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
    },
    imageAdded (e) {
      var index = e.index
      var image = this.imageLayers[index]
      image.checked = true
      if (image.type === 'serie' || image.type === 'list') {
        this.serieName = image.title
      } else {
        this.serieName = null
      }
      this.$set(this.imageLayers, index, image)
    },
    imageRemoved (index) {
      var image = this.imageLayers[index]
      image.checked = false
      this.$set(this.imageLayers, index, image)
    }
  }
}
</script>
<style>
.gdm-sar-visu div[id="fmtLargeMap"] {
  width:calc(100% - 6px);
  top:-3px;
  left:-2px;
  margin-bottom:0px;
  position:fixed;
  z-index:3000;
}
.gdm-sar-visu div.gdm-map {
  max-height:500px;
}
.gdm-sar-visu div[id="fmtMap"].mtdt-small{
   max-height:500px;
}
.gdm-sar-visu div[id="fmtMap"] {
  min-height:50vh;
  height:500px;
  border: 4px solid lightgrey;
}
.gdm-sar-visu div[id="fmtLargeMap"] .gdm-serie-navigation {
   position: absolute;
   bottom: 5px;
   left: 50%;
   transform: translate(-50%, 0);
   z-index: 10000;
}
.gdm-sar-visu .gdm-process-result > div {
  display:block;
  margin-top:20px;
} 
.gdm-sar-visu h4 {
   padding:10px 0;
}
.gdm-sar-visu div.gdm-mouseposition {
  font-size:14px;
  left:120px;
}
.gdm-sar-visu a.button{
   display: inline-block;

   margin: 0px 7px 3px 0;
   padding: 3px 12px;
   height: auto;
   line-height: 1.43;
   white-space: normal;
   text-align: center;
   background: #ececea;
   border-width: 1px;
   border-style: solid;
   border-radius: 3px;
   border-color: #ffffff #d4d4cf #d4d4cf;
   color: #000;
   text-decoration: none;
  /* text-shadow: 0 -1px 1px #bcbcb4, 1px 0 1px #d4d4cf, 0 1px 1px #d4d4cf, -1px 0 1px #bcbcb4;*/
   vertical-align: top;
   cursor: pointer;
   pointer-events: auto;
   box-sizing: border-box;
   box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
   opacity: 0.8;

  }
.gdm-sar-visu a.button:hover{
   background: #f0f0e6;
   text-decoration: none;
   opacity: 1
 }

 .gdm-sar-visu a.button:disabled,
 .gdm-sar-visu a.button.disabled {
    color: #999;
    pointer-events: none;
  }
</style>