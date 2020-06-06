<i18n>{
   "en":{
     "status_informations": "Job status",
     "owner": "Owner",
     "cost": "Cost",
     "actual_credit": "Actual credit",
     "parameters": "Parameters",
     "TERMINATED": "The job ended succefully",
	    "WAITING": "The job is only record here",
	    "CANCELED": "The job has been stopped by the user",
	    "SAVED": "The job is record here and by the service.",
	    "EVALUATED": "The job cost has been evaluated by the service",
	    "INVALID": "The job was refused by the service because it's invalid",
	    "KILLED": "The job has been stopped and deleted by the user",
	    "FAILED": "The job ended in failure",
	    "PURGED": "All results has been cleared",
	    "RUNNING": "In progress",
	    "ACCEPTED": "The service has accepted the job but has not yet started"
   },
   "fr":{
      "status_informations": "Etat du calcul",
     "owner": "Propriétaire",
     "cost": "Coût",
     "actual_credit": "Crédit actuel",
     "parameters": "Paramètres",
     "TERMINATED": "Le job s'est terminé avec succès",
	    "WAITING": "Le calcul est juste enregistré ici",
	    "CANCELED": "Le calcul a été stoppé",
	    "SAVED": "Le job a été enregistré auprès du service.",
	    "EVALUATED": "Le coût du job a été estimé par le service",
	    "INVALID": "Le job a été refusé par le service, car il est invalide",
	    "KILLED": "Le job a été supprimé",
	    "FAILED": "Le job s'est terminé en échec",
	    "PURGED": "Tous les résultats ont été effacés",
	    "RUNNING": "Traitement en cours",
	    "ACCEPTED": "Le service a accepté le job, mais ce dernier n'a pas encore démarré "  
 
   }
}
</i18n>
<template>
 <span class="gdm-process-view" v-if="process">
 <div style="position:relative;">
	
	 <gdm-service-status  :name="process.serviceName" :status="process.serviceStatus" :top="5" :right="10" :lang="lang" ></gdm-service-status>
	 <div class="gdm-process-header" :style="{background: $shadeColor(color,0.95)}">
	   <div class="header-0">
	    <h1 :style="{color:color}">GDM-{{(process.id + '').padStart(5, '0')}}<span v-if="process.name"> - {{process.name }}</span></h1>
	   </div>
	   <div class="header-1">
	     <div class="gdm-map-container">
	      <gdm-map :feature-collection="process.feature"></gdm-map>
	     </div>
	      <div style="text-align:center;margin-top:10px;">
	         {{date2str(process.tempStart, true)}}
	         <span class="fa fa-long-arrow-right"></span>
	         {{date2str(process.tempEnd, true)}}
	     </div>
	   </div>
	   <div class="header-2-1" style="padding: 0 10px;">
	      <h2 :style="{color:color, margin: 0}">{{$t('status_informations')}}</h2>
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
	      <div><b>{{$t('owner')}}:</b> {{process.email}}</div>
	      <div v-if="process.cost > 0" >
	        <b>{{$t('cost')}}:</b>
	        <span :style="{color: process.cost > process.quota ? 'red' : 'black' }">
		        <b>{{process.cost.toLocaleString()}}</b> 
		        <span v-if="['WAITING', 'EVALUATED'].indexOf(process.status) >= 0">/ {{process.quota.toLocaleString()}}</span>
	         </span>
	      </div>
	      <div v-if="process.cost <= 0 || ['WAITING', 'EVALUATED'].indexOf(process.status) < 0">
	      <b>{{$t('owner_credit')}}:</b> {{process.quota}}
	      </div>
	   </div>
	   <div class="header-3">
        <gdm-process-status :status="process.status" :lang="lang"></gdm-process-status>
	   </div>
	   <div class="header-4">
	     <gdm-process-actions v-if="process" :api="api" :url="url" :id="id" :back="back" 
	     :process="process"  :lang="lang" @processChange="processChange" @statusChange="statusChange">
	     </gdm-process-actions>
	   </div>
	 
		 </div>
		 <div class="gdm-list-parameters" >
			 <h2 :style="{color:color}">{{$t('parameters')}}</h2>
			 <div>
			  <div v-for="(value, prop) in parameters" style="font-size:0.9rem;max-width:400px;" v-if="prop !== 'correl_image_input'">
			    <b >{{prop}}:</b> <div style="vertical-align:top;max-width:350px;display:inline-block;overflow-wrap:anywhere">{{value}}</div>
			  </div>
			  </div>
		  </div>
		  <div class="gdm-list-images" >
		  <h2 :style="{color:color}">Images</h2>
		  <div >
			  <div  v-for="image in images" class="gdm-images-child" >
	        <gdm-image :image="image" :searching="true" :checked="true" mode="view" :lang="lang"></gdm-image>
	      </div>
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
      var url = this.api + '/getProcess/' + this.id
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
      if (list[index] && list[index].url) {
        this.$http.get(list[index].url).then(function (response) {
          if (response.body) {
            this.images.push(response.body.features[0].properties)
          }
          this.getImage(list, index + 1)
        })
      }
    },
    statusChange (detail) {
      
    },
    processChange (process) {
      if (process.error) {
        alert(process.error)
      } else {
	      this.$set(this.process, 'status', process.status)
	      this.$set(this.process, 'quota', process.quota)
	      this.$set(this.process, 'progress', process.progress)
	      this.$set(this.process, 'stepId', process.stepId)
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
  border: 1px solid lightgray;
  box-shadow: 1px 1px 3px gray;
}
.gdm-map-container {
   width:300px;
   margin:auto;
   border:4px solid lightgrey;
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
.gdm-list-parameters {
  display:inline-block; 
  width:380px;
  max-width:380px;
}
.gdm-list-parameters > div {
   max-height:500px;
   overflow-y:auto;
   border:1px solid lightgrey;
   padding:5px 5px 8px 8px;
   box-shadow:1px 1px 3px gray;
}
.gdm-list-images {
   display:inline-block; 
   margin-left:20px;
   vertical-align:top;
   width:calc(100% - 410px);
   min-width:630px;
   
 }
 .gdm-list-images > div {
   max-height:500px; 
   overflow-y:auto;
   overflow-x:hidden;
   padding:5px 5px 8px 8px;
   box-shadow:1px 1px 3px grey;
 }
</style>