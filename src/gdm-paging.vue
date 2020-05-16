<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {notExactly}{count}",
     "title": "Title",
     "per_page": "per page"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {notExactly}{count}",
     "title": "Titre",
     "relevance": "Pertinence",
     "changeDate": "Mise à jour",
     "sortBy": "Trier par",
     "per_page": "par page"
   }
}
</i18n>
<template>
 <span class="mtdt-paging">
  <div style="width:100%;height:33px;line-height:30px;text-align:center;">
  <span :class="{disabled: (currentPage===1 ? 'disabled': ''), 'mtdt-navigation':true}">
  	<span class="fa fa-angle-double-left" :style="{background:color}" @click="goToFirst()"></span>
  	<span class="fa fa-angle-left" :style="{background:color}" @click="changePage(-1)" ></span>
  </span>
  <span style="margin: 0 10px;" v-html="$tc('results', totalResults, {from: (totalResults === 0) ? 0 : startIndex + 1, to: to, notExactly: notExactly, count: totalResults})"></span>
   (<formater-select name="recordPerPage" :options="recordsPerPage" :defaut="recordPerPage + ''" type="associative" @input="nbRecordChange" color="#ffffff"></formater-select>)
   <span :class="{disabled: (!notExactly && (currentPage===nbPage || count=== 0) ? 'disabled': ''), 'mtdt-navigation':true}">
	   <span class="fa fa-angle-right" :style="{background:color}" @click="changePage(1)" ></span>
	   <span class="fa fa-angle-double-right" :style="{background:color}" @click="goToLast()"></span>
  </span>
 
   </div>
 </span>
</template>
<script>
import {FormaterSelect} from 'formater-commons-components-vjs'
export default {
  name: 'GdmPaging',
  components: {
    FormaterSelect
  },
  props: {

    startIndex: {
      type: Number,
      default: 0
    },
    maxRecords: {
      type: Number,
      default: 25
    },
    totalResults: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    },
    lang: {
      type: String,
      default: 'en'
    },
    color: {
      type: String,
      default: '#808080'
    }
  },
  computed: {
    to () {
      return this.startIndex + this.count
    },
    nbPage () {
      var nbPage = parseInt(this.totalResults / this.maxRecords) 
      nbPage += (this.totalResults % this.maxRecords > 0 ? 1 : 0)
      this.currentPage = parseInt(this.startIndex  / this.maxRecords) + 1
      return nbPage
    },
    recordsPerPage () {
      var list = {};
      var self = this
      this.options.forEach( function (option) {
        list[option] = option + ' ' + self.$t('per_page')
      })
      return list
    }
  },
  created () {
    this.from = this.startIndex + 1
    this.$i18n.locale = this.lang
  },
  mounted () {
  },
  destroyed () {
  },

  data() {
    return {
      from: 1,
      currentPage : 1,
      recordPerPage: this.maxRecords,
      notExactly: '',
      options: [10, 25, 50, 100]
    }
  },
  
  methods: {
 
   goToFirst () {
    // this.from = 1
     this.currentPage = 1
     this.emitChange()
   },
   goToLast () {
     console.log(this.nbPage)
    // this.from = (this.nbPage -1) * this.recordPerPage + 1
     this.currentPage = this.nbPage
     this.emitChange()
   },
   handleReset(event) {
    //  this.from = 1
     this.currentPage = 1
   },
   changePage(sens) {
     if (sens < 0 && this.currentPage === 1 ){
       return
     }
     if (sens > 0 && this.currentPage === this.nbPage && !this.notExactly) {
       return;
     }
     this.currentPage += sens
     this.from = (this.currentPage - 1) * this.recordPerPage +1
     this.emitChange()
   },
   nbRecordChange (value) {
     this.recordPerPage = parseInt(value)
     this.emitChange()
   },
   emitChange() {
     // var to = this.from + this.recordPerPage - 1
     this.$emit('change', { maxRecords:this.recordPerPage, startIndex: (this.currentPage - 1) * this.recordPerPage})
   }
  }
}
</script>
<style>
.mtdt-paging span.mtdt-navigation span{
  font-size: 1.3em;
  cursor: pointer;
  margin: 0 1px;
  padding:5px;
 cursor:pointer;
 border-radius:3px;
 /*background:#8c0209;*/
 background:grey;
 padding:3px 5px;
 color:white;
  vertical-align:middle;
  opacity:0.9;
}
.mtdt-paging span.mtdt-navigation.disabled span{
  opacity:0.3;
  cursor:not-allowed;
}
.mtdt-paging span.mtdt-navigation:not(.disabled) span:hover{
  opacity:1;
  font-size:1.31em;
}

</style>