<i18n>
{
  "en": {
    "no_image": "NO IMAGE FOR THIS DATE",
    "platform": "Platform",
    "product_type": "Product Type",
    "processing_level": "Processing Level",
    "cloud_cover": "Cloud cover",
    "relative_orbit": "Relative Orbit",
    "select_first_date": "Start date",
    "select_image": "Select image",
    "select_last_date": "Last date",
    "snow_cover": "Snow cover",
    "unselect_image": "Unselect image"
  },
  "fr": {
     "no_image": "AUCUNE IMAGE POUR CETTE DATE",
     "platform": "Plateforme",
     "product_type": "Type de Produit",
     "processing_level": "Niveau de traitement",
     "cloud_cover": "Couverture nuageuse",
     "relative_orbit": "Orbite relative",
     "select_first_date": "Date de début",
     "select_image": "Selectionner cette image",
     "select_last_date": "Date de fin",
     "snow_cover": "Couverture neigeuse",
     "unselect_image": "Désélectionner cette image"
    }
}
</i18n>
<template>
<div class="gdm-image" :class="{'gdm-no-image': !image.productIdentifier, 'gdm-image-view': mode === 'view'}">
	<div class="gdm-image-1">
	<img v-if="image.quicklook" :src="image.quicklook" height="85" style="max-height:85px;margin: 3px 5px;padding:3px;border: 1px solid grey;"/>
	<img v-else src="../assets/images/no_image.png" width="85" style="margin: 3px 5px;padding:3px;border: 1px solid grey;"/>
  
	</div>
	<div class="gdm-image-title">
	  <label v-if="image.productIdentifier">{{image.productIdentifier}}</label>
	  <label v-else >{{$t('no_image')}}</label>
	</div>
	<div class="gdm-image-2 gdm-fields">
	   <div><label>Date : </label><span :style="{color: 'black'}">{{printDate(image.startDate)}}</span></div>
	   <div v-if="image.productIdentifier">
	     <div><label>{{$t('product_type')}} : </label>{{image.productType}}</div>
	     <div><label>{{$t('platform')}} : </label>{{image.platform}}</div>
	     <div><label>{{$t('relative_orbit')}} : </label> {{image.relativeOrbitNumber}}</div>
	   </div>
	</div>
	<div v-if="image.productIdentifier" class="gdm-image-3 gdm-fields">
	   <div><label>{{$t('cloud_cover')}} : </label>
	     <span v-if="image.cloudCover !== null" :style="{color: 'black'}">{{image.cloudCover}}</span>
	     <span v-else>---</span>
	   </div>
     <div><label>{{$t('snow_cover')}} : </label>{{image.snowCover !== null ? image.snowCover : '--'}}</div>
     <div><label>{{$t('product_type')}} : </label>{{image.productType}}</div>
     <div><label>{{$t('processing_level')}} : </label>{{image.processingLevel}}</div>
	</div>
	<div v-else class="gdm-image-3 gdm-fields"></div>
	<div v-if="image.productIdentifier && mode !== 'view'" class="gdm-image-4 gdm-fields" >
	  <div v-if="!searching && order > 0" >
	     <span :style="{color: temporal.start ? '#555': 'black'}">{{$t('select_first_date')}}</span>
	     <span class="fa" :class="{'fa-square-o': !startChecked, 'fa-check-square-o': startChecked}" @click="selectFirstDate($event)"></span>
	  </div>
	  <div v-if="order > 0" class="fa fa-long-arrow-down" style="width:120px;text-align:center;"></div>
	  <div >
	     <span :style="{color: temporal.end ? '#555': 'black'}">{{$t('select_last_date')}}</span>
	     <span class="fa" :class="{'fa-square-o': !endChecked, 'fa-check-square-o': endChecked}" @click="selectLastDate($event)"></span>
	  </div>
	  <div v-if="order < 0 " class="fa fa-long-arrow-up"  style="width:120px;text-align:center;"></div>
	  <div v-if="!searching && order < 0" >
       <span :style="{color: temporal.start ? '#555': 'black'}">{{$t('select_first_date')}}</span>
       <span class="fa" :class="{'fa-square-o': !startChecked, 'fa-check-square-o': startChecked}" @click="selectFirstDate($event)"></span>
    </div>
	</div>
  <div v-if="mode !== 'view'" class="gdm-image-5 gdm-fields">
     <div v-if="!searching" style="color:black;text-align:center;">
        <span v-if="checked">{{$t('unselect_image')}}</span>
        <span v-else >{{$t('select_image')}}</span>
        <span class="fa" :class="{'fa-square-o': !checked, 'fa-check-square-o': checked}" @click="selectImage($event)"></span>
     </div>
  </div>
</div>
</template>
<script>
import moment from 'moment'
export default {
  name: 'GdmImage',
  props: {
    image: {
      type: Object,
      default: null
    },
    temporal: {
      type: Object,
      default () {
        return {start: null, end: null}
      }
    },
    checked: {
      type: Boolean,
      default: false
    },
    searching: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: -1
    },
    mode: {
      type: String,
      default: ''
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
    startChecked () {
      if (this.temporal.start === this.image.startDate) {
        return true
      } else {
        return false
      }
    },
    endChecked () {
      if (this.temporal.end === this.image.startDate) {
        return true
      } else {
        return false
      }
    },
    splitChecked () {
      if (this.split === this.image.startDate) {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    moment.locale(this.lang)
    this.$i18n.locale = this.lang
  },
  methods: {
    printDate (date) {
      return moment(date).format('ll')
    },
    selectFirstDate () {
      var value = this.image.startDate
      if (this.startChecked) {
        value = null
      }
      this.$emit('firstDate', value)
//       if ((value && !this.checked) || (!value && this.checked)) {
//         this.$emit('selectImage', this.image.productIdentifier)
//       }
    },
    selectImage () {
      event.stopPropagation()
      var value = this.image.productIdentifier
      this.$emit('selectImage', value)
    },
    selectLastDate (event) {
      event.stopPropagation()
      var value = this.image.startDate
      if (this.endChecked) {
        value = null
      }
      this.$emit('lastDate', value)
    }
  }
}

</script>
<style>
.gdm-image {
  display: grid;
  grid-template-columns: 100px minmax(150px,1fr) minmax(150px,1fr) 125px minmax(150px,1fr);
  grid-gap: 5px;
  grid-template-rows: 14px 80px; 
  /*grid-auto-rows: minmax(100px, auto);*/
  font-size:0.8em;
  border-bottom:1px solid lightgrey;
}
.gdm-image.gdm-no-image {
  background: linear-gradient(-45deg, #EEE 12.5%, #fff 12.5%, #fff 37.5%, #EEE 37.5%, #EEE 62.5%, #fff 62.5%, #fff 87.5%, #EEE 87.5%);
  background-size: 20px 20px;
  background-position: 50px 50px;
}
.gdm-image-1{
  grid-column: 1;
  grid-row: 1/3;
}
.gdm-image-title{
  grid-column: 2/5;
  grid-row: 1;
}
.gdm-image-2 {
  grid-colum: 2;
  grid-row: 2;
}
.gdm-image-3 {
  grid-colum: 3;
  grid-row: 2;
}
.gdm-image-4 {
  grid-colum: 4;
  grid-row: 2;
}
.gdm-image-5 {
  grid-colum: 4;
  grid-row: 2;
}
.gdm-fields {
  margin-top:5px;
  color: #555;
}
.gdm-image-4.gdm-fields > div {
  text-align:right;
  padding: 0px 0;
}
.gdm-image-4.gdm-fields > div:first-child{
  padding-top: 0;
}
.gdm-image-4.gdm-fields > div span{
   padding: 0 5px;
}
.gdm-image-5.gdm-fields {
  font-size: 1em;
}
.gdm-image.gdm-image-view {
  display: grid;
  grid-template-columns: 100px minmax(150px,1fr) minmax(150px,1fr);
  grid-gap: 5px;
  grid-template-rows: 14px 80px; 
  /*grid-auto-rows: minmax(100px, auto);*/
  font-size:0.8em;
  border-bottom:1px solid lightgrey;
}

.gdm-image-view  .gdm-image-1{
  grid-column: 1;
  grid-row: 1/3;
}
.gdm-image-view  .gdm-image-title{
  grid-column: 2/3;
  grid-row: 1;
}

</style>
