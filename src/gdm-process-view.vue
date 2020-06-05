<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {notExactly}{count}"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {notExactly}{count}"
   }
}
</i18n>
<template>
 <span class="gdm-process-view" v-if="process">
 <div style="position:relative;">
	 <h1 :style="{color:color}">GDM-{{process.serviceId.padStart(2, '0')}}-{{process.id.padStart(5, '0')}}<span v-if="process.name"> - {{process.name }}</span></h1>
	 <gdm-service-status  :name="process.serviceName" :status="process.serviceStatus" :lang="lang" ></gdm-service-status>
	 <div class="gdm-process-header" :style="{background: $shadeColor(color,0.9)}">
	   <div class="header-1">
	     <div style="width:300px;margin:auto;border:4px solid lightgrey;">
	      <gdm-map :feature-collection="process.feature"></gdm-map>
	     </div>
	      <div style="text-align:center;margin-top:10px;">
	         {{date2str(process.tempStart, true)}}
	         <span class="fa fa-long-arrow-right"></span>
	         {{date2str(process.tempEnd, true)}}
	     </div>
	   </div>
	   <div class="header-2-1" style="padding: 0 10px;">
	      <h2 :style="{color:color, margin: 0}">Status information</h2>
	      <div>
	       {{date2str(process.processStart)}}
          <span class="fa fa-long-arrow-right"></span>
          <span :style="{color: isEnded ? 'black' : 'grey'}">
            {{date2str(process.processEnd)}}
          </span>
	      </div>
	   </div>
	   <div class="header-2-2">
	      <div style="background:white;border:2px solid grey;height:40px;width:95%;max-width:400px;">
	      <div class="gdm-progress-running" style="height:40px;" :style="{width: process.progress + '%'}">Progress: {{process.progress}} %</div>
	      </div>
	  </div>
	  <div class="header-2-3">
	      <div>Owner: {{process.email}}</div>
	      <div v-if="parseInt(process.cost) > 0">
	        Cost: <b>{{parseInt(process.cost).toLocaleString()}}</b> 
	        <span v-if="['WAITING', 'EVALUATED'].indexOf(process.status) >= 0">/ {{parseInt(process.quota).toLocaleString()}}</span>
	      </div>
	      <div v-if="parseInt(process.cost) <= 0 || ['WAITING', 'EVALUATED'].indexOf(process.status) < 0">
	      Owner actual quota: {{process.quota}}
	      </div>
	   </div>
	   <div class="header-3">
        <gdm-process-status :status="process.status" :lang="lang"></gdm-process-status>
	   </div>
	   <div class="header-4">
	     <gdm-process-actions v-if="process" :api="api" :url="url" :id="id" :back="back" :process="process" 
	     :lang="lang">
	     </gdm-process-actions>
	   </div>
	 
		 </div>
		 <h2 :style="{color:color}">Parameters</h2>
		  <div v-for="(value, prop) in parameters" style="font-size:0.9rem;">
		    <b>{{prop}}:</b> {{value}}
		  </div>
	</div>
 </span>
</template>
<script>
import GdmMap from './subcomponents/gdm-map.vue'
import moment from 'moment'
import GdmProcessActions from './subcomponents/gdm-process-actions.vue'
import GdmServiceStatus from './subcomponents/gdm-service-status.vue'
import GdmProcessStatus from './subcomponents/gdm-process-status.vue'
export default {
  name: 'GdmProcessView',
  components: {
    GdmMap,
    GdmProcessActions,
    GdmServiceStatus,
    GdmProcessStatus
  },
  props: {
    id: {
      type: Number,
      default: null
    },
    color: {
      type: String,
      default: '#808080'
    },
    api: {
      type: String,
      default: null
    },
    lang: {
      type: String,
      default: 'en'
    },
    url: {
      type: String,
      default: 'http:localhost:8080/#/'
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isEnded () {
      if (process) {
        switch(process.status) {
          case 'RUNNING':
          case 'ACCEPTED':
          case 'SAVED':
          case 'EVALUATED':
          case 'WAITING':
          case 'CANCELED':
          case 'INVALID':
            return false
          case 'FAILED':
          case 'TERMINATED':
          case 'PURGED':
            return true
        }
      } else {
        return false
      }
    }
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    this.load()
  },
  mounted () {
  },
  destroyed () {
  },
  data() {
    return {
      parameters: {},
      feature: null,
      process: null
      
    }
  },
  methods: {
    load () {
      var url = this.api + '/' + this.id
      this.$http.get(url, {credentials: true})
      .then(
          response => this.display(response.body),
          response => this.error(response))
    },
    date2str(  date, small){
      var format = small ? 'll': 'lll'
      if (date === 'now') {
        return moment().format(format)
      } else {
        return moment(date).format(format)
      }
    },
    display (response) {
      this.parameters = response.feature.properties.parameters
      this.feature = response.feature
      this.feature.properties.id = this.id
      this.process = response
    },
    todo () {
      alert('TODO')
    }
  }
}
</script>
<style scoped>
.gdm-process-view{
  width:calc(100% - 30px);
  margin:0 auto;
}
.gdm-process-view h1 {
  margin-bottom:0;
}
 .gdm-progress-running {
 position:relative;
  background-image: linear-gradient(45deg,#09f,#0c0,#09f,#0c0,#09f);
	/*background-image: linear-gradient(45deg,#99e6ff,#fff,#99e6ff,#fff,#99e6ff);*/
 }
 .gdm-progress-running:after {
  content: "";
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background-image: linear-gradient(
    45deg, 
    rgba(255, 255, 255, .2) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255, 255, 255, .2) 50%, 
    rgba(255, 255, 255, .2) 75%, 
    transparent 75%, 
    transparent
  );
  z-index: 1;
  background-size: 50px 50px;
  animation: move 2s linear infinite;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  overflow: hidden;
}
@keyframes move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 50px 50px;
  }
}
 /* @keyframes mymove {
  from { background: linear-gradient(45deg,#09f,#0c0,#09f,#0c0,#09f);}
  to {background: linear-gradient(45deg,#99e6ff,#fff,#99e6ff,#fff,#99e6ff);}
 } */
.gdm-process-header {
  display:grid;
  grid-template-columns: 310px 2fr 150px 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  background:#f3F3F3;
  padding: 10px 5px;
}
.header-1 {
  grid-column: 1;
  grid-row: 1/4;
}
.header-2-1 {
  grid-column: 2;
  grid-row: 1;
  padding: 10px;
}
.header-2-2 {
  grid-column: 2;
  grid-row: 2;
  padding: 10px;
}
.header-2-3 {
  grid-column: 2;
  grid-row: 3;
  padding: 10px;
}
.header-3 {
  grid-column: 3;
  grid-row: 1/4;
}
.header-4 {
  grid-column: 4;
  grid-row: 1/4;
}
</style>