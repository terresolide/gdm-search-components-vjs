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
        <a class="button" @click="getStatus" :disabled="!serviceOpen">{{$t('refresh')}}</a>
      </div>
      <div v-else-if="process.status === 'EVALUATED'">
         <a class="button" :href="url + 'process/' + process.up_id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="todo" :disabled="!serviceOpen">Launch</a>
      </div>
       <div v-else-if="process.status === 'FAILED'">
         <a class="button" @click="todo" disabled>{{$t('purge')}}</a>
      </div>
      <div v-else-if="process.status === 'INVALID'">
        <a class="button" :href="url + 'process/' + process.up_id + '/edit'">{{$t('edit')}}</a>
      </div>
      <div v-else-if="process.status === 'KILLED'">
         <a class="button" v-if="process.format === 'json_optic'" @click="todo">{{$t('relaunch')}}</a>
      </div>
      <!--  PURGED NOTHING TO DO -->
      <div v-else-if="process.status === 'RUNNING'">
        <a class="button" @click="getStatus" disabled>{{$t('refresh')}}</a>
        <a class="button" @click="todo" disabled>{{$t('stop')}}</a>
      </div>
      <div v-else-if="process.status === 'SAVED'">
         <a class="button"  :href="url + 'process/' + process.up_id + '/edit'">{{$t('edit')}}</a>
        
         <a class="button" @click="todo" disabled>{{$t('evaluate')}}</a>
      </div>
     

      <div v-else-if="process.status === 'WAITING'">
       <a class="button" :href="url + 'process/' + process.up_id + '/edit'">Edit</a>
       <a class="button" v-if="process.format.indexOf('sar') >= 0 " :disabled="!serviceOpen" @click="todo">{{$t('launch')}}</a>
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
        return this.process.s_status === 'ENABLED'
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
    todo () {
     
    }
  }
}
</script>
<style scoped>
</style>
