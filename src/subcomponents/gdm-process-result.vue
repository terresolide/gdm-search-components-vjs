<i18n>
{
   "en":{
     "copied_to_clipboard": "The curl command has been copied to clipboard",
     "copy_curl": "Curl cmd",
     "copy_in_clipboard": "Copy the curl command\nin clipboard",
     "download": "Download",
     "folder": "Folder",
     "results": "Results" ,
     "preview": "Preview"  
   },
   "fr":{
     "copied_to_clipboard": "La commande Curl a été copiée dans le presse-papier",
     "copy_curl": "Cmd Curl",
     "copy_in_clipboard": "Copier la commande curl\ndans le presse-papier",
     "download": "Télécharger",
     "folder": "Répertoire",
     "results": "Résultats",
     "preview": "Visualisation"   
   }
}
</i18n>
<template>
<!--  <span v-if="stepId">
DRAW SVG
</span>
<span v-else> -->
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
    <div v-if="images && images.length > 0" :style="{width: series ? '40%' : '100%'}" style="margin-bottom:5px;">
      <h4 v-if="series" :style="{color:color}" style="margin:0;vertical-align:top;">{{$t('common')}}</h4>
      <h4 v-else :style="{color:color}" style="margin:10px 0 0 0;">{{$t('preview')}}</h4>
      
      <div style="font-size:0.9rem;">
		    <div class="gdm-image-layer" v-if="images" v-for="(image, index) in images" >
		      <i class="fa" style="vertical-align:top;":class="image.checked ?'fa-eye':'fa-eye-slash'" @click="toggleImage(index)"></i> 
		      <a v-if="image.tif" :href="image.tif" class="fa fa-download" :title="$t('download')" style="padding:0 5px;color:black;"></a>
		      <div style="display:inline-block;margin:0;max-width:calc(100% - 20px);">{{image.title}}</div>
		    </div>
	    </div>
    </div>
    <div v-if="series" style="width:calc(60% -5px);">
       <h4 :style="{color:color}" style="margin:0;vertical-align:top;">{{$t('series')}}</h4>
      <div>
        Date:
        <span class="serie-navigation" :class="{disabled: serieIndex === 0}">
          <span class="fa fa-angle-double-left" :style="{backgroundColor:color}" @click="goToFirst()"></span>
          <span class="fa fa-angle-left" :style="{backgroundColor:color}" @click="previous()"></span>
        </span>
        <span v-html="serieDate" style="display:inline-block;vertical-align:middle;"></span>
        <span class="serie-navigation" :class="{disabled: serieIndex === lastIndex}">
          <span class="fa fa-angle-right" :style="{backgroundColor:color}" @click="next()"></span>
          <span class="fa fa-angle-double-right" :style="{backgroundColor:color}" @click="goToLast()"></span>
        </span>
      </div>
      <div style="font-size:0.9rem;">
        <div class="gdm-image-layer" v-for="(serie, name) in series"">
          <i class="fa" :class="serie.checked ?'fa-eye':'fa-eye-slash'" @click="toggleSerie(name)"></i>
          <div style="display:inline-block;margin:0;max-width:50%;">{{name}}</div>
        </div>
      </div>
    </div>
    

</div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'GdmProcessResult',
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
      list: null,
      serieDate: ''
    }
  },
  computed: {
//     serieDate () {
//       if (!this.series) {
//         return ''
//       }
//       console.log(this.serieIndex)
//       var name = Object.keys(this.series)[0]
//       var date = this.series[name].images[this.serieIndex].date.substring(0, 8)
//       return moment(date, 'YYYYMMDD').format('ll')
//     },
    lastIndex () {
      if (!this.series) {
        return ''
      }
      var name = Object.keys(this.series)[0]
      return this.series[name].images.length - 1
    }
  },
  watch: {
    result (newvalue) {
      this.initCmdCurl(newvalue)
    },
    serieIndex (newvalue) {
      console.log(newvalue)
      this.computeSerieDate(newvalue)
      
    }
  },
  destroyed: function() {
  },
  created: function () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    this.initCmdCurl(this.result)
  },
  mounted: function(){
    this.computeSerieDate(0)
  },
  methods:{
     computeSerieDate (index) {
       if (!this.series) {
         return ''
       }
       var name = Object.keys(this.series)[0]
       console.log(this.series[name].images[index])
       var date = this.series[name].images[index].date.substring(0, 8)
       var date2 = this.series[name].images[index].date.substring(8)
       console.log(date2)
       this.serieDate = moment(date, 'YYYYMMDD').format('ll') + '<br />' +
       moment(date2, 'YYYYMMDD').format('ll')
     },
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
     goToFirst () {
       this.$emit('dateChange', 0)
     },
     goToLast () {
       console.log(this.lastIndex)
       this.$emit('dateChange', this.lastIndex)
     },
     initCmdCurl (result) {
       if (result.results) {
         var filename = result.results.split('/').pop().split('#')[0].split('?')[0]
         this.cmdCurl = 'curl "' + result.results + '" -o ' + filename
       }
     },
     next () {
       this.$emit('dateChange', this.serieIndex + 1)
     },
     previous () {
       this.$emit('dateChange', this.serieIndex - 1)
     },
     toggleImage (index) {
//        var layer = this.layers[e]
//        layer.checked = !layer.checked
//        this.$set(this.layers, e, layer)
         // this.result.layers[index].checked = !this.result.layers[index].checked
         this.$emit('toggleImage', index)
     },
     toggleSerie (name) {
       this.$emit('toggleSerie', name)
     }
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
span.serie-navigation span{
  font-size: 1.3em;
  cursor: pointer;
  margin: 0 1px;
  padding:5px;
 cursor:pointer;
 border-radius:3px;
 /*background:#8c0209;*/
 background:grey;
 padding:3px 5px;
 color:white;
  vertical-align:middle;
  opacity:0.9;
}
span.serie-navigation.disabled span{
  opacity:0.3;
  cursor:not-allowed;
}
span.serie-navigation:not(.disabled) span:hover{
  opacity:1;
  font-size:1.31em;
}
</style>
