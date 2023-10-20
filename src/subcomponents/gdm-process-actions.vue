<i18n>
{
   "en":{
     "abort": "Abort",
     "before_get_result": "You will download the backup_product.json file from the results directory.\nIt may not exist yet!\nDo you want to continue?",
     "confirm_abort": "This action is final.\nAre you sure you want to continue?",
     "continue_publish": "You request a publication of your results.\nIf this request is accepted, your results will appear from the interface under the \"public results\" tab.\nDo you want to continue?",
     "refresh": "Refresh",
     "edit": "Edit",
     "launch": "Launch",
     "relaunch": "Relaunch",
     "stop": "Kill",
     "cancel": "Stop",
     "purge": "To trash",
     "evaluate": "Evaluate",
     "error_occured": "An error has occured",
     "duplicate": "Duplicate",
     "debug": "Switch to debug",
     "get_result": "Get result",
     "recorded_request": "Your request has been saved.\nIt will be processed as quickly as possible by our service.",
     "run": "end of debug",
     "share": "Share",
     "publish": "Publish"
   },
   "fr":{
     "abort": "Abandonner",
     "before_get_result": "Vous allez télécharger le fichier backup_product.json du répertoire des résultats.\nIl est possible qu'il n'existe pas encore!\nVoulez-vous continuer?",
     "confirm_abort": "Cette action est définitive.\nVoulez-vous continuer?",
     "continue_publish": "Vous demandez une publication de vos résultats.\nSi cette demande est acceptée, vos résultats apparaîtront depuis l'interface sous l'onglet \"résultats publics\".\nVoulez-vous continuer?",
     "refresh": "Actualiser",
     "edit": "Editer",
     "launch": "Lancer",
     "relaunch": "Relancer",
     "stop": "Détruire",
     "cancel": "Stopper",
     "purge": "Vider",
     "evaluate": "Evaluer",
     "error_occured": "Une erreur s'est produite",
     "duplicate": "Dupliquer",
     "debug": "Passer en mode debug",
     "get_result": "Obtenir les résultats",
     "recorded_request": "Votre demande a été enregistrée.\nElle sera traitée le plus rapidement possible par nos services.",
     "run": "Fin du debug" ,
     "share": "Partager",
     "publish": "Publier"
   }
}
</i18n>
<template>
<span class="gdm-process-actions" v-if="process && (userId || back)" >
      <div v-show="showShare" class="gdm-share" >
	      <h3 :style="{color:color}">{{$t('share')}}</h3>
	      Avec les membres de l'équipe
	      <select v-model="shared">
	         <option v-for="team in teams" :value="team">{{team}}</option>
	      </select>
	      <div style="text-align:right;margin:10px 20px;">
	         <a class="button small" @click="showShare=false">Annuler</a>
	         <a class="button small"  @click="share">{{$t('share')}}</a>
	      </div>
      </div>
      <div v-if="showPublish" class="publish-box">
        <div style="float:right;"><span class="gdm-close fa fa-close" @click="showPublish=false"></span></div>
        <h3 :style="{color:color}">Entrez l'url du nouveau répertoire</h3>
        <input v-model="resultUrl" type="url"  style="min-width:380px;" @keyup="validUrl"/>
         <input type="button" class="button" @click="publish" :disabled="invalidUrl" :value="process.isExample ? $t('save') : $t('publish')" />
         
      </div>
      <span  v-if="submitting" class="gdm-searching"><i class="fa fa-circle-o-notch animated"></i></span>
      <a class="button" v-if="userId===process.userId && teams.length > 0 && !process.team" @click="showShare=true"  >{{$t('share')}}</a>
      <span v-if="process.status === 'EVALUATED'">
         <a class="button" v-if="!back && url && canEdit" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="launch" :class="{disabled: disabled || !hasCredit || !canEdit}"
         :disabled="disabled || !hasCredit">{{$t('launch')}}</a>
      </span>
       <span v-else-if="process.status === 'FAILED'">
        <a class="button" @click="duplicate" :class="{disabled: !canEdit}">{{$t('duplicate')}}</a>
      </span>
      <span v-else-if="process.status === 'INVALID'">
        <a class="button" v-if="!back && url  && canEdit"  :href="url + 'process/' + process.id + '/edit'" :class="{disabled: !canEdit}">{{$t('edit')}}</a>
      </span>
      <span v-else-if="process.status === 'CANCELED'">
         <a  style="display:none;" class="button" v-if="isOptic" @click="todo" :class="{disabled: disabled}"
          :disabled="disabled">{{$t('relaunch')}}</a>
      </span>
  
      <!--  PURGED NOTHING TO DO => CREATE NEW PROCESS WITH THIS-->
      <span v-else-if="process.status === 'PURGED' || process.status === 'ABORTED' || process.status === 'TERMINATED'">
         <a class="button" @click="duplicate"  :class="{disabled: !canEdit}">{{$t('duplicate')}}</a>
         <a class="button" v-if="back && process.status ==='TERMINATED' && !process.isExample" @click="showPublish=true"  :class="{disabled: !canEdit}">{{$t('publish')}}</a>
          <a class="button" v-if="back && process.isExample && process.status ==='TERMINATED'" @click="showPublish=true">Modifier url résultat</a>
         <!--  for SAR TERMINATED process -->
         <span v-if="process.group === 'SAR' && process.status === 'TERMINATED'">
	         <a class="button" v-if="!back && userId === process.userId && !process.isExample" 
	         @click="requestPublish" :class="{disabled: process.keep}">{{$t('publish')}}</a>
           <a class="button" v-if="back && !process.isExample && !process.keep" @click="changeKeep">Ne pas purger</a>
           <a class="button" v-else-if="back && !process.isExample && process.keep" @click="changeKeep">À purger</a>
           <!--  button purge -->
          <a class="button" v-if="!process.isExample && !process.keep" @click="purge"  :class="{disabled: !canEdit}">
           <i class="fa fa-trash"></i> {{$t('purge')}}</a>
        
          <!--  GET RESULT IF NOT EXISTS -->
          <a class="button" v-if="process.result && !process.result.bbox" @click="getResult" :class="{disabled: searchResult}">{{$t('get_result')}}</a>
       </span>
      </span>
       
      <span v-else-if="process.status === 'RUNNING' || process.status === 'PRE-RUN' || process.status === 'ACCEPTED'">
        <a class="button" @click="clickGetStatus" :class="{disabled: disabled}" :disabled="disabled">{{$t('refresh')}}</a>
        <a class="button"  @click="dismiss" :class="{disabled: disabled}" :disabled="disabled">
           <span>{{$t('abort')}}</span>
        </a>
         <a class="button" @click="duplicate"  :class="{disabled: !canEdit}">{{$t('duplicate')}}</a>
        
        <a class="button" v-if="back" @click="switchDebug" :title="$t('debug')">
        <i class="fa fa-arrow-right"></i>
        DEBUG
        </a>
      </span>
      <span v-else-if="process.status === 'DEBUG'">
         <a class="button" v-if="back" @click="switchDebug" :title="$t('run')">
        <i class="fa fa-arrow-right"></i>
        DEBUG END
        </a>
      </span>
      <span v-else-if="process.status === 'SAVED'">
         <a class="button" v-if="!back && url && canEdit" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
         <a class="button" @click="evaluate" :class="{disabled: disabled}" 
         :disabled="disabled || !canEdit">{{$t('evaluate')}}</a>
      </span>
      <span v-else-if="process.status === 'WAITING'">
	       <a class="button" v-if="!back && url  && canEdit" :href="url + 'process/' + process.id + '/edit'">{{$t('edit')}}</a>
	       <a class="button" v-if="process.format.indexOf('sar') >= 0 " :class="{disabled: disabled || !hasCredit}"
	       :disabled="disabled || !hasCredit || !canEdit" @click="launch">
	         {{$t('launch')}}
	       </a>
      </span>
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
    teams: {
      type: Array,
      default: () => []
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
      shared: null,
      showShare: false,
      isExample: false,
      resultUrl: null,
      showPublish: false,
      invalidUrl: true,
      getCount: 0,
      searchResult: false,
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
    this.isExample = this.process.isExample
    if (this.teams.length > 0) {
      this.shared = this.teams[0]
    }
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
    getResult () {
      if (!window.confirm(this.$i18n.t('before_get_result'))) {
        return
      }
      this.searchResult = true
      this.submitting = true
      this.$http.post(this.api + '/process/' + this.process.id + '/result',{}, {credentials: true})
      .then(function (resp) {
        this.$emit('processChange', resp.body)
        this.submitting = false
      }, function (e) {
        this.submitting = false
      })
    },
    getStatus () {
      this.$http.get(this.api + '/process/' + this.process.id + '/status', {credentials: true})
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
      this.$http.post(this.api + '/process/' + this.process.id + '/status', [], {credentials: true})
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
         this.api + '/process/' + this.process.id + '/start',
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
      this.$http.post(this.api + '/process/' + this.process.id + '/evaluate', [], {credentials: true})
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
      this.$http.post(this.api + '/process/' + this.process.id + '/dismiss', [], {credentials: true})
      .then(function (resp) {
        this.$emit('statusChange', resp.body)
        this.submitting = false
      }, function (e) {
        this.submitting = false
      })
    },
    changeKeep () {
      this.submitting = true
      this.$http.post(
          this.api + '/process/' + this.process.id + '/keep',
          {keep: !this.process.keep },
          {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              credentials: true
           }
      ).then(function (resp) {
        if (resp.body.success) {
          this.$emit('keptProcess', !this.process.keep)
        } else {
          if (resp.body.error) {
            alert(this.$i18n.t('error_occured') + ': ' +  resp.body.error)
          }
        }
        this.submitting = false
      }, function (resp) {
        console.log('error request ', resp.status)
        this.submitting = false
      })
    },
    duplicate () {
      this.submitting = true
      this.$http.post(
          this.api + '/process/' + this.process.id + '/duplicate',
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
    publish () {
      this.submitting = true
      this.$http.post(
          this.api + '/process/' + this.process.id + '/publish',
          {url: this.resultUrl},
          {credentials: true, emulateJSON: true})
      .then(function (resp) {
        location.reload()
      }, function (e) {
        this.submitting = false
        alert(this.$i18n.t('error_occured') + ': DISCONNECTED ?')
      })
    },
    purge () {
      this.submitting = true
      this.$http.post(
          this.api + '/process/' + this.process.id + '/purge',
          {id: this.process.id},
          {credentials: true, emulateJSON: true})
      .then(function (resp) {
        this.submitting = false
        if (resp.body && resp.body.error) {
          console.log(resp.body.error)
          alert(this.$i18n.t('error_occured') + ': ' + resp.body.error)
        } else {
         location.reload()
        }
      }, function (e) {
        this.submitting = false
        alert(this.$i18n.t('error_occured') + ': DISCONNECTED ?')
      })
    },
    requestPublish () {
      if (!window.confirm(this.$i18n.t('continue_publish'))) {
        return
      }
      this.submitting = true
      this.$http.get(
          this.api.replace('api', 'requests') + '/publish/' + this.process.id,
          {headers: { 'accept-language': this.lang}, credentials: true, emulateJSON: true})
      .then(function (resp) {
         console.log(resp)
         if(resp.body && resp.body.success) {
           alert(this.$i18n.t('recorded_request'))
           this.$emit('keptProcess', true)
         } else {
           if (resp.body.error) {
             alert(this.$i18n.t('error_occured') + ': ' +  resp.body.error)
           }
         }
         this.submitting = false
      }, function (e) {
        this.submitting = false
        alert(this.$i18n.t('error_occured'))
      })
    },
    share () {
      this.submitting = true
      this.$http.post(this.api + '/process/' + this.process.id + '/share', {team: this.shared}, {credentials: true})
      .then(function (resp) {
        this.$emit('teamChange', resp.body)
        this.submitting = false
        this.showShare = false
      }, function (e) {
        this.submitting = false
        this.showShare = false
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
    },
    validUrl (e) {
      var invalid = false
     if (!this.newUrl && this.process.isExample) {
       invalid = true
     }
     this.invalidUrl = invalid && !e.target.validity.valid
    }
  }
}
</script>
<style scoped>
.gdm-close {
  padding: 2px 5px;
  cursor: pointer;
  pointer-events:auto;
  border: 1px dotted white;
}
.gdm-close.fa-close:hover {
  border-color: grey;
}
.gdm-process-actions {
  position:relative;
}
.gdm-process-actions .gdm-searching {
  position:fixed;
  color: white;
  text-shadow: 0 0 1em black;
  top:20%;
  left:50%;
  z-index:30;
}
.publish-box,
.gdm-share {
     position:absolute;
     padding: 0 10px 10px 10px;
     border:2px solid #CCC;
     border-radius: 5px;
     background: white;
     top:0;
     right:0;
     text-align:left;
     min-width:450px;
     box-shadow: 3px 3px 6px grey;
     z-index:2000;
}
.publish-box h3 {
  margin: 10px 0;
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
