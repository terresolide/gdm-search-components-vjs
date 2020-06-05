<i18n>
{
   "en":{
     "refresh": "Refresh"    
   },
   "fr":{
     "refresh": "Actualiser"
   }
}
</i18n>
<template>
<span class="gdm-process-actions" v-if="process" >
     <div v-if="back">
    </div>
    <div v-else>
       <div v-if="process.status === 'ACCEPTED'">
        <a  class="button" @click="getStatus" :disabled="!serviceOpen">{{$t('refresh')}}</a>
      </div>
      <div v-else-if="process.status === 'EVALUATED'">
         <a class="button" :href="url + 'process/' + process.up_id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="launch" :disabled="!serviceOpen || !hasCredit">Launch</a>
      </div>
       <div v-else-if="process.status === 'FAILED'">
         <a class="button" @click="todo" disabled>{{$t('purge')}}</a>
      </div>
      <div v-else-if="process.status === 'INVALID'">
        <a class="button" :href="url + 'process/' + process.up_id + '/edit'">{{$t('edit')}}</a>
      </div>
      <div v-else-if="process.status === 'KILLED'">
         <a class="button" v-if="isOptic" @click="todo" :disabled="!serviceOpen">{{$t('relaunch')}}</a>
      </div>
      <!--  PURGED NOTHING TO DO -->
      <div v-else-if="process.status === 'RUNNING'">
        <a class="button" @click="getStatus" :disabled="!serviceOpen">{{$t('refresh')}}</a>
        <a class="button" @click="dismiss" :disabled="!serviceOpen">{{$t('stop')}}</a>
      </div>
      <div v-else-if="process.status === 'SAVED'">
         <a class="button"  :href="url + 'process/' + process.up_id + '/edit'">{{$t('edit')}}</a>
        
         <a class="button" @click="evaluate" :disabled="!serviceOpen">{{$t('evaluate')}}</a>
      </div>
     

      <div v-else-if="process.status === 'WAITING'">
       <a class="button" :href="url + 'process/' + process.up_id + '/edit'">Edit</a>
       <a class="button" v-if="process.format.indexOf('sar') >= 0 " :disabled="!serviceOpen || !hasCredit" @click="launch">{{$t('launch')}}</a>
      </div>
     
     </div>

</span>
</template>
<script>
export default {
  name: 'GdmProcessActions',
  props:{
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
    },
    process: {
      type: Object,
      default: null
    }
  },
  data(){
    return {
    }
  },
  computed: {
    editable () {
      if (this.process && this.process.roles) {
	      var intersection = this.process.roles.filter(x => ['OWNER', 'MANAGER'].includes(x))
        return intersection.length > 0
      } else {
        return false
      }
    },
    managable () {
      if (this.process) {
        return this.process.roles.includes('MANAGERS')
      } else {
        return false
      }
    },
    serviceOpen () {
      if (this.process) {
        return this.process.serviceStatus === 'ENABLED'
      } else {
        return false
      }
    },
    hasCredit () {
      if (this.process) {
        return parseInt(this.process.cost) < parseInt(this.process.quota)
      } else {
        return false
      }
    },
    isOptic () {
      if (this.process) {
        return this.process.format === 'json_optic'
      } else {
        return false
      }
    }
  },
  destroyed: function() {
  },
  created: function () {
  },
  mounted: function(){
    console.log(this.editable)
  },
  methods:{
    getStatus () {
      
    },
    launch () {
     
    },
    evaluate () {
      
    },
    dismiss () {
      
    }
  }
}
</script>
<style scoped>
</style>
