<i18n>
{
  "en": {
    "consult": "Consult",
    "process_dates": "Process dates",
    "identifiers": "Identifiers",
    "temporal_extent": "Temporal extent",
    "parameters": "Parameters",
    "no_process": "No process",
    "unauthorized": "Access Unauthorized",
    "forbidden": "Access Forbidden: deconnected?"
  },
  "fr": {
    "consult": "Consulter",
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
   <div class="column-left" >
    <gdm-form-process :lang="lang" :status="statusList" :feature-collection="featureCollection" 
    :color="color" :user="parameters.user" :service="parameters.service" :height="height"
     @remove="removeSelected" @dateChange="dateChange" @statusChange="statusChange" 
     @textChange="textChange" @reset="reset"></gdm-form-process> 
   </div>
   <div class="column-right" >
   <div id="fmtLargeMap" style="width:calc(100%);"></div>
    <div v-if="!featureCollection.features || featureCollection.features.length === 0" class="message">
        {{$t('no_process')}}
     </div>
     <div v-else >
       <gdm-paging :start-index="pagination.startIndex" :max-records="pagination.maxRecords"  
       :count="pagination.count" :total-results="pagination.totalResults"
       :lang="lang" :color="color" @change="pageChange"></gdm-paging>
       <table class="gdm-list-process" style="width:100%;" :style="{height: listHeight + 'px'}">
         <thead >
         <th :style="{background:$shadeColor(color, 0.8)}">{{$t('identifiers')}}</th>
         <th :style="{background:$shadeColor(color, 0.8)}">Status</th>
         <th :style="{background:$shadeColor(color, 0.8)}">{{$t('process_dates')}}</th>
         <th :style="{background:$shadeColor(color, 0.8)}">{{$t('temporal_extent')}}</th>
         <th :style="{background:$shadeColor(color, 0.8)}">{{$t('parameters')}}</th>
         
         </thead>
         <tbody @mouseleave="highlight(null)" >
         <tr v-for="feature in featureCollection.features" :class="'row' + feature.properties.id" 
         @mouseenter="highlight(feature.properties.id)" @click="selectProcess(feature.properties.id)">
         <td>
           <div><b>{{feature.properties.id.padStart(5,'0')}}</b></div>
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
         <td style="text-align:center;cursor:pointer;">
            <gdm-process-status :status="feature.properties.status" :lang="lang"></gdm-process-status>
            <div>
               <a v-if="url" :href="url + feature.properties.id" class="button">{{$t('consult')}}</a>
            </div>
          <!--   <a v-if="back  && feature.properties.status === 'WAITING'"  :href="launchUrl + 'process/launch/' + feature.properties.id" class="button">Test Curl</a>
            <span v-if="!back && feature.properties.status === 'WAITING'"  @click="launch(feature.properties.id, $event)" class="button">{{$t('launch')}}</span>
            
            <a v-if="back" :href="launchUrl + 'process/postdata/' + feature.properties.id" class="button" target="_blanck">Voir postdata</a>
            
            <span class="button" v-if="back && feature.properties.token && ['RUNNING', 'ACCEPTED'].indexOf(feature.properties.status) >= 0" @click="getStatus(feature.properties.id, $event)" >Test getStatus</span>
             <span class="button" v-if="feature.properties.hasDismiss && feature.properties.token && ['RUNNING', 'ACCEPTED'].indexOf(feature.properties.status) >= 0" @click="dismiss(feature.properties.id, $event)" >Dismiss</span>
            
            <span class="button" v-if="back &&  ['FAILED', 'TERMINATED', 'KILLED', 'PURGED'].indexOf(feature.properties.status) >= 0" @click="restart(feature.properties.id, $event)" >Restart</span>
          <span class="button" v-if=" feature.properties.hasPurge && ['TERMINATED'].indexOf(feature.properties.status) >= 0" @click="purge(feature.properties.id, $event)" >Purge</span>
       --> 
         <td style="text-align:left;">
         <b>Start: </b>{{printDate(feature.properties.processStart,true)}}<br/>
         <b>End: </b>{{printDate(feature.properties.processEnd, true)}}<br />
          <span v-if="feature.properties.datePurge" style="font-size:0.9em;color:#333;font-style:italic;"> 
            (<b>Purge: </b>{{printDate(feature.properties.datePurge)}})
         </span>
         </td>
         
         <td style="text-align:center;">
         {{printDate(feature.properties.temporalExtent[0])}}
         <b>&rarr;</b>
         {{printDate(feature.properties.temporalExtent[1])}}
         </td>
         <td style="min-width:40%;">
           <div style="width:100%;max-height:100px;">
	         <div class="infos">
		         <div v-for="type in ['provider', 'position']" >
			          <div v-if="feature.properties[type]" >
	                <div v-for="(value, prop) in feature.properties[type]" >
	                  <div><b>{{prop}}:</b> {{value}}</div>
	                </div>
			         </div>
		         </div>
	         </div>
	          <div class="infos" >
             <div v-if="feature.properties.parameters && Object.keys(feature.properties.parameters).length < 10"  >
                <div v-for="(value, prop) in feature.properties.parameters" >
                  <div><b>{{prop}}:</b> {{value}}</div>
                </div>
             </div>
             <div v-else>
                <div v-for="prop in ['correl_split_date', 'correl_input_mode', 'correl_correlator', 'do_analysis', 'do_correction_filtering']" >
                  <div><b>{{$hypens2camel(prop)}}:</b> {{feature.properties.parameters[prop]}}</div>
                </div>
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
import GdmProcessStatus from './subcomponents/gdm-process-status.vue'

export default {
  name: 'GdmProcessSearch',
  components: {
    GdmPaging,
    GdmFormProcess,
    FormaterDrawBbox,
    GdmProcessStatus
  },
  props: {
    api: {
      type: String,
      default: null
    },
    url: {
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
      listHeight: 700,
      height: 700,
      statusList: [],
      spatialChangeListener: null,
      selectProcessLayerListener: null,
      resizeListener: null,
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
   this.resizeListener = this.resize.bind(this)
   window.addEventListener('resize', this.resizeListener)
   this.mapListener = this.resize.bind(this)
   document.addEventListener('mapNodeChange', this.mapListener)
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
    document.removeEventListener('gdm:selectProcessLayer', this.selectProcessLayerListener) 
    this.selectProcessLayerListener = null
    window.removeEventListener('resize', this.resizeListener)
    this.resizeListener = null
  },
  mounted () {
    this.resize()
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
//     dismiss (id, event) {
//       event.stopPropagation()
//       var url = this.launchUrl + 'api/dismiss/' + id
//       this.$http.get(url, {credentials: true})
//       .then( this.search())
//     },
    display (response) {
      var pagination = response.body.properties
      this.pagination = {
        startIndex: pagination.startIndex,
        totalResults: pagination.totalResults,
        maxRecords: pagination.itemsPerPage,
        count: response.body.features.length
      }
      if (this.statusList.length <= 1) {
        this.statusList = response.body.properties.status
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
//     getStatus (id, event) {
//       event.stopPropagation()
//       var url = this.launchUrl + 'api/getStatus/' + id
//       this.$http.get(url, {credentials: true})
//       .then( this.search())
//     },
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
//     launch (id, event) {
//       event.stopPropagation()
//       var url = this.launchUrl + 'api/launchz/' + id
//       this.$http.get(url, {credentials: true})
//       .then( this.search())
//     },
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
//     purge (id, event) {
//       event.stopPropagation()
//       var url = this.launchUrl + 'api/purge/' + id
//       this.$http.get(url, {credentials: true})
//       .then( this.search())
//     },
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
    resize () {
      var maph = this.$el.querySelector('#fmtLargeMap').offsetHeight
      this.height = window.innerHeight - 65
      this.listHeight = this.height - maph - 32
    },
    restart (id, event) {
      event.stopPropagation()
      var url = this.launchUrl + 'api/restart/' + id

      this.$http.get(url, {credentials: true})
      .then(response => {this.search()})
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

table.gdm-list-process {
  display:block;
  height: 600px;
  overflow:auto;
  margin-bottom:5px;
}
.gdm-process-search div.wrapper {

  margin:auto;
}

.gdm-process-search div.column-left{
  width:270px;
  margin-left:5px;
  float:left;
}
.gdm-process-search div.column-right{
 width: calc(100% - 295px);
display: block;
margin-left: 285px;
}
div.message {
  font-size: 0.9rem;
  margin: auto;
  padding: 40px 0;
  text-align: center;
  font-style: italic;
}
table{
 width:100%;
  display:block;
 border: 1px solid #ccc;
 border-collapse: collapse;
 box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);

}
table.gdm-list-process th {
  position: sticky; 
  top: 0;
  padding:3px 8px;
  vertical-align:top;
  background:   #E8E8E8;
  text-align:left;
  border-bottom: 2px solid #CCC;
  z-index:200;
}
.gdm-process-search tr{
   min-height:100px;
   height:100px;
}
.gdm-process-search tr.highlight {
  background: #EFF6F6;
}
.gdm-process-search tr.selected {
  background: #F6EFEF;
}
/**thead {
 border: 1px solid #ccc;
 background: 
 text-align: left;
}**/
table.gdm-list-process td{
  padding:3px 8px;
  vertical-align:top;
  border-bottom: 1px solid #ccc;
  border-left: none;
  border-right: none;
   min-width:15%;
}


table.gdm-list-process td:last-child, 
table.gdm-list-process th:last-child{
      width: 100%;
    }

div.toSelect {
 cursor: pointer;
 padding: 2px;
  margin: 3px 0px;
  background: #F0f0f0;
  border: 1px solid #909090;
  border-radius:2px;
  max-width: 250px;
  white-space:normal;
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
.button{
    font-family: Arial;
    font-size: 1em;
    display: inline-block;
    margin: 0px 7px 3px 0;
    padding: 3px 12px;
    height: auto;
    line-height: 1.43;
    white-space: normal;
    text-align: center;
    background: #ececea;
    border-width: 1px;
    border-style: solid;
    border-radius: 3px;
    border-color: #ffffff #d4d4cf #d4d4cf;
    color: #000;
    text-decoration: none;
  /*  text-shadow: 0 -1px 1px #bcbcb4, 1px 0 1px #d4d4cf, 0 1px 1px #d4d4cf, -1px 0 1px #bcbcb4;*/
    vertical-align: top;
    cursor: pointer;
    pointer-events: auto;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);}
    
.button:hover
{
   background: #f0f0e6;
   text-decoration: none;
 }
.button:disabled{
    color: #999;
    pointer-events: none;
  }
</style>