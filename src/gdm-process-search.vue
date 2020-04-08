<i18n>
{
  "en": {
    "process_dates": "Process dates",
    "identifiers": "Identifiers",
    "temporal_extent": "Temporal extent",
    "parameters": "Parameters",
    "no_process": "No process",
    "unauthorized": "Access Unauthorized",
    "forbidden": "Access Forbidden: deconnected?"
  },
  "fr": {
   "process_dates": "Dates du calcul",
   "identifiers": "Identifiants",
   "temporal_extent": "Etendue temporelle",
   "parameters": "Paramètres",
   "no_process": "Aucun calcul",
   "unauthorized": "Accès non autorisé à cette ressource",
    "forbidden": "Access interdit: deconnecté?"
  }
}
</i18n>
<template>
  <span class="gdm-process-search">
    <formater-draw-bbox :lang="lang" :color="color"></formater-draw-bbox>
  <div class="wrapper">
   <div class="column-left">
	  <gdm-form-process :lang="lang" :feature-collection="featureCollection" :color="color" :user="parameters.user" :service="parameters.service"
	   @remove="removeSelected" @dateChange="dateChange" @statusChange="statusChange" 
	   @textChange="textChange" @reset="reset"></gdm-form-process> 
	 </div>
	 <div class="column-right">
	 <div id="fmtLargeMap" style="width:calc(100%);"></div>
	  <div v-if="!featureCollection.features || featureCollection.features.length === 0" class="message">
	      {{$t('no_process')}}
	   </div>
	   <div v-else>
		   <gdm-paging :start-index="pagination.startIndex" :max-records="pagination.maxRecords"  
		   :count="pagination.count" :total-results="pagination.totalResults"
		   :lang="lang" :color="color" @change="pageChange"></gdm-paging>
		   <table>
		     <thead :style="{background:$shadeColor(color, 0.8)}">
		     <th>{{$t('identifiers')}}</th>
		     <th>Status</th>
		     <th>{{$t('process_dates')}}</th>
		     <th>{{$t('temporal_extent')}}</th>
		     <th>{{$t('parameters')}}</th>
		     
		     </thead>
		     <tbody @mouseleave="highlight(null)">
		     <tr v-for="feature in featureCollection.features" :class="'row' + feature.properties.id" 
		     @mouseenter="highlight(feature.properties.id)" @click="selectProcess(feature.properties.id)">
		     <td>
			     <div><b>{{feature.properties.id}}</b></div>
			     <div class="gdm-token" v-if="feature.properties.token">{{feature.properties.token}}</div>
	         
			     <div class="toSelect" :class="{selectedService: parameters.service}" 
		           @click="selectService({id:feature.properties.serviceId, name:feature.properties.serviceName}, $event)">
		           {{feature.properties.serviceName}}
		       </div>
			     <div v-if="userId">{{feature.properties.email}}</div>
			     <div v-else>
			         <div class="toSelect" :class="{selectedUser: parameters.user}" 
			         @click="selectUser({id:feature.properties.userId, email:feature.properties.email}, $event)">
			            {{feature.properties.email}}
			          </div>
			     </div>
		      
			     <div v-if="feature.properties.processusName">({{feature.properties.processusName}})</div>
		     </td>
		     <td style="text-align:center;cursor:pointer;" :title="feature.properties.log">
		        <span :class="statusToClass(feature.properties.status)"></span>
		        <div style="font-style:italic;font-size:0.9rem;color:grey;">{{feature.properties.status}}</div>
		        <a v-if="back"  :href="launchUrl + 'process/launch/' + feature.properties.id" class="button">Test Curl</a>
		     <td style="text-align:left;">
		     <b>Start: </b>{{printDate(feature.properties.processStart,true)}}<br/>
		     <b>End: </b>{{printDate(feature.properties.processEnd, true)}}
		     </td>
		     
		     <td style="text-align:center;">
		     {{printDate(feature.properties.temporalExtent[0])}}
		     <b>&rarr;</b>
		     {{printDate(feature.properties.temporalExtent[1])}}
		     </td>
		     <td>
		     <div v-for="type in ['provider', 'position', 'parameters']" class="infos" >
		         <div v-if="feature.properties[type]"  >
		            <div v-for="(value, prop) in feature.properties[type]" >
		              <div><b>{{prop}}:</b> {{value}}</div>
		            </div>
		         </div>
		     </div>
		     </td>
		     </tr>
		     </tbody>
		   </table>
	   </div>
	   </div>
   </div>
  </span>
</template>
<script>
import GdmPaging from './gdm-paging.vue'
import GdmFormProcess from './subcomponents/gdm-form-process.vue'
import moment from 'moment'
import FormaterDrawBbox from './subcomponents/gdm-draw-bbox.vue'

export default {
  name: 'GdmProcessSearch',
  components: {
    GdmPaging,
    GdmFormProcess,
    FormaterDrawBbox
  },
  props: {
	  api: {
      type: String,
      default: null
	  },
	  lang: {
	    type: String,
	    default: 'fr'
	  },
	  userId: {
	    type: Number,
	    default: null
	  },
    color: {
      type: String,
      default: '#808080'
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD hh:mm:ss',
      dateFormatDisplay: 'DD/MM/YYYY',
      featureCollection: {},
      pagination: {
        startIndex: 0,
        maxRecords: 25,
        totalResults: null
      },
      spatialChangeListener: null,
      selectProcessLayerListener: null,
      selectedProcessId: null,
      parameters: {
        user: null,
        service: null,
        status: null,
        processStart: null,
        processEnd: null,
        tempStart: null,
        tempEnd: null,
        q: null,
        bbox: null
      }
    }
  },
  created () {
   // launch url debug
   this.spatialChangeListener = this.spatialChange.bind(this)
   document.addEventListener('fmt:spatialChangeEvent', this.spatialChangeListener)
    this.selectProcessLayerListener = this.selectedLayerChange.bind(this)
   document.addEventListener('gdm:selectProcessLayer', this.selectProcessLayerListener)
   this.launchUrl = this.api.substr(0, this.api.indexOf('api'))
   this.$i18n.locale = this.lang
   moment.locale(this.lang)
   if (this.lang === 'en') {
     this.dateFormatDisplay = 'MM/DD/YYYY'
   } else {
     this.dateFormatDisplay = 'DD/MM/YYYY'
   }
	 this.search()
  },
  destroyed () {
    document.removeEventListener('fmt:spatialChangeEvent', this.spatialChangeListener)
    this.spatialChangeListener = null
  },
  mounted () {
  },
  methods: {
    search () {
     var url = this.api + '?maxRecords=' + this.pagination.maxRecords + '&index=' + this.pagination.startIndex
     if (this.userId) {
        url += '&userId=' + this.userId
     } else if (this.parameters.user) {
       url += '&userId=' + this.parameters.user.id
     }
     if (this.parameters.service) {
       url += '&serviceId=' + this.parameters.service.id
     }
     if (this.parameters.status) {
       url += '&status=' + this.parameters.status
     }
     if (this.parameters.any) {
       url += '&any=' + this.parameters.any
     }
     if (this.parameters.bbox) {
       url +='&bbox=' + this.parameters.bbox
     }
     var self = this
     var dateType = ['processStart', 'processEnd', 'tempStart', 'tempEnd']
     dateType.forEach(function (name) {
       if (self.parameters[name]) {
         url += '&' + name + '=' + self.parameters[name]
       }
     })
     this.$http.get(url, {credentials: true})
      .then(
          response => this.display(response),
          response => this.error(response))
    },
   
    dateChange (e) {
      var change = {'from': 'Start', 'to': 'End'}
      var name = e.name.replace('from','Start').replace('to', 'End')
      this.parameters[name] = e.value
      this.search()
    },
   
    display (response) {
      var pagination = response.body.properties
      this.pagination = {
        startIndex: pagination.startIndex,
        totalResults: pagination.totalResults,
        maxRecords: pagination.itemsPerPage,
        count: response.body.features.length
      }
      this.featureCollection = response.body
    },
    error (response) {
      this.pagination = {
          startIndex: 0,
          totalResults: 0,
          maxRecords: 25,
          count: 0
        }
        this.featureCollection = {}
      switch (response.status) {
      case 403:
        console.log('Accès interdit, déconnecté?')
        alert(this.$i18n.t('forbidden'))
        break
      case 401:
        console.log("Vous n'avez pas les droits suffisants!");
        alert(this.$i18n.t('unauthorized'))
      }
    },
    highlight (featureId) {
      // remove all highlight
      var nodes = document.querySelectorAll('.gdm-process-search .highlight')
      nodes.forEach(function(node) {
        node.classList.remove('highlight')
      })
      var nodes = document.querySelectorAll('.row' + featureId)
      nodes.forEach(function (node) {
        node.classList.add('highlight')
      })
      var event = new CustomEvent('gdm:processHighlight', {detail: {id: featureId}})
      document.dispatchEvent(event)
    },
   
    pageChange(values) {
      this.pagination = values
      this.search()
    },
    printDate (date, length) {
      if (!length) {
        return moment(date, this.dateFormat).format(this.dateFormatDisplay)
        
      } else {
       return moment(date, this.dateFormat).format(this.dateFormatDisplay + ' HH:mm')
      }
    },
    removeSelected(type) {
      this.parameters[type] = null
      this.search()
    },
    reset () {
      this.selectProcess(null)
      for (var prop in this.parameters) {
        this.parameters[prop] = null
      }
      this.search()
    },
    selectedLayerChange (e) {
      var id = e.detail.id
      this.selectProcess(id)
    },
    selectProcess (featureId) {
      var selectedProcessId = this.selectedProcessId
      var nodes = document.querySelectorAll('.gdm-process-search .selected')
      nodes.forEach(function(node) {
        node.classList.remove('selected')
      })
      if (featureId !== selectedProcessId) {
        var nodes = document.querySelectorAll('.row' + featureId)
        nodes.forEach(function (node) {
          node.classList.add('selected')
        })
        this.selectedProcessId = featureId
      } else {
        this.selectedProcessId = null
      }
      var event = new CustomEvent('gdm:processSelect', {detail: {id: featureId}})
      document.dispatchEvent(event)
    },
    selectService (service, event) {
      if (this.parameters.service && this.parameters.service.id === service.id) {
        this.parameters.service = null
      } else {
        this.parameters.service = service
      }
      this.search()
      event.stopPropagation()
    },
    selectUser (user, event) {
      if (this.parameters.user && this.parameters.user.id === user.id) {
        this.parameters.user = null
      } else {
        this.parameters.user = user
      }
      this.search()
      event.stopPropagation()
    },
    spatialChange(e) {
      var event = new CustomEvent('aerisSearchEvent', {detail: {}})
      document.dispatchEvent(event)
      if (event.detail.geometry) {
        this.parameters.bbox = event.detail.geometry
      } else {
        this.parameters.bbox = null
      }
      this.search()
    },
    statusChange(e) {
      this.parameters.status = e
      this.search()
    },
    statusToClass(status) {
      switch(status) {
      case 'RUNNING':
      case 'WAITING':
        return 'fa fa-refresh fa-spin fa-3x fa-fw ' + status.toLowerCase()
        break
        default:
          return status.toLowerCase()
      }
    },
    textChange (value) {
      if (value) {
         this.parameters.any = encodeURIComponent(value)
      } else {
        this.parameters.any = null
      }
      this.search()
    }
    
    
  }
}
</script>
<style scoped>
.gdm-process-search{
font-size: 0.9rem;
}
.gdm-process-search div.wrapper {

  margin:auto;
}
.gdm-process-search tr.highlight {
  background: #EFF6F6;
}
.gdm-process-search tr.selected {
  background: #F6EFEF;
}
.gdm-process-search div.column-left{
  width:250px;
  margin-left:5px;
  float:left;
}
.gdm-process-search div.column-right{
 width:calc(100% - 275px);
  float:left;
  display:block;
  margin-left:10px;
}
div.message {
	font-size: 0.9rem;
	margin:auto;
	text-align: center;
	font-style: italic;
}
table{
 width:100%;
  float:left;
  display:box;
 border: 1px solid #ccc;
 border-collapse: collapse;
 box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);

}
thead {
 border: 1px solid #ccc;
 background: lightgrey;
 text-align: left;
}
td, th{
  padding:3px 8px;
  vertical-align:top;
  border-bottom: 1px solid #CCC;
}
span.failed{
 color: darkred;
 font-weight: 800;
}
span.failed::before{
content:"\00D7";
}
span.terminated{
 color:darkgreen;
}
span.terminated::before{
 content:"\2713";
}
span.running, 
span.waiting{
  color: grey;
  font-size:16px;
}

div.toSelect {
 cursor: pointer;
 padding: 2px;
  margin: 3px 0px;
  background: #F0f0f0;
  border: 1px solid #909090;
  border-radius:2px;
}
div.toSelect.selectedUser,
div.toSelect.selectedService{
 background: #f7f1ef;
 border-color:darkred;
}
div.toSelect:hover {
 background: #e5e5e5;
}
div.toSelect.selectedUser:hover,
div.toSelect.selectedService:hover  {
 background: #f9eae6;
}

div.infos {
  float:left;
  vertical-align:top;
  font-size:0.8em;
  margin: 0 5px;
}
div.gdm-token{
  color:#202020;
  font-size:0.8em;
  font-style:italic;
  max-width: 190px;
overflow-wrap: break-word;
}
</style>