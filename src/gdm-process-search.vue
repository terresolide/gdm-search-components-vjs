<i18n>
{
  "en": {
    "process_dates": "Process dates",
    "identifiers": "Identifiers",
    "temporal_extent": "Temporal extent",
    "parameters": "Parameters"
  },
  "fr": {
   "process_dates": "Dates du calcul",
   "identifiers": "Identifiants",
   "temporal_extent": "Etendue temporelle",
   "parameters": "Paramètres"
  }
}
</i18n>
<template>
  <span class="gdm-process-search">
   <gdm-paging :start-index="pagination.startIndex" :max-records="pagination.maxRecords"  
   :count="pagination.count" :total-results="pagination.totalResults"
   :lang="lang" @change="pageChange"></gdm-paging>
   <table>
     <thead>
     <th>{{$t('identifiers')}}</th>
     <th>Status</th>
     <th>{{$t('process_dates')}}</th>
     <th>{{$t('temporal_extent')}}</th>
     <th>{{$t('parameters')}}</th>
     
     </thead>
     <tbody>
     <tr v-for="feature in features">
     <td>
	     <div><b>{{feature.properties.id}}</b></div>
	     <div>{{feature.properties.serviceName}}</div>
	     <div v-if="userId">{{feature.properties.email}}</div>
	     <div v-else>
	         <span class="select-user" @click="selectUser(feature.properties.userId)">
	            {{feature.properties.email}}
	          </span>
	     </div>
      
	     <div v-if="feature.properties.processusName">({{feature.properties.processusName}})</div>
     </td>
     <td style="text-align:center;cursor:pointer;" :title="feature.properties.log">
        <span :class="feature.properties.status.toLowerCase()"></span>
     </td>
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
  </span>
</template>
<script>
import GdmPaging from './gdm-paging.vue'
import moment from 'moment'

export default {
  name: 'GdmProcessSearch',
  components: {
    GdmPaging
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
	  }
  },
  data () {
    return {
      dateFormat: 'YYYY-MM-DD hh:mm:ss',
      features: [],
      pagination: {
        startIndex: 0,
        maxRecords: 1,
        totalResults: null
      },
      parameters: {
        userId: null,
        serviceId: null,
        status: null,
        processStart: null,
        processEnd: null,
        tempStart: null,
        tempEnd: null
      }
    }
  },
  created () {
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
     } else if (this.parameters.userId) {
       url += '&userId=' + this.parameters.userId
     }
     this.$http.get(url, {credentials: true})
      .then(
          response => this.display(response),
          response => this.error(response))
    },
    pageChange(values) {
      this.pagination = values
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
      this.features = response.body.features
      console.log(this.printDate(this.features[0].processStart))
      
    },
    selectUser (userId) {
      this.parameters.userId = userId
      this.search()
    },
    error (response) {
      console.log(response)
      switch (response.status) {
      case 403:
        console.log('Accès interdit, déconnecté?')
        alert('Accès Interdit: deconnecté?')
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
    }
  }
}
</script>
<style scoped>
.gdm-process-search{
font-size: 0.9rem;
}
table{
 border: 1px solid black;
 border-collapse: collapse;
 margin:auto;

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
div.infos {
  float:left;
  vertical-align:top;
  font-size:0.9em;
  margin: 0 5px;
}
</style>