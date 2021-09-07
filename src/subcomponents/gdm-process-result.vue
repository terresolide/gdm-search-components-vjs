<i18n>
{
   "en":{
     "common": "Common products",
     "copied_to_clipboard": "The curl command has been copied to clipboard",
     "copy_curl": "Curl cmd",
     "copy_in_clipboard": "Copy the curl command\nin clipboard",
     "download": "Download",
     "folder": "Folder",
     "preview": "Preview",
     "results": "Results",
     "series": "Interferogram list"
   },
   "fr":{
   
     "common": "Produits communs",
     "copied_to_clipboard": "La commande Curl a été copiée dans le presse-papier",
     "copy_curl": "Cmd Curl",
     "copy_in_clipboard": "Copier la commande curl\ndans le presse-papier",
     "download": "Télécharger",
     "folder": "Répertoire",
     "preview": "Visualisation",
     "results": "Résultats",
     "series": "Liste d'interférogrammes"

   }
}
</i18n>
<template>
<div class="gdm-process-result">
     <div style="position:relative;">
      <h3 :style="{color:color}" style="margin-bottom:10px;">{{$t('results')}}</h3>
  
      <a v-if="result.results" :href="result.results" class="button" >
       <i class="fa fa-download"></i> {{$t('download')}}
      </a>
       <a v-if="result.results" @click="copyCmd(result.results)" class="button" :title="$t('copy_in_clipboard')">
        <i class="fa fa-clipboard"></i> {{$t('copy_curl')}}
        <div class="result-tooltip" v-show="showTooltip">{{$t('copied_to_clipboard')}}</div>
        <textarea ref="areaCmd" v-model="cmdCurl" v-show="false">{{cmdCurl}}</textarea>
      </a>
      <a v-if="result.dir" :href="result.dir" class="button" target="_blank" style="margin-bottom:20px;">
         <i class="fa fa-folder"></i> {{$t('folder')}}
      </a>
    </div>
    <div v-if="series" style="display:block;">
       <h3 :style="{color:color}" style="margin:10px 0 0 0;">{{$t('preview')}}</h3>
    </div>
    <div v-if="images && images.length > 0" :style="{width: series ? '35%' : '100%'}" style="margin-bottom:5px;">
      <h4 v-if="series" :style="{color:color}" style="margin:0;vertical-align:top;">{{$t('common')}}</h4>
      <h4 v-else :style="{color:color}" style="margin:10px 0 0 0;">{{$t('preview')}}</h4>
      
      <div style="font-size:0.9rem;">
		    <div class="gdm-image-layer" v-if="image.type !== 'serie'" v-for="(image, index) in images" >
		      <i class="fa" style="vertical-align:top;":class="image.checked ?'fa-eye':'fa-eye-slash'" @click="toggleImage(index)"></i> 
		      <a v-if="image.tif" :href="image.tif" class="fa fa-download" :title="$t('download')" style="padding:0 5px;color:black;"></a>
		      <div style="display:inline-block;margin:0;max-width:calc(100% - 20px);">{{image.title}}</div>
		    </div>
	    </div>
    </div>
    <div v-if="series" style="width:calc(65% -5px);">
       <h4 :style="{color:color}" style="margin:0;vertical-align:top;">{{$t('series')}}</h4>
      <div>
      <gdm-serie-navigation :series="series" :serie-index="serieIndex" :color="color" :lang="lang" :main="true"
      @dateChange="dateSerieChange"></gdm-serie-navigation>
      </div> 
      <div class="gdm-image-layer" v-if="image.type === 'serie'" v-for="(image, index) in images" >
          <i class="fa" style="vertical-align:top;":class="image.checked ?'fa-eye':'fa-eye-slash'" @click="toggleImage(index)"></i> 
          <a v-if="image.tif" :href="image.tif" class="fa fa-download" :title="$t('download')" style="padding:0 5px;color:black;"></a>
          <div style="display:inline-block;margin:0;max-width:calc(100% - 20px);">{{image.title}}</div>
        </div>
     <!--  <div style="font-size:0.9rem;">
        <div class="gdm-image-layer" v-for="(serie, name) in series"">
          <i class="fa" :class="serie.checked ?'fa-eye':'fa-eye-slash'" @click="toggleSerie(name)"></i>
          <div style="display:inline-block;margin:0;max-width:50%;">{{name}}</div>
        </div>
      </div> -->
    </div>  
    

</div>
</template>
<script>
import GdmSerieNavigation from './gdm-serie-navigation.vue'
export default {
  name: 'GdmProcessResult',
  components: {
    GdmSerieNavigation
  },
  props:{
    result: {
      type: Object,
      default: null
    },
    lang: {
      type: String,
      default: 'en'
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
    color: {
      type: String,
      default: null
    }
  },
  data(){
    return {
      cmdCurl: null,
      showTooltip: false,
      list: null
    }
  },
  watch: {
    result (newvalue) {
      this.initCmdCurl(newvalue)
    }
  },
  destroyed: function() {
  },
  created: function () {
    this.$i18n.locale = this.lang
    this.initCmdCurl(this.result)
  },
  methods:{
     copyCmd (url) {
       this.$refs.areaCmd.select()
       // node.setSelectionRange(0, 99999);
       document.execCommand("copy");
       this.showTooltip = true
       var _this = this
       setTimeout(function () {
         _this.showTooltip = false
       }, 2000)
     },
     dateSerieChange (value) {
       this.$emit('dateSerieChange', value)
     },
     initCmdCurl (result) {
       if (result.results) {
         var filename = result.results.split('/').pop().split('#')[0].split('?')[0]
         this.cmdCurl = 'curl "' + result.results + '" -o ' + filename
       }
     },
     toggleImage (index) {
       this.$emit('toggleImage', index)
     } // ,
//      toggleSerie (name) {
//        this.$emit('toggleSerie', name)
//      }
  }
}
</script>
<style scoped>
.gdm-image-layer {
  cursor: pointer;
}
.gdm-process-result {
  padding: 0 0 0 5px;
}
.gdm-process-result > div {
  display:inline-block;
  padding-left:5px;
  vertical-align:top;
}
.gdm-process-result h3 {
  margin-top:0; 
  margin-bottom:5px;
}
.result-tooltip {
  position: absolute;
  background-color: #fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  padding: 4px;
  width: 160px;
  text-align: left;
  left:150px;
  -webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
}
</style>
