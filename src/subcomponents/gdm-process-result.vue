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
    <div v-if="images && images.length > 0" style="width:100%;margin-bottom:5px;">
      <h4 :style="{color:color}" style="margin:10px 0 0 0;">{{$t('preview')}}</h4>
      <div style="font-size:0.9rem;">
		    <div class="gdm-image-layer" v-if="images" v-for="(image, index) in images" @click="toggleImage(index)">
		      <i class="fa" style="vertical-align:top;":class="image.checked ?'fa-eye':'fa-eye-slash'"></i> 
		      <div style="display:inline-block;margin:0;max-width:calc(100% - 20px);">{{image.title}}</div>
		    </div>
	    </div>
    </div>

</div>
</template>
<script>
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
    color: {
      type: String,
      default: null
    }
  },
  data(){
    return {
      cmdCurl: null,
      showTooltip: false
    }
  },
  computed: {
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
  mounted: function(){
    
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
     initCmdCurl (result) {
       if (result.results) {
         var filename = result.results.split('/').pop().split('#')[0].split('?')[0]
         this.cmdCurl = 'curl "' + result.results + '" -o ' + filename
       }
     },
     toggleImage (index) {
//        var layer = this.layers[e]
//        layer.checked = !layer.checked
//        this.$set(this.layers, e, layer)
         // this.result.layers[index].checked = !this.result.layers[index].checked
         this.$emit('toggleImage', index)
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
</style>
