<i18n>
{
   "en":{
     "refresh": "Refresh",
     "edit": "Edit",
     "launch": "Launch",
     "relaunch": "Relaunch",
     "stop": "Kill",
     "cancel": "Stop",
     "purge": "To trash",
     "evaluate": "Evaluate"   
   },
   "fr":{
     "refresh": "Actualiser",
     "edit": "Editer",
     "launch": "Lancer",
     "relaunch": "Relancer",
     "stop": "Détruire",
     "cancel": "Stopper",
     "purge": "Vider",
     "evaluate": "Evaluer"   
   }
}
</i18n>
<template>
<span class="gdm-process-actions" v-if="process" >
     <div v-if="back">
    </div>
    <div v-else>
       <div v-if="process.status === 'ACCEPTED'">
        <a  class="button" @click="getStatus" :class="{disabled: disabled}" :disabled="disabled">{{$t('refresh')}}</a>
      </div>
      <div v-else-if="process.status === 'EVALUATED'">
         <a class="button" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="launch" :class="{disabled: disabled || !hasCredit}"
         :disabled="disabled || !hasCredit">{{$t('launch')}}</a>
      </div>
       <div v-else-if="process.status === 'FAILED'">
         <a class="button" @click="purge" disabled>{{$t('purge')}}</a>
      </div>
      <div v-else-if="process.status === 'INVALID'">
        <a class="button" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
      </div>
      <div v-else-if="process.status === 'CANCELED'">
         <a class="button" v-if="isOptic" @click="todo" :class="{disabled: disabled}"
          :disabled="disabled">{{$t('relaunch')}}</a>
      </div>
      <!--  PURGED NOTHING TO DO -->
      <div v-else-if="process.status === 'RUNNING'">
        <a class="button" @click="getStatus" :class="{disabled: disabled}" :disabled="disabled">{{$t('refresh')}}</a>
        <a class="button" @click="dismiss" :class="{disabled: disabled}" :disabled="disabled">
           <span v-if="process.format.indexOf('sar') >= 0">{{$t('stop')}}</span>
           <span v-else >{{$t('cancel')}}</span>
        </a>
      </div>
      <div v-else-if="process.status === 'SAVED'">
         <a class="button"  :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="evaluate" :class="{disabled: disabled}" 
         :disabled="disabled">{{$t('evaluate')}}</a>
      </div>
      <div v-else-if="process.status === 'WAITING'">
	       <a class="button" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
	       <a class="button" v-if="process.format.indexOf('sar') >= 0 " :class="{disabled: disabled || !hasCredit}"
	       :disabled="disabled || !hasCredit" @click="launch">
	         {{$t('launch')}}
	       </a>
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
      default: ''
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
      submitting: false
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
    },
    disabled () {
      return  (!this.serviceOpen || this.submitting)
    }
  },
  destroyed: function() {
  },
  created: function () {
     this.$i18n.locale = this.lang
  },
  mounted: function(){
  },
  methods:{
    getStatus () {
      this.submitting = true
      this.$http.get(this.api + '/getStatus/' + this.process.id, {credentials: true})
      .then(function (resp) {
        this.$emit('statusChange', resp.body)
        this.submitting = false
      }, function (e) {
        this.submitting = false
      })
    },
    launch () {
     this.submitting = true
     this.$http.get(this.api + '/launch/' + this.process.id, {credentials: true})
     .then(function (resp) {
       this.$emit('processChange', resp.body)
       this.submitting = false
     }, function (e) {
       this.submitting = false
     })
    },
    evaluate () {
      this.submitting = true
      this.$http.get(this.api + '/evaluate/' + this.process.id, {credentials: true})
      .then(function (resp) {
        this.$emit('statusChange', resp.body)
        this.submitting = false
      }, function (e) {
        this.submitting = false
      })
    },
    dismiss () {
      
    }
  }
}
</script>
<style scoped>

a.button{
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
   opacity: 0.8
  }
 a.button:hover{
   background: #f0f0e6;
   text-decoration: none;
   opacity: 1
 }

 a.button:disabled,
 a.button.disabled {
    color: #999;
    pointer-events: none;
  }

</style>
