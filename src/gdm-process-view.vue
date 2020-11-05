<i18n>{
   "en":{
     "status_informations": "Job status",
     "clear_data": "All results will be deleted on this date",
     "owner": "Owner",
     "cost": "Cost",
     "created": "Created",
     "edit": "Edit",
     "last_update": "Updated",
     "owner_credit": "Actual credit",
     "process_time": "Process time",
     "parameters": "Parameters",
     "seconds": "seconds"
   },
   "fr":{
      "status_informations": "Etat du calcul",
      "clear_data": "Tous les résultats seront effacés à cette date",
     "owner": "Propriétaire",
     "cost": "Coût",
     "created": "Création",
     "edit": "Modifier",
     "last_update": "Maj",
     "owner_credit": "Crédit actuel",
     "parameters": "Paramètres",
     "process_time": "Calcul",
      "seconds": "secondes"
   }
}
</i18n>
<template>
 <span class="gdm-process-view" v-if="process">
 <div id="fmtLargeMap"></div>
 <div style="position:relative;">
	 <gdm-service-status  :name="process.serviceName" :status="process.serviceStatus" :top="5" :right="10" :lang="lang" ></gdm-service-status>
	 <div class="gdm-process-header" :style="{background: $shadeColor(color,0.95)}">
	   <div class="header-0">
	    <h1 :style="{color:color}">{{(process.id + '').padStart(5, '0')}}<span v-if="process.name"> - {{process.name }}</span></h1>
	   </div>
	   <div class="header-1">
	     <div class="gdm-map-container">
	      <gdm-map ref="map" :bbox="process.feature" :images="imageLayers" :tile="feature.properties.bboxTile"
	      fullscreen="fmtLargeMap" :remove-height="8" @imageAdded="imageAdded" @imageRemoved="imageRemoved"></gdm-map>
	     </div>
	      <div style="text-align:center;margin-top:10px;">
	         {{date2str(process.tempStart, true)}}
	         <span class="fa fa-long-arrow-right"></span>
	         {{date2str(process.tempEnd, true)}}
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
	   <div class="header-2-2" >
	     <gdm-process-progress :status="process.status" :progress="process.progress" 
	     :step-id="process.stepId" :log="log" :steps="process.serviceSteps" ></gdm-process-progress>
	  </div>
	  <div class="header-2-3">
	      <div><b>{{$t('owner')}}:</b> {{process.email}}</div>
	      <div v-if="process.cost > 0" >
	        <b>{{$t('cost')}}:</b>
	        <span v-if="['WAITING', 'EVALUATED'].indexOf(process.status) >= 0">
		        <span :style="{color: process.cost > process.quota ? 'red' : 'black' }">
			        <b>{{process.cost.toLocaleString()}}&nbsp;CPU&nbsp;{{$t('seconds')}}</b> 
			        <span >/ {{process.quota.toLocaleString()}}</span>
		         </span>
		         <div v-if="back && process.cost > process.quota">
                 <a class="button"  :href="url + 'users/view/' + process.userId">{{$t('edit')}}</a>
             </div>
	         </span>
	         <span v-else><b>{{process.cost.toLocaleString()}}</b>&nbsp;CPU&nbsp;{{$t('seconds')}}</span>
	         
	      </div>
	      <div v-if="process.cost <= 0 || ['WAITING', 'EVALUATED'].indexOf(process.status) < 0">
	      <b>{{$t('owner_credit')}}:</b> {{process.quota.toLocaleString()}}&nbsp;CPU&nbsp;{{$t('seconds')}}
	      </div>
	   </div>
	   <div class="header-3">
	  <div style="max-width:130px;display:inline-block;">
        <gdm-process-status v-if="statusList" :status="process.status" :status-list="statusList" :lang="lang"></gdm-process-status>
     </div>
	  <!--  </div>
	   <div class="header-4">--> 
	   <div class="process-actions">
	     <gdm-process-actions v-if="process" :api="api" :url="url" :id="id" :back="back" 
	     :process="process"  :lang="lang" @processChange="statusChange" 
	     @statusChange="statusChange" @duplicate="duplicate">
	     </gdm-process-actions>
	   </div>
	    
	    <div  :class="{highlight:seeResult}"
	    :style="{background: seeResult ? $shadeColor(color,0.92): 'none'}">
       <gdm-process-result v-if="process && process.result && process.status === 'TERMINATED'" :result="process.result" 
        :lang="lang" :color="color" :images="imageLayers" @toggleImage="toggleImage" >
       </gdm-process-result>
       </div>
		 </div>
		 </div>
		 <div class="gdm-list-parameters" >
			 <h2 :style="{color:color}">{{$t('parameters')}}</h2>
			 <div>
			  <div v-for="(value, prop) in parameters" style="font-size:0.9rem;max-width:400px;"
			   v-if="['correl_image_input', 't2_app_name', 't2_token','t2_user', 'wf_id'].indexOf(prop) < 0 ">
			    <b >{{prop}}:</b> <div style="vertical-align:top;max-width:350px;display:inline-block;overflow-wrap:anywhere">{{value}}</div>
			  </div>
			  </div>
		  </div>
		  <div class="gdm-list-images" >
		  <h2 :style="{color:color}">Images</h2>
		  <div v-if="images.length > 0">
			  <div  v-for="image in images" class="gdm-images-child" >
	        <gdm-image :image="image" :searching="true" :checked="true" mode="view" :lang="lang"></gdm-image>
	      </div>
		  </div>
		  <div v-else style="text-align:center;padding: 30px;">NO IMAGES SELECTED - TYPE REQUEST</div>
		  </div>
		  
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
export default {
  name: 'GdmProcessView',
  components: {
    GdmMap,
    GdmProcessActions,
    GdmServiceStatus,
    GdmProcessStatus,
    GdmProcessProgress,
    GdmProcessResult,
    GdmImage
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
    back: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    seeResult () {
      return this.process.status === 'TERMINATED' && this.process.result
    }
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    this.load()
  },
  mounted () {
    if (this.$el && this.$el.querySelector) {
      this.headerHeight = this.$el.querySelector('.gdm-process-header').clientHeight
    }
  },
  destroyed () {
     if (this.timer) {
       clearInterval(this.timer)
       this.timer = null
     }
  },
  data() {
    return {
      parameters: {},
      feature: null,
      process: null,
      images: [],
      statusList: null,
      headerHeight: null,
      imageLayers: null,
      log: null
    }
  },
  methods: {
    toggleImage (e) {
      var image = this.imageLayers[e]
      image.checked = !image.checked
      this.$set(this.imageLayers, e, image)
      this.$refs.map.toggleImageLayer(e, image.checked)
    },
    imageAdded (index) {
      var image = this.imageLayers[index]
      image.checked = true
      this.$set(this.imageLayers, index, image)
    },
    imageRemoved (index) {
      var image = this.imageLayers[index]
      image.checked = false
      this.$set(this.imageLayers, index, image)
    },
    date2str(  date, small){
      var format = small ? 'll': 'lll'
      if (date === 'now') {
        return moment().format(format)
      } else {
        return moment(date).format(format)
      }
    },
    addResult (result) {
      if (result && result.thumbnails) {
        var imageLayers = result.thumbnails
        imageLayers.forEach(function (image) {
          image.checked = false
        })
        this.imageLayers = imageLayers
      }
    },
    display (response) {
      var parameters = response.feature.properties.parameters
      console.log(parameters)
      var keys = Object.keys(parameters)
      keys.sort()
      for(var prop in keys) {
        this.$set(this.parameters, keys[prop],parameters[keys[prop]])
      }
      this.getImage(response.images, 0)
      this.feature = response.feature
      this.feature.properties.id = this.id
      this.process = response
      this.log = this.process.log
      this.addResult(this.process.result)
      if (this.$el && this.$el.querySelector) {
        this.headerHeight = this.$el.querySelector('.gdm-process-header').clientHeight
      }
    },
    duplicate (process) {
      if (process.error) {
        alert(process.error)
        return
      }
      if (this.back) {
        window.location.href = this.url + 'process/' + process.id 
      } else {
        window.location.href = this.url + 'process/' + process.id + '/edit'
      }
    },
    getImage(list, index) {
      if (list[index] && list[index].feature) {
        this.images.push(list[index].feature.properties)
        this.getImage(list, index + 1)
      } else if (list[index] && list[index].url) {
        this.$http.get(list[index].url).then(function (response) {
          if (response.body) {
            this.images.push(response.body.features[0].properties)
          }
          this.getImage(list, index + 1)
          
        })
      }
    },
    error (response) {
      alert('error server code = ' + response.status)
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
    setStatusList (status) {
      if (!status.error) {
        this.statusList = status
      }
      if (this.$el && this.$el.querySelector) {
        this.headerHeight = this.$el.querySelector('.gdm-process-header').clientHeight
        console.log(this.headerHeight)
      }
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
          this.log = detail.log
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
.gdm-process-view div[id="fmtLargeMap"] {
  width:calc(100% - 6px);
  top:0;
  left:0;
  margin-bottom:0px;
  position:fixed;
  z-index:3000;
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
</style>
<style scoped>
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
  padding: 0 0 5px 0;
  font-weight:700;
}
.gdm-map-container {
   width:300px;
   margin:auto;
}
.gdm-process-header {
   position: relative;
  margin-top:0px;
  display:grid;
  grid-template-columns: 310px 2fr 2fr;
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
</style>