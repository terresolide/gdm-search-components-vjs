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
     "duplicate": "Duplicate",
     "debug": "Switch to debug",
     "run": "end of debug",
     "share_ciest2": "Share with CIEST2"
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
     "duplicate": "Dupliquer",
     "debug": "Passer en mode debug",
     "run": "Fin du debug" ,
     "share_ciest2": "Partager CIEST2"
   }
}
</i18n>
<template>
<span class="gdm-process-actions" v-if="process" >
      <div  v-if="submitting" class="gdm-searching"><i class="fa fa-circle-o-notch animated"></i></div>

      <div v-if="process.status === 'EVALUATED'">
         <a class="button" v-if="!back && url" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="launch" :class="{disabled: disabled || !hasCredit || !canEdit}"
         :disabled="disabled || !hasCredit">{{$t('launch')}}</a>
      </div>
       <div v-else-if="process.status === 'FAILED'">
        <a class="button" @click="duplicate" :class="{disabled: !canEdit}">{{$t('duplicate')}}</a>
      </div>
      <div v-else-if="process.status === 'INVALID'">
        <a class="button" v-if="!back && url"  :href="url + 'process/' + process.id + '/edit'" :class="{disabled: !canEdit}">{{$t('edit')}}</a>
      </div>
      <div v-else-if="process.status === 'CANCELED'">
         <a  style="display:none;" class="button" v-if="isOptic" @click="todo" :class="{disabled: disabled}"
          :disabled="disabled">{{$t('relaunch')}}</a>
      </div>
      <!--  PURGED NOTHING TO DO => CREATE NEW PROCESS WITH THIS-->
      <div v-else-if="process.status === 'PURGED' || process.status === 'ABORTED' || process.status === 'TERMINATED'">
         <a class="button" @click="duplicate"  :class="{disabled: !canEdit}">{{$t('duplicate')}}</a>
          <a class="button" v-if="!back && userId===process.userId && ciest2 && !isCiest2 && process.status==='TERMINATED'" @click="share"  :class="{disabled: !canEdit}">{{$t('share_ciest2')}}</a>
      </div>
       
      <div v-else-if="process.status === 'RUNNING' || process.status === 'PRE-RUN' || process.status === 'ACCEPTED'">
        <a class="button" @click="clickGetStatus" :class="{disabled: disabled}" :disabled="disabled">{{$t('refresh')}}</a>
        <a class="button"  @click="dismiss" :class="{disabled: disabled}" :disabled="disabled">
           <span>{{$t('abort')}}</span>
        </a>
        <a class="button" v-if="back" @click="switchDebug" :title="$t('debug')">
        <i class="fa fa-arrow-right"></i>
        DEBUG
        </a>
      </div>
      <div v-else-if="process.status === 'DEBUG'">
         <a class="button" v-if="back" @click="switchDebug" :title="$t('run')">
        <i class="fa fa-arrow-right"></i>
        DEBUG END
        </a>
      </div>
      <div v-else-if="process.status === 'SAVED'">
         <a class="button" v-if="!back && url" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="evaluate" :class="{disabled: disabled}" 
         :disabled="disabled || !canEdit">{{$t('evaluate')}}</a>
      </div>
      <div v-else-if="process.status === 'WAITING'">
	       <a class="button" v-if="!back && url" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
	       <a class="button" v-if="process.format.indexOf('sar') >= 0 " :class="{disabled: disabled || !hasCredit}"
	       :disabled="disabled || !hasCredit || !canEdit" @click="launch">
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
    ciest2: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number,
      default: null
    },
    back: {
      type: Boolean,
      default: false
    },
    process: {
      type: Object,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      submitting: false,
      status: null,
      timer: null,
      isCiest2: false,
      getCount: 0
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
      this.timer = null
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
        this.emitStatusChange(resp.body, 4)
      }, function (e) {
        var _this = this
        setTimeout(function () {
          _this.submitting = false
        }, 10000)
      })
    },
    getStatusInDepth () {
      this.getCount = this.getCount + 1
      if (this.getCount % 2 === 0) {
        var _this = this
        setTimeout(function () {
          _this.getStatus()
        }, 3000)
        return
      }
      this.$http.get(this.api + '/getStatusInDepth/' + this.process.id, {credentials: true})
      .then(function (resp) {
        this.emitStatusChange(resp.body, 10)
      }, function (e) {
        var _this = this
        setTimeout(function () {
          _this.submitting = false
        }, 10000)
      })
    },
    emitStatusChange (data, delay) {
      var _this = this
      var time = Math.floor(Math.random() * 5) + delay
      setTimeout(function () {
        _this.submitting = false
        _this.$emit('statusChange', data)
        _this.status = data.status
        _this.launchTimer()
      }, time * 1000)
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
      
    },
    share () {
      this.submitting = true
      this.$http.get(this.api + '/share/' + this.process.id, {credentials: true})
      .then(function (resp) {
        this.$emit('ownerChange', resp.body)
        this.isCiest2 = true
        this.submitting = false
      }, function (e) {
        this.submitting = false
      })
    },
    switchDebug() {
      // if process running and back
      var status = this.process.status === 'RUNNING' ? 'DEBUG' : 'RUNNING';
      this.$http.post(
          this.api.replace('api', 'scripts') + '/setStatus',
          {
            id: this.process.id,
            status: status,
            step: this.process.stepName,
            progress: this.process.progress,
            log: this.process.log
          },
          {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              credentials: true
           }
      ).then(function (resp) {
        if (resp.body.success) {
          var process = Object.assign(this.process, {status: status})
          console.log(process)
          this.$emit('statusChange', process)
        }
        this.submitting = false
        this.status = resp.body.status
        this.launchTimer()
      }, function (resp) {
        console.log('error request ', resp.status)
        
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
