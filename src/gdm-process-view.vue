<i18n>{
   "en":{
    "common": "Common products",
     "status_informations": "Job status",
     "clear_data": "All results will be deleted on this date",
     "owner": "Owner",
     "cost": "Cost",
     "created": "Created",
     "display_on_map": "Display footprint on map",
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
     "units": "Units",
     "data": "Data"
   },
   "fr":{
     "common": "Produits communs",
     "status_informations": "Etat du calcul",
      "clear_data": "Tous les résultats seront effacés à cette date",
     "owner": "Propriétaire",
     "cost": "Coût",
     "created": "Création",
     "display_on_map": "Afficher l'emprise sur la carte",
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
     "units": "Unités",
     "data": "Données"
   }
}
</i18n>
<template>
 <span class="gdm-process-view" >
 <div v-if="process">
	 <div id="fmtLargeMap">
	   <gdm-serie-navigation v-if="series" :series="series" :serie-index="serieIndex" :serie-name="serieName" :color="color" :lang="lang"
	     :fullscreen="true" :loading="loadingLayer"  @dateChange="dateSerieChange"></gdm-serie-navigation>
    <div v-if="mouseposition" class="gdm-mouseposition" >{{mouseposition}}</div>

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
		      :service-name="process.serviceName" :series="series" :serie-index="serieIndex" :lidar="lidar" :lang="lang" @dateChange="dateSerieChange" @tioReady="tioImagesReady"
		      fullscreen="fmtLargeMap" :remove-height="3" @loadingLayer="loadingChange" @imageAdded="imageAdded" @imageRemoved="imageRemoved"
		      @mousemove="mousemove"></gdm-map>
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
	         
	          <div v-if="process.status === 'TERMINATED' && process.datePurge && !process.keep"
	          style="color:darkred;cursor:pointer;" :title="$t('clear_data')">
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
		     :step-id="process.stepId" :phase="process.phase" :log="log" :back="back" :steps="process.serviceSteps" ></gdm-process-progress>
		  </div>
		  <div class="header-2-3">
		      <div><b>{{$t('owner')}}:</b> {{process.email}} <span v-if="process.team">({{process.team}})</span></div>
		      <div v-if="process.cost > 0" >
		        <b>{{$t('cost')}}:</b>
		        <span v-if="['WAITING', 'EVALUATED'].indexOf(process.status) >= 0">
			        <span :style="{color: !isPrivate && process.cost > process.quota ? 'red' : 'black' }">
			           <span v-if="process.serviceName.indexOf('SAR') >= 0"> <b>{{process.cost.toLocaleString()}}&nbsp;{{$t('units')}}</b> </span>
			           <span v-else> <b>{{process.cost.toLocaleString()}}&nbsp;CPU&nbsp;{{$t('seconds')}}</b></span>
				         <span v-if="!isPrivate" >/ {{process.quota.toLocaleString()}}</span>
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
		      <div v-if="!isPrivate && (process.cost <= 0 || ['WAITING', 'EVALUATED'].indexOf(process.status) < 0)">
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
 
		     <gdm-process-actions v-if="process" :api="api" :url="url" :id="id" :back="back" :color="color"
		     :process="process" :user-id="userId" :is-private="isPrivate" :can-duplicate="hasAccessService && !dataRemoved"  :can-edit="hasAccessService" :lang="lang" :teams="teams" @processChange="statusChange" 
		     @statusChange="statusChange" @teamChange="teamChange" @duplicate="duplicate"
		     @keptProcess="keepProcess">
		     </gdm-process-actions>
		   </div>
		    
		    <div v-if="process && process.result && (process.result.local || process.status === 'TERMINATED' || process.status === 'FAILED')" :class="{highlight:seeResult}" style="margin-top:15px;"
		    :style="{background: seeResult ? $shadeColor(color,0.92): 'none'}">
	       <gdm-process-result  :status="process.status" :result="process.result" :series="series" :service-name="process.serviceName"
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
			  <span v-if="process.lidar" class="gdm-lidar">
			     <h2 :style="{color:color}">LiDAR</h2>
			     <div >
			       <span class="fa fa-globe"   :style="{color: lidar ? 'darkgreen' :'black'}"
			        :title="$t('display_on_map')" @click="displayLidar"></span>
			        {{ process.lidar.properties.filename}} 
			        (<em style="color:#333;">{{date2str(process.lidar.properties.date, 'll')}}</em>)
			     </div>
			  </span>
			  <h2 v-if="!process.magtel" :style="{color:color}">{{images.length}} images</h2>
        <h2 v-else :style="{color:color}">{{ $t('data') }}</h2>
			  <div v-if="images.length > 0">
				  <div  v-for="image in images" class="gdm-images-child" >
		        <gdm-image :image="image" :type="type" :searching="false" :checked="false" :stereo-list="stereo" mode="view" :lang="lang"></gdm-image>
		      </div>
			  </div>
        <div v-else-if="process.magtel"class="gdm-images-child" :class="{'gdm-removed': process.magtel.removed}"> 
          <div ><i class="fa fa-file-archive-o"></i> {{ process.magtel.filename }}</div>
        </div>
			  <div v-else style="text-align:center;padding: 30px;">NO IMAGES SELECTED - TYPE REQUEST</div>
			  </div>
			  
		</div>
	</div>
	<div v-else-if="errorCode" >
	    <login-to-access v-if="!userId && !back" :message="$t('no_accessible_process_user')"></login-to-access>
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
    // group roles
    roles: {
      type: String|Array,
      default: ''
    },
    userId: {
      type: Number,
      default: null
    },
    isPrivate: {
      type: Boolean,
      default: false
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
     // this.getToken()
     if (!this.process) {
        this.load()
     }
    }
  },
  computed: {
    seeResult () {
      if (!this.process) {
        return false
      }
      return this.process.status === 'TERMINATED' && this.process.result
    },
    shareKey () {
        if (this.$route) {
         var query = this.$route.query
         return query.key
       } else {
	       var result = window.location.href.match(/^.+\?([^\/]+)$/)
         if (result && result.length > 1) {
            const params = new URLSearchParams(result[1]);
	          return params.get('key')
         }
       }
       return null
    },
    log () {
      if (!this.process || !this.process.log) {
        return null
      }
      if ((this.back || this.process.serviceName.indexOf('SAR') >= 0) && 
          (this.process.status === 'RUNNING' || this.process.status === 'FAILED')) {
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
    },
    teams () {
      if (!this.roles) {
        return []
      }
      if (typeof this.roles ==='string' || this.roles instanceof String) {
        return this.roles.split(',')
      } else {
        return this.roles
      }
    }
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
   // this.getToken()
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
      lidar: null,
      process: null,
      errorCode: null,
      // INPUT IMAGES
      images: [],
      dataRemoved: false,
      statusList: null,
      headerHeight: null,
      // RESULT
      imageLayers: null,
      series: null,
      serieIndex: 0,
      serieName: null,
     // token: null,
      // image type among PEPS, PLEIADES...
      type: 'PEPS',
      // URL of file which describe parameters
      describe: null,
      stereo: null,
      fullscreen: false,
      defaultParameters: null,
      loadingLayer: false,
      showTioInstructions: false,
      mouseposition: null
    }
  },
  methods: {
    displayLidar () {
      if (!this.lidar) {
        this.lidar = this.process.lidar
      } else {
        this.lidar = null
      }
    },
    mousemove (val) {
      this.mouseposition = val
    },
    dateSerieChange (index) {
      if (!this.loadingLayer) {
        this.serieIndex = index
      }
    },
    loadingChange (value) {
      this.loadingLayer = value
    },
//     getToken () {
//       this.$http.get(this.api + '/getToken', {credentials: true})
//       .then(
//          (resp) => { this.token = resp.body.token },
//          (resp) => { console.log('ERROR GET TOKEN') }
//       )
//     },
    toggleImage (e) {
      if (!this.imageLayers || this.imageLayers === 'undefined') {
        return
      }
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
    createSarImage (key, prop, name, result, dir, bbox, footprint, type, text) {
      var image = {}
      image.title = name
      if(result.bbox) {
        image.bbox = result.bbox
      } else {
         image.bbox = bbox
      }
      image.type = type
      image.legend = dir + key + '/legend_' + name + '_runw.png' 
      if (text) {
        image.first = text
        text = null
      }
      image.footprint = footprint
      image.checked = false
      for(var file in result) {
        if (typeof result[file] === 'string' &&
            result[file].substr(-3) === 'png') {
          image.png = dir + key + '/' + result[file]
        }
        if (typeof result[file] === 'string' &&
            result[file].substr(-4) === 'tiff') {
          image.tif = dir + key + '/' + result[file]
        }
      }
      return image
    },
    addResult (result) {
      if (this.process.status === 'PURGED' && !result.local) {
        return
      }
      if (result && result.thumbnails) {
        result.thumbnails.sort(function (a, b) {
          return a.title > b.title ? 1 : -1
        })
        var url = ''
        if (result.local) {
          url = this.api.replace('api', '')
        }
        console.log(url)
        var imageLayers = result.thumbnails
        imageLayers.forEach(function (image) {
          image.checked = false,
          image.type = 'image'
          image.png = url + image.png
          if (image.legend) {
            image.legend = url + image.legend
          }
          if (result.bounds) {
            image.bounds = result.bounds
          }
        })
        this.imageLayers = imageLayers
      } else if (result && result.bbox && !this.imageLayers){
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
		               var image = this.createSarImage(key, prop, name, result[key][prop][name], result.dir, bbox, footprint, 'image', text)
		               text = null
			             imageLayers.push(image)
		             }
		           }
		         }  else if (prop === 'Time_Serie') {
		           var text = this.$i18n.t('time_serie')
               // array series
               
               for (var name in result[key]['Time_Serie']) {
                 if (name.indexOf('geo') >= 0 )
                 {
                   if (result[key]['Time_Serie'][name].serie) {
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
                     var tif = result[key]['Time_Serie'][name].tiff || result[key]['Time_Serie'][name].tif
                     if (tif) {
                       image.tif = result.dir + key + '/' + tif
                     }
				             if (text) {
				               image.first = text
				               text = null
				             }
                     imageLayers.push(image)
                   } else {
                     var image = this.createSarImage(key, prop, name, result[key][prop][name], result.dir, bbox, footprint, 'serie', text)
                     text = null
                     imageLayers.push(image)
                   }
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
      if (this.process) {
        return
      }
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
      if (response.images && response.images[0] && response.images[0].feature ) {
        // add feature.properties['temporal:startDate'] if not exist
        response.images.forEach(function(f, index) {
          if (f.feature.properties.startDate) {
            response.images[index].feature.properties['temporal:startDate'] = f.feature.properties.startDate
          }
        })
        response.images.sort(function (a,b) {
          if (a.feature && b.feature) {
            return a.feature.properties['temporal:startDate'] > b.feature.properties['temporal:startDate'] ? 1 : -1
          } else {
            return 0
          }
        })
      }
      this.getImage(response.images, 0)
      this.feature = response.feature
      this.feature.properties.id = this.id
      this.process = response
      if (this.process.magtel && this.process.magtel.removed) {
        this.dataRemoved = true
      }
      
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
            this.dataRemoved = true
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
    keepProcess (value) {
      this.process.keep = value
    },
    load () {
      var url = this.api + '/process/' + this.id
      if (this.shareKey) {
        url += '?key=' + this.shareKey
      }
      this.$http.get(url, {credentials: true})
      .then(
          response => this.display(response.body),
          response => this.error(response))
      var url = this.api + '/process/status'
      this.$http.get(url,
          {headers: {'accept-language': this.lang}, credentials: true})
      .then(
          response => this.setStatusList(response.body),
          response => this.error(response))
    },
   
    setStatusList (status) {
      if (!status.error) {
        this.statusList = status
      }
      if (this.$el && this.$el.querySelector && this.$el.querySelector('.gdm-process-header')) {
        this.headerHeight = this.$el.querySelector('.gdm-process-header').clientHeight
      }
    },
    teamChange (process) {
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
        this.$set(this.process, 'phase', detail.phase)
        this.$set(this.process, 'end', detail.end)
        this.$set(this.process, 'processEnd', detail.processEnd)
        this.$set(this.process, 'processStart', detail.processStart)
        this.$set(this.process, 'userId', detail.userId)
        this.$set(this.process, 'email', detail.email)
        if (!this.process.result && detail.result) {
	        this.$set(this.process, 'result', detail.result)
		      this.addResult(detail.result)  
	      }
        // gdm-sar
        if (this.process.result && this.process.result.dir && !this.process.result.bbox && detail.result && detail.result.bbox) {
          this.$set(this.process, 'result', detail.result)
          this.addResult(detail.result)
        }
      }
    }
  }
}
</script>
<style>
.gdm-removed {
  background: linear-gradient(-45deg, white 25%,
  #EEE 25%, #EEE 50%, 
  white 50%, white 75%, 
  #EEE 75%);
background-size: 10px 10px;
}
.gdm-process-view {
  font-family: Roboto, sans-serif;
}
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
  width:calc(100% - 3px);
  top:-3px;;
  left:-3px;
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
   } 
div[id="view"] .gdm-process-view div.gdm-process-header {
  max-height:none;
}
.gdm-process-view h1 {
  font-size: 1.7em;
  text-transform:uppercase;
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
.gdm-process-view h2,
span.gdm-lidar h2 {
  padding: 10px 0;
  font-weight:700;
}
span.gdm-lidar .fa {
  margin-right:10px;
  cursor: pointer;
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
   position:relative;
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
   font-size: 0.9rem;
   
 }
 .gdm-list-images > div,
 span.gdm-lidar > div {
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