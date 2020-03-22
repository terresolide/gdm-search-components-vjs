<i18n>
{
  "en": {
    "process_dates": "Process dates"
  },
  "fr": {
   "process_dates": "Process dates"
  }
}
</i18n>
<template>
  <span class="gdm-process-search">
   <table>
     <thead>
     <th>Identifier</th>
     <th>Status</th>
     <th>Process Dates</th>

     <th>Temporal Extent</th>
     <th>Other informations</th>
     
     </thead>
     <tbody>
     <tr v-for="feature in features">
     <td>
	     <div><b>{{feature.properties.id}}</b></div>
	     <div>{{feature.properties.serviceName}}</div>
	     <div>{{feature.properties.email}}</div>
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
     <div v-for="prop in displayProperties" style="font-size:0.9em;">
     <div><b>{{prop}}:</b> {{feature.properties[prop]}}</div>
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
      displayProperties: ['relativeOrbit','lookWrap', 'lookUnwrap', 'atmoCorrection', 'provider', 'subSwaths']
    }
  },
  created () {
   // this.$i18n.locale = this.lang
    moment.locale(this.lang)
	  this.search()
  },
  methods: {
    search () {
      this.$http.get(this.api, {credentials: true})
      .then(
          response => this.display(response),
          response => this.error(response))
    },
    display (response) {
      console.log(response.body.features)
      this.features = response.body.features
      console.log(this.printDate(this.features[0].processStart))
      
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

}
thead {
 border: 1px solid black;
 background: lightgrey;
 text-align: left;
}
td, th{
  padding:3px 5px;
  vertical-align:top;
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
</style>