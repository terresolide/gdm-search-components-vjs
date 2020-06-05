<i18n>
{
   "en":{
     "refresh": "Refresh"    
   },
   "fr":{
     "refresh": "Actualiser"
   }
}
</i18n>
<template>
 <div style="position:absolute;top:0;right:0;" :title="titleFromStatus(status)">
   <span v-if="name" style="vertical-align:middle;">
      Service {{name.toUpperCase()}}
   </span>
   <div class="gdm-service-status" :style="{background: colorFromStatus(status)}"></div>
 </div>
</template>
<script>
export default {
  name: 'GdmProcessActions',
  props:{
    name: {
      type: String,
      default: null
    },
    status: {
      type: String,
      default: 'DISABLED'
    },
    lang: {
      type: String,
      default: 'en'
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
  },
  mounted: function(){
  },
  methods:{
    colorFromStatus (status) {
      switch (status) {
      case 'ENABLED':
        return 'radial-gradient(circle at 30%, #00FF00, #008000)'
      case 'DISABLED':
        return 'radial-gradient(circle at 30%, #FF0000, #800000)'
      case 'MAINTENANCE':
        return 'radial-gradient(circle at 30%, #FFA500, #FF5733)'
      }
    },
    titleFromStatus (status) {
      
    }

  }
}
</script>
<style scoped>
.gdm-service-status {
  display: inline-block;
  width: 15px;
  height:15px;
  vertical-align: middle;
  border: 1px solid grey;
  border-radius: 15px;
}
</style>
