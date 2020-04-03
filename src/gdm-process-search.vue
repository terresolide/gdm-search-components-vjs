<i18n>
{
  "en": {
    "process_dates": "Process dates",
    "identifiers": "Identifiers",
    "temporal_extent": "Temporal extent",
    "parameters": "Parameters",
    "no_process": "No process visible for you",
    "unauthorized": "Unauthorized"
  },
  "fr": {
   "process_dates": "Dates du calcul",
   "identifiers": "Identifiants",
   "temporal_extent": "Etendue temporelle",
   "parameters": "Paramètres",
   "no_process": "Aucun calcul n'est accessible pour vous",
   "unauthorized": "Accès interdit"
  }
}
</i18n>
<template>
  <span class="gdm-process-search">
    <formater-draw-bbox :lang="lang" :color="color"></formater-draw-bbox>
  <div class="wrapper">
   <div class="column-left">
	  <gdm-form-process :lang="lang" :feature-collection="featureCollection" :color="color" :user="parameters.user" :service="parameters.service"
	   @remove="removeSelected" @dateChange="dateChange" @statusChange="statusChange"></gdm-form-process> 
	 </div>
	 <div class="column-right">
	  <div v-if="featureCollection.features && featureCollection.features.length === 0" class="message">
	      {{$t('no_process')}}
	   </div>
	   <div v-else>
		   <gdm-paging :start-index="pagination.startIndex" :max-records="pagination.maxRecords"  
		   :count="pagination.count" :total-results="pagination.totalResults"
		   :lang="lang" :color="color" @change="pageChange"></gdm-paging>
		   <table>
		     <thead :style="{background:$shadeColor(color, 0.5)}">
		     <th>{{$t('identifiers')}}</th>
		     <th>Status</th>
		     <th>{{$t('process_dates')}}</th>
		     <th>{{$t('temporal_extent')}}</th>
		     <th>{{$t('parameters')}}</th>
		     
		     </thead>
		     <tbody>
		     <tr v-for="feature in featureCollection.features">
		     <td>
			     <div><b>{{feature.properties.id}}</b></div>
			     <div class="gdm-token" v-if="feature.properties.token">{{feature.properties.token}}</div>
	         
			     <div class="toSelect" :class="{selected: parameters.service}" 
		           @click="selectService({id:feature.properties.serviceId, name:feature.properties.serviceName})">
		           {{feature.properties.serviceName}}
		       </div>
			     <div v-if="userId">{{feature.properties.email}}</div>
			     <div v-else>
			         <div class="toSelect" :class="{selected: parameters.user}" 
			         @click="selectUser({id:feature.properties.userId, email:feature.properties.email})">
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
import FormaterDrawBbox from './subcomponents/formater-draw-bbox.vue'

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
      featureCollection: {},
      pagination: {
        startIndex: 0,
        maxRecords: 25,
        totalResults: null
      },
      parameters: {
        user: null,
        service: null,
        status: null,
        processStart: null,
        processEnd: null,
        tempStart: null,
        tempEnd: null,
        launchUrl: null
      }
    }
  },
  created () {
   // launch url debug
   this.launchUrl = this.api.substr(0, this.api.indexOf('api'))
   this.$i18n.locale = this.lang
   console.log(this.$i18n);

    moment.locale(this.lang)
	  this.search()
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
    pageChange(values) {
      this.pagination = values
      this.search()
    },
    dateChange (e) {
      var change = {'from': 'Start', 'to': 'End'}
      var name = e.name.replace('from','Start').replace('to', 'End')
      console.log(name)
      this.parameters[name] = e.value
      this.search()
    },
    display (response) {
      console.log(response.body.features)
      var pagination = response.body.properties
      this.pagination = {
        startIndex: pagination.startIndex,
        totalResults: pagination.totalResults,
        maxRecords: pagination.itemsPerPage,
        count: response.body.features.length
      }
      console.log(response.body)
      this.featureCollection = response.body
      console.log(this.featureCollection)
    },
//     removeSelected (type) {
//       this.parameters[type] = null
//       this.search()
//     },
    selectUser (user) {
      if (this.parameters.user && this.parameters.user.id === user.id) {
        this.parameters.user = null
      } else {
        this.parameters.user = user
      }
      this.search()
    },
    selectService (service) {
      if (this.parameters.service && this.parameters.service.id === service.id) {
        this.parameters.service = null
      } else {
        this.parameters.service = service
      }
      this.search()
    },
    statusChange(e) {
      this.parameters.status = e
      this.search()
    },
    removeSelected(type) {
      this.parameters[type] = null
      this.search()
    },
    error (response) {
      console.log(response)
      switch (response.status) {
      case 403:
        console.log('Accès interdit, déconnecté?')
        alert(this.$i18n('unauthorized'))
        break
      case 401:
        console.log("Vous n'avez pas les droits suffisants!");
      }
    },
    getProperties (feature) {
      
    },
    printDate (date, length) {
      if (!length) {
        return moment(date, this.dateFormat).format('DD/MM/YYYY')
        
      } else {
       return moment(date, this.dateFormat).format('DD/MM/YYYY HH:mm')
      }
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
.gdm-process-search div.column-left{
  width:250px;
  margin-left:5px;
  float:left;
}
.gdm-process-search div.column-right{
 width:calc(100% - 325px);
  float:left;
  display:box;
  margin-left:10px;
}
table{
 width:100%;
  float:left;
  display:box;
  margin-left:10px;
 border: 1px solid black;
 border-collapse: collapse;

}
thead {
 border: 1px solid black;
 background: lightgrey;
 text-align: left;
}
td, th{
  padding:3px 8px;
  vertical-align:top;
  border-bottom: 1px solid grey;
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
div.toSelect.selected{
 background: #f7f1ef;
 border-color:darkred;
}
div.toSelect:hover {
 background: #e5e5e5;
}
div.toSelect.selected:hover {
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