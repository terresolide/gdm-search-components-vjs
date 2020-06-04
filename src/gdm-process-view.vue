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
 <span class="gdm-process-view">
 <h1>@todo - {{process.s_name}} N°{{process.up_id}}<span v-if="process.up_name"> - {{process.up_name }}</span></h1>
 <div class="gdm-process-header">
   <div class="header-1">
     <div style="width:300px;margin:auto;">
      <gdm-map :feature-collection="feature"></gdm-map>
     </div>
      <div style="text-align:center;">
         {{date2str(process.up_start, true)}}
         <span class="fa fa-long-arrow-right"></span>
         {{date2str(process.up_end, true)}}
     </div>
   </div>
   <div class="header-2">
      <div>Status: {{process.status}}</div>
      <div>Progress: {{process.progress}}</div>
      <div>
        Dates process: {{date2str(process.up_date)}}
        <span class="fa fa-long-arrow-right"></span>
        {{date2str(process.ps_date)}}
      </div>
   </div>
   <div class="header-3">
    <div v-if="back">
    </div>
    <div v-else>
       
      <div v-if="process.status === 'SAVED'">
       <a class="button" :href="url + 'process/' + process.up_id + '/edit'">Edit</a>
       <a class="button" @click="todo" disabled>Evaluate</a>
      </div>
      <div v-if="process.status === 'EVALUATED'">
       <a class="button" :href="url + 'process/' + process.up_id + '/edit'">Edit</a>
       <a class="button" @click="todo">Launch</a>
      </div>
      <div v-if="process.status === 'WAITING'">
       <a class="button" :href="url + 'process/' + process.up_id + '/edit'">Edit</a>
      
       <a class="button" @click="todo">Launch</a>
      </div>
      <div v-if="process.status === 'RUNNING'">
        <a class="button" @click="todo" disabled>Get Status (en attendant)</a>
        <a class="button" @click="todo" disabled>STOP</a>
      </div>
     
     </div>
   </div>
 </div>
 <h2>Parameters</h2>
  <div v-for="(value, prop) in parameters" style="font-size:0.9rem;">
    <b>{{prop}}:</b> {{value}}
  </div>
 </span>
</template>
<script>
import GdmMap from './subcomponents/gdm-map.vue'
import moment from 'moment'
export default {
  name: 'GdmProcessView',
  components: {
    GdmMap
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
      default: 'http:localhost:8080/#/'
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    this.load()
  },
  mounted () {
  },
  destroyed () {
  },
  data() {
    return {
      parameters: {},
      feature: null,
      process: {}
      
    }
  },
  methods: {
    load () {
      var url = this.api + '/' + this.id
      this.$http.get(url, {credentials: true})
      .then(
          response => this.display(response.body),
          response => this.error(response))
    },
    date2str(  date, small){
      var format = small ? 'll': 'lll'
      if (date === 'now') {
        return moment().format(format)
      } else {
        return moment(date).format(format)
      }
    },
    display (response) {
      this.parameters = response.up_parameters.properties.parameters
      this.feature = response.up_parameters
      this.feature.properties.id = this.id
      this.process = response
    },
    todo () {
      alert('TODO')
    }
  }
}
</script>
<style scoped>
.gdm-process-view{
}
.gdm-process-header {
  display:grid;
  grid-template-columns: 310px 1fr 1fr;
  grid-gap: 1Opx;
  grid-auto-rows: auto;
}
.header-1 {
  grid-column: 1;
  grid-row: 1/3;
}
.header-2 {
  grid-column: 2;
  grid-row: 1/3;
}
.header-3 {
  grid-column: 3;
  grid-row: 1/3;
}
</style>