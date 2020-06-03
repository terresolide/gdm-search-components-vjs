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
 <h1>@todo</h1>
 <div>{{process.up_name }}</div>
 <div>{{process.s_name}} - {{process.up_id}}</div>
 <div>Status: {{process.status}}</div>
 <diV>Dates process: {{date2str(process.up_date)}} <span class="fa fa-long-arrow-right"></span> {{date2str(process.ps_date)}}</diV>
 <div></div>
 <div style="width:300px;">
  <gdm-map :feature-collection="feature"></gdm-map>
 </div>
  <div>TempExtent: {{date2str(process.up_start, true)}} <span class="fa fa-long-arrow-right"></span> {{date2str(process.up_end, true)}}</div>
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
    }
  }
}
</script>
<style scoped>
.gdm-process-view{
}
</style>