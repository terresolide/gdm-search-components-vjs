<template>
<div class="gdm-serie-navigation">
     Dates:
     <span class="serie-navigation" :class="{disabled: serieIndex === 0}">
       <span class="fa fa-angle-double-left" :style="{backgroundColor:color}" @click="goToFirst()"></span>
       <span class="fa fa-angle-left" :style="{backgroundColor:color}" @click="previous()"></span>
     </span>
     <span v-html="serieDate" style="display:inline-block;vertical-align:middle;"></span>
     <span class="serie-navigation" :class="{disabled: serieIndex === lastIndex}">
       <span class="fa fa-angle-right" :style="{backgroundColor:color}" @click="next()"></span>
       <span class="fa fa-angle-double-right" :style="{backgroundColor:color}" @click="goToLast()"></span>
     </span>
 </div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'GdmSerieNavigation',
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    series: {
      type: Object,
      default: null
    },
    serieIndex: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: null
    }
  },
  computed: {
    lastIndex () {
      if (!this.series) {
        return ''
      }
      var name = Object.keys(this.series)[0]
      return this.series[name].images.length - 1
    }
  },
  data () {
    return {
      serieDate: ''
    }
  },
  watch: {
    serieIndex (newvalue) {
      this.computeSerieDate(newvalue)
      
    }
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
  },
  mounted: function(){
    this.computeSerieDate(0)
  },
  methods: {
    computeSerieDate (index) {
      if (!this.series) {
        return ''
      }
      var name = Object.keys(this.series)[0]
      var date = this.series[name].images[index].date.substring(0, 8)
      var date2 = this.series[name].images[index].date.substring(8)
      console.log(date2)
      this.serieDate = moment(date, 'YYYYMMDD').format('ll') 
      if (this.fullscreen) {
        this.serieDate += ' &rarr; ' + moment(date2, 'YYYYMMDD').format('ll')
      } else {
        this.serieDate += '<br />' + moment(date2, 'YYYYMMDD').format('ll')
      }
    },
    goToFirst () {
      this.$emit('dateChange', 0)
    },
    goToLast () {
      console.log(this.lastIndex)
      this.$emit('dateChange', this.lastIndex)
    },
    next () {
      this.$emit('dateChange', this.serieIndex + 1)
    },
    previous () {
      this.$emit('dateChange', this.serieIndex - 1)
    },
    
  }
}
</script>
<style scoped>
span.serie-navigation span{
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
span.serie-navigation.disabled span{
  opacity:0.3;
  cursor:not-allowed;
}
span.serie-navigation:not(.disabled) span:hover{
  opacity:1;
  font-size:1.31em;
}
</style>