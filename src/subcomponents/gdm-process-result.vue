<i18n>
{
   "en":{
     "common": "Common products",
     "copied_to_clipboard": "The curl command has been copied to clipboard",
     "copy_curl": "Curl cmd",
     "copy_in_clipboard": "Copy the curl command\nin clipboard",
     "download": "Download",
     "folder": "Folder",
     "preview": "Visualization",
     "product_license": "The products resulting from the DSM-OPT service are made available under a <a class='gdm-link'  href='https://creativecommons.org/licenses/by-nc/4.0/legalcode.fr' target='_blank'>CC-BY-NC</a> license, excluding any commercial use.",
     "results": "Results",
     "series": "Interferogram list",
     "unauthorized_clipboard": "Your browser does not allow copying to the clipboard"
   },
   "fr":{
   
     "common": "Produits communs",
     "copied_to_clipboard": "La commande Curl a été copiée dans le presse-papier",
     "copy_curl": "Cmd Curl",
     "copy_in_clipboard": "Copier la commande curl\ndans le presse-papier",
     "download": "Télécharger",
     "folder": "Répertoire",
     "preview": "Visualisation",
     "product_license": "Les produits issus du service DSM-OPT sont mis à disposition sous licence <a class='gdm-link' href='https://creativecommons.org/licenses/by-nc/4.0/legalcode.fr' target='_blank'>CC-BY-NC</a> excluant toute exploitation commerciale.",
     "results": "Résultats",
     "series": "Liste d'interférogrammes",
     "unauthorized_clipboard": "Votre navigateur ne permet la copie dans le presse-papier"

   }
}
</i18n>
<template>
<div class="gdm-process-result">
     <div>
      <h3 :style="{color:color}" >{{$t('results')}}</h3>
      <div v-if="result['partial results']">
	      <div v-for="link, name in result['partial results']"  class="partial-result">
	        <a class="button" :href="link">
	           <i class="fa fa-download"></i> 
	           <span>{{name}}</span>
	        </a>
	         <div  @click="copyPartialCmd(name)" class="cmd-curl" :title="$t('copy_in_clipboard')">
	           (<i class="fa fa-clipboard"></i> <span>{{$t('copy_curl')}})</span> 
	          <div class="result-tooltip" v-show="showTooltip[name]"  @click="close($event, name)">{{$t('copied_to_clipboard')}}</div>
	        </div>
	       </div>
      </div>
    
      <div v-else-if="result.results" style="margin-top:10px;">
	      <a  :href="result.results" class="button" >
	       <i class="fa fa-download"></i> {{$t('download')}}
	      </a>
	       <a  @click="copyCmd(result.results)" class="button" :title="$t('copy_in_clipboard')" style="position:relative;">
	        <i class="fa fa-clipboard"></i> {{$t('copy_curl')}}
	        <div class="result-tooltip" v-show="showTooltip">{{$t('copied_to_clipboard')}}</div>
	        <textarea ref="areaCmd" v-model="cmdCurl" v-show="false">{{cmdCurl}}</textarea>
	      </a>
      </div>
      
    </div>
    <div v-if="serviceName === 'DSM-OPT'" class="gdm-comment" v-html="$t('product_license')"></div>
    <div v-if="result.dir" style="display:block;">
      <a :href="result.dir" class="button" target="_blank" style="margin:10px 0 20px 0;">
         <i class="fa fa-folder"></i> {{$t('folder')}}
      </a>
      <a v-if="result.synthesis" :href="result.synthesis" class="button" target="_blank" style="margin:10px 0 20px 10px;">
        <i class="fa fa-file-text"></i> Synthèse</a>
     </div>
     
    <div v-if="!result.dir && images && images.length > 0" :style="{width: series ? '35%' : '100%'}" style="margin-bottom:5px;">
      <h3  :style="{color:color}" style="margin:10px 0 0 0;">{{$t('preview')}}</h3>
      <div class="gdm-image-layer" v-if="image.type !== 'serie' && image.type !== 'list'" v-for="(image, index) in images" >
		    <h4 v-if="image.first" :style="{color:color}" style="margin-bottom:0;">{{$t(image.first)}}</h4>
		    <!-- TIO CASE -->
		    <div v-if="image.images">
		      <div v-for="imageTio, indexTio in image.images">
             <i class="fa" style="vertical-align:top;":class="image.checked && image.indexImage === indexTio ?'fa-eye':'fa-eye-slash'" @click="toggleImageTio(index, indexTio)"></i> 
             <div style="display:inline-block;margin:0;max-width:calc(100% - 30px);">{{imageTio.title}}</div>
           </div>
		    </div>
		    <div v-else>
			    <i class="fa" style="vertical-align:top;":class="image.checked ?'fa-eye':'fa-eye-slash'" @click="toggleImage(index)"></i> 
			    <div style="display:inline-block;margin:0;max-width:calc(100% - 30px);">{{image.title}}</div>
		    </div>
		  </div>
    </div>
    <div v-if="result.dir && images && images.length > 0">
       <h3 :style="{color:color}" style="margin:10px 0 0 0;">{{$t('preview')}}</h3>
 
      <div v-if="images && images.length > 0"  style="margin-bottom:5px;">
	        <div class="gdm-image-layer" v-if="image.type !== 'serie' && image.type !== 'list'" v-for="(image, index) in images" >
	        <h4 v-if="image.first" :style="{color:color}" style="margin-bottom:0;">{{$t(image.first)}}</h4>
          <div style="margin-left:5px;">
             <i class="fa" style="vertical-align:top;":class="image.checked ?'fa-eye':'fa-eye-slash'" @click="toggleImage(index)"></i> 
              <a v-if="image.tif && serviceName.indexOf('SAR') >= 0" :href="image.tif" class="fa fa-download" :title="$t('download')" style="padding:0 5px;color:black;"></a>
             <div style="display:inline-block;margin:0;max-width:calc(100% - 20px);">{{image.title}}</div>
           </div>
	        </div>
	      </div>

    </div>
    <div v-if="series" style="width:48%;min-width:300px;">
      <div>
      <gdm-serie-navigation :series="series" :serie-name="serieName" :serie-index="serieIndex" :color="color" :lang="lang" :main="true" 
      @dateChange="dateSerieChange"></gdm-serie-navigation>
      </div> 
      <div class="gdm-image-layer" v-if="image.type === 'serie' || image.type === 'list'" v-for="(image, index) in images" >
         <h4 v-if="image.first" :style="{color:color}" style="margin-bottom:0;">{{image.first}}</h4>
         <div>
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
    serviceName: {
      type: String,
      default: null
    },
    synthesis: {
      type: String,
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
      partialCurl: {},
      showTooltip: false,
      list: null
    }
  },
  watch: {
    result (newvalue) {
      this.initCmdCurl(newvalue)
    },
    images (newvalue) {
      console.log(newvalue)
    }
  },
  computed: {
    serieName () {
      if (!this.images) {
        return null
      }
      var find = this.images.find(img => img.checked)
      if (find) {
        return find.title
      } else {
        return null
      }
    },
    hasFirst () {
      return this.images.some(img => img.first)
    }
  },
  destroyed: function() {
  },
  created: function () {
    this.$i18n.locale = this.lang
    this.initCmdCurl(this.result)
  },
  methods:{
     close (e, name) {
       this.showTooltip[name] = false
       e.stopPropagation()
     },
     copyCmd () {
//        this.$refs.areaCmd.select()
//        // node.setSelectionRange(0, 99999);
//        document.execCommand("copy");
//        this.showTooltip = true
//        var _this = this
//        setTimeout(function () {
//          _this.showTooltip = false
//        }, 2000)
       var _this = this
       navigator.clipboard.writeText(this.cmdCurl).then(function() {
         /* clipboard successfully set */
         _this.showTooltip = true
         setTimeout(function () {
           _this.showTooltip = false
         }, 2000)
       }, function() {
         alert(_this.$i18n.t('unauthorized_clipboard'))
       });
     },
     copyPartialCmd (key) {
       var _this = this
       navigator.clipboard.writeText(this.partialCurl[key]).then(function() {
         /* clipboard successfully set */
         _this.$set(_this.showTooltip, key, true)
         setTimeout(function () {
           _this.$set(_this.showTooltip, key, false)
         }, 2000)
       }, function() {
         alert(_this.$i18n.t('unauthorized_clipboard'))
       });
//        this.$el.querySelector('#areaCmd' + key).select()
//        // console.log(node)
//        node.select()
//       // node.setSelectionRange(0, 99999);
//        document.execCommand("copy");
//        this.showTooltip[key] = true
//        var _this = this
//        setTimeout(function () {
//          _this.showTooltip = false
//        }, 2000)
     },
     dateSerieChange (value) {
       this.$emit('dateSerieChange', value)
     },
     initCmdCurl (result) {
       var filename = '';
       if (result.results) {
         filename = result.results.split('/').pop().split('#')[0].split('?')[0]
         this.cmdCurl = 'curl "' + result.results + '" -o ' + filename
       } if (result['partial results']) {
        var partials = result['partial results']
        this.showTooltip = {}
        for (var key in partials) {
          filename = partials[key].split('/').pop().split('#')[0].split('?')[0]
          this.partialCurl[key] =  'curl "' + partials[key] + '" -o ' + filename
        }
       }
     },
     toggleImage (index) {
       this.$emit('toggleImage', {index: index})
     },
     toggleImageTio (index, indexImage) {
         this.$emit('toggleImage', {index: index, indexImage: indexImage})
     }// ,
//      toggleSerie (name) {
//        this.$emit('toggleSerie', name)
//      }
  }
}
</script>
<style scoped>
.gdm-image-layer h4 {
  margin: 10px 5px 0 5px;
  font-size: 0.9rem;
}
.gdm-image-layer h4:first-child {
  margin-top:0;
}
.gdm-image-layer > div {
  margin-left:5px;
}
div.partial-result {
  max-width:150px;
  display:inline-block;
  margin-top:10px;
}
div.partial-result a.button {
 min-width:145px;
}
div.partial-result div.cmd-curl {
  position:relative;
  cursor:pointer;
  font-size:0.8em;
  text-align:center;
  color:#555;
}
div.partial-result div.cmd-curl:hover {
  color:black;
}
div.partial-result div.cmd-curl span {
 text-decoration: underline;
}
div.partial-result a.button span {
  text-transform: capitalize;
}
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
.gdm-comment {
  display:block;
  margin-top:10px;
  font-style:italic;
  font-size: 0.8rem;
  line-height: 1;
  color: #333;
  text-align:justify;
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
  color:black;
  z-index:100;
  -webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
}
span div.result-tooltip  {
  cursor: pointer;
  font-size:0.8rem;
  left:0;
}
</style>
