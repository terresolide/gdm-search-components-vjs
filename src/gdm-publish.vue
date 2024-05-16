<template>
 <div>
  
    <div><h2>Titre principal</h2> 
         <div><span class="lang-label">fr: </span>GDM-SAR-In <input v-model="post.title.fr" />
           collection d'interférogrammes<span v-if="hasSerie"> et série temporelle</span> {{temporal.fr}}  </div>
         <div><span class="lang-label">en: </span>GDM-SAR-In <input v-model="post.title.en" /> 
           collection of interferograms<span v-if="hasSerie"> and time serie</span> {{ temporal.en }} </div>

       </div>
    <div><h2>Objectif</h2>
      <div><span class="lang-label">fr: </span><textarea v-model="post.purpose.fr" style="vertical-align: top;"></textarea>      </div> 
      <div><span class="lang-label">en: </span><textarea v-model="post.purpose.en" style="vertical-align: top;"></textarea>      </div> 
    </div>
   
    <gdm-keywords :keywords="post.keywords"></gdm-keywords>
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
    thesaurus: {
      type: String,
      default: 'https://catalogue-terresolide.ipgp.fr/voc/rest/v1/'
    },
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
      temporal: {
        fr: '',
        en: ''
      },
      post: {
        title: {fr: '', en: ''},
        purpose: {fr: '', en: ''},
        keywords: {}
        
      }
    }
  },
  methods: {
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
          this.post.keywords = json.metadata.keywords
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
       
          this.post.keywords = {
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
       })
    }
  }
  
  
}
</script>
<style>
.lang-label {
  color:#333;
  font-weight:700;
  display:inline-block;
  min-width:50px;
}
</style>