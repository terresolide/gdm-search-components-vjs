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
<!--  <span v-if="stepId">
DRAW SVG
</span>
<span v-else> -->
<span class="gdm-process-progress">
  <div style="background:#eef1f3;border:2px solid lightgrey;border-radius:10px;height:25px;width:95%;max-width:400px;">
        <div class="gdm-progress-running" style="height:25px;border-radius:10px 0 0 10px;display:inline-block;" :style="{width: progress + '%'}">
        <div><span v-if="progress >= 50" style="line-height:25px;">{{progress}} %</span></div>
         </div>
        <div v-if="progress < 50" style="line-height:25px;height:25px;display:inline-block;vertical-align:top;">{{progress}} %</div>
      
  </div>
</span>
</template>
<script>
export default {
  name: 'GdmProcessProgress',
  props:{
    status: {
      type: String,
      default: null
    },
    stepId: {
      type: Number,
      default: null
    },
    progress: {
      type: Number,
      default: 0
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
    statusToClass (status) {
      switch(status) {
        case 'RUNNING':
          return 'gdm-process-running'
        case 'FAILED':
        case 'TERMINATED':
        case 'ACCEPTED':
        case 'PURGED':
          return status
          break
        case 'SAVED':
        case 'EVALUATED':
          return 'ACCEPTED';
        case 'WAITING':
           return 'SAVED';
        case 'CANCELED':
           return 'STOPPED';
        case 'INVALID':
           return 'REFUSED'
      }
    }
  }
}
</script>
<style scoped>
.gdm-progress-running {
 position:relative;
 background-image: linear-gradient(45deg,#09f,#0c0,#09f,#0c0,#09f);
 background:  #28a428;
  /*background-image: linear-gradient(45deg,#99e6ff,#fff,#99e6ff,#fff,#99e6ff);*/
 }
 @keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 50px;
  }
}
 .gdm-progress-running > div {
  position: absolute;
  text-align:right;
  padding-right: 3px;
  color:white;
  text-shadow: 1px 1px 3px black;
  top: 0; left: 0; bottom: 0; right: 0;
   background-image: linear-gradient(-45deg,#16e000,rgba(0, 255, 0, .3),#16e000,rgba(0, 255, 0, .3),#16e000);
 /* background-image: linear-gradient(
    45deg, 
    rgba(255, 255, 255, .2) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255, 255, 255, .2) 50%, 
    rgba(255, 255, 255, .2) 75%, 
    transparent 75%, 
    transparent
  );*/
  z-index: 1;
  background-size: 50px 50px;
  animation: move 8s linear infinite;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
}

 /* @keyframes mymove {
  from { background: linear-gradient(45deg,#09f,#0c0,#09f,#0c0,#09f);}
  to {background: linear-gradient(45deg,#99e6ff,#fff,#99e6ff,#fff,#99e6ff);}
 } */
</style>
