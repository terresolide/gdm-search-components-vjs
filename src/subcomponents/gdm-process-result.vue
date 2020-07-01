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
  }
}
</script>
<style scoped>

</style>
