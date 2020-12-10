<i18n>
{
  "en": {
    "click_to_enlarge": "Click to enlarge",
    "click_to_reduce": "Click to reduce",
    "cloud_cover": "Cloud cover",
    "columns_rows": "Columns/Rows",
    "hide_image": "Hide image",
    "geo_processing_level": "Geometric processing level",
    "nb_bands": "Nb bands",
    "no_image": "NO IMAGE FOR THIS DATE",
    "platform": "Platform",
    "producer": "Producer",
    "product_type": "Product Type",
    "processing_center": "Processing Center",
    "processing_level": "Processing Level",
    "radio_processing_level": "Radiometric processing level",
    "relative_orbit": "Relative Orbit",
    "remove_image": "Remove the image\nfrom your library",
    "remove": "Remove",
    "select_first_date": "Start date",
    "select_image": "Select image",
    "select_last_date": "Last date",
    "show_image": "Display on map",
    "spectral_band": "Spectral band",
    "snow_cover": "Snow cover",
    "size": "Size",
    "unselect_image": "Unselect image",
    "zoom_in": "Zoom in",
    "zoom_out": "Zoom out",
    "zoom_to": "Zoom to the footprint"
  },
  "fr": {
     "click_to_enlarge": "Cliquer pour agrandir",
     "click_to_reduce": "Cliquer pour fermer",
     "cloud_cover": "Couverture nuageuse",
     "hide_image": "Cacher",
     "nb_bands": "Nb bandes",
     "columns_rows": "Col/lignes",
     "geo_processing_level": "Niv. traitement géométrique",
     "no_image": "AUCUNE IMAGE POUR CETTE DATE",
     "platform": "Plateforme",
     "producer": "Producteur",
     "product_type": "Type de Produit",
     "processing_center": "Centre de traitement",
     "processing_level": "Niveau de traitement",
     "relative_orbit": "Orbite relative",
     "radio_processing_level": "Niv. traitement radiométrique",
     "remove_image": "Supprimer l'image\nde votre bibliothèque",
     "remove": "Suppr.",
     "select_first_date": "Date de début",
     "select_image": "Selectionner cette image",
     "select_last_date": "Date de fin",
     "show_image": "Afficher",
     "snow_cover": "Couverture neigeuse",
     "spectral_band": "Bande spectrale",
     "size": "Taille",
     "unselect_image": "Désélectionner cette image",
     "zoom_in": "Zoomer",
     "zoom_out": "Dézoomer",
     "zoom_to": "Zoomer sur l'emprise"
    }
}
</i18n>
<template>
<div class="gdm-image" :class="{'gdm-no-image': !image.productIdentifier, 'gdm-image-view': mode === 'view', 'gdm-pleiade': type === 'PLEIADES', 'gdm-removed': image.removed}">
	<div v-if="displayedImageId === image.productIdentifier" class="gdm-full"  @click="displayImage($event)" :title="$t('click_to_reduce')">
	  <img :src="image.quicklook" >
	</div>
	<div class="gdm-image-1">
	<img v-if="image.quicklook && mode !== 'view' && type === 'PEPS'" :src="image.quicklook" @click="displayImage($event)" 
	:title="displayedImageId === image.productIdentifier ? $t('click_to_reduce') : $t('click_to_enlarge')" style="cursor:pointer;" :class="{selected: displayedImageId === image.productIdentifier}"/>
  <img v-else-if="image.quicklook" :src="image.quicklook"  />
  
	<img v-else src="../assets/images/no_image.png" width="85" style="margin: 3px 5px;padding:3px;border: 1px solid grey;"/>
  
	</div>
	<div class="gdm-image-title">
	  <label v-if="image.productIdentifier">{{image.productIdentifier}}</label>
	  <label v-else >{{$t('no_image')}}</label>
	</div>
	<div class="gdm-image-2 gdm-fields">
	   <div><label>Date : </label><span :style="{color: 'black'}">{{printDate(image.startDate)}}</span></div>
	   <div v-if="image.productIdentifier">
	     <div v-if="type === 'PEPS'">    
	       <div><label>{{$t('product_type')}} : </label>{{image.productType}}</div>
           
         <div><label>{{$t('platform')}} : </label>{{image.platform}}</div>
         <div><label>{{$t('relative_orbit')}} : </label> {{image.relativeOrbitNumber}}</div>
       </div>
       <div v-else-if="type === 'PLEIADES'">
          <div><label>Instrument: </label>{{image.instrument}}</div>
          <div>
           <label>Processing level: </label>
            <ul >
	            <li>
	            <label>Geometric: </label>{{image.processingLevel}}
	            </li>
	            
              <li  v-if="image.radiometricProcessingLevel" >
                <label>Radiometric: </label>{{image.radiometricProcessingLevel}}
              </li>
            </ul>
         </div>
    </div>
    </div>
	</div>
	<div v-if="image.productIdentifier" class="gdm-image-3 gdm-fields">
	   <div v-if="type === 'PEPS'">
       <div><label>{{$t('cloud_cover')}} : </label>
         <span v-if="image.cloudCover !== null" :style="{color: 'black'}">{{image.cloudCover}}</span>
         <span v-else>---</span>
       </div>
       <div><label>{{$t('snow_cover')}} : </label>{{image.snowCover !== null ? image.snowCover : '--'}}</div>
       <div><label>{{$t('processing_level')}} : </label>{{image.processingLevel}}</div>
    </div>
    <div v-else-if="type === 'PLEIADES' && angles" >
	    <div><label>Orientation:</label> {{printFloat(angles.azimuth)}}°</div>
	    <div> <ul style="padding-left:0;padding-top:2px;" >
	        <li><label>Incidence Across track:</label> {{printFloat(angles.incidence.acrossTrack)}}°</li>
	        <li><label>Incidence Along track:</label> {{printFloat(angles.incidence.alongTrack)}}°</li>
	        <li><label>Incidence Overall:</label> {{printFloat(angles.incidence.angle)}}°</li>
	      </ul>
	    </div>
	    <div>
	      <ul style="padding-left:0;padding-top:2px;" >
	        <li><label>Viewing Across track:</label> {{printFloat(angles.viewing.acrossTrack)}}°</li>
	        <li><label>Viewing Along track:</label> {{printFloat(angles.viewing.alongTrack)}}°</li>
	      </ul>
	    </div>
	    <div>
        <ul style="padding-left:0;padding-top:2px;" >
          <li><label>Sun azimuth:</label> {{printFloat(angles.sunAzimuth)}}°</li>
          <li><label>Sun elevation:</label> {{printFloat(angles.sunElevation)}}°</li>
        </ul>
      </div>
      <div style="padding-top:2px">
      <label>Ground sample dist.:</label> {{printFloat(angles.groundSampleDistance.across)}} x {{printFloat(angles.groundSampleDistance.along)}}
      </div>
    </div>
  </div>
	<div v-if="image.productIdentifier && mode === 'S2ST-STACK'" class="gdm-image-4 gdm-fields" >
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
	<div v-if="image.productIdentifier && type === 'PLEIADES'" class="gdm-image-4  gdm-fields" >
	    <div><label>Producer: </label>{{image.producer}}</div>
      <div><label>Format : </label>{{image.format}}<span v-if="image.encoding"> ({{image.encoding}}bits)</span></div>
      <div><label>Columns/Rows: </label>{{image.dimensions.cols}} /  {{image.dimensions.rows}}</div>
      <div v-if="image.spectralBand"><label>Spectral band: </label> {{image.spectralBand}}</div>
      <div class="gdm-stereo" v-if="stereo && stereo.length > 0" style="margin-top:5px; padding:3px;color:black;">
        <div v-for="st in stereo">
        &delta;<sub>{{st.name}}</sub> = {{printFloat(st.angle)}}°, B/H<sub>{{st.name}}</sub> = {{printFloat(st.bh)}}
        </div>
      </div>
	</div>
	<div v-if="image.productIdentifier && type === 'PLEIADES' & mode !== 'view'" class="gdm-image-5 gdm-fields" 
  style="color:black;">
    <div>
       <span class="gdm-action"  @click="zoomTo" :title="$t('zoom_to')">
         <i class="fa fa-search-plus" style="font-size:1.2em;"></i>
       </span>
    </div>
    <div>
      <span class="gdm-action" @click="zoomOut" :title="$t('zoom_out')">
        <i class="fa fa-search-minus" style="font-size:1.2em;"></i>
      </span>
    </div>
    <div>
	    <span class="gdm-action" style="margin-top:5px;" v-if="!image.removed && !checked"  @click="removeImage()" :title="$t('remove_image')">
	        <!--  <span >{{$t('remove')}}</span>-->
	        <i class="fa fa-trash" style="font-size:1.2em;"></i>
	     </span>
     </div>
  </div>
  <div v-if="mode !== 'view' && !searching" :class="{'gdm-image-5': type === 'PEPS', 'gdm-image-6': type == 'PLEIADES'}" class="gdm-fields">
     <div  style="color:black;text-align:center;cursor:pointer;"  @click="selectImage($event)">
        <span v-if="checked">{{$t('unselect_image')}}</span>
        <span v-else >{{$t('select_image')}}</span>
        <span class="gdm-action fa" :class="{'fa-square-o': !checked, 'fa-check-square-o': checked}"></span>
     </div>
    <!--    <div v-if="image.productIdentifier && type === 'PEPS'" style="margin-top:5px;color:black;text-align:center;cursor:pointer;"  @click="displayImage($event)">
        <span v-if="!displayedImageId || displayedImageId !== image.productIdentifier ">{{$t('show_image')}} <i class="gdm-action fa fa-globe" ></i></span>
        <span v-else >{{$t('hide_image')}} <i class="gdm-action fa fa-eye-slash" ></i></span>
     </div> -->
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
    type: {
      type: String,
      default: 'PEPS'
    },
    lang: {
      type: String,
      default: 'en'
    },
    displayedImageId: {
      type: String,
      default: null
    },
    stereoList: {
      type: Array,
      default: null
    }
  },
  computed: {
    angles () {
      if (this.image.angles) {
        if (this.image.angles[1]) {
          return this.image.angles[1]
        } 
        return this.image.angles
      }
      return null
    },
    stereo () {
      var extract = this.stereoList.filter(str => str.id === this.image.id)
      if (extract.length === 1) {
        return extract[0].stereo
      } else {
        return null
      }
    },
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
    },
    layer () {
      if (this.image.services && this.image.services.browse && this.image.services.browse.layer) {
        return this.image.services.browse.layer
      } else {
        return null
      }
    }
  },
  data () {
    return {
      full: false
    }
  },
  created () {
    moment.locale(this.lang)
    this.$i18n.locale = this.lang
  },
  methods: {
    displayImage (event) {
//       var layer = this.layer
//       layer.id = this.image.productIdentifier
      this.$emit('displayImage', this.image.productIdentifier)
    },
    printFloat (value) {
      value = Math.round(value * 100) / 100
      return value.toLocaleString(this.lang, {minimumFractionDigits: 2})
    },
    printDate (date) {
      if (this.type === 'PLEIADES') {
        if (this.lang === 'fr') {
          return moment.utc(date).format('D MMM YYYY HH:mm:ss')
        } else {
          return moment.utc(date).format('MMM D, YYYY HH:mm:ss')
        }
        
      } else {
        return moment.utc(date).format('ll')
      }
    },
    removeImage () {
      this.$emit('removeImage', this.image.id )
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
      if (this.type === 'PLEIADES') {
        value = this.image.id
      }
      this.$emit('selectImage', value)
    },
    selectLastDate (event) {
      event.stopPropagation()
      var value = this.image.startDate
      if (this.endChecked) {
        value = null
      }
      this.$emit('lastDate', value)
    },
    zoomOut () {
      this.$emit('zoomOut')
    },
    zoomTo () {
      this.$emit('zoomTo', this.image.id)
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
.gdm-image.gdm-pleiade ul {
margin: 0;
padding: 0 5px;
line-height:1;
list-style-type: none;
}
.gdm-image.gdm-pleiade {
  min-width:750px;
   grid-template-columns: 90px minmax(100px,2fr) minmax(230px,2fr)  minmax(110px,2fr) minmax(30px, 50px) minmax(70px, 100px) ;
   grid-gap: 3px;
  grid-template-rows: 10px 135px; 
}
.gdm-image.gdm-image-view {
  display: grid;
  grid-template-columns: 100px minmax(150px,1fr) minmax(150px,1fr);
  /*grid-auto-rows: minmax(100px, auto);*/
}
.gdm-image.gdm-pleiade.gdm-image-view {
   grid-template-columns: 100px minmax(110px,2fr) minmax(150px,2fr) minmax(150px,2fr);
  grid-template-rows: 10px 135px; 
}
.gdm-image .gdm-full {
  position:fixed;
  height:auto;
  top: calc(50% - 250px);
  margin-left:90px;
  padding: 20px;
  background: #333;
  border-radius: 5px;
  cursor:pointer;
}
.gdm-image .gdm-full img {
  min-width:500px;
  min-height:500px;
}
.gdm-image .gdm-image-1 img {
  max-height:85px;
  max-width:85px;
  margin: 2px;
  padding:3px;
  border: 1px solid grey;
}
.gdm-image img.selected {
  background: #333;
  border: 2px solid darkred;
}
.gdm-image.gdm-pleiade.gdm-image img {
  max-width: 80px;
  max-height: 110px;
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
.gdm-pleiade .gdm-image-title {
  grid-column: 2/6;
  grid-row: 1;
}
.gdm-image-2 {
  grid-column: 2;
  grid-row: 2;
}
.gdm-image-3 {
  grid-column: 3;
  grid-row: 2;
}
.gdm-image-4 {
  grid-column: 4;
  grid-row: 2;
}
.gdm-image-5 {
  grid-column: 5;
  grid-row: 2;
}
.gdm-image-6{
  grid-column: 6;
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
.gdm-pleiade .gdm-image-4.gdm-fields > div {
  text-align: left;
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
.gdm-action {
  cursor: pointer;
  opacity:0.8;
  padding:2px 2px;
  display:inline-block;
  border:1px dotted white;
}
.gdm-action:hover {
  opacity:1;
   border:1px dotted grey;
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
.gdm-image-view.gdm-pleiade .gdm-image-title {
   grid-column: 2/4;
  grid-row: 1;
}
.gdm-removed {
  background: linear-gradient(-45deg, white 25%,
  #EEE 25%, #EEE 50%, 
  white 50%, white 75%, 
  #EEE 75%);
background-size: 10px 10px;
}
 div.gdm-image-remove {
    width:30px;
    height:30px;
    text-align:center;
    line-height:30px;
    cursor:pointer;
    opacity:0.8;
    color:red;
    margin-top: -10px;
    border-color: 1px dotted white;
  }
  div.gdm-image-remove:hover {
    opacity:1;
    border: 1px dotted red;
  }
</style>
