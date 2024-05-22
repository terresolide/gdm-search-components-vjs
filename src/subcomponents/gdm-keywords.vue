<template>
<div>
  <h2>Mots-clés</h2>
 <span style="display:inline-block;width:112px;">Rechercher:  </span> 
 <span class="search" style="">
    <input type="search" class="light" v-model="query"  @focus="show=true" @keyup="search"/>
    <span class="fa fa-close" @click="reset"></span>
  </span>  
  <div style="position:relative;">
  <div v-if="show && query.length > 2" class="tt-menu" 
    style="position: absolute; top: 0; left: 50px; z-index: 100; /*! display: none; */">
    <div v-if="results.length > 0" class="tt-dataset tt-dataset-concept">
      <div v-for="item, index in results" @click="addResult(index)" 
      class="autocomplete-label tt-suggestion tt-selectable"       :class="{disabled: item.choose}">
        <div>
        <span><span v-html="highlight(item.prefLabel)"></span><span> ({{item.lang}})</span></span>
      </div>
      <div class="vocab">{{toTitle(item.vocab)}}</div>
    </div>
   </div>
   <div v-else class="tt-dataset tt-dataset-concept" style="padding:5px 10px;">
       <div>Aucun mot-clé correspondant trouvé dans les thésaurus!<br>
      Vous pouvez entrer un mot clé libre</div>
       <ul style="list-style-type: none;">
        <li><span class="lang-label">FR</span> <input type="text" v-model="kw.fr" /></li>
        <li><span class="lang-label">EN</span> <input type="text" v-model="kw.en" /></li>
        <li><span class="lang-label">Type</span>
            <select v-model="kw.type">
              <option v-for="tp, key in types" :value="key" :title="tp.definition">{{ tp.name }}</option>
            </select>
         </li>
       </ul>
       <div style="text-align:right;margin:0 10px 15px 0;">
        <button @click="addFree">Ajouter</button>
       </div>
   </div>
   </div>
   </div>
  <div style="display:inline-block;min-width:300px;width:calc(50% - 20px);" @click="show=false">
    <h3>Mots-clés de thésaurus</h3>
       <div v-for="list, thesaurus in keywords.thesaurus" v-show="list.length > 0">
          <label>{{ toTitle(thesaurus) }}</label>
          <div class="list-keywords"> 
          <div v-for="item in list" class="keyword" >{{ item.fr }} 
            <span class="fa fa-close" v-if="!item.disabled"
            @click="remove(thesaurus, item)"></span></div>
          </div> 
       </div>
       <div>
          <label>Méthodes, procédures et solutions</label>
          <div class="list-keywords"> <div class="keyword">GDM-SAR-In</div></div>
       </div>
       <div>
          <label>Type de produit</label>
          <div class="list-keywords">
            <div class="keyword">Interférogramme</div>
            <div v-if="hasSerie" class="keyword">Série temporelle</div>
          </div>
       </div>
  </div>
  <div style="display:inline-block;min-width:300px;width:calc(50% - 20px);vertical-align:top;">
    <h3>Mots-clés libres</h3>
    
    <div v-for="list, type in keywords.free" v-show="list.length > 0">
             <label>{{ types[type].name }}</label>
             <div class="list-keywords"> 
             <div v-for="item, index in list" class="keyword" >{{ item.fr }} 
               <span class="fa fa-close" v-if="!item.disabled"
               @click="remove(type, item, index)"></span></div>
             </div> 
          </div>
        </div>
</div>
</template>
<script>
export default {
  name: 'GdmKeywords',
  props: {
    keywords: {
      type: Object,
      default: () => {return {thesaurus: {}, free: {}}}
    },
    voc: {
      type: String,
      default: 'https://catalogue-terresolide.ipgp.fr/voc/rest/v1/'
    },
    hasSerie: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.getVocabularies()
    this.search()
  },
  computed: {
    translate () {
      var titles = {}
      this.vocabularies.forEach(function (item) {
        titles[item.id] = item.title
      })
      return titles
    }
  },
  data () {
    return {
      // Recherche SKOSMOS 
      query: '',
      results: [],
      notFind: '',
      show: false,
      vocabularies: [],
      // Mots clés libres
      // ISO19139 TYPES
      kw: {
        fr: '',
        en: '',
        type: 'theme'
      },
      types: {
        discipline: {
          name: 'Discipline',
          definition: 'Mot-clé en relation avec une branche de la connaissance'
        },
        theme: {
          name: 'Thème',
          definition: 'Mot clé identifiant un sujet particulier'
        },
        place: {
          name: 'Localisation',
          definition: 'Mot-clé identifiant un lieu'
        },
        stratum: {
          name: 'Couche géologique',
          definition: ''
        },
        temporal: {
          name: 'Période de temps'
        },
        process: {
          name: 'Procédé'
        }, 
        project: {
          name: 'Project'
        }
      }
      
    }
  },
  methods: {
    addResult (index) {
      var item = this.results[index]
      var self = this
      this.results = this.results.filter(elt => elt.uri !== item.uri)
      
      var keyword = {
        uri: item.uri
      }
      
      var vocab = item.vocab
      var lang = item.lang
      var otherLang = lang === 'fr' ? 'en' : 'fr'
      keyword[lang] = item.prefLabel
      this.$http.get(this.voc + item.vocab + '/label?uri=' + encodeURIComponent(keyword.uri) + '&lang=' + otherLang )
      .then(resp => {
        this.show = false
        keyword[otherLang] = resp.body.prefLabel
        this.$emit('add', {thesaurus: vocab, item: keyword})
      })
    },
    addFree () {
      this.$emit('add', {thesaurus: this.kw.type, item: this.kw})
    },
    highlight (name) {
      var regex = new RegExp(this.query, 'i'); 
      return name.replace(regex, function (x) {
        
        return '<strong>' + x + '</strong>'
      })
    },
    getVocabularies () {
      this.$http.get(this.voc + 'vocabularies?lang=fr', {headers: {'Accept': 'application/json'}})
      .then(resp => {
        if (resp.body.vocabularies) {
          this.vocabularies = resp.body.vocabularies
          this.$emit('vocab', this.vocabularies)
        }
      })
    },
    remove (thesaurus, item, index) {
      this.$emit('remove', {thesaurus: thesaurus, item: item, index: index})
    },
    toTitle (value) {
      if (this.translate[value]) {
        return this.translate[value]
      }
      switch(value) {
        case 'ron':
           return 'Orbite relative'
        default:
           return value.charAt(0).toUpperCase() + value.slice(1);
      }
    },
    reset () {
      this.query = ''
      this.results = []
      this.show = false
    },
    search () {
      
      this.show = false
      var query = this.query.trim()
      if (query.length < 3) {
        return
      }
      console.log(this.notFind)
      console.log(query.indexOf(this.notFind))
      if (this.notFind && query.indexOf(this.notFind) === 0) {
        this.kw.fr = query
        this.kw.en = query
        this.show = true
        return
      }
      
      var headers = {
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept': 'application/json, text/javascript, */*; q=0.01'
      }
      var self = this
      this.$http.get(this.voc + 'search?query=*' + this.query + '*&vocab=&lang=&labellang=', {headers: headers})
      
      .then(resp => {
        this.show = true
        var results = []
        if (resp.body.results) {
          results = resp.body.results
          var indexes = results.reduce(function (accumulator, item, index) {
             if (self.keywords.thesaurus[item.vocab]) {
                var find = self.keywords.thesaurus[item.vocab].findIndex(voc => voc.uri === item.uri)
                if (find >=0) {
                  accumulator.push(index)
                } 
             }
             return accumulator
          },[],)
          for(var i=indexes.length - 1; i >=0; i--) {
            results.splice(indexes[i], 1)
          }
        }
        if (results.length === 0) {
          this.notFind = query
          this.kw.fr = query
          this.kw.en = query
        } else {
          this.notFind = ''
        }
        this.results = results
      })
    }
  }
}
</script>
<style scoped>
h1, h2, h3 {
  color: darkred;
}
.fa-close {
  color: darkred;
  vertical-align:top;
}
input[type="search"] {
  border:none;
  outline:none;
  font-size:1rem;
  color: #111;
  font-family:Arial, Helvetica, sans-serif;
  background: transparent;
}
span.search {
  border:1px solid lightgray;
  padding:3px;
}
span.search + input[type="search"]:focus,
span.search:focus-within{
  border-color:#b1b1b1;
  background: #faf9f9;
}
span.search .fa-close {
  color: #333;
  padding:2px;
  font-size:0.8rem;
  font-weight:600;
  border: 1px dotted transparent;
}
span.search .fa-close:hover {
  border-color:#333;
}
.tt-menu {
  width: 100%;
  width: 350px;
  min-width: 300px;
  background-color: #f8f8f8;
  border-radius: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  max-height: 302px;
  overflow-y: auto;
  right: 0 !important;
  top: 4px !important;
  left: 117px !important;
}
.autocomplete-label > div:first-child > span:first-child, 
.autocomplete-label > div:first-child > span.replaced + span {
  color: darkred;
  margin: 0;
}
.tt-selectable {
  border-bottom: 1px solid rgba(0,0,0,0.2);
  cursor: pointer;
  line-height: 20px;
  padding: 2px 8px;
  overflow:hidden;
}
.tt-selectable.disabled {
  pointer-events: none;
  opacity:0.8;
}
.tt-selectable:hover {
  background-color: #fbfbfb;
}
label {
  min-width: 200px;
  font-weight: 700;
  color: #333;
  display: block;
  margin: 10px 0 0 10px;
}
.keyword {
  display:inline-block;
  position:relative;
  margin: 3px 10px 3px 0;
  padding: 3px  6px;
  border-radius: 4px;
  background: #ddd;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.4);
  cursor: pointer;
}
.list-keywords {
  margin-left:15px;
}

</style>