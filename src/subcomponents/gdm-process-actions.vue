<i18n>
{
   "en":{
     "abort": "Abort",
     "confirm_abort": "This action is final.\nAre you sure you want to continue?",
     "refresh": "Refresh",
     "edit": "Edit",
     "launch": "Launch",
     "relaunch": "Relaunch",
     "stop": "Kill",
     "cancel": "Stop",
     "purge": "To trash",
     "evaluate": "Evaluate",
     "duplicate": "Duplicate"  
   },
   "fr":{
     "abort": "Abandonner",
     "confirm_abort": "Cette action est définitive.\nVoulez-vous continuer?",
     "refresh": "Actualiser",
     "edit": "Editer",
     "launch": "Lancer",
     "relaunch": "Relancer",
     "stop": "Détruire",
     "cancel": "Stopper",
     "purge": "Vider",
     "evaluate": "Evaluer",
     "duplicate": "Dupliquer"   
   }
}
</i18n>
<template>
<span class="gdm-process-actions" v-if="process" >
      <div  v-if="submitting" class="gdm-searching"><i class="fa fa-circle-o-notch animated"></i></div>
       <div v-if="process.status === 'ACCEPTED'">
        <a  class="button" @click="clickGetStatus" :class="{disabled: disabled}" :disabled="disabled">{{$t('refresh')}}</a>
      </div>
      <div v-else-if="process.status === 'EVALUATED'">
         <a class="button" v-if="!back && url" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="launch" :class="{disabled: disabled || !hasCredit}"
         :disabled="disabled || !hasCredit">{{$t('launch')}}</a>
      </div>
       <div v-else-if="process.status === 'FAILED'">
        <a class="button" @click="duplicate" >{{$t('duplicate')}}</a>
      </div>
      <div v-else-if="process.status === 'INVALID'">
        <a class="button" v-if="!back && url"  :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
      </div>
      <div v-else-if="process.status === 'CANCELED'">
         <a  style="display:none;" class="button" v-if="isOptic" @click="todo" :class="{disabled: disabled}"
          :disabled="disabled">{{$t('relaunch')}}</a>
      </div>
      <!--  PURGED NOTHING TO DO => CREATE NEW PROCESS WITH THIS-->
      <div v-else-if="process.status === 'PURGED' || process.status === 'ABORTED' || process.status === 'TERMINATED'">
         <a class="button" @click="duplicate" >{{$t('duplicate')}}</a>
      </div>
        <div v-else-if="process.status === 'PRE-RUN'">
        <a class="button" @click="getStatus" :class="{disabled: disabled}" :disabled="disabled">{{$t('refresh')}}</a>
       
      </div>
      <div v-else-if="process.status === 'RUNNING' || process.status === 'PRE-RUN' || process.status === 'ACCEPTED'">
        <a class="button" @click="clickGetStatus" :class="{disabled: disabled}" :disabled="disabled">{{$t('refresh')}}</a>
        <a class="button"  @click="dismiss" :class="{disabled: disabled}" :disabled="disabled">
           <span>{{$t('abort')}}</span>
        </a>
      </div>
      <div v-else-if="process.status === 'SAVED'">
         <a class="button" v-if="!back && url" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="evaluate" :class="{disabled: disabled}" 
         :disabled="disabled">{{$t('evaluate')}}</a>
      </div>
      <div v-else-if="process.status === 'WAITING'">
	       <a class="button" v-if="!back && url" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
	       <a class="button" v-if="process.format.indexOf('sar') >= 0 " :class="{disabled: disabled || !hasCredit}"
	       :disabled="disabled || !hasCredit" @click="launch">
	         {{$t('launch')}}
	       </a>
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
      submitting: false,
      status: null,
      timer: null
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
        return parseInt(this.process.cost) <= parseInt(this.process.quota)
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
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  created: function () {
    this.status = this.process.status
    this.$i18n.locale = this.lang
  },
  mounted () {
    this.launchTimer()
  },
  methods:{
    launchTimer () {
      if (!this.timer && ['ACCEPTED', 'PRE-RUN', 'RUNNING'].indexOf(this.status) >=0) {
        var func = this.getStatus
        this.timer = setInterval(func, 60000)
      }
      if (this.timer && ['ACCEPTED', 'PRE-RUN', 'RUNNING'].indexOf(this.status) < 0) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    clickGetStatus() {
      this.submitting = true
      this.getStatusInDepth()
    },
    getStatus () {
      this.$http.get(this.api + '/getStatus/' + this.process.id, {credentials: true})
      .then(function (resp) {
        this.$emit('statusChange', resp.body)
        this.submitting = false
        this.status = resp.body.status
        this.launchTimer()
      }, function (e) {
        this.submitting = false
      })
    },
    getStatusInDepth () {
      this.$http.get(this.api + '/getStatusInDepth/' + this.process.id, {credentials: true})
      .then(function (resp) {
        this.$emit('statusChange', resp.body)
        this.submitting = false
        this.status = resp.body.status
        this.launchTimer()
      }, function (e) {
        this.submitting = false
      })
    },
    launch () {
     this.submitting = true
     this.$http.post(
         this.api + '/launch/' + this.process.id,
         this.process,
         {
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           },
           credentials: true
         }
     ).then(function (resp) {
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
      if (!window.confirm(this.$i18n.t('confirm_abort'))) {
        return
      }
      this.submitting = true
      this.$http.get(this.api + '/dismiss/' + this.process.id, {credentials: true})
      .then(function (resp) {
        this.$emit('statusChange', resp.body)
        this.submitting = false
      }, function (e) {
        this.submitting = false
      })
    },
    duplicate () {
      this.submitting = true
      this.$http.post(
          this.api + '/duplicate/' + this.process.id,
          this.process,
          {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              credentials: true
           }
      ).then(function (resp) {
        this.$emit('duplicate', resp.body)
        this.submitting = false
      }, function (resp) {
        console.log('error request ', resp.status)
        this.submitting = false
      })
      
    }
  }
}
</script>
<style scoped>
.gdm-process-actions .gdm-searching {
  position:fixed;
  color: white;
  text-shadow: 0 0 1em black;
  top:20%;
  left:50%;
  z-index:30;
}
.gdm-searching i {
  font-size:3rem;
}
@keyframes spin { 
  from { 
      transform: rotate(0deg); 
  } to { 
      transform: rotate(360deg); 
  }
}
.fa-spinner.animated,
.fa-circle-o-notch.animated{
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}
/*
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
  }*/

</style>
