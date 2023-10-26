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
     <div style="max-width:50%;height:500px;">
        <gdm-map fullscreen="fmtLargeMap" :remove-height="0" @mousemove="mousemove"></gdm-map>
     </div>
   </div>
   </span>
</template>
<script>
import GdmMap from './subcomponents/gdm-map.vue'
import GdmSerieNavigation from './subcomponents/gdm-serie-navigation.vue'
export default {
  name: 'GdmProcessSar',
  components: {GdmMap, GdmSerieNavigation},
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
      series: null,
      serieIndex: null,
      mouseposition: null,
      loadingLayer: false
    }
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
  font-size:16px;
  left:100px;
}
</style>