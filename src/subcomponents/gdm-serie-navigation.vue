<template>
<div class="gdm-serie-navigation" :style="{background: fullscreen ? '#fff' : $shadeColor(color,0.85)}">
     <span class="serie-navigation" :class="{disabled: serieIndex === 0 }">
       <span class="fa fa-angle-double-left" :style="{backgroundColor:color}" @click="goToFirst()"></span>
       <span class="fa fa-angle-left" :style="{backgroundColor:color}" @click="previous()"></span>
     </span>
     <span class="serie-navigation" style="display:inline-block;vertical-align:top;text-align:center;"  :class="{disabled: serieIndex === lastIndex}">
        <div v-html="serieDate"></div>
        <span class="fa" :class="timer ? 'fa-pause' : 'fa-play'"  :style="{backgroundColor:color}" @click="togglePlay"></span>
     </span>
     <span class="serie-navigation" :class="{disabled: serieIndex === lastIndex }">
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
    main: {
      type: Boolean,
      default: false
    },
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
    serieName: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    }
  },
  computed: {
    lastIndex () {
      if (!this.series || !this.serieName || !this.series[this.serieName]) {
        return 0
      }
      //var name = Object.keys(this.series)[this.serieName]
      return this.series[this.serieName].images.length - 1
    }
  },
  data () {
    return {
      serieDate: 'Serie navigation',
      timer: null,
      playerChangeListener: null
    }
  },
  watch: {
    serieIndex (newvalue) {
      this.computeSerieDate(this.serieName, newvalue)
      
    },
    serieName (newvalue) {
      this.computeSerieDate(newvalue, 0)
      this.goToFirst()
    }
  },
  created () {
    this.$i18n.locale = this.lang
    moment.locale(this.lang)
    this.playerChangeListener = this.changePlayer.bind(this)
    document.addEventListener('SeriePlayerChange', this.playerChangeListener)
  },
  mounted (){
    // this.computeSerieDate(0)
  },
  destroyed () {
    if (this.main && this.timer) {
      clearInterval(this.timer)
      this.timer = false
    }
    document.removeEventListener('SeriePlayerChange', this.playerChangeListener)
    this.playerChangeListener = null
  },
  methods: {
    computeSerieDate (serieName, index) {
      if (!this.series || !this.series[serieName]) {
        this.serieDate = 'Serie navigation'
        return
      }
      var name = Object.keys(this.series)[0]
      console.log(this.series[this.serieName].images[index])
      if (this.series[this.serieName].images[index].date) {
	      if (this.series[this.serieName].images[index].date.indexOf('-') < 5) {
	        var date = this.series[this.serieName].images[index].date
	        this.serieDate = moment(date, 'YYYY-MM-DD').format('ll') 
	      } else {
	       
		      var date = this.series[this.serieName].images[index].date.substring(0, 8)
		      var date2 = this.series[this.serieName].images[index].date.substring(9)
		      this.serieDate = moment(date, 'YYYYMMDD').format('ll') 
	      }
	      if (date2) {
	        this.serieDate += ' &rarr; ' + moment(date2, 'YYYYMMDD').format('ll')
	      }
      } else if (this.series[this.serieName].images[index].startDate) {
        var date = this.series[this.serieName].images[index].startDate
        this.serieDate = moment(date, 'YYYY-MM-DD').format('ll') 
        var date2 = this.series[this.serieName].images[index].completionDate
        this.serieDate += ' &rarr; ' + moment(date, 'YYYY-MM-DD').format('ll') 
      }
//       } else {
//         this.serieDate += '<br />' + moment(date2, 'YYYYMMDD').format('ll')
//       }
    },
    goToFirst () {
      this.$emit('dateChange', 0)
    },
    goToLast () {
      this.$emit('dateChange', this.lastIndex)
    },
    next () {
      if (this.serieIndex < this.lastIndex) {
        this.$emit('dateChange', this.serieIndex + 1)
      }
    },
    play () {
      if (this.timer) {
        return
      }
      this.timer = setInterval(this.next, 1000)
    },
    previous () {
      this.$emit('dateChange', this.serieIndex - 1)
    },
    togglePlay () {
      var event = new CustomEvent('SeriePlayerChange')
      document.dispatchEvent(event)
    },
    changePlayer () {
      if (this.main) {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = false
        } else {
          this.play()
        }
      } else {
        this.timer = !this.timer
      }
    }
  }
}
</script>
<style scoped>
.gdm-serie-navigation {
  background: #fff;
  border-radius: 5px;
  padding: 8px 3px;
  font-size:0.8rem;
  border: 2px solid rgba(0,0,0,0.2);
  max-width:330px;
  text-align:center;
}
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