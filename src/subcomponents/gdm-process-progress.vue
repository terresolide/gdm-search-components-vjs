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
  <div style="">
        <div :class="classes"  :style="{width: progress + '%'}">
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
    classes () {
      var classname = ''
        switch(this.status) {
          case 'RUNNING':
            classname = 'gdm-progress-running'
            break;
          case 'CANCELED':
          case 'WAITING':
          case 'ACCEPTED':
          case 'SAVED':
          case 'EVALUATED':
          case 'CANCELED':
            classname = 'gdm-progress-waiting'
            break;
          case 'TERMINATED':
          case 'PURGED':
            classname = 'gdm-progress-terminated'
            break
          case 'KILLED':
          case 'FAILED':
          case 'INVALID':
            classname = 'gdm-progress-failed'
            break
        }
        if (this.progress > 90) {
          classname += ' gdm-completed'
        }
        return classname
    }
  },
  created: function () {
    this.$i18n.locale = this.lang
  },
  methods:{
  }
}
</script>
<style scoped>
.gdm-process-progress > div {
 background:#eef1f3;
 border:2px solid lightgrey;
 border-radius:10px;
 height:25px;
 width:95%;
 max-width:400px;
}
.gdm-progress-terminated,
.gdm-progress-failed,
.gdm-progress-waiting,
.gdm-progress-running {
  position: relative;
  display:inline-block;
  height:25px;
  color:white;
  text-align:right;
  padding-right: 3px;
  text-shadow: 1px 1px 3px black;
}
.gdm-progress-terminated {
 background:  #13c200;
 border-radius: 10px;

}
.gdm-progress-waiting {
  border-radius:10px 0 0 10px;
  background:  #13c200;
}
.gdm-progress-failed {
  background:#e00000;
  border-radius:10px 0 0 10px;
  text-shadow: 1px 1px 3px black;
  text-align:right;
}
.gdm-progress-running {
 background:  #28a428;
 border-radius:10px 0 0 10px;
}
.gdm-completed {
  border-radius: 10px;
  text-align:center;
}
 @keyframes running {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100px 50px;
  }
}
.gdm-progress-running > div {
  position: absolute;
  color:white;
  top: 0; left: 0; bottom: 0; right: 0;
  background-image: linear-gradient(-45deg,#16e000,rgba(0, 255, 0, .3),#16e000,rgba(0, 255, 0, .3),#16e000);
  z-index: 1;
  background-size: 50px 50px;
  animation: running 8s linear infinite;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
}

</style>
