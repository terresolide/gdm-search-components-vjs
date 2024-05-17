<template>
 <div class="gdm-publish">
   <h1 v-if="type === 'insert'">Publication dans le catalogue FormaTerre pour le job {{ this.post.title.fr }}</h1>
   <h1 v-else>Mise à jour des métadonnées pour le job {{ this.post.title.fr }}</h1>
       

   <h2>Titre principal</h2> 
   <div style="margin-left:10px;">
       <div><span class="lang-label">fr: </span>GDM-SAR-In <input v-model="post.title.fr" />
         collection d'interférogrammes<span v-if="hasSerie"> et série temporelle</span> {{temporal.fr}}  </div>
       <div><span class="lang-label">en: </span>GDM-SAR-In <input v-model="post.title.en" /> 
         collection of interferograms<span v-if="hasSerie"> and time serie</span> {{ temporal.en }} </div>
   </div>

   <h2>Objectif</h2>
   <div style="margin-left:10px;">
      <div><span class="lang-label">fr: </span><textarea v-model="post.purpose.fr" style="vertical-align: top;"></textarea>      </div> 
      <div><span class="lang-label">en: </span><textarea v-model="post.purpose.en" style="vertical-align: top;"></textarea>      </div> 
    </div>
    <gdm-keywords ref="keywords" :has-serie="hasSerie" :count="count" :keywords="post.keywords" @vocab="checkKeywords"
    @remove="removeKeyword" @add="addKeyword"></gdm-keywords>
 </div>
</template>
<script>
import GdmKeywords from './subcomponents/gdm-keywords.vue'
export default {
  name: 'GdmPublish',
  components: {
    GdmKeywords
  },
  props: {
    
    processId: {
      type: Number,
      default: null
    },
    api: {
      type: String,
      default: 'https://gdm.formater/api/process'
    }
  },
  created () {
    this.getProcess()
  },
  data () {
    return {
      process: null,
      hasSerie: false,
      type: 'insert',
      count: 0,
      temporal: {
        fr: '',
        en: ''
      },
      post: {
        title: {fr: '', en: ''},
        purpose: {fr: '', en: ''},
        keywords: {thesaurus: {}, free: {}}
        
      }
    }
  },
  methods: {
    addKeyword (obj) {
        if (obj.item.uri) {
          var keywords = this.post.keywords
          if (!keywords.thesaurus[obj.thesaurus]) {
            keywords.thesaurus[obj.thesaurus] = [obj.item]
          } else {
            var index = keywords.thesaurus[obj.thesaurus].findIndex(k => k.uri === obj.item.uri)
            if (index >=0) {
              return
            }
            keywords.thesaurus[obj.thesaurus].push(obj.item)
          }
          this.post.keywords = keywords
        }
    },
    checkKeywords(vocabularies) {
      if (this.post.keywords) {
        var self = this
        vocabularies.forEach(function (voc) {
          if (!self.post.keywords.thesaurus[voc.id]) {
            self.post.keywords.thesaurus[voc.id] = []
          }
        })
      }
    },
    getProcess() {
      this.$http.get(this.api + '/' + this.processId, {credentials: true})
      .then(resp => {
        var json = resp.body
        console.log(resp)
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
        this.temporal = {
          fr: json.feature.properties.temporalExtent[0].substring(0,10) + ' à ' + json.feature.properties.temporalExtent[1].substring(0,10),
          en: json.feature.properties.temporalExtent[0].substring(0,10) + ' to ' + json.feature.properties.temporalExtent[1].substring(0,10)
        }
        if (json.metadata) {
          this.type = 'update'
          var keywords = json.metadata.keywords
          
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
              polarisation: [
                 {
                   fr: json.feature.properties.parameters.polarisation.toUpperCase(),
                   en: json.feature.properties.parameters.polarisation.toUpperCase()
                 }
              ],
              ron: [
                 {
                   fr: ron,
                   en: ron
                 }
              ]
            }
          }
        }
        var vocabularies = this.$refs.keywords.vocabularies;
        vocabularies.forEach(function (vocab) {
          if (!keywords.thesaurus[vocab.id]) {
            keywords.thesaurus[vocab.id] = []
          }
        })
        keywords.thesaurus.polarisation[0].disabled = true
        keywords.thesaurus.ron[0].disabled = true
        keywords.thesaurus.platform[0].disabled = true
        this.post.keywords = keywords
       })
    },
    removeKeyword (obj) {
      if (obj.item.uri) {
        var index = this.post.keywords.thesaurus[obj.thesaurus].findIndex(k => k.uri === obj.item.uri)
        this.post.keywords['thesaurus'][obj.thesaurus].splice(index, 1)
      } 
    }
  }
  
  
}
</script>
<style>
.gdm-publish {
  font-family: Arial, Helvetica, sans-serif;
}
h1, h2, h3 {
  color: darkred;
}
.lang-label {
  color:#333;
  font-weight:700;
  display:inline-block;
  min-width:50px;
}
textarea {
  min-width: 700px;
}
</style>