<i18n>{
   "en":{
     "process_extent": "Process Dates",
     "temporal_extent": "Temporal Extent",
     "filters": "Filters",
     "no_filter": "No filter"
   },
   "fr":{
     "process_extent": "Dates du calcul",
     "temporal_extent": "Etendue temporelle",
     "filters": "Filtres",
     "no_filter": "Aucun filtre"
    }
}
</i18n>
<template>
 <div class="gdm-form-process">
    <div class="research-map">
      <gdm-map :features="features"></gdm-map>
    </div>
    <div class="research">
  
      <h3>Status</h3>
      <formater-select  :options="statusList"  @input="statusChange"></formater-select>
    </div>
    <div class="research">
      <h3>{{$t('process_extent')}}</h3>
       <div style="max-width:200px;">
       <formater-temporal-search name="process" lang="fr" daymin="2020-03-01" @change="dateChange"></formater-temporal-search>
       </div>
    </div>
    <div class="research">
	    <h3>{{$t('temporal_extent')}}</h3>
	    <div style="max-width:200px;">
	       <formater-temporal-search name="temp" lang="fr" daymin="2014-04-03" @change="dateChange"></formater-temporal-search>
	    </div>
    </div>
  
    <div class="research">
     <h3>{{$t('filters')}}</h3>
   <div v-if="!user && !service" style="font-style:italic;color:grey;">{{$t('no_filter')}}</div>
   <div v-if="user" class="selected">{{user.email}}<span class="fa fa-close" @click="removeFilter('user')"></span></div>
   <div v-if="service" class="selected">{{service.name}}<span class="fa fa-close" @click="removeFilter('service')"></span></div>
  </div>
  <div style="clear:both;"></div>
</div>

</template>
<script>
// import AerisDatepicker from 'aeris-commons-components-vjs/src/aeris-datepicker/aeris-datepicker.vue';
import moment from 'moment';
// import FormaterTemporalSearch from './formater-temporal-search.vue'
import {FormaterTemporalSearch, FormaterSelect} from 'formater-commons-components-vjs'
import GdmMap from './gdm-map.vue'
export default {
  name: 'GdmFormProcess',
  components: {
    FormaterTemporalSearch,
    FormaterSelect,
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
    features: {
      type: Array,
      default: () => ([])
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
  padding: 10px;
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
  float:left;
  margin-right: 10px;
  max-width:300px;
}

</style>