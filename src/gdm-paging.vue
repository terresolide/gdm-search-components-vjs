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
  	<span class="fa fa-angle-double-left" @click="goToFirst()"></span>
  	<span class="fa fa-angle-left" @click="changePage(-1)" ></span>
  </span>
  <span style="margin: 0 10px;" v-html="$tc('results', count, {from: (count === 0) ? 0 : from, to: to, notExactly: notExactly, count: count})"></span>
   (<formater-select name="recordPerPage" :options="recordsPerPage" :defaut="recordPerPage + ''" type="associative" @input="nbRecordChange" color="#ffffff"></formater-select>)
   <span :class="{disabled: (!notExactly && (currentPage===nbPage || count=== 0) ? 'disabled': ''), 'mtdt-navigation':true}">
	   <span class="fa fa-angle-right " @click="changePage(1)" ></span>
	   <span class="fa fa-angle-double-right" @click="goToLast()"></span>
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

    page: {
      type: Number,
      default: 1
    },
    offset: {
      type: Number,
      default: 1
    },
    nb: {
      type: Number,
      default: 25
    },
    total: {
      type: Number,
      default: 0
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
  },
  created: function() {
  },
  mounted () {
  },
  destroyed () {
  },

  data() {
    return {
      count: 0,
      currentPage : 1,
      recordsPerPage:{
        1: '1 par page',
        10: '10 par page',
        25: '25 par page'
      },
      recordPerPage: this.nb,
      nbPage: 0,
      from: 1,
      to: 24,
      notExactly: '',
      options: [1, 10, 25, 50, 100]
    }
  },
  
  methods: {
 
   goToFirst () {
     this.from = 1
     this.currentPage = 1
     this.emitChange()
   },
   goToLast () {
     this.from = (this.nbPage -1) * this.recordPerPage + 1
     this.currentPage = this.nbPage
     this.emitChange()
   },
   handleReset(event) {
     this.from = 1
     this.currentPage = 1
   },
   handleSearch (event) {
     if (this.depth != event.detail.depth) {
       return
     }
     if (this.type === 'opensearch') {
       event.detail.index = this.from
       event.detail.maxRecords = this.recordPerPage
     } else {
      event.detail.from = this.from
      event.detail.to = this.from + this.recordPerPage - 1
     }
     if (this.sortBy) {
     	event.detail.sortBy = this.sortBy
     }
   },
   handleTheme () {
     var nodes = this.$el.querySelectorAll('.mtdt-paging span.mtdt-navigation span')
     var self = this
     nodes.forEach( function (node) {
       node.style.backgroundColor = self.$store.state.style.primary
     })
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
     var to = this.from + this.recordPerPage - 1
     this.$emit('change', { nb:this.recordPerPage, page: this.currentPage})
     var event = new CustomEvent('fmt:pageChangedEvent', {detail:{ depth: this.depth}})
     document.dispatchEvent(event)
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