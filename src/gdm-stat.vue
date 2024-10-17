<template>
<div>
<div style="padding: 10px;">
  <ul class="menu-content">
    <li :class="{selected: mode === 'service'}" @click="setMode('service')"><span>Services</span>
    </li><li :class="{selected: mode === 'connection'}" @click="setMode('connection')"><span>Connexion</span>
    </li><li :class="{selected: mode === 'job'}" @click="setMode('job')"><span>Jobs</span>
    </li><li :class="{selected: mode === 'product'}" @click="setMode('product')"><span>Produits</span>
    </li><li :class="{selected: mode === 'ciest2'}" @click="setMode('ciest2')"><span>CIEST2</span>
    </li>
  </ul>
</div>
<gdm-stat-form ref="form" :mode="mode" :services="services" :groups="groups" 
@servicesChange="initServices" @search="search" @draw="draw"></gdm-stat-form>


  <!-- RESULTS -->
  <!-- MODE CONNECTION -->
  <div v-show="mode === 'connection'">
    <h1>Suivi des authentifications</h1>
    <div v-if="group === 'type'" class="job-header" >
	    <div>
	      <h2>Total connexions aux services de calcul par type d'organisme</h2>
	       <div v-for="(type, index) in userTypes" >
	             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
	             <b>{{type.t_name_fr}}</b>:
	             <span v-if="sessions.type.count && sessions.type.count[type.t_id]">{{sessions.type.count[type.t_id].toLocaleString()}}</span>
	             <span v-else>0</span>
	       </div>
	        <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{sessions.type.avg.count}}
           </div>
	    </div>
	    <div>
        <h2>Visiteurs par jour</h2>
         <div v-for="(type, index) in userTypes" >
               <span class="fa fa-circle" :style="{color: colors[index]}"></span>
               <b>{{type.t_name_fr}}</b>:
               <span v-if="sessions.type.count && sessions.type.count[type.t_id]">{{(sessions.type.count[type.t_id] / days.length).toLocaleString()}}</span>
               <span v-else>0</span>
         </div>
          <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{(sessions.type.avg.count / days.length).toLocaleString()}}
           </div>
      </div>
	  </div>
     <div v-else class="job-header" >
      <div>
        <h2>Total connexions aux services de calcul par pôle</h2>
         <div v-for="(pole, index) in poles" >
               <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
               <b>{{poleName(pole.po_id)}}</b>:
               <span v-if="sessions.pole.count && sessions.pole.count[pole.po_id]">{{sessions.pole.count[pole.po_id].toLocaleString()}}</span>
               <span v-else>0</span>
         </div>
          <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{sessions.pole.avg.count}}
           </div>
      </div>
      <div>
        <h2>Visiteurs par jour</h2>
         <div v-for="(pole, index) in poles" >
               <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
               <b>{{poleName(pole.po_id)}}</b>:
               <span v-if="sessions.pole.count && sessions.pole.count[pole.po_id]">{{(sessions.pole.count[pole.po_id] / days.length).toLocaleString()}}</span>
               <span v-else>0</span>
         </div>
          <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{(sessions.pole.avg.count / days.length).toLocaleString()}}
           </div>
      </div>
    </div>
    <div id="sessions" style="margin-top:30px;"></div>
    
    <h1>Suivi des créations de comptes</h1>
     <div v-if="group === 'type'" class="job-header" >
      <div>
        <h2>Total nouvels utilisateurs</h2>
         <div v-if="userTypes" v-for="(type, index) in userTypes" >
               <span class="fa fa-circle" :style="{color: colors[index]}"></span>
               <b>{{type.t_name_fr}}</b>:
               <span v-if="newUsers.type.count && newUsers.type.count[type.t_id]">{{newUsers.type.count[type.t_id].toLocaleString()}}</span>
               <span v-else>0</span>
         </div>
          <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{newUsers.type.avg.count}}
           </div>
      </div>
      <div>
        <h2>Nouveaux comptes par jour</h2>
         <div v-for="(type, index) in userTypes" >
               <span class="fa fa-circle" :style="{color: colors[index]}"></span>
               <b>{{type.t_name_fr}}</b>:
               <span v-if="newUsers.type.count && newUsers.type.count[type.t_id]">{{(newUsers.type.count[type.t_id] / days.length).toLocaleString()}}</span>
               <span v-else>0</span>
         </div>
          <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{(newUsers.type.avg.count / days.length).toLocaleString()}}
           </div>
      </div>
    </div>
    <div v-else class="job-header" >
      <div>
        <h2>Total nouvels utilisateurs</h2>
         <div  v-for="(pole, index) in poles" >
               <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
               <b>{{poleName(pole.po_id)}}</b>:
               <span v-if="newUsers.pole.count && newUsers.pole.count[pole.po_id]">{{newUsers.pole.count[pole.po_id].toLocaleString()}}</span>
               <span v-else>0</span>
         </div>
          <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{newUsers.pole.avg.count}}
           </div>
      </div>
      <div>
        <h2>Nouveaux comptes par jour</h2>
         <div v-for="(pole, index) in poles" >
               <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
               <b>{{poleName(pole.po_id)}}</b>:
               <span v-if="newUsers.pole.count && newUsers.pole.count[pole.po_id]">{{(newUsers.pole.count[pole.po_id] / days.length).toLocaleString()}}</span>
               <span v-else>0</span>
         </div>
          <hr  style="width:60%;margin-left:5px;color:gray;">
           <div >
              <b>Total</b>: {{(newUsers.pole.avg.count / days.length).toLocaleString()}}
           </div>
      </div>
    </div>
    <div id="newUsers" style="margin-top:30px;"></div>
  </div>
   <div v-show="mode === 'service'">
     <h2>Répartition des utilisateurs</h2>
     <div><b>Nombre d'utilisateurs actifs</b>: {{totalUsers}}</div>
     <div style="width:48%;display:inline-block;margin-top:30px;">
       <div id="userByType"></div>
     </div>
      <div style="width:48%;display:inline-block;">
       <div id="userByPole"></div>
     </div>
     <div id="serviceUsers" style="margin-top:30px;"></div>
     <div id="servicePoles" style="margin-top:30px;"></div>
<!--     <h2>Répartition par service</h2>
     <div v-for="service in services" style="width:49%;display:inline-block;">
     <h3 style="color:black;">Service {{service.name}}</h3>
      <div :id="'service' + service.id"></div>
     </div>   -->
   </div>
    <div v-show="mode === 'job'" class="job-content" >
    <h1>{{selectedName()}}</h1>
    <div class="job-header" >

       <div>
          <h2>Total jobs</h2>
           <div v-for="(type, index) in userTypes" v-if="groupBy === 'type'">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="jobs.count && jobs.count[type.t_id]">{{jobs.count[type.t_id].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <div v-for="(pole, index) in poles" v-if="groupBy === 'pole'">
             <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
             <b>{{poleName(pole.po_id)}}</b>:
             <span v-if="jobs.count && jobs.count[pole.po_id]">{{jobs.count[pole.po_id].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <div v-for="(status, index) in status" v-if="groupBy === 'status'">
             <span class="fa fa-circle" :style="{color: status.color}"></span>
             <b>{{status.name}}</b>:
             <span v-if="jobs.count && jobs.count[status.id]">{{jobs.count[status.id].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <div v-for="service in selectedServices" v-if="groupBy === 'service' && (selectedService() === '' || selectedService() === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="jobs.count && jobs.count[service.name]">{{jobs.count[service.name].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <hr v-if="selectedService() === '' || groupBy !== 'service'" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService() === '' || groupBy !== 'service'">
              <b>Total</b>: {{jobs.avg.count}}
           </div>
       </div>
       <div>
           <h2>Coût moyen</h2>
           <div v-for="(type, index) in userTypes" v-if="groupBy === 'type'">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="jobs.cost && jobs.cost[type.t_id]">{{Math.round(jobs.cost[type.t_id]/jobs.countCost[type.t_id]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
            <div v-for="(pole, index) in poles" v-if="groupBy === 'pole'">
             <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
             <b>{{poleName(pole.po_id)}}</b>:
             <span v-if="jobs.cost && jobs.cost[pole.po_id]">{{Math.round(jobs.cost[pole.po_id]/jobs.countCost[pole.po_id]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <div v-for="(status, index) in status" v-if="groupBy === 'status'">
             <span class="fa fa-circle" :style="{color: status.color}"></span>
             <b>{{status.name}}</b>:
             <span v-if="jobs.cost && jobs.cost[status.id]">{{Math.round(jobs.cost[status.id]/jobs.countCost[status.id]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <div v-for="service in selectedServices" v-if="groupBy === 'service' && (selectedService() === '' || selectedService() === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="jobs.cost && jobs.cost[service.name]">{{Math.round(jobs.cost[service.name]/jobs.countCost[service.name]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService() === '' || groupBy !== 'service'" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService() === '' || groupBy !== 'service'">
              <b>Tout {{groupBy}}</b>:
              <span v-if="jobs.avg && jobs.avg.cost">{{Math.round(jobs.avg.cost).toLocaleString()}} CPU Secondes</span>
              <span v-else>---</span>
           </div>
       </div>
       <div >
           <h2>Durée moyenne</h2>
           <div v-for="(type, index) in userTypes" v-if="groupBy === 'type'">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="jobs.duration[type.t_id] && jobs.countDuration[type.t_id]">{{secondToStr(jobs.duration[type.t_id]/jobs.countDuration[type.t_id])}}</span>
             <span v-else>---</span>
           </div>
            <div v-for="(pole, index) in poles" v-if="groupBy === 'pole'">
             <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
             <b>{{poleName(pole.po_id)}}</b>:
             <span v-if="jobs.duration[pole.po_id] && jobs.countDuration[pole.po_id]">{{secondToStr(jobs.duration[pole.po_id]/jobs.countDuration[pole.po_id])}}</span>
             <span v-else>---</span>
           </div>
           <div v-for="(status, index) in status" v-if="groupBy === 'status'">
             <span class="fa fa-circle" :style="{color: status.color}"></span>
             <b>{{status.name}}</b>:
             <span v-if="jobs.duration[status.id] && jobs.countDuration[status.id]">{{secondToStr(jobs.duration[status.id]/jobs.countDuration[status.id])}}</span>
             <span v-else>---</span>
           </div>
           <div v-for="service in selectedServices" v-if="groupBy === 'service'  && (selectedService() === '' || selectedService() === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="jobs.duration[service.name] && jobs.countDuration[service.name]">{{secondToStr(jobs.duration[service.name]/jobs.countDuration[service.name])}}</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService() === '' || groupBy !== 'service'" style="width:60%;margin-left:5px;color:gray;">
            <div v-if="selectedService() === '' || groupBy !== 'service'" >
              <b>Tout {{groupBy}}</b>:
              <span v-if="jobs.avg.duration">{{secondToStr(jobs.avg.duration)}}</span>
              <span v-else>---</span>
            </div>
       </div>
     </div>
     <div id="jobs" style="margin-top:30px;"></div>
   </div>
   <div v-if="mode === 'product'">
    <h1>{{selectedName()}}</h1>
    <div class="job-header" >
       <div>
          <h2>Nombre de jobs</h2>
          
           <div v-for="service in selectedServices">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="products.countJobs && products.countJobs[service.name]">{{products.countJobs[service.name].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <hr v-if="selectedService() === ''" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService() === ''">
              <b>Total</b>: {{products.avg.countJobs}}
           </div>
       </div>
       <div>
          <h2>Total produits générés</h2>
          
           <div v-for="service in selectedServices">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="products.countJobs && products.countJobs[service.name]">{{products.count[service.name].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <hr v-if="selectedService() === ''" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService() === ''">
              <b>Total</b>: {{products.avg.countProducts}}
           </div>
       </div>
       <div>
          <h2>Nombre moyen de produits générés</h2>
          
           <div v-for="service in selectedServices">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="products.countJobs && products.countJobs[service.name]">{{(products.count[service.name] / products.countJobs[service.name]).toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <hr v-if="selectedService() === ''" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService() === ''">
              <b>Total</b>: 
              <span v-if="products.avg.countJobs">{{Math.round(products.avg.countProducts / products.avg.countJobs).toLocaleString()}}</span>
              <span v-else>---</span>
           </div>
       </div>
       </div>
       <div id="products" style="margin-top:30px;"></div>
   </div>
   <div v-show="mode === 'ciest2'" class="job-content" >
    <h1>{{selectedName()}}</h1>
    <div class="job-header" >

       <div>
          <h2>Total jobs</h2>
           <div v-for="service in selectedServices" v-if="(selectedService() === '' || selectedService() === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="ciest2.count && ciest2.count[service.name]">{{ciest2.count[service.name].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <hr v-if="selectedService() === ''" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService() === ''">
              <b>Total</b>: {{ciest2.avg.count}}
           </div>
       </div>
       <div>
           <h2>Coût moyen</h2>
           <div v-for="service in selectedServices" v-if="(selectedService() === '' || selectedService() === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="ciest2.cost && ciest2.cost[service.name]">{{Math.round(ciest2.cost[service.name]/ciest2.countCost[service.name]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService() === ''" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService() === ''">
              <b >Tout service</b>:
              <span v-if="ciest2.avg && ciest2.avg.cost">{{Math.round(ciest2.avg.cost).toLocaleString()}} CPU Secondes</span>
              <span v-else>---</span>
           </div>
       </div>
       <div >
           <h2>Durée moyenne</h2>
           <div v-for="service in selectedServices" v-if="(selectedService() === '' || selectedService() === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="status === 'success' && ciest2.duration && ciest2.countDuration[service.name]">{{secondToStr(ciest2.duration[service.name]/ciest2.countDuration[service.name])}}</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService() === ''" style="width:60%;margin-left:5px;color:gray;">
            <div v-if="selectedService() === ''" >
              <b>Tout service</b>:
              <span v-if="status === 'success' && ciest2.avg.duration">{{secondToStr(ciest2.avg.duration)}}</span>
              <span v-else>---</span>
            </div>
       </div>
     </div>
     <div id="ciest2" style="margin-top:30px;"></div>
      <div style="margin-top:30px;">
      <h1>Images téléchargées</h1>
      <div class="job-header" >
          <h2>Total: {{download.count}}</h2>
       </div>
      <div id="download"></div>
      </div>
   </div>
 </div>
</template>
<script>
import * as Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
// import FullScreen from 'highcharts/modules/full-screen'

import Accessibility from 'highcharts/modules/accessibility'
import GdmStatForm from './subcomponents/gdm-stat-form.vue'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
  Accessibility(Highcharts)
  ExportData(Highcharts)
 // FullScreen(Highcharts)
}
import moment from 'moment'
export default {
  name: 'GdmStat',
  components: {
    GdmStatForm
  },
  props: {
    appUrl: {
      type: String,
      default: null
    }
  },
  computed: {
    
  },
//   computed: {
//     selectedServices () {
//       if (this.selectedGroup !== '') {
//         return this.groups[this.selectedGroup]
//       } else {
//         return this.services
//       }
//     },
//     selectedName () {
//       if (this.selectedService !== '') {
//         var find = this.services.find(s => s.id === this.selectedService)
//         if (find) {
//           return 'Jobs pour le service ' + find.name
//         }
//       }
//       if (this.selectedGroup !== '') {
//         return 'Jobs pour les services ' + this.selectedGroup
//       }
      
//       return 'Jobs pour tous les services'
//     }
//   },
  data () {
    return {
      startDate: null,
      endDate: null,
      by: 'day',
      mode: 'service',
      group: 'type',
      groupBy: 'service',
//       newUsers: { days:{}, months: {}, years: {}},
//       process: { days: {}, months: {}, years: {}},
     // products: { days: {}, months: {}, years: {}},
      serviceUsers: [],
      userTypes: [],
      poles: [],
      days:[],
      months:[],
      years: [],
      services: [],
      selectedServices: [],
      groups: {},
//       count: {},
//       cost:{},
      // tab connexion
      sessions: null,
      newUsers: null,
      // tab jobs
      jobs: null,
      // tab products
      products: null,
      // tab ciest2
      ciest2: null,
      download: null,
//       countCost: {},
//       duration: {},
//       countDuration: {},
//       countJobs: {},
      status: '',
      totalUsers: 0,
      disabledUsers: 0,
      status: [{
            id: 'RUNNING',
            name: 'En cours',
            color: 'grey'
          }, {
            id: 'SUCCESS',
            name: "Terminé avec succès",
            color: 'green',
          }, {
            id: 'ABORTED',
            name: 'Abandonné',
            color: 'orange'
          }, {
            id: 'FAILED',
            name: "En échec",
            color: 'red'
      }],
     // avg: {},
   //   avgProduct: {},
//       selectedService: '',
//       selectedGroup: '',
//       userType: false,
      colors: ['#2f7ed8', '#910000', '#8bbc21',   '#1aadce',
        '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a', '#0d233a']
    }
  },
  created () {
    this.getClassification()
    this.sessions = {
      type: this.defaultData(),
      pole: this.defaultData()
    }
    this.newUsers = {
      type: this.defaultData(),
      pole: this.defaultData()
    }
    this.jobs = this.defaultData()
    this.products = this.defaultData()
    this.ciest2 = this.defaultData()
    this.download = this.jobs = this.defaultData()
    
  },
  methods: {
    defaultData () {
      return {
        data: { days: {}, months: {}, years: {}},
        count: {},
        cost:{},
        countCost: {},
        duration: {},
        countDuration: {},
        countJobs: {},
        avg: {}
      }
    },
    selectedName () {
      if (this.$refs && this.$refs.form) {
        return this.$refs.form.selectedName
      } else {
        return ''
      }
    },
    selectedService () {
      if (this.$refs && this.$refs.form) {
        return this.$refs.form.selectedService
      } else {
        return ''
      }
    },
    initServices (services) {
      this.selectedServices = services
    },
//     selectedServices () {
//       if (this.$refs && this.$refs.form) {
//         return this.$refs.form.selectedServices
//       } else {
//         return this.services
//       }
//     },
//     changeGroup () {
//       if (this.selectedGroup !== '') {
//         this.selectedService = ''
//       }
//       this.search()
//     },
    nameByKey (key, group) {
      if (group === 'pole') {
        return this.poleName(key)
      } else {
        return this.userTypeName(key)
      }
    },
    poleName (key) {
      var find = this.poles.find(pl => pl.po_id === key)
      if (find) {
        if (find.po_name) {
          return find.po_name
        } else {
          return find.po_description.fr
        }
      } else {
        return 'inconnu'
      }
    },
    userTypeName (type) {
      var find = this.userTypes.find(tp => tp.t_id === type)
      if (find) {
        return find.t_name_fr
      } else {
        'Inconnu'
      }
    },
    draw (e) {
      this.group = e.group
      switch (this.mode) {
        case 'connection':
          this.drawConnection(e)
          this.drawNewUsers(e)
          break
        case 'services':
          this.drawServices(e)
          break
        case 'job':
          this.drawJobs(e)
          break
        case 'product':
          this.drawProducts(e)
          break;
        case 'ciest2':
          this.drawCiest2(e)
          this.drawDownload(e)
      }
    },
    drawHistogram (id, title, categories, series, options ) {
      var colors = this.colors
      if (options && options.colors) {
        colors = options.colors
      }
      Highcharts.chart(id, {
        chart: {
          type: 'column'
        },
        title: {
          text: title,
          align: 'left',
          style: {'color': '#000000', 'fontSize': '20px', 'fontWeight': 700}
        },
        credits: {
          enabled:false
        },
        colors: colors,
        legend: {
          labelFormatter: function() {
            return this.name
          }
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          allowDecimals: false,
          title: {
            text: ''
          }
        },
        tooltip: {
          formatter: function(e) {
            var currentPoint = this
            var tot = 0
            var stackValues = '<b>' + this.x.replaceAll('-', '/') + '</b><br />'
              currentPoint.points.forEach(function(point, i) {
                  stackValues += '<span style="color: ' + point.color + '">\u25CF</span> ' + series[i].name + ': ' + point.y + '<br/>'
                  tot += point.y
              })
            return stackValues +
              '<span style="margin-left:10px;font-weight:700">Total: </span>' + tot;
          },
  //         headerFormat: '<span style="font-size:10px">{point.x}</span><table>',
  //         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //           '<td style="padding:0"><b>{point.y}</b></td></tr>',
  //         footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            pointPadding: 0,
            borderWidth: 1,
            groupPadding: 0,
            shadow: false
          }
        },
        series: series
      });
    },
    drawPie (id, title,  series, options) {
      var colors = this.colors
      if (options.colors) {
        colors = options.colors
      }
      Highcharts.chart(id, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        credits: {
          enabled:false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: colors,
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: series
      })
    },
    drawNewUsers (details) {
      var categories = this[details.by + 's']
      var data = this.newUsers[details.group].data[details.by + 's']
      var series = []
      var options = {}
      for(var key in data) {
        series.push({
          name: this.nameByKey(key, details.group),
          data: data[key]
        })
        if (details.group === 'pole') {
          if (!options.colors) {
            options.colors = []
          }
          var pl = this.poles.find(pl => pl.po_id === key)
          options.colors.push(pl.po_color)
        }
      }
      this.drawHistogram('newUsers', 'Histogramme des Nouveaux comptes', categories, series, options)
    },
    drawConnection(details) {
      var categories = this[details.by + 's']
      var data = this.sessions[details.group].data[details.by + 's']
      var series = []
      var options = {}
      for(var key in data) {
        series.push({
          name: this.nameByKey(key, details.group), // this.userTypeName(type),
          data: data[key]
        })
        if (details.group === 'pole') {
          if (!options.colors) {
            options.colors = []
          }
          var pl = this.poles.find(pl => pl.po_id === key)
          options.colors.push(pl.po_color)
        }
      }
      this.drawHistogram('sessions', 'Histogramme de connexions', categories, series, options)
    },
    drawJobs (e) {
      var categories = this[e.by + 's']
      var data = this.jobs.data[e.by + 's']
      var series = []
      var colors = []
      var name = ''
      for (var index in data) {
        switch (e.groupBy) {
          case 'pole':
            var pl = this.poles.find(pl => pl.po_id === index)
            colors.push(pl.po_color)
          case 'type':
            name = this.nameByKey(index, e.groupBy)
            break;
          case 'status':
            var pl = this.status.find(st => st.id === index)
            colors.push(pl.color)
            name = pl.name
            break
          case 'service':
            var find = this.services.find(s => s.name === index)
            name = index
            colors.push(find.color)
        }
        series.push({
          name: name,
          data: data[index]
        })
      }
      var options = {}
      if (colors.length > 0) {
        options = {colors: colors}
      }
      this.drawHistogram('jobs', 'Nombre de jobs', categories, series, options)
    },
    drawProducts (e) {
      var categories = this[e.by + 's']
      var data = this.products.data[e.by + 's']
      var series = []
      var colors = []
      var name = ''
      for (var index in data) {
        
          var find = this.services.find(s => s.name === index)
          name = index
          colors.push(find.color)

        series.push({
          name: name,
          data: data[index]
        })
        
      }
      var options = {}
      if (colors.length > 0) {
        options = {colors: colors}
      }
      this.drawHistogram('products', 'Nombre de produits', categories, series, options)
    },
    drawCiest2 () {
      var categories = this[this.by + 's']
      var data = this.ciest2.data[this.by + 's']
      var series = []
      var colors = []
      var name = ''
      for (var index in data) {
         var find = this.services.find(s => s.name === index)
         name = index
         colors.push(find.color)
         series.push({
           name: name,
           data: data[index]
         })
      }
      var options = {}
      if (colors.length > 0) {
        options = {colors: colors}
      }
      this.drawHistogram('ciest2', 'Activité CIEST2', categories, series, options)
    },
    drawDownload () {
      var categories = this[this.by + 's']
      var data = this.download.data[this.by + 's']
      var series = []
      var colors = []
      var name = ''
        series.push({
          name: 'Téléchargements',
          data: data
        })
    
      var options = {}
      
      this.drawHistogram('download', 'Téléchargement FTP', categories, series, options)
    },
    getServices () {
      var url = this.appUrl + '/api/services/list'
      this.$http.get(url)
      .then(function (response) {
        this.services = response.body.services
        this.selectedServices = this.services
        var _this = this
        this.services.forEach(function (sv) {
          if (!_this.groups[sv.group]) {
            _this.groups[sv.group] = [sv]
          } else {
            _this.groups[sv.group].push(sv)
          }
        })
      })
    },
    getClassification () {
      var url = this.appUrl + '/api/users/types?full=yes'
      this.$http.get(url, {
        headers: {
          'Accept-Language': 'fr'
        }
      })
      .then(function (response) {
        this.initialize(response.body)
      })
    },
    initialize (data) {
//       this.by = 'day'
//       this.startDate = moment().startOf('month').format('YYYY-MM-DD')
//       this.endDate = moment().endOf('month').format('YYYY-MM-DD')
      if (data.types) {
        this.userTypes = data.types
        this.poles = data.poles
      }
      this.getServices()
      // this.search()
    },
    average (content, groupBy) {
      var count = 0
      var duration = 0
      var countDuration = 0
      var cost = 0
      var countCost = 0
      switch (groupBy) {
        case 'type':
	        this.userTypes.forEach(function (type) {
	          count += content.count[type.t_id]
	          countDuration += content.countDuration[type.t_id]
	          duration += content.duration[type.t_id]
	          cost += content.cost[type.t_id]
	          countCost += content.countCost[type.t_id]
	        })
	        break;
        case 'pole':
          this.poles.forEach(function (pole) {
            count += content.count[pole.po_id]
            countDuration += content.countDuration[pole.po_id]
            duration += content.duration[pole.po_id]
            cost += content.cost[pole.po_id]
            countCost += content.countCost[pole.po_id]
          })
        case 'status':
          this.status.forEach(function (st) {
            count += content.count[st.id]
            countDuration += content.countDuration[st.id]
            duration += content.duration[st.id]
            cost += content.cost[st.id]
            countCost += content.countCost[st.id]
          })
          break;
        default:
	        this.selectedServices.forEach(function (sv) {
	          count += content.count[sv.name]
	          countDuration += content.countDuration[sv.name]
	          duration += content.duration[sv.name]
	          cost += content.cost[sv.name]
	          countCost += content.countCost[sv.name]
	        })
      }
      content.avg = {
        count: count,
        cost: countCost > 0 ? Math.round(cost / countCost) : 0,
        duration: countDuration > 0 ? Math.round(duration / countDuration) : 0
      }
    },
//     jobsAverage () {
//       this.average(this.jobs, this.userType)
//       return
// //       var _this = this
// //       var count = 0
// //       var duration = 0
// //       var countDuration = 0
// //       var cost = 0
// //       var countCost = 0
// //       if (this.userType) {
// //         this.userTypes.forEach(function (type) {
// //           count += _this.jobs.count[type.t_id]
// //           countDuration += _this.jobs.countDuration[type.t_id]
// //           duration += _this.duration[type.t_id]
// //           cost += _this.jobs.cost[type.t_id]
// //           countCost += _this.jobs.countCost[type.t_id]
// //         })
// //       } else {
// // 	      this.selectedServices.forEach(function (sv) {
// // 	        count += _this.jobs.count[sv.name]
// // 	        countDuration += _this.jobs.countDuration[sv.name]
// // 	        duration += _this.jobs.duration[sv.name]
// // 	        cost += _this.jobs.cost[sv.name]
// // 	        countCost += _this.jobs.countCost[sv.name]
// // 	      })
// //       }
// //       this.avg = {
// //         count: count,
// //         cost: countCost > 0 ? Math.round(cost / countCost) : 0,
// //         duration: countDuration > 0 ? Math.round(duration / countDuration) : 0
// //       }
//     },
    productsAverage (e) {
      var _this = this
      var countProducts = 0
      var countJobs = 0
      this.selectedServices.forEach(function (sv) {
        countJobs += _this.products.countJobs[sv.name]
        countProducts += _this.products.count[sv.name]
      })
      this.products.avg = {
        countJobs: countJobs,
        countProducts: countProducts
      }
    },
    secondToStr (totalSeconds) {
      totalSeconds = Math.round(totalSeconds)
      var days = Math.floor(totalSeconds / 86400)
      totalSeconds %= 86400
      var hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = totalSeconds % 60;
      return (days > 0 ? days + 'j ' : '') + hours.toString().padStart(2, '0') +
        ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
    },
    setMode (value) {
      this.mode = value
      // this.$refs.form.search()
    },
    search (e) {
      if (!this.appUrl) {
        return
      }
      switch (this.mode) {
        case 'connection':
          this.searchConnection(e)
          break
        case 'service':
          this.searchService(e)
          break
        case 'job':
          this.searchJob(e)
          break
        case 'product':
          this.searchProduct(e)
          break;
        case 'ciest2':
          this.searchCiest2(e)
          break
      }
    },
    searchConnection (e) {
      var url = this.appUrl + '/api/statistics/sessions?'
      var params = [];
      if (e.startDate) {
        params.push('start=' + e.startDate)
      }
      if (e.endDate) {
        params.push('end=' + e.endDate)
      }
      url += params.join('&')
      this.$http.get(url, {credentials: true})
      .then(function (response) {
        this.treatmentConnection(response.body, e)
      })
    },
    searchJob (e) {
      var url = this.appUrl + '/api/statistics/process?'
      var params = [];
      if (e.startDate) {
        params.push('start=' + e.startDate)
      }
      if (e.endDate) {
        params.push('end=' + e.endDate)
      }
      if (e.status) {
        params.push('status=' + e.status)
      }
//       if (this.selectedService !== '') {
//         params.push('service=' + this.selectedService)
//       } else if (this.selectedGroup !== '') {
//         var services = this.selectedServices.map(sv => sv.id)
//         params.push('service=' + services.join(','))
//       }
      if (e.service) {
        params.push('service=' + e.service)
      }
      if (e.groupBy ) {
        params.push('groupBy=' + e.groupBy )
      }
      url += params.join('&')
      this.$http.get(url, {credentials: true})
      .then(function (response) {
        this.treatmentJobs(response.body, e)
      })
    },
    searchProduct (e) {
      var url = this.appUrl + '/api/statistics/products?'
      var params = [];
          if (e.startDate) {
        params.push('start=' + e.startDate)
      }
      if (e.endDate) {
        params.push('end=' + e.endDate)
      }
      if (e.service) {
        params.push('service=' + e.service)
      }
      url += params.join('&')
      this.$http.get(url, {credentials: true})
      .then(function (response) {
        this.treatmentProducts(response.body, e)
      })
    },
    searchService () {
      this.$http.get(this.appUrl + '/api/statistics/users', {credentials: true})
      .then(function (response) {
        this.treatmentServices(response.body)
      })
    },
    searchCiest2 (e) {
      var url = this.appUrl + '/api/statistics/ciest?'
      var params = [];
          if (e.startDate) {
        params.push('start=' + e.startDate)
      }
      if (e.endDate) {
        params.push('end=' + e.endDate)
      }
      if (this.status !== '') {
        params.push('status=' + e.status)
      }
      if (e.groupBy ) {
        params.push('groupBy=' + e.groupBy )
      }
      url += params.join('&')
      this.$http.get(url, {credentials: true})
      .then(function (response) {
        this.treatmentCiest2(response.body, e)
      })
    },
    extractSeriesFrom (data, cat, content, first, temp) {
      if (first) {
        this.days = []
        this.months = []
        this.years = []
        if (cat) {
	        content.cost = {}
	        content.count = {}
	        content.countCost = {}
	        content.duration = {}
	        content.countDuration = {}
	        content.countJobs = {}
        }
//         this.cost = {}
//         this.count = {}
//         this.countCost = {}
//         this.duration = {}
//         this.countDuration = {}
//         this.countJobs = {}
       // this.sessions = {days: [], months: [], years: []}
      }
//       this.count[cat] = 0
//       this.cost[cat] = 0
//       this.countCost[cat] = 0
//       this.duration[cat] = 0
//       this.countDuration[cat] = 0
//       this.countJobs[cat] = 0
      if (cat) {
	      content.count[cat] = 0
	      content.cost[cat] = 0
	      content.countCost[cat] = 0
	      content.duration[cat] = 0
	      content.countDuration[cat] = 0
	      content.countJobs[cat] = 0
      } else {
        content.count = 0
        content.cost = 0
        content.countCost = 0
        content.duration = 0
        content.countDuration = 0
        content.countJobs = 0
      }
     // this.countProductJobs[cat] = 0
      var date = moment(temp.startDate, 'YYYY-MM-DD')
      var results = {days: [], months: [], years: []}
      var date = moment(temp.startDate, 'YYYY-MM-DD')
      var _this = this
      var year = date.year()
      var month = (date.month() + 1).toString().padStart(2, '0') + '-' + year
      var year2 = null
      var month2 = null
      if (first) {
        this.years.push(year + '')
        this.months.push(month)
      }
      var countMonth = 0
      var countYear = 0
      data.forEach(function (day) {
        // day data
        var strDay = day['year'].toString() + day['month'].toString().padStart(2, '0') + day['day'].toString().padStart(2, '0')
        var date2 =  moment(strDay, 'YYYYMMDD')
        year2 = date2.year()
        month2 = (date2.month() + 1).toString().padStart(2, '0') + '-' + year2
        while (date2.diff(date, 'days') > 0) {
          if (first) {
            _this.days.push(date.format('DD-MM-YYYY'))
          }
          results.days.push(0)
          date.add(1, 'days')
          year2 = date.year()
          month2 = (date.month() + 1).toString().padStart(2, '0') + '-' + year2
          if (month2 !== month) {
            results.months.push(countMonth)
            if (first) {
              _this.months.push(month2)
            }
            month = month2
            countMonth = 0
          }
          if (year2 !== year) {
            results.years.push(countYear)
            if (first) {
              _this.years.push(year2 + '')
            }
            year = year2
            countYear = 0
          }
        }
       // date = date2
        if (first) {
          _this.days.push(date.format('DD-MM-YYYY'))
        }
        results.days.push(day['tot'])
        if (cat) {
          content.count[cat] = content.count[cat] + day['tot']
        } else {
          content.count = content.count + day['tot']
        }
        if (day['cost'] && cat) {
//           _this.cost[cat] = _this.cost[cat] + day['cost']
//           _this.countCost[cat]= _this.countCost[cat] + day['tot']
          content.cost[cat] = content.cost[cat] + day['cost']
          content.countCost[cat]= content.countCost[cat] + day['tot']
        }
        if (day['count'] && cat) {
//           _this.countJobs[cat] = _this.countJobs[cat] + day['count']
             content.countJobs[cat] = content.countJobs[cat] + day['count']
        }
        if (day['duration'] && cat) {
//           _this.duration[cat] = _this.duration[cat] + parseInt(day['duration'])
//           _this.countDuration[cat] = _this.countDuration[cat] + day['tot']
           content.duration[cat] = content.duration[cat] + parseInt(day['duration'])
           content.countDuration[cat] = content.countDuration[cat] + day['tot']
        }
        countMonth += day['tot']
        countYear += day['tot']
        if (month2 !== month) {
          results.months.push(countMonth)
          if (first) {
            _this.months.push(month2)
          }
          month = month2
          countMonth = 0
        }
        if (year2 !== year) {
          results.years.push(countYear)
          if (first) {
            _this.years.push(year2 + '')
          }
          year = year2
          countYear = 0
        }
        date = date2.add(1, 'days')
      })
      var end = moment(temp.endDate, 'YYYY-MM-DD')
      while(end.diff(date, 'days') >= 0) {
        if (first) {
          _this.days.push(date.format('DD-MM-YYYY'))
        }
        results.days.push(0)
        year2 = date.year()
        month2 = (date.month() + 1).toString().padStart(2, '0') + '-' + year2
        if (month2 !== month) {
          results.months.push(countMonth)
          if (first) {
          _this.months.push(month2)
          }
          month = month2
          countMonth = 0
        }
        if (year2 !== year) {
          results.years.push(countYear)
          if (first) {
            _this.years.push(year2 + '')
          }
          year = year2
          countYear = 0
        }
        date.add(1, 'days')
      }
      if (this.years.length > results.years.length) {
        results.years.push(countYear)
      }
      if (this.months.length > results.months.length) {
        results.months.push(countMonth)
      }
      return results
    },
    treatmentConnection (data, e) {
     // this.sessions = this.extractSeriesFrom(data.sessions, true)
      var _this = this 
      var first = true
      this.userTypes.forEach(function (tp) {
        var tab = data.sessionByType.filter(u => u.type === tp.t_id)
        var results = _this.extractSeriesFrom(tab, tp.t_id, _this.sessions.type, first, e)
        first = false
        _this.sessions.type.data.days[tp.t_id] = results.days
        _this.sessions.type.data.months[tp.t_id] = results.months
        _this.sessions.type.data.years[tp.t_id] = results.years
        
      })
      this.average(this.sessions.type, 'type')
      this.poles.forEach(function (po) {
        var tab = data.sessionByPole.filter(u => u.pole === po.po_id)
        var results = _this.extractSeriesFrom(tab, po.po_id, _this.sessions.pole, first, e)
        first = false
        _this.sessions.pole.data.days[po.po_id] = results.days
        _this.sessions.pole.data.months[po.po_id] = results.months
        _this.sessions.pole.data.years[po.po_id] = results.years
        
      })

      this.average(this.sessions.pole, 'pole')
      // this.sessions.avg.average = this.sessions.avg.count / this.days.length
      this.drawConnection(e)
     
      this.userTypes.forEach(function (tp) {
        var tab = data.newUserByType.filter(u => u.type === tp.t_id)
        var results = _this.extractSeriesFrom(tab, tp.t_id, _this.newUsers.type, false, e)
        _this.newUsers.type.data.days[tp.t_id] = results.days
        _this.newUsers.type.data.months[tp.t_id] = results.months
        _this.newUsers.type.data.years[tp.t_id] = results.years
        
      })
      this.average(this.newUsers.type, 'type')
      this.poles.forEach(function (po) {
        var tab = data.newUserByPole.filter(u => u.pole === po.po_id)
        var results = _this.extractSeriesFrom(tab, po.po_id, _this.newUsers.pole, first, e)
        first = false
        _this.newUsers.pole.data.days[po.po_id] = results.days
        _this.newUsers.pole.data.months[po.po_id] = results.months
        _this.newUsers.pole.data.years[po.po_id] = results.years
        
      })
      this.average(this.newUsers.pole, 'pole')
      this.drawNewUsers(e)

    },
    treatmentJobs (data, e) {
      this.groupBy = e.groupBy
      var _this = this
//       if (this.services.length === 0) {
//         this.services = data.services
//         this.services.forEach(function (sv) {
//           if (!_this.groups[sv.group]) {
//             _this.groups[sv.group] = [sv]
//           } else {
//             _this.groups[sv.group].push(sv)
//           }
//         })
//       }
      this.jobs.data = {days: {}, months: {}, years: {}}
      var first = true
      switch (e.groupBy) {
      case 'type':
	        this.userTypes.forEach(function (tp) {
	            var tab = data.process.filter(ps => ps.type === tp.t_id)
	            var results = _this.extractSeriesFrom(tab, tp.t_id, _this.jobs, first, e)
	            first = false
	            _this.jobs.data.days[tp.t_id] = results.days
	            _this.jobs.data.months[tp.t_id] = results.months
	            _this.jobs.data.years[tp.t_id] = results.years 
	        })
	        break;
      case 'status':
          
          this.status.forEach(function (st) {
            var tab = data.process.filter(tp => st.id === tp.status)
            var results = _this.extractSeriesFrom(tab, st.id, _this.jobs, first, e)
            first = false
            _this.jobs.data.days[st.id] = results.days
            _this.jobs.data.months[st.id] = results.months
            _this.jobs.data.years[st.id] = results.years 
          })
          break;
      case 'pole':
          this.poles.forEach(function (tp) {
            var tab = data.process.filter(ps => ps.pole === tp.po_id)
            var results = _this.extractSeriesFrom(tab, tp.po_id, _this.jobs, first, e)
            first = false
            _this.jobs.data.days[tp.po_id] = results.days
            _this.jobs.data.months[tp.po_id] = results.months
            _this.jobs.data.years[tp.po_id] = results.years 
          })
          break;
      case 'service':
        console.log(this.selectedServices)
	      this.selectedServices.forEach(function (service) {
	        if (_this.selectedService() === '' || _this.selectedService() === service.id) {
		        var tab = data.process.filter(p => p.service === parseInt(service.id))
		        var results = _this.extractSeriesFrom(tab, service.name, _this.jobs, first, e)
		        first = false
		        _this.jobs.data.days[service.name] = results.days
		        _this.jobs.data.months[service.name] = results.months
		        _this.jobs.data.years[service.name] = results.years 
	        }
	      })
      }
      this.average(this.jobs, e.groupBy, e)
      this.drawJobs(e)
    },
    treatmentCiest2 (data, e) {
      var _this = this
      
      this.ciest2.data = {days: {}, months: {}, years: {}}
      var first = true

      this.selectedServices.forEach(function (service) {
        if (_this.selectedService() === '' || _this.selectedService() === service.id) {
          var tab = data.process.filter(p => p.service === parseInt(service.id))
          var results = _this.extractSeriesFrom(tab, service.name, _this.ciest2, first, e)
          first = false
          _this.ciest2.data.days[service.name] = results.days
          _this.ciest2.data.months[service.name] = results.months
          _this.ciest2.data.years[service.name] = results.years 
        }
      })
      this.download.data = this.extractSeriesFrom(data.download, null, this.download, false, e)
      this.average(this.ciest2, 'service', e)
      this.drawCiest2(e)
      this.drawDownload(e)
    },
    treatmentProducts (data, e) {
      this.products.data = {days: {}, months: {}, years: {}}
      var first = true
      var _this = this
      this.selectedServices.forEach(function (service) {
        if (_this.selectedService() === '' || _this.selectedService() === service.id) {
          var tab = data.products.filter(p => p.service === parseInt(service.id))
          var results = _this.extractSeriesFrom(tab, service.name, _this.products, first, e)
          first = false
          _this.products.data.days[service.name] = results.days
          _this.products.data.months[service.name] = results.months
          _this.products.data.years[service.name] = results.years 
        }
      })
      this.productsAverage(e)
      this.drawProducts(e)
    },
    treatmentServices(data) {
      // prepare pie
      var _this = this
      var tot = 0
      var rest = 0
      var disabled = 0
      data.types.forEach(function(obj) {
        if(obj.type) {
          tot += obj.tot
        } else {
          disabled += obj.tot
        }
      })
      this.totalUsers = tot
      this.disabledUsers = disabled
      rest = tot
      var value = 0
      var values = []
      this.userTypes.forEach(function (type, id, array ) {
        var find = data.types.find(obj => obj.type === type.t_id)
        if (find) {
          value = Math.round(100 * find.tot / tot)
          rest = rest - tot
        } else {
          value = 0
        }
        values.push({
          name : _this.userTypeName(type.t_id),
          y: value
          
        })
      })
      var serie = {
        name: 'truc',
        data: values
      }
      this.drawPie('userByType','Utilisateurs par type d\'organisme', [serie], {})
      
      tot = 0
      rest = 0
      data.poles.forEach(function(obj) {
        if(obj.pole) {
          tot += obj.tot
        }
      })
      rest = tot
      value = 0
      values = []
      colors = []
      this.poles.forEach(function (pole, id, array ) {
        var find = data.poles.find(obj => obj.pole === pole.po_id)
        if (find) {
          value = Math.round(100 * find.tot / tot)
          rest = rest - tot
        } else {
          value = 0
        }
        colors.push(pole.po_color)
        values.push({
          name : _this.poleName(pole.po_id),
          y: value
          
        })
      })
      var serie = {
        name: 'truc',
        data: values
      }
      this.drawPie('userByPole','Utilisateurs par pôle', [serie], {colors: colors})
      
      var currentService = null
      var categories = []
      var aux = {}
      var colors = []
      this.poles.forEach(function (pl) {
        aux[pl.po_id] = []
        colors.push(pl.po_color)
      })
      data.servicePoles.forEach(function (obj) {
        if (obj.service !== currentService) {
          categories.push(obj.service)
          currentService = obj.service
          for (var pole in aux) {
            var find = data.servicePoles.find(el => el.pole === pole && el.service === currentService)
            if (find) {
              aux[pole].push(find.tot)
            } else {
              aux[pole].push(0)
            }
          }
        }
      })
      var series = []
      for (var pole in aux) {
        series.push({
          name: this.poleName(pole),
          data: aux[pole]
        })
      }
      this.drawHistogram('servicePoles', "Nombre d'utilisateurs par service et par pôle", categories, series, {colors: colors})
      currentService = null
      categories = []
      aux = {}
      this.userTypes.forEach(function (tp) {
        aux[tp.t_id] = []
      })
      console.log(aux)
      data.serviceTypes.forEach(function (obj) {
        if (obj.service !== currentService) {
          categories.push(obj.service)
          currentService = obj.service
          // search count for this service
          for (var type in aux) {
            var find = data.serviceTypes.find(el => el.type === type && el.service === currentService)
            if (find) {
              aux[type].push(find.tot)
            } else {
              aux[type].push(0)
            }
          }
        }
      })
      var series = []
      for (var tp in aux) {
        series.push({
          name: this.userTypeName(tp),
          data: aux[tp]
        })
      }
      this.drawHistogram('serviceUsers', "Nombre d'utilisateurs par service et type", categories, series)
    }
  }
}
</script>
<style>
.job-header {
  display:flex;
}
.job-header > div {
  padding: 0 10px 0 0;
  flex-grow:1;
}

.job-header h2,
.job-content h1 {
  color:black;
  font-size:20px;
  font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
}
.job-content h1 {
  font-size: 24px;
}
.user-search {
   margin:auto;
   margin-bottom:20px;
   text-align: left;
   display: inline-block;
   background: #F5f5f5;
   margin-bottom: 40px;
   margin-left: calc(50% - 225px);
   padding: 10px;
   border: 1px solid grey;
   border-radius: 5px;
 }
 .user-search-large {
   margin-left:5px;
 }
 .user-search > div {
   display: inline-block;
 }
 .user-search label {
   margin-left:10px;
   font-weight: 700;
 }
 ul.menu-content {
  border-bottom: 1px solid #adadad;
 }
 ul.menu-content li {
  display: inline-block;
	min-width: 50px;
	font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
	border: 1px solid #adadad;
	border-bottom: none;
	text-align: center;
	color: black;
	height: 30px;
	vertical-align: middle;
	margin: 0;
	background: #efefef;
	cursor:pointer;
}
 ul.menu-content li span {
   text-transform: capitalize;
vertical-align: middle;
font-size: 1.1rem;
height: 30px;
min-width: 50px;
color: black;
padding: 5px 10px 0 10px;
text-decoration: none;
display: inline-block;
 }
/* ul.menu-content li{
    text-transform: capitalize;
    vertical-align: middle;
    font-size: 1.1rem;
    height: 30px;
    min-width:50px;
    color:black;
    padding: 5px 10px 0 10px;
    text-decoration: none;
    display:inline-block;
} */
ul.menu-content li:hover {
  color:#b8412c;
}
ul.menu-content li.selected  span {
  background:white;
  color:#b8412c;
}
ul.menu-content li.isDisabled {
  pointer-events: none;
  color:grey;
}
</style>