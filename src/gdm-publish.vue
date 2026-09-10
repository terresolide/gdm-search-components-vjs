<i18n>
  {
    "fr": {
      "event_date":"Dates de l'évènement",
      "event_date_label": "Précisez si possible la date ou l'intervalle temporel de l'évènement que vous étudiez (séisme, glissement de terrain....)",
      "generated_title": "Titre généré",
      "keywords": "Mots-clés",
      "main_title": "Titre principal",
      "message_to_moderator": "Avant de demander la publication, ajouter un message pour le modérateur",
      "ongoing": "En cours",
      "provider": "Fournisseur",
      "publish": "Demander la publication",
      "purpose": "Objectif",
      "save": "Sauvegarder",
      "temp_information": "Pour information, l'étendue temporelle des images traitées est du {start} au {end}.",
      "unauthorized": "Vous n'êtes pas autorisé à consulter ou éditer ces informations"
    },
    "en": {
      "event_date": "Event dates",
      "event_date_label": "If possible, specify the date or time interval of the event you are studying (earthquake, landslide, etc.).",
      "generated_title": "Generated title",
      "keywords": "Keywords",
      "main_title": "Main title",
      "message_to_moderator": "Before requesting publication, add a message for the moderator",
      "ongoing": "On going",
      "provider": "Provider",
      "publish": "Request for publication",
      "purpose": "Purpose",
      "save": "Save",
      "temp_information": "For information, the time span of the processed images is from {start} to {end}.",
      "unauthorized": "You are not authorized to view or edit this information."
    }
  }
</i18n>
<template>
  <div><div v-if="process" class="gdm-publish">
  <div v-if="saving" class="gdm-processing fa fa-spinner fa-spin fa-3x fa-fw running" ></div>
  <template v-if="back"><h1>Métadonnées pour le job N° {{ processId }} &laquo;{{this.post.short.fr }}&raquo;</h1></template>
  <template v-else>
    <h1 v-if="locale === 'fr'">Demande de publication du job N°{{processId}} &laquo;{{this.post.short.fr }}&raquo;</h1>
    <h1 v-else>Request to publish the job N°{{processId}} &laquo;{{this.post.short.en }}&raquo;</h1>
   </template>
   <div v-if="error" style="font-size:2em;color:darkred;margin-bottom:10px;">{{ error }}</div>
   <div v-if="requestPublish" style="font-size:1.3em;color:darkred;padding:10px;border:1px solid darkred;margin-bottom:10px;">
      <template v-if="locale === 'fr'">Une demande de publication a été déposée: son status est {{ requestPublish }}</template>
      <template v-else>A publication request has been submitted: its status is {{ requestPublish }}</template>
   </div>
   <div v-else-if="back" style="font-size:1.3em;color:darkred;padding:10px;border:1px solid darkred;margin-bottom:10px;">Aucune demande n'a été réalisée pour ce job!!
    Vous ne pouvez donc rien valider!!!
   </div>
   <template v-if="!back">
      <em style="display:block;margin-bottom:10px;">

        <template v-if="locale === 'fr'">Une grande partie des métadonnées provient des informations sur le calcul et des résultats (emprise géographique, dates, liens...) mais ces informations sont insuffisantes
        pour   l'indexation de vos produits dans le catalogue FormaTerre ou ISDeform et par suite celui de DataTerra<br><br>
        Nous vous encourageons donc à compléter au mieux les informations ci-dessous.<br>
        Vous pouvez simplement "Sauvegarder" et revenir plus tard. Attention, toutefois, les résultats seront effacés le <span v-if="process && process.datePurge">{{ str2date(process.datePurge)}}</span> et toute demande de publication sera impossible!
        </template>
        <template v-else>
        A large portion of the metadata is derived from the computation details and results (geographic extent, dates, links, etc.), but this information is insufficient
        for indexing your products in the FormaTerre/ISDeform catalog—and consequently the DataTerra catalog.<br><br>
        We therefore encourage you to provide as much detail as possible in the information below.<br>
        You can simply "Save" and return later. Please note, however, that the results will be deleted on <span v-if="process && process.datePurge">{{ str2date(process.datePurge)}}</span>, and it will no longer be possible to submit a publication request!
        </template>
      </em>
   </template>
  
    <form style="border:1px solid darkgrey;padding:10px;box-shadow: 0 1px 5px rgba(0,0,0,.65);" @submit="save">
     <div style="text-align:right;">
      <button class="btn btn-publish" @click="save" :disabled="saved || saving || (!back && requestPublish)" >{{$t('save')}}</button>
      <button v-if="back" class="btn btn-publish"  @click="validate" :disabled="!requestPublish || requestPublish !== 'WAITING' || saving" 
      title="Envoyer un courrier pour déplacer le répertoire!">
        Valider
      </button>
      <button v-else class="btn btn-publish" @click="publish" :disabled="requestPublish || !process || !process.metadata || saving" >
        {{$t('publish')}}
      </button>
     </div>
     <div>
     <template v-if="back">
      <div><label>Message de l'utilisateur {{ process.email }}</label></div>
      <div class="user-message">{{ post.message }}</div>
     </template>
     <template v-else>
      <div><label>{{ $t('message_to_moderator') }}</label></div>
     <textarea v-model="post.message"></textarea>
     </template>
     </div>
     <h2>{{ $t('event_date') }}</h2>
     <div style="margin-left:10px;">{{ $t('event_date_label') }}
      <div style="margin-left:30px;;max-width:300px;">
          <formater-temporal-search :lang="locale" color="#8B0000" :default-from="post.temporal.start"
          :default-to="post.temporal.end"
        :format="format" daymin="2015-01-01" @change="dateChange"></formater-temporal-search></div>
      </div>
      <div style="margin-left:10px;"><em>{{$t('temp_information', {start: str2date(process.tempStart), end:str2date(process.tempEnd)}) }}</em></div>

     <h2>{{$t('main_title')}}</h2> 
     <div style="margin-bottom:5px;margin-left:10px;">
     Le titre doit être de la forme <em>[Processus]_[location]_[time]_[ts]</em>.<br />
     Exemples: Earthquake_Wushi_2024-jan-22,   Volcano_Merapi_2022-dec, Landslide_Maca_2019
     </div>
     <template v-if="back">
       <div style="margin-left:10px;">Titre: <input type="text" v-model="post.title" style="width:400px;"/></div>
     </template>
     <template v-else>
     <div style="margin-left:10px;">
         <div style="margin:15px 0;">
         <input type="text" v-model="post.foi" list="list-foi" placeholder="Processus" required/><datalist id="list-foi">
            <option value="Volcano"></option>
            <option value="Earthquake"></option>
            <option value="Landslide"></option>
            <option value="Post-seismic"></option>
            <option value="Subsidence"></option>
            <option value="Fire"></option>
            <option value="Flooding"></option>
         </datalist>_<input type="text" v-model="post.location" required placeholder="location" />_{{ temporal }}<template v-if="hasSerie">_ts</template>
         </div>
     </div>
     <div style="margin-left:10px;">{{ $t('generated_title') }}: <b>{{ title }}</b></div>
     </template>
     <h2>{{$t('purpose')}}</h2>
     <div style="margin-left:10px;margin-bottom:10px;font-style:italic;">
      <template v-if="locale==='fr'">
        De préférence en anglais. Pas plus de 600 caractères.<br />

        Indiquez l’objectif du traitement, et les points intéressants qui en ressortent.<br />
         Pour les <a href="https://www.isdeform.fr/acces-aux-collections/">cibles ISDeform</a>:  indiquez la complémentarité avec les données FAST-SAR.
      </template>
      <template v-else></template>
    </div>
     <div style="margin-left:10px;">
        <div><span class="lang-label">EN: </span><textarea v-model="post.purpose.en" style="vertical-align: top;"></textarea></div> 
     
        <div><span class="lang-label">FR: </span><textarea v-model="post.purpose.fr" style="vertical-align: top;"></textarea></div> 
      </div>
      <h2>{{$t('keywords')}}</h2>
       <em>
        <template v-if="locale === 'fr'">Il est important de compléter au mieux les mots-clés. Ils sont utilisés pour l'indexation des fiches de métadonnées et favorisent la visibilité de vos données.<br />
      La classification principale est obligatoire. Nous imposons déjà le mot-clé "Déformation du sol", mais vous pouvez en choisir d'autres.<br />
      Une partie des mots-clés a été automatiquement prédéfinie comme le type de produits ou la plateforme... 
       </template>
        <template v-else>
       It is important to fill in the keywords as thoroughly as possible. They are used to index metadata records and help boost the visibility of your data.<br />
      The primary classification is mandatory. We have already set the keyword "Ground deformation," but you may select others.<br />
      Some keywords have been predefined automatically, such as  product type or platform..
       </template>
      </em>
      <formaterre-keywords ref="keywords" :lang="locale" v-model="post.keywords" :geonetwork="geonetwork" 
      :listed="listed" :recommanded="recommanded" :excluded="excluded" :fixed="fixed">
        <template v-if="locale === 'fr'">Ci-dessous vous pouvez rechercher des mots-clés dans les thésaurus/ontologies utilisés par FormaTerre.<br />
          Si vous ne trouvez pas le terme recherché, vous pouvez saisir un <b>mot-clé libre</b>.<br />Vous pouvez même suggérer qu'il soit ajouté à une ontologie.
          <br />Pour les thésaurus hierarchisés, ne sélectionnez pas la branche entière, mais uniquement le terme le plus précis que vous désirez. Par exemple, si vous sélectionnez 'Merapi' dans les objets d'intérêt, ne sélectionnez pas le terme 'Volcan' plus général.
        </template>
      <template v-else>
        Below, you can search for keywords within the thesauri/ontologies used by FormaTerre.<br />
          If you do not find the term you are looking for, you can enter a <b>free-text keyword</b>.<br />You can even suggest adding it to an ontology.
          <br />For hierarchical thesauri, do not select the entire branch; select only the most specific term you require. For example, if you select 'Merapi' from the objects of interest, do not select the more general term 'Volcano'.


      </template>
      </formaterre-keywords>
        <h2>{{ $t('provider') }}</h2>
        <ul v-for="provider in post.providers" style="margin-left:10px;">
          <a :href="provider.url" target="_blank">{{ provider.name }}</a> ({{ provider.roles.join(', ') }})
        </ul>
    </form>
  </div>
  <div v-else style="color:darkred;">{{ $t('unauthorized') }}</div>

 </div>
</template>
<script>
// import GdmKeywords from './subcomponents/gdm-keywords.vue'
import FormaterreKeywords from 'formaterre-keywords-vjs/src/FormaterreKeywords.vue'
import {FormaterTemporalSearch} from 'formater-commons-components-vjs'
export default {
  name: 'GdmPublish',
  components: {
    FormaterreKeywords,
    FormaterTemporalSearch
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
    lang: {
      type: String,
      default:'en'
    },
    api: {
      type: String,
      default: 'https://gdm.formater/api'
    }
  },
  computed: {
    locale () {
      if (this.lang === 'fr') {
        return 'fr'
      } else {
        return 'en'
      }
    },
    temporal () {
      if (!this.process) {
        return '??'
      }
      if (this.post.temporal.start || this.post.temporal.end) {
        return this.temporal2str(this.post.temporal.start, this.post.temporal.end)
      } else {
        return this.temporal2str(this.process.feature.properties.temporalExtent[0], this.process.feature.properties.temporalExtent[1])
      }
    },
    title () {
      if (!this.process || !this.post.foi || !this.post.location) {
        return null
      }
      if (this.back) {
        return this.post.title
      }
      var title =  this.post.foi + '_' + this.post.location + '_' + this.temporal + (this.hasSerie ? '_ts' : '')
      this.post.title = title
      return title
    }
  },
  created () {
    this.$i18n.locale = this.locale
    this.format = this.locale === 'fr' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'
    this.getPublish()
    this.getProcess()
  },
  data () {
    return {
      error: null,
      resultDir: null,
      process: null,
      hasSerie: false,
      type: 'insert',
      saving: null,
      saved: true,
      format: 'DD/MM/YYYY',
      requestPublish: false,
      taskId: null,
      count: 0,
      // temporal: {
      //   fr: '',
      //   en: ''
      // },
      listed: ['external.discipline.formater-discipline'],
      recommanded: ['external.theme.formater-foi-gn'],
      excluded: ['external.dataCentre.formater-distributor', 'external.theme.gemet', 'external.theme.httpinspireeceuropaeutheme-theme'],
      fixed: ['external.process.formaterre-process-gn','external.platform.formater-platform-gn', 'external.product.formaterre-product-gn'],
      post: {
        short: {fr: '', en: ''},
        temporal: {start: null, end: null},
        foi: '',
        message: '',
        title: '',
        location: '',
        providers: [],
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
    dateChange (event) {
      if (event.name === 'from') {
        if (event.value !== 'Invalid date') {
          this.post.temporal.start = event.value
        } else {
          this.post.temporal.start = null
        }
      }
      if (event.name === 'to') {
        if (event.value !== 'Invalid date') {
          this.post.temporal.end = event.value
        } else {
          this.post.temporal.end = null
        }
      }

    },
    extractDate (str) {
      if (!str) {
        return null
      }
      return {y:parseInt(str.substring(0,4)), m: parseInt(str.substring(5,7)), d: parseInt(str.substring(8,10))}
    },
    str2date (str) {
      
      var tab = this.extractDate(str)
      var date = new Date(tab.y, tab.m - 1, tab.d)
      var options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      if (this.locale === 'fr') {
        return date.toLocaleDateString('fr-FR', options)
      } else {
        return date.toDateString(options)
      }
    },
    temporal2str (startStr, endStr) {
      var start = this.extractDate(startStr)

       var end = this.extractDate(endStr)
       var months = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
       var temporal = null
       if (!start) {
        start = end
       }
       if (!end) {
        end = start
       }
       if (start.y === end.y && start.m === end.m) {
          if (start.d === end.d) {
            temporal =  start.y + '-' + months[start.m] + '-' + start.d
          } else {
            temporal =  start.y + '-' + months[start.m]
          }

       } else if (start.y === end.y && end.m - start.m > 8) {
          return start.y
       } else {
          temporal = start.y + '-' + months[start.m] + '_' + end.y + '-' + months[end.m]
       }
       return temporal
    },
    // getMetadata () {
    //   this.$http.get(this.api + '/process/' + this.processId + '/catalog', {credentials: true})
    //   .then(resp => {
    //           this.metaUrl = resp.body.url
    //   }, resp => {
    //     this.errorGn = resp.body.error
    //   })
    // },
    getPublish () {
      fetch(
          this.api.replace('api', 'requests') + '/publish/' + this.processId,
          { credentials: 'include'}
      ).then(resp => {
        switch(resp.status) {
          case 401:
          case 403:
          case 404:
            return {error: resp.status}
        }
        return resp.json()
      }).then(json => {
         if (json.exists) {
          this.requestPublish = json.status
         } else {
          this.requestPublish = false
         }}
      ).catch(err => { console.log(err)})
    },
    treatmentProcess(json) {
       if (json.error) {
        return
       }
       this.process = json
       if (!json.result) {
         this.errorProcess = 'Aucun résultat à publier pour ce job'
         return
       }
       // provider
       if (this.process.serviceName.indexOf('UGA') > 0) {
          this.post.providers = [{
            name: 'UGA',
            url: 'https://ror.org/02rx3b187',
            roles: ['processor']
          }]
       } else {
          this.post.providers = [{
            name: 'CNES',
            url: 'https://ror.org/04h1h0y33',
            roles: ['processor']
          }]
       }
       var discipline = {
          vocab:'external.discipline.formater-discipline',
          url: 'https://service.poleterresolide.fr/voc/science_field/D120000',
          title: 'Ground deformation',
          values: {fr: 'Déformation du sol', en: 'Ground deformation'},
          fixed: true
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
       if (json.metadata) {
         this.post = Object.assign(this.post,json.metadata)
       }
       
      
       if (json.metadata) {
         this.type = 'update'
         var keywords = json.metadata.keywords
         if (Array.isArray(keywords.free)) {
            keywords.free = {}
         }
        /**
         *   où l'on traduit l'ancien format dans un nouveau
         * */
         var mapping = {
          discipline: {
            key: 'external.discipline.formater-discipline',
            scheme: 'https://service.poleterresolide.fr/voc/science_field'
          },
          platform: {
            key: 'external.platform.formater-platform-gn',
            scheme: 'https://service.poleterresolide.fr/voc/platform'
          },
          foi: {
            key: 'external.theme.formater-foi-gn',
            scheme: 'https://service.poleterresolide.fr/voc/FOI'
          },
          variable: {
            key: 'external.theme.formater-variable-gn',
            scheme: 'https://service.poleterresolide.fr/voc/variable',
          },
          product: {
            key: 'external.product.formaterre-product-gn',
            scheme: 'https://service.poleterresolide.fr/voc/product'
          }
         }
         var truc = ['network', 'process', 'instrument', 'ron', 'polarisation', 'local.theme.formaterre_provider',
         'provider', 'theme', 'local.theme.ron', 'local.theme.polarisation', 'local.theme.formaterre_themes' ]
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
              } 
              var url = keywords.thesaurus[th][i].uri || keywords.thesaurus[th][i].url
              var thesaurus = Object.values(mapping).find(x => x.key === keywords.thesaurus[th][i].vocab)
              var id = url.replace(thesaurus.scheme, '')
              id = id.replace(/[\/#]?/, '')
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
         /**
          * FIN CHANGEMENT DE FORMAT QUI POURRA ÊTRE EFFACÉ ENSUITE
          *  */  
         
         // this.post.goal = json.metadata.goal
       } else {
         
      
         var keywords = {
           thesaurus: {
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
              }]
           },
           free: {}
         }
        
       }
       //if (!keywords.thesaurus['external.process.formaterre-process-gn']) {
          keywords.thesaurus['external.process.formaterre-process-gn'] = [
            {
              vocab: 'external.process.formaterre-process-gn',
              scheme: 'https://service.poleterresolide.fr/voc/process',
              title: 'GDM-SAR-In',
              values:{
                fr: 'GDM-SAR-In',
                en: 'GDM-SAR-In'
              },
              id: 'c_b22668da',
              url: 'https://service.poleterresolide.fr/voc/process/c_b22668da'
            }
          ]  
       // }
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
      //  if (!keywords.thesaurus['local.theme.formaterre_provider']) {
      //     keywords.thesaurus['local.theme.formaterre_provider'] = [provider]
      //  }
       var tab = ['discipline']
       for (var i in tab) {
          var x = eval(tab[i])
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
      fetch(this.api + '/process/' + this.processId, {credentials: 'include'})
      .then( resp => {
        switch(resp.status) {
          case 401:
          case 403:
          case 404:
            return {error: resp.status}
          
        }
        return resp.json()
      })
      .then( json => { this.treatmentProcess(json)})
      .catch( err => { console.log(err)})
    },
    publish () {
      if (this.saving) {
        return
      }
      this.save()
      this.saving = true
      var formData = new FormData()
      formData.append('purpose', this.post.message)
      fetch(
          this.api.replace('api', 'requests') + '/publish/' + this.process.id,
          {headers: { 'accept-language': this.locale}, credentials: 'include', body: formData, method:'POST'})
      .then(resp => resp.json())
      .then(json => {
        if (json.success) {this.requestPublish = 'WAITING'}
        this.saving = false
      })
      .catch(err => { this.saving = false})
      
    },
    validate () {
       this.save()
       this.saving = true
       fetch(
          this.api.replace('api', 'requests') + '/publish/' + this.process.id,
          {credentials: 'include', method:'PUT'})
       .then(resp => resp.json())
       .then(json => {
          if (json.success) {this.requestPublish = 'VALID'}
            this.saving = false
          })
       .catch(err => { this.saving = false })
    },
    save () {
      this.saving = true
      this.post.title = this.title
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
         this.process.metadata = this.post
      })
      .catch(err => {console.log(err)})
    }
  }
}
</script>
<style>
div.user-message {
  border:1px solid #888;
  max-width:700px;
  color: #333;
  padding:10px;
  background: #ddd;
}
.keyword.checked span.close {
  color:#bbb;
}
.keyword.checked span.close:hover {
  color: #fff;
}
.gdm-processing {
    position:fixed;
    top: 48%;
    left:50%;
    color:white;
    text-shadow:1px 1px 3px #333, -1px -1px 3px #333;
    z-index:2001;
  }

.btn,
div[id="app"] .btn {
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
.btn-publish,
div[id="app"] .btn-publish {
  color: #fff;
  background-color: #8b0000;
  border-color: #8b0000;
}
.btn-publish:disabled,
div[id="app"]  .btn-publish:disabled{
  opacity:0.6;
  pointer-events: none;
}
.btn-publish:hover,
div[id="app"] .btn-publish:hover {
  background-color: #7d0e0e;
  border-color: #9c0000;
}
.btn-publish:focus,
div[id="app"] .btn-publish:focus {
  box-shadow: 0 0 0 .2rem rgba(139,0,0,.5);
}
.gdm-publish {
  font-family: Arial, Helvetica, sans-serif;
}
div[id="app"] .gdm-publish {
  margin:30px;
}
.gdm-publish h1, .gdm-publish h2, .gdm-publish h3 {
  color: darkred;
}
.gdm-publish h1 {
  text-transform:uppercase;
}
.gdm-publish .dp-header h2 {
  color: white;
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
