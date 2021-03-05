<i18n>
{
   "en":{
     "download": "Download",
     "folder": "Folder",
     "results": "Results" ,
     "preview": "Preview"  
   },
   "fr":{
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
     <div >
      <h3 :style="{color:color}" style="margin-bottom:10px;">{{$t('results')}}</h3>
  
      <a v-if="result.results" :href="result.results" class="button" >
       <i class="fa fa-download"></i> {{$t('download')}}
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
    }
  },
  computed: {
  },
  destroyed: function() {
  },
  created: function () {
    this.$i18n.locale = this.lang
  },
  mounted: function(){
    
  },
  methods:{
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
</style>
