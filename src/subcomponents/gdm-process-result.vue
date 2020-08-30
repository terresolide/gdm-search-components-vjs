<i18n>
{
   "en":{
     "download": "Download",
     "results": "Results"   
   },
   "fr":{
     "download": "Télécharger",
     "results": "Résultats"   
   }
}
</i18n>
<template>
<!--  <span v-if="stepId">
DRAW SVG
</span>
<span v-else> -->
<div class="gdm-process-result" style="padding:0 10px;">
  <h3 style="margin-top:0; margin-bottom:5px;" :style="{color:color}">{{$t('results')}}</h3>
  <div style="padding-left:15px;">
    <a v-if="result.url" :href="result.url" class="button" target="_blank">{{$t('download')}}</a>
    <div class="gdm-image-layer" v-if="images" v-for="(image, index) in images" @click="toggleImage(index)">
      <i class="fa" :class="image.checked ?'fa-check-square-o':'fa-square-o'"></i> {{image.name}}
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
</style>
