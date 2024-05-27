<i18n>
{
  "en": {
    "process_dates": "Dates",
    "identifiers": "Identifiers",
    "image_dates": "Date of  <span>images&nbsp;<i class='fa {class} {active}'></i></span>",
    "temporal_extent": "Temporal <span>extent&nbsp;<i class='fa {class} {active}'></i></span>",
    "parameters": "Parameters",
    "no_process": "No process",
    "no_team": "No team",
    "unauthorized": "Access Unauthorized",
    "forbidden": "Access Forbidden: deconnected?",
    "creation": "Created",
    "start": "Start",
    "status": "Status"
  },
  "fr": {
    "process_dates": "Dates",
    "identifiers": "Identifiants",
    "image_dates": "Date des  <span>images&nbsp;<i class='fa {class} {active}'></i></span>",
    "temporal_extent": "Etendue  <span>temporelle&nbsp;<i class='fa {class} {active}'></i></span>",
    "parameters": "Paramètres",
    "no_process": "Aucun calcul",
    "no_team": "Aucune équipe",
    "unauthorized": "Accès non autorisé à cette ressource",
    "forbidden": "Access interdit: deconnecté?",
    "creation": "Création",
    "start": "Début",
    "status": "Statut"
  }
}
</i18n>
<template>
  <div class="gdm-process-search">
    <gdm-draw-bbox :lang="lang" :color="color"></gdm-draw-bbox>
  <div class="gdm-wrapper">
   <div class="column-left" >
    <gdm-form-process :lang="lang" :status="statusList" :groups="groups" :feature-collection="featureCollection" 
    :color="color" :user="parameters.user" :service="parameters.service" :height="height" :back="back"
    :parameters="parameters" :teams="teams"
     @remove="removeSelected" @dateChange="dateChange" @statusChange="statusChange" @groupChange="groupChange"
     @teamChange="teamChange" @textChange="textChange" @archivedChange="archivedChange" 
     @catalogChange="catalogChange" @reset="reset"></gdm-form-process> 
   </div>
   <div class="column-right" >
   <div id="fmtLargeMap" style="width:calc(100%);"></div>
    <div v-if="!featureCollection.features || featureCollection.features.length === 0" class="message">
        {{$t('no_process')}}
     </div>
     <div v-else >
       <gdm-paging :start-index="pagination.startIndex" :max-records="pagination.maxRecords"  
       :count="pagination.count" :color="color" :total-results="pagination.totalResults"
       :lang="lang" @change="pageChange"></gdm-paging>
      <div  :style="{background:$shadeColor(color, 0.8)}" class="gdm-process-header">
         <div class="gdm-process-header-column-1">{{$t('identifiers')}}</div>
         <div class="gdm-process-header-column-2">{{$t('status')}}</div>
         <div class="gdm-process-header-column-3">
            {{$t('process_dates')}}<br/> 
            <span class="fa-button"  @click="orderChange('date')">
                {{$t('creation')}} 
                <i class="fa" style="display:inline-block" :class="{'fa-long-arrow-down': order.date === 1, 'fa-long-arrow-up': order.date != 1, unactive: orderBy != 'date'}" ></i>
             </span>
            <span class="fa-button" style="display:inline-block"  @click="orderChange('processStart')">
                {{$t('start')}}
                <i class="fa" :class="{'fa-long-arrow-down': order.processStart === 1, 'fa-long-arrow-up': order.processStart != 1, unactive: orderBy != 'processStart'}" ></i>
            </span>
         </div>
         <div class="gdm-process-header-column-4">
           <span class="fa-button" style="display:inline-block;" @click="orderChange('temporal')">
	           <span v-if="group === 'MNS'" v-html="$t('image_dates',{class: order.temporal === 1 ? 'fa-long-arrow-down':'fa-long-arrow-up', active:  orderBy != 'temporal' ? 'unactive': ''})"></span>
	           <span v-else v-html="$t('temporal_extent',{class: order.temporal === 1 ? 'fa-long-arrow-down':'fa-long-arrow-up', active:  orderBy != 'temporal' ? 'unactive': ''})"></span>
	          
	         </span>
         </div>
         <div class="gdm-process-header-column-5" >{{$t('parameters')}}</div>
      </div>
      <div @mouseleave="highlight(null)" :style="{height: listHeight + 'px'}" style="border:1px solid lightgrey; overflow:auto;">
       <gdm-process-row v-if="featureCollection" v-for="(feature, key) in featureCollection.features" :key="key" 
       :process="feature" :selected="selectedProcessId" :back="back" :selected-service="parameters.service" @selectService="selectService"
       :user-id="idUser" :selected-team="parameters.team" :selected-user="parameters.user" @selectTeam="selectTeam" @selectUser="selectUser"
       :status-list="statusList" :url="url" :group="group" :lang="lang"
       @highlight="highlight" @selectProcess="selectProcess" @removeProcess="removeProcess"></gdm-process-row>
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
const parseParams = (querystring) => {
  // parse query string
  const params = new URLSearchParams(querystring);
  const obj = {};
  // iterate over all keys
  for (const key of params.keys()) {
      if (params.getAll(key).length > 1) {
          obj[key] = params.getAll(key);
      } else {
          obj[key] = params.get(key);
      }
  }
  return obj;
};
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
      default: 'process'
    },
    userId: {
      type: Number,
      default: null
    },
    roles: {
      type: String|Array,
      default: ''
    },
    color: {
      type: String,
      default: '#808080'
    },
    example: {
      type: Boolean,
      value: false
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  computed: {
     teams () {
       var roles = []
       if (typeof this.roles ==='string' || this.roles instanceof String) {
         roles = this.roles.split(',')
       } else {
         roles = this.roles
       }
       var returns = {}
       if (roles.length > 0) {
         returns['0'] = '---'
         returns['no'] = this.$i18n.t('no_team')
         roles.forEach(function (r) {
           returns[r] = r
         })
       }
       return returns
     },
     idUser () {
       if (this.$store) {
         return this.$store.getters['user/id']
       } else {
         return this.userId
       }
     }
  },
  watch: {
    $route (newvalue) {
      this.extractRouteParams()
      var query = newvalue.fullPath.substring(newvalue.fullPath.indexOf('?'))
      this.search(query)
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
      popListener: null,
      selectedProcessId: null,
      order: {
        temporal: 1,
        date: -1,
        processStart: 1
      },
      orderBy: 'date',
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
        group: null,
        team: '0',
        order: 'start DESC'
      },
      defaultValues: {
        status: null
      },
      timer: null
    }
  },
  created () {
    var self = this
//     document.addEventListener('change', function(e) {
//       var currentPageUrl = document.URL
//       console.log(e)
//       if(currentPageUrl && self.queryUrl != currentPageUrl) {
//         self.queryUrl = currentPageUrl
// /         self.extractParams()
//         //
//         console.log(currentPageUrl)
//         console.log(window.location.search)
//          self.search(self.buildQuery())
//       }
//     });
//     window.addEventListener('popstate', (event) => {
//       console.log(event)
//       console.log(history)
    
//     })
  
   // extract params
   
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
   var query = ''
   if (this.$route) {
     this.extractRouteParams()
     // query = this.$route.fullPath.substring(this.$route.fullPath.indexOf('?'))
   } else {
     this.popListener = this.stateChange.bind(this)
     window.addEventListener('popstate', this.popListener)
     this.extractParams(window.location.href)
     query = this.buildQuery()
   }
   this.search(query)
//    moment.locale(this.lang)
//    if (this.lang === 'en') {
//      this.dateFormatDisplay = 'MM/DD/YYYY'
//    } else {
//      this.dateFormatDisplay = 'DD/MM/YYYY'
//    }
//    var search = this.search
//    this.timer = setInterval(search, 300000)
//    this.search()
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.popListener) {
	    window.removeEventListener('popstate', this.popListener)
	    this.popListener = null
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
     stateChange () {
      // if (window.history && window.history.state) {
         this.extractParams(window.location.href)
         var query = this.buildQuery()
         this.search(query)
      //  }
     },
     changeQuery () {
       var query = this.buildQuery()
       if (this.$router) {
         var route = this.$route
         console.log(route)
         this.$router.push({name: route.name, params: route.params, query: parseParams(query)})
       } else {
	       const newURL = new URL(window.location.href)
	       newURL.search  = query
	       if (window.history.pushState && newURL.search !== window.location.search) {
	         window.history.pushState({path: newURL.href, query: query }, '', newURL.href)
	         this.search(query)
	       }
       }
      // this.search(query)
   
     },
     buildQuery () {
       var location = '?maxRecords=' + this.pagination.maxRecords + '&index=' + this.pagination.startIndex
      
       if (this.parameters.user && !this.userId) {
          location += '&userId=' + this.parameters.user.id
       }
       if (this.userId) {
         location += '&userId=' + this.userId
       }
       
       if (this.parameters.service) {
         location += '&serviceId=' + this.parameters.service.id
       }
       if (this.parameters.status) {
         location += '&status=' + this.parameters.status
       }
       if (this.parameters.any) {
         location += '&any=' + this.parameters.any
       }
       if (this.parameters.bbox) {
         location += '&bbox=' + this.parameters.bbox
       }
       if (this.parameters.group && !this.group) {
           location += '&group=' + this.parameters.group
       }
       if (this.parameters.archived) {
         location += '&archived=1'
       }
       if (this.parameters.catalog) {
          location += '&catalog=1'
       }
       if (this.parameters.team && this.parameters.team !== '0') {
         location += '&team=' + this.parameters.team
       }
       if (this.parameters.order) {
         location += '&order=' + encodeURIComponent(this.parameters.order)
       }
       var self = this
       var dateType = ['Start', 'End', 'tempStart', 'tempEnd', 'processStart', 'processEnd']
       dateType.forEach(function (name) {
         if (self.parameters[name] && self.parameters[name] != 'Invalid date') {
           location += '&' + name.charAt(0).toLowerCase() + name.slice(1) + '=' + self.parameters[name]
         }
       })
       return location
     },
     extractRouteParams () {
       var path = 'https://localhost' + this.$route.fullPath.substring(this.$route.fullPath.indexOf('?'))
       this.extractParams(path)
     },
     extractParams (path) {
       var url = new URL(path)
       var maxRecords = url.searchParams.get('maxRecords')
       if (maxRecords) {
         this.$set(this.pagination, 'maxRecords', parseInt(maxRecords))
       }
       var index = url.searchParams.get('index')
       if (index) {
         this.$set(this.pagination, 'startIndex', parseInt(index))
       }
       var userId = url.searchParams.get('userId')
       if (userId && !this.userId) {
         this.parameters.user = { id: parseInt(userId) , email: 'User ' + userId}
       } else {
         this.parameters.user = null
       }
       var serviceId = url.searchParams.get('serviceId')
       if (serviceId) {
         this.parameters.service = {id: parseInt(serviceId), name : 'Service ' + serviceId}
       } else {
         this.parameters.service = null
       }
       var status = url.searchParams.get('status')
       if (status) {
         this.parameters.status = status
       } else {
         this.parameters.status = null
       }
       var team = url.searchParams.get('team')
       if (team) {
         this.$set(this.parameters, 'team',  team)
       } else {
         this.$set(this.parameters, 'team', '0')
       }
       if (!this.groupId) {
         var group = url.searchParams.get('group')
         if (group) {
           this.parameters.group = group
         } else {
           this.parameters.group = null
         }
       }
       var archived = url.searchParams.get('archived')
       if (archived) {
         this.parameters.archived = archived
       }
       var catalog= url.searchParams.get('catalog')
       if (catalog) {
         this.parameters.catalog = catalog
       }
       var order = url.searchParams.get('order')
       if (order) {
         this.parameters.order = decodeURIComponent(order)
         var orders = this.parameters.order.split(', ')
         var ord = orders[0]
         var self = this
         // orders.forEach(function (ord) {
           var part = ord.split(' ')
	         switch (part[0]) {
	           case 'start':
	             self.order.date = part[1] === 'ASC' ? 1 : -1 
	             self.orderBy = 'date'
	             break
	           case 'tempStart':
	             self.order.temporal = part[1] === 'ASC' ? 1 : -1 
	             self.orderBy = 'temporal'
	            break
	           case 'processStart':
	             self.order.processStart = part[1] === 'ASC' ? 1 : -1 
	             self.orderBy = 'processStart'
	             break
	         }
       //  })
       }
       var self = this
       var dateType = ['Start', 'End', 'tempStart', 'tempEnd', 'processStart', 'processEnd']
       dateType.forEach(function (key) {
         var name = key.charAt(0).toLowerCase() + key.slice(1)
         var date = url.searchParams.get(name)
         if (date) {
           self.parameters[key] = date
         } else {
           self.parameters[key] = ''
         }
       })
       var bbox = url.searchParams.get('bbox')
       if (bbox) {
         this.parameters.bbox = bbox
       } else {
         this.parameters.bbox = null
       }
     },
     search (query) {
       var headers = {
           'Accept-Language': this.lang
       }
       if (this.group) {
         headers.groupKey = this.group
       }
      
	     var url = this.api + this.what 
	     if (this.userId && this.back) {
	       query += '&userId=' + this.userId
	     } 
	     if (this.example) {
	       query += '&example=1'
	     }
       if (this.groupId) {
         query += '&group=' + this.groupId
       }
	     
	     url += query
	    
	     this.$http.get(url, {credentials: true, headers: headers})
	      .then(
	          response => this.display(response),
	          response => this.error(response))
    },
    searchGroups () {
      this.$http.get(this.api + 'groups?short=1', {credentials: true})
      .then(
          response => this.groups = response.body,
          response => console.log('error getGroups'))
    },
    orderChange (order) {
      switch (order) {
        case 'date':
          this.order.date = (-1) * this.order.date
          this.orderBy = 'date'
          this.parameters.order = 'start ' + (this.order.date > 0 ? 'ASC' : 'DESC')
//           this.parameters.order += ', tempStart ' + (this.order.temporal > 0 ? 'ASC' : 'DESC')
//            this.parameters.order += ', processStart ' + (this.order.processStart > 0 ? 'ASC' : 'DESC')
          break
        case 'temporal':
          this.order.temporal = (-1) * this.order.temporal
          this.orderBy = 'temporal'
          this.parameters.order = 'tempStart ' + (this.order.temporal > 0 ? 'ASC' : 'DESC')
//           this.parameters.order += ', start ' + (this.order.date > 0 ? 'ASC' : 'DESC')
//           this.parameters.order += ', processStart ' + (this.order.processStart > 0 ? 'ASC' : 'DESC')
          break
        case 'processStart':
          this.order.processStart = (-1) * this.order.processStart
          this.orderBy = 'processStart'
          this.parameters.order = 'processStart ' + (this.order.processStart > 0 ? 'ASC' : 'DESC')
//           this.parameters.order += ', tempStart ' + (this.order.temporal > 0 ? 'ASC' : 'DESC')
//           this.parameters.order += ', start ' + (this.order.date > 0 ? 'ASC' : 'DESC')
          
      }
     // this.changeUrl()
      this.changeQuery()
    },
    archivedChange (value) {
      if (value) {
        this.parameters.archived = value
      } else {
        delete this.parameters.archived
      }
      this.changeQuery()
    },
    catalogChange (value) {
      if (value) {
        this.parameters.catalog = value
      } else {
        delete this.parameters.catalog
      }
      this.changeQuery()
    },
    teamChange (value) {
      if (value) {
        this.parameters.team = value
      } else {
        this.parameters.team = ''
      }
      this.changeQuery()
    },
    dateChange (e) {
      var change = {'from': 'Start', 'to': 'End'}
      var name = e.name.replace('from','Start').replace('to', 'End')
      this.parameters[name] = e.value
      this.changeQuery()
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
      this.changeQuery()
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
    removeProcess (id) {
      var url = this.api + 'process/' + id
      this.$http.delete(url, {credentials: true})
      .then(resp => {this.search('')})
    },
    removeSelected(type) {
      this.parameters[type] = null
      this.changeQuery()
    },
    reset () {
      this.selectProcess(null)
      for (var prop in this.parameters) {
        this.parameters[prop] = null
      }
      this.changeQuery()
    },
    resize () {
      if (this.$el && this.$el.querySelector) {
	      var maph = this.$el.querySelector('#fmtLargeMap').offsetHeight
	      this.height = window.innerHeight - 65
	      this.listHeight = this.height - maph - 32
      }
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
      if (parseInt(featureId) !== selectedProcessId) {
        var nodes = document.querySelectorAll('.row' + featureId)
        nodes.forEach(function (node) {
          node.classList.add('selected')
        })
        this.selectedProcessId = parseInt(featureId)
      } else {
        this.selectedProcessId = null
      }
      var event = new CustomEvent('gdm:processSelect', {detail: {id: featureId}})
      document.dispatchEvent(event)
    },
    selectService (service) {
      if (this.parameters.service && this.parameters.service.id === service.id) {
        this.parameters.service = null
      } else {
        this.parameters.service = service
      }
      this.changeQuery()
    },
    selectTeam (team) {
      if (this.parameters.team && this.parameters.team === team) {
        this.parameters.team = '0'
      } else {
        this.parameters.team = team
      }
      this.changeQuery()
    },
    selectUser (user) {
      if (this.parameters.user && this.parameters.user.id === user.id) {
        this.parameters.user = null
      } else {
        this.parameters.user = user
      }
      this.changeQuery()
    },
    groupChange(e) {
      this.parameters.group = e
      this.changeQuery()
    },
    spatialChange(e) {
      var event = new CustomEvent('aerisSearchEvent', {detail: {}})
      document.dispatchEvent(event)
      if (event.detail.geometry) {
        this.parameters.bbox = event.detail.geometry
      } else {
        this.parameters.bbox = null
      }
      this.changeQuery()
    },
    statusChange(e) {
      this.parameters.status = e
      this.changeQuery()
    },
    textChange (value) {
      if (value) {
         this.parameters.any = encodeURIComponent(value)
      } else {
        this.parameters.any = null
      }
      this.changeQuery()
    }
    
    
  }
}
</script>
<style>
.gdm-process-search {
  font-family: Roboto, sans-serif;
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
  .fa-button span {
   display:inline-block;
}
</style>
<style scoped>
.fa-button {
  cursor: pointer;
  padding: 1px 3px;
}
.fa-button:hover {
  border:1px dotted grey;
}

i.unactive,
span.unactive {
  color: #5f5f5f;
}
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
   max-height: 35px;
padding: 5px 0;
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