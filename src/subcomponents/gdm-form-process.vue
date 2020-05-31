<i18n>{
   "en":{
     "process_extent": "Process Dates",
     "temporal_extent": "Temporal Extent",
     "spatial_extent": "Spatial Extent",
     "filters": "Filters",
     "no_filter": "No filter",
     "reset": "Reset",
     "search": "Search"
   },
   "fr":{
     "process_extent": "Dates du calcul",
     "temporal_extent": "Etendue temporelle",
      "spatial_extent": "Etendue spatiale",
     "filters": "Filtres",
     "no_filter": "Aucun filtre",
     "reset": "Intialiser",
     "search": "Rechercher"
    }
}
</i18n>
<template>
 <div class="gdm-form-process" style="overflow-y:auto;overflow-x:hidden;" :style="{maxHeight:height + 'px'}">
       <div style="text-align:center;margin: 10px 0 30px 0;">
        <input id="globalReset" :style="$buttonStyle(color)" type="button" @click="reset" :value="$t('reset')"/>
       </div>
       <div class="text-search" :style="{background: backgroundColor()}">
       <input id="any" name="any" v-model="textSearch" :placeholder="$t('search')" @keypress="textChange"  /><i class="fa fa-search"></i>
      </div>
      <gdm-map :feature-collection="featureCollection"></gdm-map>
   
     <formater-search-box header-icon-class="fa fa-globe" open-icon-class="fa fa-caret-right" :title="$t('spatial_extent')" :deployed="false" type="empty" >
       <gdm-spatial-search :lang="lang"></gdm-spatial-search>
     </formater-search-box>
     
     <formater-search-box header-icon-class="fa fa-calendar" open-icon-class="fa fa-caret-right" :title="$t('temporal_extent')" :deployed="false" type="empty" >
         <formater-temporal-search name="temp" lang="fr" :format="format" daymin="2014-04-03" @change="dateChange"></formater-temporal-search>
     </formater-search-box>
     <formater-search-box header-icon-class="fa fa-cog" open-icon-class="fa fa-caret-right" title="Status" :deployed="false" type="empty" >
      <formater-select  :options="status" :defaut="parameters.status" @input="statusChange" width="228px"></formater-select>
    </formater-search-box>
     <formater-search-box header-icon-class="fa fa-hourglass-end" open-icon-class="fa fa-caret-right" :title="$t('process_extent')" :deployed="false" type="empty" >

       <formater-temporal-search name="process" lang="fr" :format="format" daymin="2020-03-01" @change="dateChange"></formater-temporal-search>
    </formater-search-box>

    <formater-search-box  header-icon-class="fa fa-filter" open-icon-class="fa fa-caret-right" :title="$t('filters')" :deployed="false" type="empty" >
     <div style="margin-left:10px;min-height:70px;">
     <div v-if="!user && !service" style="font-style:italic;color:grey;">{{$t('no_filter')}}</div>
     <div v-if="user" class="selectedUser">{{user.email}}<span class="fa fa-close" @click="removeFilter('user')"></span></div>
     <div v-if="service" class="selectedService">{{service.name}}<span class="fa fa-close" @click="removeFilter('service')"></span></div>
     </div>
    </formater-search-box>


</div>

</template>
<script>
// import AerisDatepicker from 'aeris-commons-components-vjs/src/aeris-datepicker/aeris-datepicker.vue';
import moment from 'moment';
// import FormaterTemporalSearch from './formater-temporal-search.vue'

import {FormaterSearchBox, FormaterTemporalSearch, FormaterSelect} from 'formater-commons-components-vjs'
import GdmSpatialSearch from './gdm-spatial-search.vue'
import GdmMap from './gdm-map.vue'

export default {
  name: 'GdmFormProcess',
  components: {
    FormaterTemporalSearch,
    GdmSpatialSearch,
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
      type: Object,
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
    },
    height: {
      type: Number,
      default: 700
    }
  },
  computed: {
    
  },
  created () {
    this.$i18n.locale = this.lang
    if (this.lang === 'fr') {
      this.format = 'DD/MM/YYYY'
    } else {
      this.format = 'MM/DD/YYYY'
    }
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
      format: 'DD/MM/YYYY',
      textSearch: null,
      dateFormat: 'DD/MM/YYYY',
      pattern: '(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/[0-9]{4}',
      parameters: {
        status: null
      }
    }
  },
  methods: {
    removeFilter (type) {
      this.$emit('remove', type)
    },
    backgroundColor () {
      return this.$shadeColor(this.color, 0.8)
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
    },
    textChange(event) {
      if (event.which == 13 || event.keyCode == 13) {
        this.$emit('textChange', this.textSearch)
      }
    },
    reset(e) {
      this.textSearch = ""
      var event = new CustomEvent('aerisResetEvent')
      document.dispatchEvent(event)
      this.$emit('reset')  
    }
  }
}
</script>
<style scoped>
.gdm-form-process {
  margin-bottom: 0px;
  min-height: 20px;
  padding: 0px 0px 0px 0px;
border: 1px solid #ccc;
box-shadow: 1px 1px 1px 2px rgba(0, 0, 0, 0.1);
}
.gdm-form-process h3 {
  margin-top:0;
}
.gdm-form-process .formater-search-box {
    margin: 5px 0;
    width: 100%;
    box-shadow: 0 2px 5px -5px rgba(0, 0, 0, 0.2);
}
.gdm-form-process .formater-search-box .content{
    margin: 0;
}
.gdm-form-process .fa-close{
  color: darkred;
  margin-left:10px;
  cursor:pointer;
  vertical-align:top;
}
.gdm-form-process div.selectedUser,
.gdm-form-process div.selectedService{
  float:left;
  padding: 3px;
  margin: 0px 5px 5px 0px;
  background: #F0f0f0;
  border: 1px solid grey;
  border-radius:2px;
}
.gdm-form-process .text-search {
  margin: 10px;
width: calc(100% - 20px);
}
.gdm-form-process input[name="any"] {
   line-height: 35px;
   height: 35px;
   width: calc(100% - 40px);
   border: none;
   background-color: transparent;
   padding: 0 10px;
   outline: none;
}
.gdm-form-process input#globalReset {
  margin: 0 0 3px 7px;
  padding: 3px 12px;
  text-align: center;
  border-radius: 1px;
  font-size: 16px;
  line-height: 1.7;
  border:1px solid #393933;
  background-color: #808080;
  color: #fff;
  cursor: pointer;
  text-decoration:none;
  pointer-events: auto;
  box-sizing: border-box;
  box-shadow: 0 1px 5px rgba(0,0,0,.65);
  opacity:0.8;
}
.gdm-form-process input#globalReset:hover{
  opacity:1;
    text-decoration:none;
     outline: none; 
}
.gdm-form-process input#globalReset:active,
.gdm-form-process input#globalReset:visited,
.gdm-form-process input#globalReset:focus,
.gdm-form-process input#globalReset::-moz-focus-inner{
     outline:0 none !important;
     text-decoration:none;
      -moz-outline-style: none;
}

</style>