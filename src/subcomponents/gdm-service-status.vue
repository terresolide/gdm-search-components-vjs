<i18n>
{
   "en":{
     "ENABLED": "Service Open",
     "DISABLED": "Service Closed",
     "FORBIDDEN": "You are not authorized\nto access this service",
     "MAINTENANCE":"Service Under Maintenance\n(You can only edit and save your job)"    
   },
   "fr":{
     "ENABLED": "Service Ouvert",
     "DISABLED": "Service Fermé",
     "FORBIDDEN": "Vous n'êtes pas autorisé\nà accéder à ce service",
     "MAINTENANCE":"Service En maintenance\n(Vous pouvez uniquement éditer et sauvegarder vos jobs)"   
   }
}
</i18n>
<template>
 <div style="position:absolute;cursor:pointer;z-index:1;"
  :style="{top: top + 'px', right: right + 'px'}" 
  :title="$t(status)" @click="stopPropagation">
   <span v-if="name" style="vertical-align:middle;">
      {{name.toUpperCase()}}
   </span>
   <div class="gdm-service-status" :class="size" :style="{background: colorFromStatus(status)}"></div>
 </div>
</template>
<script>
export default {
  name: 'GdmServiceStatus',
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
      case 'FORBIDDEN':
        return 'radial-gradient(circle at 30%, #FF0000, #800000)'
      case 'MAINTENANCE':
        return 'radial-gradient(circle at 30%, #FFA500, #FF5733)'
      }
    },
    stopPropagation (event) {
      event.preventDefault()
      event.stopPropagation()
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
