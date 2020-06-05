<i18n>
{
   "en":{
     "ENABLED": "Open",
     "DISABLED": "Closed",
     "MAINTENANCE":"Under maintenance"    
   },
   "fr":{
     "ENABLED": "Ouvert",
     "DISABLED": "Fermé",
     "MAINTENANCE":"En maintenance"   
   }
}
</i18n>
<template>
 <div style="position:absolute;" :style="{top: top + 'px', right: right + 'px'}" :title="$t(status)">
   <span v-if="name" style="vertical-align:middle;">
      Service {{name.toUpperCase()}}
   </span>
   <div class="gdm-service-status" :class="size" :style="{background: colorFromStatus(status)}"></div>
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
    },
    top: {
      type: Number,
      default: 0
    },
    right: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
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
    colorFromStatus (status) {
      switch (status) {
      case 'ENABLED':
        return 'radial-gradient(circle at 30%, #00FF00, #008000)'
      case 'DISABLED':
        return 'radial-gradient(circle at 30%, #FF0000, #800000)'
      case 'MAINTENANCE':
        return 'radial-gradient(circle at 30%, #FFA500, #FF5733)'
      }
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
  margin:0;
  padding:0;
  line-height:15px;
}
.gdm-service-status.large {
   width: 30px;
  height:30px;
   border-radius: 30px;
   line-height:30px;
   border: 2px solid black;
}
</style>
