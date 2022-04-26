<i18n>{
   "en":{
    "common": "Common products",
     "status_informations": "Job status",
     "clear_data": "All results will be deleted on this date",
     "owner": "Owner",
     "cost": "Cost",
     "created": "Created",
     "edit": "Edit",
     "last_update": "Updated",
     "map_layers": "Map layers",
     "no_accessible_process_user": "You don't have permission to view this job.<br/>Please login.",
     "no_accessible_process": "You don't have permission to view this job.",
     "owner_credit": "Actual credit",
     "process_time": "Process time",
     "parameters": "Parameters",
     "seconds": "seconds",
     "lists": "Interferogram list",
     "time_serie": "Time series",
     "tio_instructions":"Click on the map image to view the time series at that point.",
     "units": "Units"
   },
   "fr":{
     "common": "Produits communs",
     "status_informations": "Etat du calcul",
      "clear_data": "Tous les résultats seront effacés à cette date",
     "owner": "Propriétaire",
     "cost": "Coût",
     "created": "Création",
     "edit": "Modifier",
     "last_update": "Maj",
     "map_layers": "Couches cartographiques",
     "no_accessible_process_user": "Vous n'avez pas la permission de visualiser ce job.<br/>Connectez-vous s'il vous plait.",
     "no_accessible_process": "Vous n'avez pas la permission de visualiser ce job.",
     "owner_credit": "Crédit actuel",
     "parameters": "Paramètres",
     "process_time": "Calcul",
     "seconds": "secondes",
     "lists": "Liste d'interférogrammes",
     "time_serie": "Séries temporelles",
     "tio_instructions": "Cliquez sur l'image de la carte pour visualiser les séries temporelles en ce point.",
     "units": "Unités"
   }
}
</i18n>
<template>
 <span class="gdm-process-view" >
 <div v-if="process">
	 <div id="fmtLargeMap">
	   <gdm-serie-navigation v-if="series" :series="series" :serie-index="serieIndex" :serie-name="serieName" :color="color" :lang="lang"
	     :fullscreen="true" :loading="loadingLayer"  @dateChange="dateSerieChange"></gdm-serie-navigation>
	 </div>
	 <div class="tio-instructions" v-show="showTioInstructions" @click="showTioInstructions=false">{{$t('tio_instructions')}}</div>
	 <div >
	   <div style="position:relative;">
		 <gdm-service-status  :name="process.serviceName" :status="process.serviceStatus" :top="5" :right="10" :lang="lang" ></gdm-service-status>
		 </div>
		 <div class="gdm-process-header" :style="{background: $shadeColor(color,0.95)}">
		   <div class="header-0">
		    <h1 :style="{color:color}">{{(process.id + '').padStart(5, '0')}}<span v-if="process.token">-{{process.token}}</span><span v-if="process.name">  {{process.name }}</span></h1>
		   </div>
		   <div class="header-1">
		     <div class="gdm-map-container">
		      <gdm-map ref="map" :bbox="process.feature" :images="imageLayers" :tile="feature.properties.bboxTile"
		      :service-name="process.serviceName" :series="series" :serie-index="serieIndex" :lang="lang" @dateChange="dateSerieChange" @tioReady="tioImagesReady"
		      fullscreen="fmtLargeMap" :remove-height="8" @loadingLayer="loadingChange" @imageAdded="imageAdded" @imageRemoved="imageRemoved"></gdm-map>
		     </div>
		      <div style="text-align:center;margin-top:10px;">
		         {{date2str(process.tempStart, true)}}
		         <span v-if="type !== 'PLEIADES'" class="fa fa-long-arrow-right"></span>
		         <span v-if="type !== 'PLEIADES'">{{date2str(process.tempEnd, true)}}</span> 
		     </div>
		   </div>
		   <div class="header-2-1" style="padding: 0 10px;">
		      <h2 :style="{color:color, margin: 0}">{{$t('status_informations')}}</h2>
		      <div>
		        <div>
	             <b>{{$t('created')}}: </b>
	             <span style="white-space:nowrap;">
	               {{date2str(process.start)}}
	             </span>
	           </div>
	           <div v-if="process.processStart">
	           <b>{{$t('process_time')}}:</b>
			        <span style="white-space:nowrap;">
			          {{date2str(process.processStart)}}
			        </span>
		          <span class="fa fa-long-arrow-right"></span>
		          <span v-if="process.processEnd" style="white-space:nowrap;">
	             {{date2str(process.processEnd)}}
	             </span>
	             <span v-else style="color:grey;white-space:nowrap;">
	             {{date2str(process.end)}}
	             </span>
	          </div>
	          <div v-else>
	             <b>{{$t('last_update')}}: </b>
	             <span style="white-space:nowrap;">
	               {{date2str(process.end)}}
	             </span>
	          </div>
	          <div v-if="process.status === 'TERMINATED' && process.datePurge"
	          style="font-size:0.9em;color:darkred;cursor:pointer;" :title="$t('clear_data')">
	           <i class="fa fa-exclamation-triangle"> 
	           </i>
	           <b>Purge: </b>
	             <span style="white-space:nowrap;">
	               {{date2str(process.datePurge)}}
	             </span>
	          </div>
		      </div>
		   </div>
		   <div class="header-2-2" style="position:relative;z-index:0;">
		     <gdm-process-progress :status="process.status" :progress="process.progress" 
		     :step-id="process.stepId" :log="log" :back="back" :steps="process.serviceSteps" ></gdm-process-progress>
		  </div>
		  <div class="header-2-3">
		      <div><b>{{$t('owner')}}:</b> {{process.email}}</div>
		      <div v-if="process.cost > 0" >
		        <b>{{$t('cost')}}:</b>
		        <span v-if="['WAITING', 'EVALUATED'].indexOf(process.status) >= 0">
			        <span :style="{color: process.cost > process.quota ? 'red' : 'black' }">
			           <span v-if="process.serviceName.indexOf('SAR') >= 0"> <b>{{process.cost.toLocaleString()}}&nbsp;{{$t('units')}}</b> </span>
			           <span v-else> <b>{{process.cost.toLocaleString()}}&nbsp;CPU&nbsp;{{$t('seconds')}}</b></span>
				         <span >/ {{process.quota.toLocaleString()}}</span>
			        </span>
			         <div v-if="back && process.cost > process.quota">
	                 <a class="button"  :href="url + 'users/view/' + process.userId">{{$t('edit')}}</a>
	             </div>
		         </span>
		         <span v-else>
		            <span v-if="process.serviceName.indexOf('SAR') >= 0"><b>{{process.cost.toLocaleString()}}</b>&nbsp;{{$t('units')}}</span>
		            <span v-else><b>{{process.cost.toLocaleString()}}</b>&nbsp;CPU&nbsp;{{$t('seconds')}}</span>
		         </span>
		         
		      </div>
		      <div v-if="process.cost <= 0 || ['WAITING', 'EVALUATED'].indexOf(process.status) < 0">
		      <b>{{$t('owner_credit')}}:</b> 
			      <span v-if="process.serviceName.indexOf('SAR') >= 0">{{process.quota.toLocaleString()}}&nbsp;{{$t('units')}}</span>
			      <span v-else>{{process.quota.toLocaleString()}}&nbsp;CPU&nbsp;{{$t('seconds')}}</span>
		      </div>
		   </div>
		   <div class="header-3">
		  <div style="max-width:130px;display:inline-block;">
	        <gdm-process-status v-if="statusList" :status="process.status" :progress="process.progress" :status-list="statusList" :lang="lang"></gdm-process-status>
	     </div>
		  <!--  </div>
		   <div class="header-4">--> 
		   <div class="process-actions">
		     <gdm-process-actions v-if="process" :api="api" :url="url" :id="id" :back="back" 
		     :process="process" :user-id="userId" :can-edit="hasAccessService && !pleiadeRemoved" :lang="lang" :ciest2="ciest2" @processChange="statusChange" 
		     @statusChange="statusChange" @ownerChange="userChange" @duplicate="duplicate">
		     </gdm-process-actions>
		   </div>
		    
		    <div v-if="process && process.result && process.status === 'TERMINATED'" :class="{highlight:seeResult}" style="margin-top:15px;"
		    :style="{background: seeResult ? $shadeColor(color,0.92): 'none'}">
	       <gdm-process-result  :result="process.result" :series="series" :service-name="process.serviceName"
	        :lang="lang" :color="color" :images="imageLayers" :serie-index="serieIndex" 
	        @toggleImage="toggleImage"  @dateSerieChange="dateSerieChange" >
	       </gdm-process-result>
	       </div>
			 </div>
			 </div>
			 <div class="gdm-list-parameters" v-if="describe"> 
			  <h2 :style="{color:color}">{{$t('parameters')}}</h2>
	       <div>
			 <gdm-parameters  mode="view" :describe="describe" :default-parameters="defaultParameters" :width="360" :color="color" :lang="lang"></gdm-parameters>
	        <div style="height:120px;"></div>
	      </div>
	      </div>
			 <div class="gdm-list-parameters" v-else >
				 <h2 :style="{color:color}">{{$t('parameters')}}</h2>
				 <div>
				  <div v-for="(value, prop) in parameters" style="font-size:0.9rem;max-width:400px;">
				    <b >{{prop}}:</b> <div style="vertical-align:top;max-width:350px;display:inline-block;overflow-wrap:anywhere">{{value}}</div>
				  </div>
				  <div v-for="(value, prop) in position" v-if="prop !== 'bbox'" style="font-size:0.9rem;max-width:400px;">
	          <b >{{prop}}:</b> <div style="vertical-align:top;max-width:350px;display:inline-block;overflow-wrap:anywhere">{{value}}</div>
	        </div>
				  </div>
			  </div>  
			 <div class="gdm-list-images" >
			  <h2 :style="{color:color}">{{images.length}} images</h2>
			  <div v-if="images.length > 0">
				  <div  v-for="image in images" class="gdm-images-child" >
		        <gdm-image :image="image" :type="type" :searching="false" :checked="false" :stereo-list="stereo" mode="view" :lang="lang"></gdm-image>
		      </div>
			  </div>
			  <div v-else style="text-align:center;padding: 30px;">NO IMAGES SELECTED - TYPE REQUEST</div>
			  </div>
			  
		</div>
	</div>
	<div v-else-if="errorCode" >
	    <login-to-access v-if="!userId && !back"" :message="$t('no_accessible_process_user')"></login-to-access>
	    <login-to-access v-else :message="$t('no_accessible_process')"></login-to-access>
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
import GdmProcessResult from './subcomponents/gdm-process-result.vue'
import GdmImage from './subcomponents/gdm-image.vue'
import GdmParameters from './subcomponents/gdm-parameters.vue'
import GdmSerieNavigation from './subcomponents/gdm-serie-navigation.vue'
const LoginToAccess = () => import('./subcomponents/login-to-access.vue')

import hs from './modules/howstereo.js'
export default {
  name: 'GdmProcessView',
  components: {
    GdmMap,
    GdmProcessActions,
    GdmServiceStatus,
    GdmProcessStatus,
    GdmProcessProgress,
    GdmProcessResult,
    GdmImage,
    GdmParameters,
    GdmSerieNavigation,
    LoginToAccess
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
    ciest2: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    },
    access: {
      type: Object,
      default: () => {}
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    userId (newvalue) {
      this.getToken()
      this.load()
    }
  },
  computed: {
    seeResult () {
      return this.process.status === 'TERMINATED' && this.process.result
    },
    log () {
      if (!this.process.log) {
        return null
      }
      if ((this.back || this.process.serviceName.indexOf('SAR') >= 0) && 
          (this.process.status === 'RUNNING' || status === 'FAILED')) {
        return this.process.log
      }
      return null
    },
    hasAccessService () {
      if (this.back) {
        return true
      }
      if (!this.access) {
        return false
      }
      var sId = this.process.serviceId
//       var access = this.access.find(gp => gp[sId])
//       console.log(access)
      var access = false
      for (var key in this.access) {
        if (this.access[key].hasOwnProperty(sId)) {
          return this.access[key][sId]
        }
      }
      return false
    }
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    this.getToken()
    this.load()
  },
  mounted () {
    if (this.$el && this.$el.querySelector && this.$el.querySelector('.gdm-process-header')) {
      this.headerHeight = this.$el.querySelector('.gdm-process-header').clientHeight
    }
  },
  destroyed () {
//      if (this.timer) {
//        clearInterval(this.timer)
//        this.timer = null
//      }
  },
  data() {
    return {
      parameters: {},
      position: {},
      feature: null,
      process: null,
      errorCode: null,
      // INPUT IMAGES
      images: [],
      pleiadeRemoved: false,
      statusList: null,
      headerHeight: null,
      // RESULT
      imageLayers: null,
      series: null,
      serieIndex: 0,
      serieName: null,
      token: null,
      type: 'PEPS',
      describe: null,
      stereo: null,
      fullscreen: false,
      defaultParameters: null,
      loadingLayer: false,
      showTioInstructions: false
    }
  },
  methods: {
    dateSerieChange (index) {
      if (!this.loadingLayer) {
        this.serieIndex = index
      }
    },
    loadingChange (value) {
      this.loadingLayer = value
    },
    getToken () {
      this.$http.get(this.api + '/getToken', {credentials: true})
      .then(
         (resp) => { this.token = resp.body.token },
         (resp) => { console.log('ERROR GET TOKEN') }
      )
    },
    toggleImage (e) {
      var image = this.imageLayers[e.index]
      if (e.hasOwnProperty('indexImage')) {
        if (image.checked && image.indexImage === e.indexImage) {
          image.checked = false
        } else {
          image.checked = true
          image.indexImage = e.indexImage
          // this.$refs.map.toggleImageLayer(e, image.checked)
        }
      } else {
	      image.checked = !image.checked
	      this.serieName = image.title
// 	      this.$set(this.imageLayers, e, image)
// 	      this.$refs.map.toggleImageLayer(e, image.checked)
      }
      this.$set(this.imageLayers, e.index, image)
      this.$refs.map.toggleImageLayer(e, image.checked)
    },
    // @toRemove
//     toggleSerie (name) {
//       var serie = this.series[name]
//       serie.checked = !serie.checked
//       this.$set(this.series, name, serie)
//       this.$refs.map.toggleSerieLayer(name, serie.checked)
//     },
    tioImagesReady (e) {
       var image = this.imageLayers[e.index]
       image.images = e.layer.images
       this.$set(this.imageLayers, e.index , image)
    },
    imageAdded (e) {
      var index = e.index
      var image = this.imageLayers[index]
      image.checked = true
      if (image.type === 'serie' || image.type === 'list') {
        this.serieName = image.title
      } else {
        this.serieName = null
      }
      if (image.type === 'tio') {
        image.indexImage = e.indexImage
        if (!image.displayed) {
	        this.showTioInstructions = true
	        image.displayed = true
	        var _this = this
	        setTimeout(function () {
	          _this.showTioInstructions = false
	        }, 10000)
        }
      }
      this.$set(this.imageLayers, index, image)
//       var _this = this
//       this.imageLayers.forEach(function (image, i) {
//         image.checked = (i === index)
//         _this.$set(_this.imageLayers, i, image)
//       })
    },
    imageRemoved (index) {
      var image = this.imageLayers[index]
      image.checked = false
      this.$set(this.imageLayers, index, image)
    },
    date2str(date, small){
      var format = small ? 'll': 'lll'
      if (date === 'now') {
        return moment().format(format)
      } else {
        return moment(date).format(format)
      }
    },
    addResult (result) {
      if (result && result.thumbnails) {
        result.thumbnails.sort(function (a, b) {
          return a.title > b.title ? 1 : -1
        })
        var imageLayers = result.thumbnails
        imageLayers.forEach(function (image) {
          image.checked = false,
          image.type = 'image'
          if (result.bounds) {
            image.bounds = result.bounds
          }
        })
        this.imageLayers = imageLayers
      } else if (result && !this.imageLayers){
        // treatment result SAR
        var subswath = null
        var imageLayers = []
        var series = null
        var lists = null
        var bbox = result.bbox
        // @todo footrpint à effacer, uniquement pour les tests
        var footprint = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: result.footprint
            }
        }
        for(var key in result) {
         if (key.indexOf('iw') >= 0) {
           subswath = key
           for (var prop in result[key]) {
             
		         if (prop === 'Common_Product') {
		           // search for each geo product the png image
		           var text = this.$i18n.t('common')
		           for (var name in result[key][prop]) {
		             if (name.indexOf('geo') >= 0) {
			             var image = {}
		               image.title = name
		               if(result[key][prop][name].bbox) {
		                 image.bbox = result[key][prop][name].bbox
		               } else {
		                  image.bbox = bbox
		               }
		               image.type = 'image'
		               image.legend = result.dir + key + '/legend_' + name + '_runw.png' 
		               if (text) {
		                 image.first = text
		                 text = null
		               }
		               image.footprint = footprint
		               image.checked = false
		               for(var file in result[key][prop][name]) {
				             if (typeof result[key][prop][name][file] === 'string' &&
				                 result[key][prop][name][file].substr(-3) === 'png') {
				               image.png = result.dir + key + '/' + result[key][prop][name][file]
				             }
				             if (typeof result[key][prop][name][file] === 'string' &&
				                 result[key][prop][name][file].substr(-4) === 'tiff') {
		                   image.tif = result.dir + key + '/' + result[key][prop][name][file]
		                 }
		               }
			             imageLayers.push(image)
		             }
		           }
		         }  else if (prop === 'Time_Serie') {
		           var text = this.$i18n.t('time_serie')
               // array series
               
               for (var name in result[key]['Time_Serie']) {
                 if (name.indexOf('geo') >= 0 && result[key]['Time_Serie'][name].serie)
                 {
                   if (!series) {
                     series = {}
                   }
                   series[name] = {
                       images: []
                   }
                   for(var date in result[key]['Time_Serie'][name].serie) 
                   {
                     series[name].images.push(
                       {
                         date: date,
                         png: result.dir + key + '/' + result[key]['Time_Serie'][name].serie[date]
                       }
                     )
                   }
                   // create image layer
                   image = {
				             checked: false,
				             title: name,
				             bbox: bbox,
				             type: 'serie',
				             png: series[name].images[this.serieIndex].png,
				             legend: result.dir + key + '/legend_' + name + '_runw.png' 
				           }
				           if (text) {
				             image.first = text
				             text = null
				           }
                   imageLayers.push(image)
                 }
               }
		           if (!this.series) {
		             this.series = series
		           } else if (series){
		             this.series = Object.assign(this.series, series)
		           }
		         } else if (prop.match(/[0-9]{8}\-[0-9]{8}/g)){
               // serie extract date and geo product identifier
               var date = prop
               // array of dates
               for (var name in result[key][prop]) {
                 if (!lists) {
                   lists = {}
                 }
                 if (name.indexOf('geo') >= 0) {
                   if (!lists[name]) {
                     lists[name] = {
                         images: []
                     }
                   }
                   var imageInside = {}
                   imageInside.date = date
                  // image.footprint = footprint
                   for(var file in result[key][prop][name]) {
                     if (typeof result[key][prop][name][file] === 'string' &&
                         result[key][prop][name][file].substr(-3) === 'png') {
                       imageInside.png = result.dir + key + '/' + result[key][prop][name][file]
                     }
//                      if (result[key][prop][name][file].substr(-4) === 'tiff') {
//                        imageInside.tif = result.dir + key + '/' + result[key][prop][name][file]
//                      }
                   }
                   lists[name].images.push(imageInside)
                 }
               }
             }
           }
         }
         
        }
        var text = this.$i18n.t('lists')
        for (var name in lists) {
          image = {
            checked: false,
            title: name,
            bbox: bbox,
            type: 'list',
            png: lists[name].images[this.serieIndex].png,
            legend: result.dir + subswath + '/legend_' + name + '_runw.png' 
          }
          if (text) {
            image.first = text
            text = null
          }
          imageLayers.push(image)
         }
      }
      if (lists) {
        if (this.series) {
          this.series = Object.assign(this.series, lists)
        } else {
          this.series = lists
        }
      }
      if (result && result.inversion) {
        if (imageLayers.length > 0 && !imageLayers[0].first) {
          imageLayers[0].first = this.$i18n.t('map_layers')
        }
        imageLayers.push({
          checked: false,
          title: 'TIO Interactive layer',
          first: this.$i18n.t('time_serie'),
          bbox: bbox,
          type: 'tio',
          root: result.inversion
        })
      }
      this.imageLayers = imageLayers
      
    },
    display (response) {
      this.describe = response.serviceParametersUrl
      this.defaultParameters = response.feature.properties.parameters
      var parameters = response.feature.properties.parameters
      this.position = response.feature.properties.position
      var keys = Object.keys(parameters)
      keys.sort()
      for(var prop in keys) {
        this.$set(this.parameters, keys[prop],parameters[keys[prop]])
      }
      if (response.images && response.images[0] &&
          response.images[0].collection === 'PLEIADES') {
        this.type = 'PLEIADES' 
      }
      // sort image
      if (response.images && response.images[0] && response.images[0].feature )
      response.images.sort(function (a,b) {
        if (a.feature && b.feature) {
          return a.feature.properties.startDate > b.feature.properties.startDate ? 1 : -1
        } else {
          return 0
        }
      })
      this.getImage(response.images, 0)
      this.feature = response.feature
      this.feature.properties.id = this.id
      this.process = response
      
      this.addResult(this.process.result)
      if (this.$el && this.$el.querySelector && this.$el.querySelector('.gdm-process-header')) {
        this.headerHeight = this.$el.querySelector('.gdm-process-header').clientHeight
      }
    },
    duplicate (process) {
      if (process.error) {
        alert(process.error)
        return
      }
      var url = this.url
      if (this.group) {
        url = this.url + this.group + '/'
      }
     
      if (this.back) {
        window.location.href = url + 'process/' + process.id 
      } else {
        window.location.href = url + 'process/' + process.id + '/edit'
      }
    },
    getImage(list, index) {
      if (list[index] && list[index].feature) {
        list[index].feature.properties.id = list[index].id
        if (this.type === 'PLEIADES') {
          // specific case pleiades
          if (list[index].removed || !list[index].owner) {
            this.pleiadeRemoved = true
            list[index].feature.properties.removed = true
          } else {
            list[index].feature.properties.removed = false
          }
          var urlImg = this.api.replace('/api', '/upload/pleiades/') + list[index].feature.properties.icon
          list[index].feature.properties.quicklook = urlImg
        }
        var find = this.images.find(img => img.id === list[index].id)
        if (!find) {
          this.images.push(list[index].feature.properties)
        }
        this.getImage(list, index + 1)
      } else if (list[index] && list[index].url) {
        this.$http.get(list[index].url).then(function (response) {
          if (response.body && response.body.features && response.body.features[0]) {
            var identifier = response.body.features[0].properties.productIdentifier
            var find = this.images.find(img => img.productIdentifier === identifier )
            if (!find) {
              this.images.push(response.body.features[0].properties)
            }
          }
          this.getImage(list, index + 1)
          
        })
      }
      // last pleiade image compute stereo
      if (index === list.length - 1 && this.type === 'PLEIADES') {
        // extract angles by image id
        this.stereo = hs.computeStereo(this.images)
//         var angles = {}
//         list.forEach(function (img) {
//           img.feature.properties.angles.sort(function (a, b) {
//             return a.date < b.date ? -1 : 1
//           })
//           // angles.push(img.feature.properties.angles[1])
//         })
      }
    },
    error (response) {
      // alert('error server code = ' + response.status)
      this.errorCode = response.status
    },
    load () {
      var url = this.api + '/getProcess/' + this.id
      this.$http.get(url, {credentials: true})
      .then(
          response => this.display(response.body),
          response => this.error(response))
      var url = this.api + '/getAllStatus/' + this.lang
      this.$http.get(url, {credentials: true})
      .then(
          response => this.setStatusList(response.body),
          response => this.error(response))
    },
    setDescribe (srv) {
    },
    setStatusList (status) {
      if (!status.error) {
        this.statusList = status
      }
      if (this.$el && this.$el.querySelector && this.$el.querySelector('.gdm-process-header')) {
        this.headerHeight = this.$el.querySelector('.gdm-process-header').clientHeight
      }
    },
    userChange (process) {
      this.process = Object.assign(this.process, process)
      this.feature = Object.assign(this.feature, process.feature)
      
    },
    statusChange (detail) {
      if (detail.hasOwnProperty('err') || detail.hasOwnProperty('error')) {
        if (detail.err || detail.error) {
          alert( 'REQUEST FAILED - '  + (detail.err || detail.error))
        } else {
          alert('REQUEST FAILED - UNKNOWN ERROR')
        }
      } else {
        this.$set(this.process, 'status', detail.status)
         this.$set(this.process, 'cost', detail.cost)
        if (detail.hasOwnProperty('quota')) {
          this.$set(this.process, 'quota', detail.quota)
        }
        // if (this.back) {
        //  this.log = detail.log
        this.$set(this.process, 'log', detail.log)
        // }
        this.$set(this.process, 'progress', detail.progress)
        this.$set(this.process, 'stepId', detail.stepId)
        this.$set(this.process, 'end', detail.end)
        this.$set(this.process, 'processEnd', detail.processEnd)
        this.$set(this.process, 'processStart', detail.processStart)
        if (!this.process.result && detail.result) {
	        this.$set(this.process, 'result', detail.result)
		      this.addResult(detail.result)  
	      }
      }
    }
  }
}
</script>
<style>
.gdm-process-view .gdm-warning {
   margin-top: 60px;
}
.gdm-process-view .gdm-warning > div {
  border: 1px solid darkred;
  color: darkred;
  width: 450px;
  margin:auto;
  padding: 20px;
  border-radius: 5px;
  -webkit-box-shadow: 0 0px 3px rgba(0,0,0,0.5);
  box-shadow: 0 0px 3px rgba(0,0,0,0.5);
}
.gdm-process-view div[id="fmtLargeMap"] {
  width:calc(100% - 6px);
  top:0;
  left:0;
  margin-bottom:0px;
  position:fixed;
  z-index:3000;
}
.gdm-process-view .graph-container {
  z-index:3001;
}
 .gdm-process-view div[id="fmtLargeMap"] .gdm-serie-navigation {
   position: absolute;
   bottom: 5px;
   left: 50%;
   transform: translate(-50%, 0);
   z-index: 10000;
   } *
div[id="view"] .gdm-process-view div.gdm-process-header {
  max-height:none;
}
.gdm-process-view .gdm-process-header a.button{
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
  /* text-shadow: 0 -1px 1px #bcbcb4, 1px 0 1px #d4d4cf, 0 1px 1px #d4d4cf, -1px 0 1px #bcbcb4;*/
   vertical-align: top;
   cursor: pointer;
   pointer-events: auto;
   box-sizing: border-box;
   box-shadow: 0 1px 5px rgba(0, 0, 0, 0.65);
   opacity: 0.8;

  }
.gdm-process-view .gdm-process-header a.button:hover{
   background: #f0f0e6;
   text-decoration: none;
   opacity: 1
 }

 .gdm-process-view .gdm-process-header a.button:disabled,
 .gdm-process-view .gdm-process-header a.button.disabled {
    color: #999;
    pointer-events: none;
  }
  .gdm-process-view #fmtMap {
border: 4px solid lightgrey;
}
.gdm-process-view{
  width:calc(100% - 30px);
  margin:0 auto;
}
.gdm-process-view h2 {
  padding: 10px 0;
  font-weight:700;
}
.gdm-process-header h1,
.gdm-process-header h2 {
  margin:0;
  padding: 5px 0;
  font-weight:700;
}
.gdm-process-header h1{
  margin-top:-5px;
}
.gdm-map-container {
   width:300px;
   margin:auto;
}
.gdm-process-header {
  /* position: relative;*/
  margin-top: 0px;
  display:grid;
  grid-template-columns: 310px 2fr 1.7fr;
  grid-template-rows: 50px 1fr 50px 1fr;
  background:#f3F3F3;
  padding: 10px 5px;
  border: 1px solid lightgray;
  box-shadow: 1px 1px 3px gray;
     z-index: 0;
}
span.gdm-information {
  cursor:pointer;
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
}
.header-2-3 {
  grid-column: 2;
  grid-row: 4;
  padding: 10px;
  align-self: center;
}
.header-3 {
  grid-column: 3;
  grid-row: 2/5;
}
.process-actions {
  display: inline-block;
  vertical-align: top;
  width: calc(100% - 130px);
  text-align: center;
}
.header-4 {
  grid-column: 3/5;
  grid-row: 2/5;
}
.header-5 {
  padding:10px 3px 3px 3px;
  grid-column: 3/5;
   grid-row: 3/5;
}
.highlight {
  border: 1px solid #e3e3e3;
  background-color: #e9e9e9;
}
.gdm-list-parameters {
  display:inline-block; 
  width:380px;
  max-width:380px;
  font-size: 0.9rem;
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

 .tio-instructions {
    position: fixed;
    max-width:300px;
    padding:10px;
    left: 50%;
    top: 50%;
     border: 1px solid #a3a3a3;
    cursor: pointer;
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
    background: white;
    transform: translate(-50%, -50%);
    z-index:3001;
 }
</style>