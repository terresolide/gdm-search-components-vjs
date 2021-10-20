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
<div class="gdm-progress" >
 <div v-if="steps.length > 0" class="gdm-steps" >
 <ul class="gdm-progress-step">
    <li v-for="(step, index) in steps" :class="stepClass(index)"
    :style="{width: 100/steps.length + '%'}" :title="step.stp_description">
	    <div style="padding:0 3px;line-height:1">
	    {{step.stp_title ? step.stp_title : step.stp_name.replace(/_/g, ' ')}}
	    </div>
    </li>
  </ul>
  </div>
  <div v-else  class="gdm-progressbar" >
     <span class="gdm-process-progress">
     <div>
        <div :class="classes"  :style="{width: progress + '%'}">
        <div><span v-if="progress >= 50" style="line-height:25px;">{{progress}} %</span></div>
         </div>
        <div v-if="progress < 50" style="line-height:25px;height:25px;display:inline-block;vertical-align:top;">{{progress}} %</div>
      </div>
      </span>
  </div>
  <div class="gdm-tooltip" v-if="log"><b>Logs:</b> {{log}}</div>
</div>
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
    steps: {
      type: Array,
      default: () => []
    },
    progress: {
      type: Number,
      default: 0
    },
    log: {
      type: String,
      default: null
    },
    lang: {
      type: String,
      default: 'en'
    },
    color: {
      type: String,
      default: null
    }, 
    back: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      step: true
    }
  },
  computed: {
    findStep () {
      if (this.steps.length === 0) {
        return null
      }
      if (this.status === 'TERMINATED' || this.status === 'PURGED') {
        return this.steps[this.steps.length - 1]
      }
      var _this = this
      var step = this.steps.find(obj => obj.stp_id === _this.stepId )
      if (step) {
        return step
      } else {
        return -1
      }
    },
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
          case 'ABORTED':
            classname = 'gdm-progress-failed'
            break
          case 'DEBUG':
            classname = 'gdm-progress-debug'
            break;
        }
        if (this.progress > 90 && this.status !== 'DEBUG') {
          classname += ' gdm-completed'
        }
        return classname
    }
  },
  created: function () {
    this.$i18n.locale = this.lang
  },
  methods:{
    stepClass (index) {
      if (this.steps[index].stp_order < this.findStep.stp_order) {
        return 'done'
      } else if (this.steps[index].stp_order === this.findStep.stp_order){
        return this.classes
      }     
    }
  }
}
</script>
<style scoped>
.gdm-progress {
  position:relative;
}
.gdm-progressbar {
  margin: 10px 0 5px 10px;
  position:relative;
}
.gdm-steps {
 z-index:0;
}

div.gdm-tooltip {
  position:absolute;
  background-color:#fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  margin-top: -3px;
  margin-left:5%;
  cursor:pointer;
  padding:4px;
  max-width: 90%;
  display:none;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.4);
  z-index:100;
}
div.gdm-progressbar:hover + div.gdm-tooltip {
 display:block;
}
div.gdm-steps:hover + div.gdm-tooltip {
 display:block;
}
div.gdm-tooltip:hover {
 display:block;
}
.gdm-process-progress {
 -webkit-box-sizing: content-box;
 box-sizing: content-box;
}
.gdm-process-progress > div {
 background:#eef1f3;
 border:2px solid lightgrey;
 border-radius:10px;
 height:25px;
 width:95%;
 max-width:400px;
 -webkit-box-sizing: content-box;
 box-sizing: content-box;
}
div.gdm-progress-terminated,
div.gdm-progress-failed,
div.gdm-progress-waiting,
div.gdm-progress-running,
div.gdm-progress-debug {
  position: relative;
  display:inline-block;
  height:25px;
  color:white;
  text-align:right;
  padding-right: 3px;
  text-shadow: 1px 1px 3px black;
}
div.gdm-progress-terminated {
 background:  #13c200;
 border-radius: 10px;

}
div.gdm-progress-waiting {
  border-radius:10px 0 0 10px;
  background:  #13c200;
}
div.gdm-progress-failed {
  background:#e00000;
  border-radius:10px 0 0 10px;
  text-shadow: 1px 1px 3px black;
  text-align:right;
}
div.gdm-progress-running {
 background:  #28a428;
 border-radius:10px 0 0 10px;
}
div.gdm-progress-debug {
 background: #fc9303;
 border-radius:10px 0 0 10px;
}
div.gdm-completed {
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
div.gdm-progress-running > div {
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
div.gdm-progress-debug > div {
  position: absolute;
  color:white;
  top: 0; left: 0; bottom: 0; right: 0;
  background-image: linear-gradient(-45deg,#fec06d,rgba(252, 147, 3, 0.6),#fec06d,rgba(252, 147, 3, 0.6),#fec06d);
  z-index: 1;
  background-size: 50px 50px;
  animation: running 8s linear infinite;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
}
/*progressbar*/
.gdm-progress-step {
  margin-bottom: 30px;
  overflow: hidden;
  /*CSS counters to number the steps*/
  counter-reset: step;
  padding:0;
  margin: 0;
}
.gdm-progress-step li {
  list-style-type: none;
  color: white;
  text-transform: uppercase;
  font-size: 9px;
  width: 33.33%;
  float: left;
  position: relative;
  text-align:center;
  color:black;
}
.gdm-progress-step li:before {
  content: counter(step);
  counter-increment: step;
  width: 20px;
  line-height: 20px;
  display: block;
  font-size: 10px;
  font-weight:800;
  color: #333;
  background: white;
  border-radius: 3px;
  margin: 3px auto 5px auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
}
/*progressbar connectors*/
.gdm-progress-step li:after {
  content: '';
  width: 100%;
  height: 4px;
  background: white;
  position: absolute;
  left: -50%;
  top: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  z-index: -1; /*put it behind the numbers*/
}
.gdm-progress-step li:first-child:after {
  /*connector not needed before the first step*/
  content: none; 
}
/*marking done/completed steps green*/
/*The number of the step and the connector before it = green*/
.gdm-progress-step li.done:before,  
.gdm-progress-step li.done:after,
.gdm-progress-step li.gdm-progress-running:after,
.gdm-progress-step li.gdm-progress-failed:after,
.gdm-progress-step li.gdm-progress-terminated:after,
.gdm-progress-step li.gdm-progress-completed:after,
.gdm-progress-step li.gdm-progress-running:after,
.gdm-progress-step li.gdm-progress-waiting:after,
.gdm-progress-step li.gdm-progress-debug:after
{
  background:#28a428;
  color: white;
}
.gdm-progress-step li.gdm-progress-running:before{
background-image: linear-gradient(-45deg,#16e000,#28a428,#16e000,#28a428,#16e000);
  color: white;
   animation: running 10s linear infinite;
  overflow:hidden;
  font-size:11px;
  text-shadow: 1px 1px black;
}
.gdm-progress-step li.gdm-progress-debug:before{
background-image: linear-gradient(-45deg,#fec06d,#fc9303,#fec06d,#fc9303,#fec06d);
  color: white;
   animation: running 10s linear infinite;
  overflow:hidden;
  font-size:11px;
  text-shadow: 1px 1px black;
}
.gdm-progress-step li.gdm-progress-terminated:before,
.gdm-progress-step li.gdm-progress-waiting:before{
   background:#28a428;
    color:white;
    font-size:11px;
}
/*.gdm-progress-step li.gdm-progress-debug:before{
    background:orange;
    color:white;
    font-size:11px;
} */
.gdm-progress-step li.gdm-progress-failed:before{
    background:#e00000;
    color:white;
    font-size:11px;
}

</style>
