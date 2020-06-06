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
	
	 <gdm-service-status  :name="process.serviceName" :status="process.serviceStatus" :top="5" :right="5" :lang="lang" ></gdm-service-status>
	 <div class="gdm-process-header" :style="{background: $shadeColor(color,0.9)}">
	   <div class="header-0">
	    <h1 :style="{color:color}">GDM-{{(process.id + '').padStart(5, '0')}}<span v-if="process.name"> - {{process.name }}</span></h1>
	   </div>
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
	     <gdm-process-progress :status="process.status" :progress="process.progress" 
	     :step-id="process.stepId"></gdm-process-progress>
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
		 <div style="display:inline-block; width:4OOpx;">
		 <h2 :style="{color:color}">Parameters</h2>
		  <div v-for="(value, prop) in parameters" style="font-size:0.9rem;max-width:400px;" v-if="prop !== 'correl_image_input'">
		    <b >{{prop}}:</b> <div style="vertical-align:top;max-width:350px;display:inline-block;overflow-wrap:anywhere">{{value}}</div>
		  </div>
		  </div>
		  <div style="display:inline-block; width:4OOpx;vertical-align:top;">
		  <h2 :style="{color:color}">Images</h2>
		  <div  v-for="image in images" class="gdm-images-child" style="width:630px;">
        <gdm-image :image="image" :searching="true" :checked="true" mode="view" :lang="lang"></gdm-image>
       </div>
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
import GdmProcessProgress from './subcomponents/gdm-process-progress.vue'
import GdmImage from './subcomponents/gdm-image.vue'
export default {
  name: 'GdmProcessView',
  components: {
    GdmMap,
    GdmProcessActions,
    GdmServiceStatus,
    GdmProcessStatus,
    GdmProcessProgress,
    GdmImage
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
      default: ''
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
      process: null,
      images: []
      
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
      var parameters = response.feature.properties.parameters
      var keys = Object.keys(parameters)
      keys.sort()
      for(var prop in keys) {
        this.$set(this.parameters, keys[prop],parameters[keys[prop]])
      }
      this.getImage(response.images, 0)
      this.feature = response.feature
      this.feature.properties.id = this.id
      this.process = response
    },
    getImage(list, index) {
      console.log(list)
      if (list[index] && list[index].url) {
        this.$http.get(list[index].url).then(function (response) {
          if (response.body) {
            this.images.push(response.body.features[0].properties)
          }
          this.getImage(list, index + 1)
        })
      }
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
  margin:0;
}
 
.gdm-process-header {
  margin-top:0px;
  display:grid;
  grid-template-columns: 310px 2fr 150px 1fr;
  grid-template-rows: 50px 1fr 1fr 1fr;
  background:#f3F3F3;
  padding: 10px 5px;
}
.header-0 {
  grid-column:1/5;
  grid-row: 1;
 }
.header-1 {
  grid-column: 1;
  grid-row: 2/5;
}
.header-2-1 {
  grid-column: 2;
  grid-row: 2;
  padding: 10px;
}
.header-2-2 {
  grid-column: 2;
  grid-row: 3;
  padding: 10px;
}
.header-2-3 {
  grid-column: 2;
  grid-row: 4;
  padding: 10px;
}
.header-3 {
  grid-column: 3;
  grid-row: 2/5;
}
.header-4 {
  grid-column: 4;
  grid-row: 2/5;
}
</style>