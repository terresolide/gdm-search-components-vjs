<template>
 <div class="gdm-publish">
  <div v-if="running" class="gdm-processing fa fa-spinner fa-spin fa-3x fa-fw running" ></div>
   <h1 v-if="type === 'insert'">Catalogue FormaTerre - publication du job N°{{processId}} &laquo;{{this.post.title.fr }}&raquo;</h1>
   <h1 v-else>Catalogue FormaTerre - M.a.j des métadonnées du job N°{{ processId }} - {{ this.post.title.fr }}</h1>
   <em style="display:block;">Une grande partie des métadonnées provient des informations sur le calcul et du backup_product.json (emprise géographique, dates, liens...) mais ces informations sont insuffisantes
    pour   l'indexation de vos produits dans le catalogue FormaTerre et par suite celui de DataTerra<br><br>
    Nous vous encourageons donc à compléter au mieux les informations ci-dessous.<br>
    <div v-if="metaUrl">
      Des fiches de métadonnées ont été publiées pour ce job: <a :href="metaUrl" target="_blank">Fiche de métadonnées racine enregistrée</a>
    </div>
    <div v-if="!metaUrl">
      <br>Vous pouvez dans un premier temps sauvegarder les métadonnées et lorsque vous êtes satisfait publier dans le catalogue FormaTerre.
      <br>Un ensemble de fiches de métadonnées sera généré:
         <ul>
           <li>une fiche parent comprenant un ensemble de fiches enfants:
              <ul>
                 <li>une fiche par interférogramme (pour toutes les versions de l'interférogramme: enroulé, déroulé, filtré...)</li>
                 <li>une fiche pour les données auxiliaires</li>
                 <li>et s'il existe une série temporelle, une fiche pour la série temporelle</li>
              </ul>
           </li>
     
         </ul>
      Une fois publié, vous pourrez toujours modifier ces informations. 
     </div>
   </em>
   <div style="color:darkred;margin:10px 0;border:1px solid darkred;padding:10px;display:block;max-width:900px;">
    <i class="fa fa-exclamation-triangle" style="vertical-align:top;width:30px;"></i> 
    <div style="display:inline-block;width:calc(100% - 50px);">
      <div v-if="errorGn" style="margin-bottom:5px;">L'application a renvoyé le message d'erreur suivant: {{ errorGn }}. 
        <br>Vous ne pourrez pas publier  dans le catalogue FormaTerre pour le moment, mais vous pouvez toujours enregistrer les informations auprès de GDM et finaliser plus tard.</div>
      <div v-if="errorProcess" style="margin-bottom:5px;">{{ errorProcess }}</div>
      <div v-if="!errorProcess">Vous devez vous assurer que le répertoire des résultats est <b>pérenne</b>! 
        <div v-if="resultDir && !errorProcess">Le répertoire enregistré en DB est: <br><a :href="resultDir" target="_blank">{{ resultDir }}</a> </div>
      </div>
    </div>

  </div>
  <div v-if="running">En cours</div>
  <div style="border:1px solid darkgrey;padding:10px; max-width:900px;box-shadow: 0 1px 5px rgba(0,0,0,.65);">
     <div style="text-align:right;">
      <button class="btn btn-publish" @click="save" :disabled="errorProcess || running" title="Enregistrer les informations en interne">Sauvegarder</button>
      <button class="btn btn-publish" @click="publish" :disabled="errorGn || errorProcess || running" title="Publier dans le catalogue FormaTerre">
        <template v-if="metaUrl">Modifier dans le catalogue</template> 
        <template v-else >Publier dans le catalogue</template>
      </button>
     </div>
     <h2>Titre principal</h2> 
     <div style="margin-left:10px;">
         <div style="margin-bottom:5px;"><span class="lang-label">FR: </span>GDM-SAR-In <input type="text" v-model="post.title.fr" />
           collection d'interférogrammes<span v-if="hasSerie"> et série temporelle</span> {{temporal.fr}}  </div>
         <div><span class="lang-label">EN: </span>GDM-SAR-In <input type="text" v-model="post.title.en" /> 
           collection of interferograms<span v-if="hasSerie"> and time serie</span> {{ temporal.en }} </div>
     </div>
  
     <h2>Objectif</h2>
     <div style="margin-left:10px;">
        <div><span class="lang-label">FR: </span><textarea v-model="post.purpose.fr" style="vertical-align: top;"></textarea></div> 
        <div><span class="lang-label">EN: </span><textarea v-model="post.purpose.en" style="vertical-align: top;"></textarea></div> 
      </div>
      <h2>Mots-clés</h2>
      {{ post.keywords }}
      <formaterre-keywords ref="keywords" v-model="post.keywords" :recommanded="recommanded" :excluded="excluded">Complétez les informations par des mots-clés de thésaurus:<ul>
        <li>Discipline</li>
        <li>Objet d'intérêt</li>
      </ul></formaterre-keywords>
   </div>
 </div>
</template>
<script>
// import GdmKeywords from './subcomponents/gdm-keywords.vue'
import FormaterreKeywords from 'formaterre-keywords-vjs/src/FormaterreKeywords.vue'
export default {
  name: 'GdmPublish',
  components: {
    FormaterreKeywords
  },
  props: {
    
    processId: {
      type: Number,
      default: null
    },
    geonetwork: {
      type: String,
      default: null
    },
    api: {
      type: String,
      default: 'https://gdm.formater/api'
    }
  },
  created () {
    if (!this.geonetwork) {
      this.errorGn = 'PAS DE GEONETWORK CONFIGURÉ'
    }
    this.getProcess()
  },
  data () {
    return {
      errorGn: null,
      errorProcess: null,
      resultDir: null,
      process: null,
      metaUrl: null,
      hasSerie: false,
      type: 'insert',
      running: null,
      taskId: null,
      count: 0,
      temporal: {
        fr: '',
        en: ''
      },
      recommanded: ['external.discipline.formater-discipline', 'external.theme.formater-foi-gn'],
      excluded: ['external.dataCentre.formater-distributor'],
      fixed: [],
      post: {
        title: {fr: '', en: ''},
        purpose: {fr: '', en: ''},
        keywords: {thesaurus: {'external.platform.formater-platform-gn': [{
                value: 'SENTINEL-1',
                values: {
                  fr: 'SENTINEL-1',
                  en: 'SENTINEL-1',
                },
                 uri: 'https://service.poleterresolide.fr/voc/platform/P010100'
              }]}, free: {}}
        
      }
    }
  },
  methods: {
    
    getMetadata () {
      this.$http.get(this.api + '/process/' + this.processId + '/catalog', {credentials: true})
      .then(resp => {
              this.metaUrl = resp.body.url
      }, resp => {
        this.errorGn = resp.body.error
      })
    },
    treatmentProcess(resp) {
      var json = resp.body
       console.log(resp)
       if (!json.result) {
         this.errorProcess = 'Aucun résultat à publier pour ce job'
         return
       }
       this.resultDir = json.result.dir
       if (json.result['series']) {
         this.hasSerie = true
       } else {
         // vieux format de résultat!!
         for(var key in json.result) {
           if (key.indexOf('iw') >= 0) {
             if (json.result[key].Time_Serie) {
               this.hasSerie = true
             }
           }
         }
       }
       this.getMetadata()
       if (json.metadata) {
         this.post = Object.assign(this.post,json.metadata)
       }
       this.temporal = {
         fr: json.feature.properties.temporalExtent[0].substring(0,10) + ' à ' + json.feature.properties.temporalExtent[1].substring(0,10),
         en: json.feature.properties.temporalExtent[0].substring(0,10) + ' to ' + json.feature.properties.temporalExtent[1].substring(0,10)
       }
       if (json.metadata) {
         console.log('update')
         this.type = 'update'
         var keywords = json.metadata.keywords
         console.log(keywords)
         if (keywords.thesaurus.ron) {
          console.log(keywords.thesaurus.ron)
          keywords.thesaurus['local.theme.ron'] = [{
            vocab: 'local.themes.ron',
            uri: keywords.thesaurus.ron[0].uri,
            value: keywords.thesaurus.ron[0].fr,
            values: {
              fr: keywords.thesaurus.ron[0].fr,
              en: keywords.thesaurus.ron[0].en
            }
          }]
          console.log(keywords.thesaurus['local.theme.ron'])
          delete keywords.thesaurus.ron
         }
         if (keywords.thesaurus.discipline) {
            keywords.thesaurus['external.discipline.formater-discipline'] = []
            keywords.thesaurus.discipline.forEach(function (item) {
              var kw = {
                uri: item.uri,
                value: item.fr,
                values: {fr: item.fr, en: item.en},
                vocab: 'external.discipline.formater-discipline'
              }
              keywords.thesaurus['external.discipline.formater-discipline'].push(kw)
            })
            delete keywords.discipline
         }
         this.post.keywords = keywords
         if (json.metadata.title.fr) {
             this.post.title = json.metadata.title
         } else {
           this.post.title = {
             fr: json.metadata.title,
             en: json.metadata.title
           }
         }
         this.post.goal = json.metadata.goal
       } else {
         this.post.title = {
           fr: json.feature.properties.processusName,
           en: json.feature.properties.processusName
         }
         var rOrbit = json.feature.properties.parameters.relative_orbit
         var ron = rOrbit[0].toUpperCase() + rOrbit.slice(1).padStart(3, 0)
      
         var keywords = {
           thesaurus: {
             'local.theme.polarisation': [
                {
                  value: json.feature.properties.parameters.polarisation.toUpperCase(),
                  values: {
                    fr: json.feature.properties.parameters.polarisation.toUpperCase(),
                    en: json.feature.properties.parameters.polarisation.toUpperCase()
                  }
                }
             ],
             'local.theme.ron': [
                {
                  vocab: 'local.theme.ron',
                  value: ron,
                  values: { 
                    fr: ron,
                    en: ron
                  }
                }
             ],
             'external.platform.formater-platform-gn': [
              {
                value: 'SENTINEL-1',
                values: {
                  fr: 'SENTINEL-1',
                  en: 'SENTINEL-1',
                },
                 uri: 'https://service.poleterresolide.fr/voc/platform/P010100'
              }
             ]
                 
           },
           free: {}
         }
       }
      //  var vocabularies = this.$refs.keywords.vocabularies;
      //  vocabularies.forEach(function (vocab) {
      //    console.log(vocab)
      //    if (!keywords.thesaurus[vocab.id]) {
      //      keywords.thesaurus[vocab.id] = []
      //    }
      //  })
      //  keywords.thesaurus.polarisation[0].disabled = true
      //  keywords.thesaurus.ron[0].disabled = true
      //  keywords.thesaurus.platform[0].disabled = true
      //  var types = this.$refs.keywords.types
      
       if (!keywords.free) {
         keywords.free = {}
       } else {
          var keys = Object.keys(types)
          for(var key in keywords.free) {
            if (keys.indexOf(key) < 0) {
              keywords.free.theme.concat(keywords.free[key])
            }
          }
       }
       for(var type in types) {
          if (!keywords.free[type]) {
            keywords.free[type] = []
          }
        }
       this.post.keywords = keywords
    },
    getProcess() {
      this.$http.get(this.api + '/process/' + this.processId, {credentials: true})
      .then(
        resp => { this.treatmentProcess(resp)},
        resp => { if (resp.body.error) {
            this.errorProcess = 'Le serveur a répondu lors de l\'accès au job: ' + resp.body.error
          } else {
            this.errorProcess = 'Le serveur a répondu lors de l\'accès au job: UNKNOWN ERROR' 
          }
      })
    },
    getTask () {
      if (!this.taskId) {
        return
      }
      this.$http.get(this.api + '/tasks/' + this.taskId, {credentials: true})
      .then(resp => {
        if (resp.body.task && ['COMPLETED', 'FAILED'].indexOf(resp.body.task.tks_status) >= 0) {
          if (this.running) {
            clearInterval(this.running)
            this.running = null
          }
          this.taskId = null
        }
      })
    },
    publish () {
      if (this.running) {
        return
      }
      this.$http.put(this.api + '/process/' + this.processId + '/catalog',
        this.post,
        {
          credentials: true,
          headers: {'Content-Type': 'application/json'}
        }
      ).then(
        resp => {
          
          this.taskId = resp.body.task
          var self = this
          this.running = setInterval(function (){
            self.getTask()
          }, 10000)
        },
        resp => {console.log('pb publish')}
      )
    },
    save () {
      this.$http.post(this.api + '/process/' + this.processId + '/catalog',
        this.post,
        {
          credentials: true,
          headers: {'Content-Type': 'application/json'}
        }
      ).then(
        resp => {console.log()},
        resp => {console.log('pb')}
      )
    }
  }
}
</script>
<style>
.gdm-processing {
    position:fixed;
    top: 48%;
    left:50%;
    color:white;
    text-shadow:1px 1px 3px #333, -1px -1px 3px #333;
    z-index:2001;
  }

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.btn-publish {
  color: #fff;
  background-color: #8b0000;
  border-color: #8b0000;
}
.btn-publish:disabled {
  opacity:0.6;
  pointer-events: none;
}
.btn-publish:hover {
  background-color: #7d0e0e;
  border-color: #9c0000;
}
.btn-publish:focus {
  box-shadow: 0 0 0 .2rem rgba(139,0,0,.5);
}
.gdm-publish {
  font-family: Arial, Helvetica, sans-serif;
}
.gdm-publish h1, .gdm-publish h2, .gdm-publish h3 {
  color: darkred;
}
.gdm-publish h1 {
  text-transform:uppercase;
}
.lang-label {
  color:#333;
  font-weight:700;
  display:inline-block;
  min-width:50px;
}
.gdm-publish input[type=text] {
  outline-color: darkgrey;
  font-family: Arial, Helvetica, sans-serif;
  font-size:1rem;
  color: #333;
}
.gdm-publish textarea {
  min-width: 700px;
  outline-color: darkgrey;
}
</style>