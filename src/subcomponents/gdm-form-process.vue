<i18n>{
   "en":{
     "process_extent": "Process Dates",
     "temporal_extent": "Temporal Extent",
     "spatial_extent": "Spatial Extent",
     "filters": "Filters",
     "no_filter": "No filter"
   },
   "fr":{
     "process_extent": "Dates du calcul",
     "temporal_extent": "Etendue temporelle",
      "spatial_extent": "Etendue spatiale",
     "filters": "Filtres",
     "no_filter": "Aucun filtre"
    }
}
</i18n>
<template>
 <div class="gdm-form-process">
      <gdm-map :feature-collection="featureCollection"></gdm-map>
   
     <formater-search-box header-icon-class="fa fa-globe" open-icon-class="fa fa-caret-right" :title="$t('spatial_extent')" :deployed="false" type="empty" >
       <formater-spatial-search></formater-spatial-search>
     </formater-search-box>
     
     <formater-search-box header-icon-class="fa fa-calendar" open-icon-class="fa fa-caret-right" :title="$t('temporal_extent')" :deployed="false" type="empty" >
         <formater-temporal-search name="temp" lang="fr" daymin="2014-04-03" @change="dateChange"></formater-temporal-search>
     </formater-search-box>
     <formater-search-box header-icon-class="fa fa-cog" open-icon-class="fa fa-caret-right" title="Status" :deployed="false" type="empty" >
      <formater-select  :options="statusList"  @input="statusChange" width="228px"></formater-select>
    </formater-search-box>
     <formater-search-box header-icon-class="fa fa-hourglass-end" open-icon-class="fa fa-caret-right" :title="$t('process_extent')" :deployed="false" type="empty" >

       <formater-temporal-search name="process" lang="fr" daymin="2020-03-01" @change="dateChange"></formater-temporal-search>
    </formater-search-box>

    <formater-search-box  header-icon-class="fa fa-filter" open-icon-class="fa fa-caret-right" :title="$t('filters')" :deployed="false" type="empty" >
     <div style="margin-left:10px;min-height:70px;">
     <div v-if="!user && !service" style="font-style:italic;color:grey;">{{$t('no_filter')}}</div>
	   <div v-if="user" class="selected">{{user.email}}<span class="fa fa-close" @click="removeFilter('user')"></span></div>
	   <div v-if="service" class="selected">{{service.name}}<span class="fa fa-close" @click="removeFilter('service')"></span></div>
	   </div>
	  </formater-search-box>


</div>

</template>
<script>
// import AerisDatepicker from 'aeris-commons-components-vjs/src/aeris-datepicker/aeris-datepicker.vue';
import moment from 'moment';
// import FormaterTemporalSearch from './formater-temporal-search.vue'

import {FormaterSearchBox, FormaterTemporalSearch, FormaterSelect} from 'formater-commons-components-vjs'
import FormaterSpatialSearch from './formater-spatial-search.vue'
import GdmMap from './gdm-map.vue'

export default {
  name: 'GdmFormProcess',
  components: {
    FormaterTemporalSearch,
    FormaterSpatialSearch,
    FormaterSelect,
    FormaterSearchBox,
    GdmMap
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    service: {
      type: Array,
      default: null
    },
    status: {
      type: Array,
      default: null
    },
    color: {
      type: String,
      default: '#808080'
    },
    lang: {
      type: String,
      default: 'en'
    },
    featureCollection: {
      type: Object,
      default: null
    },
    bbox: {
      type: String,
      default: null
    }
  },
  computed: {
    
  },
  created () {
    this.$i18n.locale = this.lang
  },
  mounted () {
  },
  destroyed () {
  },

  data() {
    return {
      process: {
        from: null,
        to: null,
        daymin: '2020-01-01',
        daymax: 'now'
      },
      statusList: ['WAITING', 'TERMINATED', 'RUNNING', 'FAILED', 'PURGED'],
      dateFormat: 'DD/MM/YYYY',
      pattern: '(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/[0-9]{4}'
    }
  },
  methods: {
    getStatus () {
      
    },
    removeFilter (type) {
      this.$emit('remove', type)
    },
  
    date2str(  date){
      if (date === 'now') {
        return moment().format(this.format)
      } else {
        return moment(date).format(this.format)
      }
	  },
	  str2date( str, format){
	      if( str == "now"){
	          return moment();
	      }else{
	          return moment( str, format);
	      }
	  },
	  dateChange(e) {
	    this.$emit('dateChange', e)
	  },
	  statusChange(e) {
	    if (e === '---') {
	      e = null
	    }
	    this.$emit('statusChange', e)
	  }
  }
}
</script>
<style scoped>
.gdm-form-process {
  border: 1px solid grey;
  border-radius: 3px;
  margin-bottom: 30px;
  min-height: 20px;
}
.gdm-form-process h3 {
  margin-top:0;
}
.gdm-form-process .formater-search-box {
    margin: 5px 0;
    width: 100%;
    box-shadow: 0 2px 5px -5px rgba(0, 0, 0, 0.2);
}
.gdm-form-process .fa-close{
  color: darkred;
  margin-left:10px;
  cursor:pointer;
  vertical-align:top;
}
.gdm-form-process div.selected{
  float:left;
  padding: 3px;
  margin: 0px 5px 5px 0px;
  background: #F0f0f0;
  border: 1px solid grey;
  border-radius:2px;
}
.gdm-form-process div.research{
  display:inline-block;
  vertical-align:top;
  margin-right: 10px;
  margin-bottom: 10px;
  max-width:300px;
  min-height: 110px;
}

</style>