<i18n>
{
  "en": {
    "clear_data": "All results will be deleted on this date",
    "created": "Created",
    "collection": "Collection",
    "consult": "Consult",
    "dsmopt_default_correlation": "Uncorrelated threshold ",
    "dsmopt_use_roi": "Use ROI",
    "dsmopt_roi_sizex": "ROI size X",
    "dsmopt_roi_sizey": "ROI size Y",
    "aspy_run_stereo_pipeline": "Stereo pipeline",
    "aspy_output_epsg": "Product cartographic projection",
    "aspy_output_res_factor": "Output resolution factor",
    "end": "Job end",
    "remove_process": "Remove the job",
    "squareCenter": "Product center",
    "start": "Job start"
}, 
  "fr": {
    "clear_data": "Tous les résultats seront effacés à cette date",
    "created": "Création",
    "collection": "Collection",
    "consult": "Consulter",
    "dsmopt_default_correlation": "Seuil de dé-corrélation",
    "dsmopt_use_roi": "Utilisation d'une Zone d'Intérêt",
    "dsmopt_roi_sizex": "Taille de la zone en X",
    "dsmopt_roi_sizey": "Taille de la zone en Y",
    "aspy_run_stereo_pipeline": "Stereo pipeline",
    "aspy_output_epsg": "Product cartographic projection",
    "aspy_output_res_factor": "Output resolution factor",
    "end": "Fin",
    "remove_process": "Supprimer le job",
    "squareCenter": "Centre du produit",
    "start": "Début"
  }
}
</i18n>
<template>
<div class="gdm-process-row" :class="{selected: selected === parseInt(process.properties.id)}" @mouseenter="highlight()" @click="selectProcess()">
   <div class="gdm-process-identifier">  {{process.properties.id.toString().padStart(5,'0')}}<span  v-if="process.properties.token">-{{process.properties.token}}</span>
   <span v-if="process.properties.processusName">{{process.properties.processusName}}</span>
   </div>
   <div class="gdm-process-column-1">
	   <div class="toSelect" :class="{selected: selectedService}" 
	      @click="selectService($event)">
	      {{process.properties.serviceName}}
	   </div>
	   <div v-if="userId && (back || ['MNS', 'DSM'].indexOf(group) < 0)">{{process.properties.email}}</div>
	   <div v-else>
	       <div class="toSelect" :class="{selected: selectedUser}" 
	       @click="selectUser($event)">
	          {{process.properties.email}}
	       </div>
	   </div>
	   <div v-if="process.properties.team"  class="toSelect short" :class="{selected: selectedTeam === process.properties.team}" @click="selectTeam($event)">
	          {{process.properties.team}}
	   </div>
   </div>
   <div class="gdm-process-column-2">
      <gdm-process-status :status="process.properties.status" :status-list="statusList" 
            :progress="process.properties.progress" :lang="lang"></gdm-process-status>
       <div>
          <a v-if="url" :href="url + process.properties.id" class="button">{{$t('consult')}}</a>
       </div>
       <div style="position:relative;">
	       <i v-if="(back || group === 'SAR') && (process.properties.status === 'RUNNING' || process.properties.status === 'FAILED')" class="gdm-log fa fa-question-circle"  ></i>
	       <div  class="gdm-tooltip">
	         <span>{{process.properties.progress}} %</span>
	         <div v-if="process.properties.log">{{process.properties.log}}</div>
	       </div>
        </div>
   </div>
   <div class="gdm-process-column-3">
         <div>
           <b>{{$t('created')}}: </b>
           <span style="white-space:nowrap;">
             {{printDate(process.properties.start, true)}}
           </span>
         </div>
         <div v-if="['TERMINATED', 'RUNNING', 'FAILED', 'ABORTED', 'PURGED'].indexOf(process.properties.status) >=0">
           <div>
             <b>{{$t('start')}}: </b>
             <span style="white-space:nowrap;">
             {{printDate(process.properties.processStart,true)}}
             </span>
           </div>
           <div>
             <b>{{$t('end')}}:</b>
             <span v-if="process.properties.processEnd" style="white-space:nowrap;">
             {{printDate(process.properties.processEnd, true)}}
             </span>
             <span v-else style="color:grey;white-space:nowrap;">
             {{printDate(process.properties.end, true)}}
             </span>
           </div>
         </div>
         <div style="position:relative;">
	         <span v-if="!process.properties.keep && process.properties.datePurge && process.properties.status === 'TERMINATED'" class="date-purge"> 
	            <i class="fa fa-exclamation-triangle"></i>
	            <b>Purge: </b>{{printDate(process.properties.datePurge)}}
	         </span>
	         <div class="gdm-tooltip" style="font-size:0.9em;word-break: normal;">{{$t('clear_data')}}</div>
         </div>
    
   </div>
    <div class="gdm-process-column-4">
         {{printDate(process.properties.temporalExtent[0])}}
          <span v-if="group !== 'DEM'">
           <b>&rarr;</b>
             {{printDate(process.properties.temporalExtent[1])}}
          </span>
   </div>  
   <div class="gdm-process-column-5">
      <div class="infos">
             <div v-for="type in ['provider', 'position']" >
                <div v-if="process.properties[type]" >
                  <div v-for="(value, prop) in process.properties[type]" 
                  v-if="prop !== 'bbox' && prop !== 'providerName'  && value">
                    <div><b>{{$t(prop)}}:</b> {{decodeURIComponent(value)}}</div>
                  </div>
               </div>
             </div>
             <div v-for="prop in ['sub_swath', 'relative_orbit']" >
                  <div v-if="process.properties.parameters.hasOwnProperty(prop)"><b>{{$hypens2camel(prop)}}:</b> {{process.properties.parameters[prop]}}</div>
           </div>
       </div>
           
   </div>  
   <div class="gdm-process-column-6">
     <div class="infos" >
             <div v-if="process.properties.parameters && Object.keys(process.properties.parameters).length < 5"  >
                <div v-for="(value, prop) in process.properties.parameters" >
                  <div><b>{{$t(prop)}} :</b> {{value}}</div>
                </div>
             </div>
             <div>
                <div v-for="prop in ['atmo', 'rlooks_int', 'rlooks_unw']" >
                  <div v-if="process.properties.parameters.hasOwnProperty(prop)"><b>{{$hypens2camel(prop)}}:</b> {{process.properties.parameters[prop]}}</div>
                </div>
                <div v-for="prop in ['correl_split_date', 'correl_input_mode', 'correl_correlator', 'do_analysis', 'do_correction_filtering']" >
                  <div v-if="process.properties.parameters.hasOwnProperty(prop)"><b>{{$hypens2camel(prop)}}:</b> {{process.properties.parameters[prop]}}</div>
                </div>
                <div v-for="prop in ['dsmopt_default_correlation','dsmopt_use_roi', 'dsmopt_roi_sizex', 'dsmopt_roi_sizey']" >
                  <div v-if="process.properties.parameters.hasOwnProperty(prop)"><b>{{$t(prop)}}:</b> {{process.properties.parameters[prop]}}</div>
                </div>
                <!-- Display params for DSM-ASPY -->
                <div v-for="prop in ['aspy_run_stereo_pipeline', 'aspy_output_epsg', 'aspy_output_res_factor']" >
                  <div v-if="process.properties.parameters.hasOwnProperty(prop)"><b>{{$t(prop)}}:</b> <span v-if=" prop === 'aspy_output_epsg' && process.properties.parameters[prop] !== null ">EPSG </span>{{process.properties.parameters[prop]}}</div>
                </div>
             </div>
           </div>
   </div>
   <div class="gdm-process-column-7">
      <div v-if="canRemove">
       <span class="fa fa-close" :title="$t('remove_process')" @click="remove($event)"></span></div>  
     </div>
</div>
</template>
<script>
import moment from 'moment'
import GdmProcessStatus from './gdm-process-status.vue'
export default {
  name: 'GdmProcessRow',
  components: {
    GdmProcessStatus
  },
  props: {
    process: {
	    type: Object,
	    default: null
    },
    back: {
      type: Boolean,
      default: false
    },
    group: {
      type: String,
      default: null
    },
    lang: {
      type: String,
      default: 'en'
    },
    selected: {
      type: Number,
      default: null
    },
    selectedService: {
      type: Object,
      default: null
    },
    selectedTeam: {
      type: String,
      default: null
    },
    selectedUser: {
      type: Object,
      default: null
    },
    statusList: {
      type: Object,
      default: () => {}
    },
    url: {
      type: String,
      default: null
    },
    userId: {
      type: Number,
      default:null
    }
  },
//   watch: {
//     $route (newvalue) {
//       var query = newvalue.query
//       console.log(query)
//       if (query.serviceId) {
//         this.selectedService = query.serviceId
//       } else {
//         this.selectedService = null
//       }
//       if (query.userid) {
//         this.selectedUser = query.userid
//       } else {
//         this.selectedUser = null
//       }
//       if (query.team && query.team !== 'no') {
//         this.selectedTeam = query.team
//       } else {
//         this.selectedTeam = null
//       }
//     }
//  },
  computed: {
    canRemove () {
      if (!this.back && this.userId !== parseInt(this.process.properties.userId)) {
        return false
      } 
      if (['DEBUG', 'PRE-RUN', 'RUNNING', 'ACCEPTED'].indexOf(this.process.properties.status) < 0) {
        return true
      }
      return false
    }
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD hh:mm:ss',
      dateFormatDisplay: 'DD/MM/YYYY',
//       selectedService: null,
//       selectedUser: null,
//       selectedTeam: null
    }
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    if (this.lang === 'en') {
      this.dateFormatDisplay = 'MM/DD/YYYY'
    } else {
      this.dateFormatDisplay = 'DD/MM/YYYY'
    }
  },
  methods: {
    printDate (date, length) {
      if (!length) {
        return moment(date, this.dateFormat).format(this.dateFormatDisplay)
        
      } else {
       return moment(date, this.dateFormat).format(this.dateFormatDisplay + ' HH:mm')
      }
    },
    highlight () {
      this.$emit('highlight', this.process.properties.id)
    },
    remove (e) {
      this.$emit('removeProcess', this.process.properties.id)
       e.stopPropagation()
    },
    selectProcess () {
      this.$emit('selectProcess', this.process.properties.id)
    },
    selectService(e) {
      this.$emit('selectService', {id: this.process.properties.serviceId, name: this.process.properties.serviceName})
      e.stopPropagation()
    },
    selectTeam(e) {
      this.$emit('selectTeam', this.process.properties.team)
      e.stopPropagation()
    },
    selectUser(e) {
      this.$emit('selectUser',{id:this.process.properties.userId, email: this.process.properties.email})
      e.stopPropagation()
    }
  }
}
</script>
<style>
.gdm-process-row {
  display: grid;
  grid-template-columns: minmax(180px,1fr) 110px minmax(190px,1fr) minmax(100px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) 30px;
  grid-gap: 5px;
  row-gap: 5px;
 /* grid-template-rows: 20px 100px;*/ 
  grid-auto-rows: minmax(10px, auto);
  font-size:0.9em;
  border-bottom:1px solid lightgrey;
  cursor: pointer;
  padding: 5px 0;
}
.gdm-process-row:hover {
  background: #EFF6F6;
}
.gdm-process-row.selected {
   background: #F6EFEF;
}
.gdm-process-identifier {
   grid-column: 1/6;
  grid-row: 1;
  font-weight:600;
  font-size:0.9em;
  padding-left: 5px;
}
.gdm-process-column-1 {
  grid-column: 1;
  grid-row:2;
  padding-left:5px;
}
.gdm-process-column-2 {
  grid-column: 2;
  grid-row:2;
  text-align:center;
  padding-top:5px;
}
.gdm-process-column-3 {
  grid-column: 3;
  grid-row:2;
}
.gdm-process-column-4 {
  grid-column: 4;
  grid-row:2;
  text-align:center;
}
.gdm-process-column-5 {
  grid-column: 5;
  grid-row:2;
  font-size: 0.9em;
}
.gdm-process-column-6 {
  grid-column: 6;
  grid-row:2;
  font-size: 0.9em;
}
.gdm-process-column-7 {
  grid-column: 7;
  grid-row:2;
}
.gdm-process-column-1 div {
  line-height:1;
}
.gdm-process-column-7 span {
  padding: 3px;
  border: 1px dotted rgba(0,0,0,0);
  cursor: pointer;
}
.gdm-process-column-7 span:hover {
  border: 1px dotted grey;
}
div.toSelect {
 cursor: pointer;
 padding: 2px;
  margin: 3px 0px;
  background: #F0f0f0;
  border: 1px solid #909090;
  border-radius:2px;
  line-height:1;
  max-width: 250px;
  white-space:normal;
  word-break: break-all;
}
.toSelect.short {
   display:inline-block;
   padding:2px 3px;
}
div.toSelect:hover {
 background: #e5e5e5;
}

div.toSelect.selected{
 background: #f7f1ef;
 border-color:darkred;
}
div.toSelect.selected:hover  {
 background: #f9eae6;
}
.gdm-process-row span.date-purge {
 
  color:darkred;
  cursor:pointer;
}
.gdm-process-row div.gdm-tooltip {
  position:absolute;
  background-color:#fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  margin-left:50px;
  padding:4px;
  width: 160px;
  display:none;
  word-break:break-all;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.4);
  z-index:100;
}
.gdm-process-row div.gdm-tooltip:hover {
  display:block;
}
.gdm-process-row:last-child div.gdm-tooltip{
  margin-left:70px;
  margin-top:-80px;
}
.gdm-process-row span.date-purge:hover + div.gdm-tooltip {
  display:block;
}
.gdm-process-row i.gdm-log:hover + div.gdm-tooltip {
  display:block;
}
</style>