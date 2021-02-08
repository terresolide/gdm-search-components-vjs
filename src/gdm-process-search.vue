<i18n>
{
  "en": {
    "process_dates": "Job information",
    "identifiers": "Identifiers",
    "image_dates": "Date of images",
    "temporal_extent": "Temporal extent",
    "parameters": "Parameters",
    "no_process": "No process",
    "unauthorized": "Access Unauthorized",
    "forbidden": "Access Forbidden: deconnected?"
  },
  "fr": {
    "process_dates": "Job information",
    "identifiers": "Identifiants",
    "image_dates": "Date des images",
    "temporal_extent": "Etendue temporelle",
    "parameters": "Paramètres",
    "no_process": "Aucun calcul",
    "unauthorized": "Accès non autorisé à cette ressource",
    "forbidden": "Access interdit: deconnecté?"
  }
}
</i18n>
<template>
  <div class="gdm-process-search">
    <gdm-draw-bbox :lang="lang" :color="color"></gdm-draw-bbox>
  <div class="gdm-wrapper">
   <div class="column-left" >
    <gdm-form-process :lang="lang" :status="statusList" :groups="groups" :feature-collection="featureCollection" 
    :color="color" :user="parameters.user" :service="parameters.service" :height="height"
     @remove="removeSelected" @dateChange="dateChange" @statusChange="statusChange" @groupChange="groupChange"
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
      <div  :style="{background:$shadeColor(color, 0.8)}" class="gdm-process-header">
         <div class="gdm-process-header-column-1">{{$t('identifiers')}}</div>
         <div class="gdm-process-header-column-2">Status</div>
         <div class="gdm-process-header-column-3">{{$t('process_dates')}}</div>
         <div class="gdm-process-header-column-4">
           <span v-if="group === 'DEM'">{{$t('image_dates')}}</span>
           <span v-else>{{$t('temporal_extent')}}</span>
         </div>
         <div class="gdm-process-header-column-5" >{{$t('parameters')}}</div>
      </div>
      <div @mouseleave="highlight(null)" :style="{height: listHeight + 'px'}" style="border:1px solid lightgrey; overflow:auto;">
       <gdm-process-row v-if="featureCollection" v-for="feature in featureCollection.features" 
       :process="feature" :selected="selectedProcessId" :back="back" :selected-service="parameters.service" @selectService="selectService"
       :user-id="userId" :selected-user="parameters.user" @selectUser="selectUser"
       :status-list="statusList" :url="url" :group="group" :lang="lang"
       @highlight="highlight" @selectProcess="selectProcess"></gdm-process-row>
      </div>
     </div>
     </div>
   </div>
  </div>
</template>
<script>
import GdmPaging from './gdm-paging.vue'
import GdmFormProcess from './subcomponents/gdm-form-process.vue'
import moment from 'moment'
import GdmDrawBbox from './subcomponents/gdm-draw-bbox.vue'
import GdmProcessStatus from './subcomponents/gdm-process-status.vue'
import GdmProcessRow from './subcomponents/gdm-process-row.vue'
export default {
  name: 'GdmProcessSearch',
  components: {
    GdmPaging,
    GdmFormProcess,
    GdmProcessRow,
    GdmDrawBbox,
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
    group: {
      type: String,
      default: null
    },
    what: {
      type: String,
      default: 'getProcess'
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
      statusList: {},
      groups: [],
      spatialChangeListener: null,
      selectProcessLayerListener: null,
      resizeListener: null,
      selectedProcessId: null,
      parameters: {
        user: null,
        service: null,
        status: null,
        Start: null,
        End: null,
        tempStart: null,
        tempEnd: null,
        q: null,
        bbox: null,
        group: null
      },
      timer: null
    }
  },
  created () {
   // launch url debug
   if (!this.group) {
     this.searchGroups()
   }
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
//    moment.locale(this.lang)
//    if (this.lang === 'en') {
//      this.dateFormatDisplay = 'MM/DD/YYYY'
//    } else {
//      this.dateFormatDisplay = 'DD/MM/YYYY'
//    }
   var search = this.search
   this.timer = setInterval(search, 60000)
   this.search()
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
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
       var headers = {}
       if (this.group) {
         headers.groupKey = this.group
       }
	     var url = this.api + this.what + '?maxRecords=' + this.pagination.maxRecords + '&index=' + this.pagination.startIndex
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
	     if (this.parameters.group) {
	       url +='&group=' + this.parameters.group
	     }
	     url += '&lang=' + this.lang
	     var self = this
	     var dateType = ['Start', 'End', 'tempStart', 'tempEnd']
	     dateType.forEach(function (name) {
	       if (self.parameters[name] && self.parameters[name] != 'Invalid date') {
	         url += '&' + name.charAt(0).toLowerCase() + name.slice(1) + '=' + self.parameters[name]
	       }
	     })
	     this.$http.get(url, {credentials: true, headers: headers})
	      .then(
	          response => this.display(response),
	          response => this.error(response))
    },
    searchGroups () {
      this.$http.get(this.api + 'getGroups', {credentials: true})
      .then(
          response => this.groups = response.body,
          response => console.log('error getGroups'))
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
      if (Object.keys(this.statusList).length <= 1) {
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
    groupChange(e) {
      this.parameters.group = e
      this.search()
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
<style>
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
<style scoped>
.gdm-process-search{
font-size: 0.9rem;
}
.gdm-process-header {
display: grid;
  grid-template-columns: minmax(180px,1fr) 110px minmax(190px,1fr) minmax(100px, 1fr) minmax(300px, 2fr);
  grid-gap: 5px;
   text-align:left;
   font-weight:700;
   border: 1px solid lightgrey;
   min-height:20px;
   max-height:35px;
}
.gdm-process-header-column-1 {
  grid-column: 1;
  grid-row: 1;
  padding-left:5px;
}
.gdm-process-header-column-2 {
  grid-column: 2;
  grid-row: 1;
  text-align:center;
}
.gdm-process-header-column-3 {
  grid-column: 3;
  grid-row: 1;
}
.gdm-process-header-column-4 {
  grid-column: 4;
  grid-row: 1;
}
.gdm-process-header-column-5 {
  grid-column: 5;
  grid-row: 1;
}
/* .gdm-process-search i.gdm-log {
	font-size:20px;
	margin-top:5px;
	color:grey;
}
.gdm-process-search span.date-purge {
  font-size:0.9em;
  color:#333;
  font-style:italic;
  cursor:pointer;
}
.gdm-process-search div.gdm-tooltip {
  position:absolute;
  background-color:#fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  margin-left:50px;
  padding:4px;
  width: 160px;
  display:none;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.4);
  z-index:100;
}
.gdm-process-search div.gdm-tooltip:hover {
  display:block;
}
.gdm-process-search tr:last-child div.gdm-tooltip{
  margin-left:70px;
  margin-top:-80px;
}
.gdm-process-search span.date-purge:hover + div.gdm-tooltip {
  display:block;
}
.gdm-process-search i.gdm-log:hover + div.gdm-tooltip {
  display:block;
} */
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
/* table.gdm-list-process {
  position:relative;
  display:block;
  width:100%;
  height: 600px;
  overflow:auto;
  margin-bottom:5px;
  border: 1px solid #ccc;
  border-collapse: collapse;
  box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
  z-index:0;
} */
.gdm-process-search div.gdm-wrapper {
  max-width:1950px;
  margin:auto;
}

.gdm-process-search div.column-left{
  width:270px;
  margin-left:5px;
  float:left;
}


/* table.gdm-list-process th {
  position: sticky; 
  top: 0;
  padding:3px 8px;
  vertical-align:top;
  background:   #E8E8E8;
  text-align:left;
  border:none;
  border-bottom: 2px solid #CCC;
  z-index:1;
}
.gdm-process-search tr{
   min-height:100px;
   height:100px;
} */
.gdm-process-search div.highlight {
  background: #EFF6F6;
}
/*.gdm-process-search tr.selected {
  background: #F6EFEF;
} */
/**thead {
 border: 1px solid #ccc;
 background: 
 text-align: left;
}**/
/*table.gdm-list-process td{
  padding:3px 8px;
  vertical-align:top;
  border-bottom: 1px solid #ccc;
  border-left: none;
  border-right: none;
   min-width:15%;
   width:15%;
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
} */

</style>