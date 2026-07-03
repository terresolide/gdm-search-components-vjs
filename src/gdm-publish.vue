<i18n>
  {
    "fr": {
      "keywords": "Mots-clés",
      "main_title": "Titre principal",
      "ongoing": "En cours",
      "publish": "Demander la publication",
      "purpose": "Objectif",
      "save": "Sauvegarder"
    },
    "en": {
      "keywords": "Keywords",
      "main_title": "Main title",
      "ongoing": "On going",
      "publish": "Request for publication",
      "purpose": "Purpose",
      "save": "Save"
    }
  }
</i18n>
<template>
 <div class="gdm-publish">
  <div v-if="saving" class="gdm-processing fa fa-spinner fa-spin fa-3x fa-fw running" ></div>
   <h1 v-if="lang === 'fr'">Publication du job N°{{processId}} &laquo;{{this.post.title.fr }}&raquo;</h1>
   <h1 v-else>Publication of job N°{{processId}} &laquo;{{this.post.title.en }}&raquo;</h1>
   <template v-if="!back">
      <em style="display:block;margin-bottom:10px;">

        <template v-if="lang === 'fr'">Une grande partie des métadonnées provient des informations sur le calcul et des résultats (emprise géographique, dates, liens...) mais ces informations sont insuffisantes
        pour   l'indexation de vos produits dans le catalogue FormaTerre et par suite celui de DataTerra<br><br>
        Nous vous encourageons donc à compléter au mieux les informations ci-dessous.<br>
        Vous pouvez simplement "Sauvegarder" et revenir plus tard. Attention, toutefois, les résultats seront effacés le <span v-if="process && process.datePurge">{{ str2date(process.datePurge)}}</span> et toute demande de publication sera impossible!
        </template>
        <template v-else>
        A large portion of the metadata is derived from the computation details and results (geographic extent, dates, links, etc.), but this information is insufficient
        for indexing your products in the FormaTerre catalog—and consequently the DataTerra catalog.<br><br>
        We therefore encourage you to provide as much detail as possible in the information below.<br>
        You can simply "Save" and return later. Please note, however, that the results will be deleted on <span v-if="process && process.datePurge">{{ str2date(process.datePurge)}}</span>, and it will no longer be possible to submit a publication request!
        </template>
      </em>
   </template>
  
  <div style="border:1px solid darkgrey;padding:10px;box-shadow: 0 1px 5px rgba(0,0,0,.65);">
     <div style="text-align:right;">
      <button class="btn btn-publish" @click="save" :disabled="saved || saving" >{{$t('save')}}</button>
      <button v-if="back" class="btn btn-publish" >
        Valider
      </button>
      <button v-else class="btn btn-publish" @click="publish" :disabled="requestPublish" >
        {{$t('publish')}}
      </button>
     </div>
     <h2>{{$t('main_title')}}</h2> 
     <div style="margin-left:10px;">
         <div style="margin-bottom:5px;"><span class="lang-label">FR: </span>GDM-SAR-In <input type="text" v-model="post.title.fr" />
           collection d'interférogrammes<span v-if="hasSerie"> et série temporelle</span> {{temporal.fr}}  </div>
         <div><span class="lang-label">EN: </span>GDM-SAR-In <input type="text" v-model="post.title.en" /> 
           collection of interferograms<span v-if="hasSerie"> and time serie</span> {{ temporal.en }} </div>
     </div>
  
     <h2>{{$t('purpose')}}</h2>
     <div style="margin-left:10px;">
        <div><span class="lang-label">FR: </span><textarea v-model="post.purpose.fr" style="vertical-align: top;"></textarea></div> 
        <div><span class="lang-label">EN: </span><textarea v-model="post.purpose.en" style="vertical-align: top;"></textarea></div> 
      </div>
      <h2>{{$t('keywords')}}</h2>
       <em>
        <template v-if="lang === 'fr'">Il est important de compléter au mieux les mots-clés. Ils sont utilisés pour l'indexation des fiches de métadonnées et favorisent la visibilité de vos données.<br />
      La classification principale est obligatoire. Nous imposons déjà le mot-clé "Déformation du sol", mais vous pouvez en choisir d'autres.<br />
      Une partie des mots-clés a été automatiquement prédéfinie comme la polarisation, le type de produits ou le fournisseur... 
       </template>
        <template v-else>
       It is important to fill in the keywords as thoroughly as possible. They are used to index metadata records and help boost the visibility of your data.<br />
      The primary classification is mandatory. We have already set the keyword "Ground deformation," but you may select others.<br />
      Some keywords have been predefined automatically, such as polarization, product type, or provider...
       </template>
      </em>
  
      <formaterre-keywords ref="keywords" :lang="lang" v-model="post.keywords" :recommanded="recommanded" :excluded="excluded" :fixed="fixed">
        <template v-if="lang === 'fr'">Ci-dessous vous pouvez rechercher des mots-clés dans les thésaurus/ontologies utilisés par FormaTerre.<br />
          Si vous ne trouvez pas le terme recherché, vous pouvez saisir un <b>mot-clé libre</b>.<br />Vous pouvez même suggérer qu'il soit ajouté à une ontologie.
        </template>
      <template v-else>
        Below, you can search for keywords within the thesauri/ontologies used by FormaTerre.<br />
          If you do not find the term you are looking for, you can enter a <b>free-text keyword</b>.<br />You can even suggest adding it to an ontology.
      </template>
      </formaterre-keywords>
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
    back: {
      type: Boolean,
      default: false
    },
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
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  created () {
    if (!this.geonetwork) {
      this.errorGn = 'PAS DE GEONETWORK CONFIGURÉ'
    }
    this.$i18n.locale = this.lang === 'fr' ? 'fr' : 'en'
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
      saving: null,
      saved: true,
      requestPublish: false,
      taskId: null,
      count: 0,
      temporal: {
        fr: '',
        en: ''
      },
      recommanded: ['external.discipline.formater-discipline', 'external.theme.formater-foi-gn'],
      excluded: ['external.dataCentre.formater-distributor', 'external.theme.gemet', 'external.theme.httpinspireeceuropaeutheme-theme'],
      fixed: ['external.platform.formater-platform-gn', 'external.product.formaterre-product-gn', 'local.theme.ron', 'local.theme.polarisation', 'local.theme.formaterre_provider'],
      post: {
        title: {fr: '', en: ''},
        purpose: {fr: '', en: ''},
        keywords: {thesaurus: {}, free: {}}
        
      }
    }
  },
  watch: {
    post: {
      handler (newvalue) {
        this.saved = false
      },
      deep: true
    }
  },
  methods: {
    str2date (str) {
      var date = new Date(str)
      var options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      if (this.lang === 'fr') {
        var date = new Date(str)
        
        
        return date.toLocaleDateString('fr-FR', options)
      } else {
        return date.toDateString(options)
      }
    },
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
       this.process = json
       console.log(resp)
       if (!json.result) {
         this.errorProcess = 'Aucun résultat à publier pour ce job'
         return
       }
       var groundDeformation = {
          vocab: 'local.theme.formaterre_themes',
          scheme: 'https://registry.geonetwork-opensource.org/theme/formaterre_themes',
          url: 'https://registry.geonetwork-opensource.org/theme/formaterre_themes#a12a3cc2-baf3-454b-b155-e0cb615da129',
          title: 'Ground deformation',
          values: {fr: 'Déformation du sol', en: 'Ground deformation'},
          fixed: true
       }
       var discipline = {
          vocab:'external.discipline.formater-discipline',
          url: 'https://service.poleterresolide.fr/voc/science_field/D120000',
          title: 'Ground deformation',
          values: {fr: 'Déformation du sol', en: 'Ground deformation'},
          fixed: true
       }
       var provider =  {
          vocab: 'local.theme.formaterre_provider',
          scheme: '',
          url: 'https://registry.geonetwork-opensource.org/theme/formaterre_provider#905d59ea-ce82-4bf8-b3fe-be9968c4e7d2',
          title: 'CNES',
          values: {fr: 'CNES', en: 'CNES'}
       }
       if (json.serviceName === 'GDM-SAR-In-UGA') {
           var  provider = {
              vocab: 'local.theme.formaterre_provider',
              url: 'https://registry.geonetwork-opensource.org/theme/formaterre_provider#b82bf736-666a-4470-8605-ca6c8122509e',
              title: 'UGA',
              values: {fr: 'UGA', en: 'UGA'}
           }
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
         this.type = 'update'
         var keywords = json.metadata.keywords
        /**
         *   où l'on traduit l'ancien format dans un nouveau
         * */
         var mapping = {
          discipline: {
            key: 'external.discipline.formater-discipline',
            scheme: 'https://service.poleterresolide.fr/voc/science_field'
          },
          theme: {
            key: 'local.theme.formaterre_themes',
            scheme: 'https://registry.geonetwork-opensource.org/theme/formaterre_themes'
          },
          platform: {
            key: 'external.platform.formater-platform-gn',
            scheme: 'https://service.poleterresolide.fr/voc/platform'
          },
          ron: {
            key: 'local.theme.ron',
            scheme: 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.ron'
          },
          polarisation: {
            key: 'local.theme.polarisation',
            scheme: 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.polarisation'
          },
          foi: {
            key: 'external.theme.formater-foi-gn',
            scheme: 'https://service.poleterresolide.fr/voc/FOI'
          },
          variable: {
            key: 'external.theme.formater-variable-gn',
            scheme: 'https://service.poleterresolide.fr/voc/variable',
          },
          provider: {
            key: 'local.theme.formaterre_provider',
            scheme: 'https://registry.geonetwork-opensource.org/theme/formaterre_provider'
          },
          product: {
            key: 'external.product.formaterre-product-gn',
            scheme: 'https://service.poleterresolide.fr/voc/product'
          }
         }
         var truc = ['network', 'process', 'instrument']
         for (var th in truc) {
            delete keywords.thesaurus[truc[th]]
         } 
        
         for (var th in mapping) {
            if (keywords.thesaurus[th]) {
                if (keywords.thesaurus[th].length > 0) {
                keywords.thesaurus[mapping[th]] = []
                  keywords.thesaurus[th].forEach(function (item) {
                    var kw = {
                      url: item.uri || item.url,
                      title: item.en,
                      values: {fr: item.fr, en: item.en},
                      vocab: mapping[th].key,
                      scheme: mapping[th].scheme
                    }
                    keywords.thesaurus[mapping[th.key]].push(kw)
                  })
                }
                delete keywords.thesaurus[th]
            }
         }
        // Ou l'on change pour un format STAC
         for (th in keywords.thesaurus) {
            for (var i in keywords.thesaurus[th]) {
              var kw = keywords.thesaurus[th][i]
              if (keywords.thesaurus[th][i].url && keywords.thesaurus[th][i].id) {
                continue
              } else {
                console.log(th)
                console.log(Object.values(mapping))
                var thesaurus = Object.values(mapping).find(x => x.key === keywords.thesaurus[th][i].vocab)
                switch(th) {
                  case 'local.theme.ron':
                      var id = keywords.thesaurus[th][i].values.fr
                      var url = 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.ron#' + id
                      break
                  case 'local.theme.polarisation':
                      var id = keywords.thesaurus[th][i].values.fr.toLowerCase()
                      var url = 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.polarisation#' + id.toLowerCase()
                      break
                  default:
                      var url = keywords.thesaurus[th][i].uri || keywords.thesaurus[th][i].url
                      var id = url.replace(thesaurus.scheme, '')
                      id = id.replace(/[\/#]?/, '')
                }
               
                var kw = {
                  vocab: keywords.thesaurus[th][i].vocab,
                  scheme: thesaurus.scheme,
                  title: keywords.thesaurus[th][i].values.en,
                  url: url,
                  id: id,
                  values: keywords.thesaurus[th][i].values
                }
                keywords.thesaurus[th][i] = kw
              }
            }
         }  
         /**
          * FIN CHANGEMENT DE FORMAT QUI POURRA ÊTRE EFFACÉ ENSUITE
          *  */      
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
                  vocab: 'local.theme.polarisation',
                  id: json.feature.properties.parameters.polarisation.toLowerCase(),
                  url: 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.polarisation#' + json.feature.properties.parameters.polarisation.toLowerCase(),
                  scheme: 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.polarisation',
                  title: json.feature.properties.parameters.polarisation.toUpperCase(),
                  values: {
                    fr: json.feature.properties.parameters.polarisation.toUpperCase(),
                    en: json.feature.properties.parameters.polarisation.toUpperCase()
                  }
                }
             ],
             'local.theme.ron': [
                {
                  vocab: 'local.theme.ron',
                  id: ron,
                  url: 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.ron#' + ron,
                  scheme: 'https://catalogue-terresolide.ipgp.fr/geonetwork/srv/api/registries/vocabularies/local.theme.ron',
                  title: ron,
                  values: { 
                    fr: ron,
                    en: ron
                  }
                }
             ],
             'external.platform.formater-platform-gn': [
              {
                vocab: 'external.platform.formater-platform-gn',
                'scheme': 'https://service.poleterresolide.fr/voc/platform',
                title: 'SENTINEL-1',
                values: {
                  fr: 'SENTINEL-1',
                  en: 'SENTINEL-1',
                },
                id:'P010100',
                url: 'https://service.poleterresolide.fr/voc/platform/P010100'
              }
             ]   
           },
           free: {}
         }
        
       }
       if (!keywords.thesaurus['external.product.formaterre-product-gn']) {
          keywords.thesaurus['external.product.formaterre-product-gn'] = [{
                vocab: 'external.product.formaterre-product-gn',
                scheme: 'https://service.poleterresolide.fr/voc/product',
                title: 'Interferogram',
                values: { fr: 'Interférogramme', en: 'Interferogram'},
                id: 'c_460292ab',
                url: 'https://service.poleterresolide.fr/voc/product/c_460292ab'
              },
              {
                vocab: 'external.product.formaterre-product-gn',
                scheme: 'https://service.poleterresolide.fr/voc/product',
                title: 'Auxiliary data',
                values: { fr: 'Données auxiliaires', en: 'Auxiliary data'},
                id: 'c_67446f9c',
                url: 'https://service.poleterresolide.fr/voc/product/c_67446f9c'
              }]
       }
       if (!keywords.thesaurus['local.theme.formaterre_provider']) {
          keywords.thesaurus['local.theme.formaterre_provider'] = [provider]
       }
       var tab = ['discipline', 'groundDeformation']
       for (var i in tab) {
          var x = eval(tab[i])
          console.log(x)
          if (!keywords.thesaurus[x.vocab]) {
              keywords.thesaurus[x.vocab] = [x]
          } else {
              var index = keywords.thesaurus[x.vocab].findIndex(x => x.uri === x.uri)
              if (index >= 0) {
                keywords.thesaurus[x.vocab][index] = x
              } else {
                keywords.thesaurus[x.vocab].push(x)
              }
          }
       }
       
       if (this.hasSerie) {
        var find = keywords.thesaurus['external.product.formaterre-product-gn'].find(x => x.url === 'https://service.poleterresolide.fr/voc/product/c_6fff7a77')
        if (!find) {
          keywords.thesaurus['external.product.formaterre-product-gn'].push(
             {
                vocab: 'external.product.formaterre-product-gn',
                scheme: 'https://service.poleterresolide.fr/voc/product',
                title: 'Time series',
                values: { fr: 'Série temporelle', en: 'Time series'},
                id: 'c_6fff7a77',
                url: 'https://service.poleterresolide.fr/voc/product/c_6fff7a77'
              }
          )
        }
       } 
       if (!keywords.free) {
         keywords.free = {}
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
    publish () {
      if (this.saving) {
        return
      }
      this.save()
      fetch(
          this.api.replace('api', 'requests') + '/publish/' + this.process.id,
          {headers: { 'accept-language': this.lang, "Content-Type": "application/x-www-form-urlencoded"}, credentials: 'include', body: "purpose=notempty", method:'POST'})
      .then(resp => resp.json())
      .then(json => {console.log(json)})
      .catch(err => { })
      
    },
    save () {
      this.saving = true
      fetch(this.api + '/process/' + this.processId + '/catalog',
        {
          method: 'post',
          credentials: 'include',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(this.post)
        }
      ).then(resp => resp.json())
      .then(json => {
         this.saving = false
         this.saved = true
         console.log(json)
      })
      .catch(err => {console.log(err)})
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
