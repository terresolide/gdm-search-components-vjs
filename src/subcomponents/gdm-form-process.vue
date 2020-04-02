<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {notExactly}{count}"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {notExactly}{count}"
   }
}
</i18n>
<template>
 <span class="gdm-form-process">
  


    <div class="research">
      <h3>{{$t('process_extent')}}</h3>
       <div style="max-width:200px;">
       <formater-temporal-search name="process" lang="fr" daymin="2020-03-01" @change="processDateChange"></formater-temporal-search>
       </div>
    </div>
    <div class="research">
	    <h3>{{$t('temporal_extent')}}</h3>
	    <div style="max-width:200px;">
	       <formater-temporal-search name="temp" lang="fr" daymin="2014-04-03" @change="tempDateChange"></formater-temporal-search>
	    </div>
    </div>
    <div class="research">
     <h3>{{$t('filters')}}</h3>
   <div v-if="user" class="selected">{{user.email}}<span class="fa fa-close" @click="removeFilter('user')"></span></div>
   <div v-if="service" class="selected">{{service.name}}<span class="fa fa-close" @click="removeFilter('service')"></span></div>
  </div>
  <div style="clear:both;"></div>

 </span>
</template>
<script>
// import AerisDatepicker from 'aeris-commons-components-vjs/src/aeris-datepicker/aeris-datepicker.vue';
import moment from 'moment';
// import FormaterTemporalSearch from './formater-temporal-search.vue'
import {FormaterTemporalSearch} from 'formater-commons-components-vjs'
export default {
  name: 'GdmFormProcess',
  components: {
    FormaterTemporalSearch
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
      dateFormat: 'DD/MM/YYYY',
      pattern: '(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/[0-9]{4}'
    }
  },
  methods: {
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
	  processDateChange(e) {
	    console.log('process')
	    console.log(e)
	  },
	  tempDateChange(e) {
	    console.log('temporal')
	    console.log(e)
	  }
  }
}
</script>
<style scoped>
.gdm-form-process > div:first-child {
  margin-bottom: 30px;
  min-height: 20px;
}
.gdm-form-process .fa-close{
  color: darkred;
  margin-left:10px;
  cursor:pointer;
  vertical-align:top;
}
.gdm-form-process div.selected{
  float:left;
  padding: 5px;
  margin: 5px;
  background: lightgrey;
  border: 1px solid grey;
  border-radius:2px;
}
.gdm-form-process div.research{
  float:left;
  margin-right: 10px;
}

</style>