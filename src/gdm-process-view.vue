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
	 <h1>GDM-{{process.serviceId.padStart(2, '0')}}-{{process.id.padStart(5, '0')}}<span v-if="process.name"> - {{process.name }}</span></h1>
	 <gdm-service-status :name="process.serviceName" :status="process.serviceStatus" :lang="lang" ></gdm-service-status>
	 <div class="gdm-process-header">
	   <div class="header-1">
	     <div style="width:300px;margin:auto;">
	      <gdm-map :feature-collection="process.feature"></gdm-map>
	     </div>
	      <div style="text-align:center;">
	         {{date2str(process.tempStart, true)}}
	         <span class="fa fa-long-arrow-right"></span>
	         {{date2str(process.tempEnd, true)}}
	     </div>
	   </div>
	   <div class="header-2">
	      <div>Status: {{process.status}}</div>
	      <div>Progress: {{process.progress}} %</div>
	      <div>
	        Dates process: {{date2str(process.processStart)}}
	        <span class="fa fa-long-arrow-right"></span>
	        {{date2str(process.processEnd)}}
	      </div>
	      <div>Cost: <b>{{process.cost}}</b> / {{process.quota}}</div>
	   </div>
	   <div class="header-3">
	     <gdm-process-actions v-if="process" :api="api" :url="url" :id="id" :back="back" :process="process" 
	     :lang="lang">
	     </gdm-process-actions>
	   </div>
	 
		 </div>
		 <h2>Parameters</h2>
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
export default {
  name: 'GdmProcessView',
  components: {
    GdmMap,
    GdmProcessActions,
    GdmServiceStatus
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
}
.gdm-process-header {
  display:grid;
  grid-template-columns: 310px 1fr 1fr;
  grid-gap: 1Opx;
  grid-auto-rows: auto;
}
.header-1 {
  grid-column: 1;
  grid-row: 1/3;
}
.header-2 {
  grid-column: 2;
  grid-row: 1/3;
}
.header-3 {
  grid-column: 3;
  grid-row: 1/3;
}
</style>