<i18n>
{
   "en":{
     "north_symbol": "N",
     "east_symbol": "E",
     "south_symbol": "S",
     "west_symbol": "W",
     "reset":     "Reset",
     "draw": "Draw",
     "titleLatitude": "Latitude must be a number between -90° and 90° (ex: 65.3)",
     "titleLongitude": "Longitude must be a number between -180° and 180° (ex: -110.3)"
     
   },
   "fr":{
     "north_symbol": "N",
     "east_symbol": "E",
     "south_symbol": "S",
     "west_symbol": "O",
     "reset": "Initialiser",
     "draw": "Dessiner",
     "titleLatitude": "La latitude doit être un nombre compris entre -90° et 90° (ex: 65.3)",
     "titleLongitude": "La longitude doit être comprise entre -180° et 180° (ex: -110.3)"
   }
}
</i18n>
<template>
<span class="formater-spatial-search" >
     <div class="box-toolbar" style="background: none;">
      <button class="spatial-edit-button" :title="$t('draw')" @click="handleDraw"><i class="fa fa-pencil-square-o"></i></button>
      <button class="spatial-reset-button" :title="$t('reset')" @click="handleResetLocal"><i class="fa fa-remove"></i></button>
     </div>
     <form name="formater-spatial-search" class="formater-spatial-search-content">
          <div class="formater-input-group cardinal-center">
               <span class="right">{{$t('north_symbol')}}</span>
               <input  type="text" name="north" v-model="north" :pattern="patternLatitude"  :title="$t('titleLatitude')" @keydown="validInput" @change="handleChange" data-index="1" ></input>
          </div>
          <div class="formater-input-group cardinal-left">
               <span class="right">{{$t('west_symbol')}}</span>
               <input  type="text" name="west" v-model="west" :pattern="patternLongitude"  :title="$t('titleLongitude')" @keydown="validInput" @change="handleChange" data-index="2" ></input>
          </div>
          <div class="formater-input-group cardinal-right">
               
               <input  type="text" name="east" v-model="east" :pattern="patternLongitude"  :title="$t('titleLongitude')" @keydown="validInput" @change="handleChange" data-index="3" >     </input>
               <span class="left">{{$t('east_symbol')}}</span>
          </div>
          
          <div class="formater-input-group cardinal-center">
               <span class="right">{{$t('south_symbol')}}</span>
               <input  type="text" name="south" v-model="south" :pattern="patternLatitude"  :title="$t('titleLatitude')" @keydown="validInput" @change="handleChange" data-index="4" ></input>
          </div>
          
     </form>

</span>
</template>
<script>
export default {
  name: 'GdmSpatialSearch',
  props:{
    lang:{
      type: String,
      default: 'en'
    },
    polygon: {
      type : String,
      default: null
    },
    color: {
      type: String,
      default: '#808000'
    }
  },
  data(){
    return {
      north: "",
      south: "",
      east: "",
      west: "",
      areaSelect: false,
      searchEventListener: null,
      resetEventListener: null,
    //  aerisThemeListener:null,
      patternLatitude: "[-+]?(90|([1-8]?[0-9])([.][0-9]+)?)",
      patternLongitude:"[-+]?(180(\.0+)?|((1[0-7][0-9])|([1-9]?[0-9]))([.][0-9]+)?)"
    }
  },
  computed: {
   
  },
  watch: {
    polygon (newvalue) {
      this.initBounds()
    }
  },
  destroyed: function() {
  
    document.removeEventListener('aerisResetEvent', this.resetEventListener);
    this.resetEventListener = null;
    document.removeEventListener('aerisSearchEvent', this.searchEventListener);
    this.searchEventListener = null;
//     document.removeEventListener('aerisTheme', this.aerisThemeListener);
//     this.aerisThemeListener = null;
    document.removeEventListener('fmt:selectAreaChange', this.selectAreaChangeListener);
    this.selectAreaChangeListener = null
    document.removeEventListener('fmt:drawClose', this.drawCloseListener)
    this.drawCloseListener = null
  },
  created: function () {
    this.initBounds()
    this.$i18n.locale = this.lang
    this.resetEventListener = this.handleReset.bind(this) 
    document.addEventListener('aerisResetEvent', this.resetEventListener);
    this.searchEventListener = this.handleSearch.bind(this) 
    document.addEventListener('aerisSearchEvent', this.searchEventListener);
//     this.aerisThemeListener = this.handleTheme.bind(this) 
//     document.addEventListener('aerisTheme', this.aerisThemeListener);
    this.selectAreaChangeListener = this.handleBounds.bind(this) 
    document.addEventListener('fmt:selectAreaChange', this.selectAreaChangeListener);
    this.drawCloseListener = this.handleDraw.bind(this)
    document.addEventListener('fmt:drawClose', this.drawCloseListener)
    // this.bounds = this.box
  },
  mounted: function(){
//      var event = new CustomEvent('aerisThemeRequest', {});
//      document.dispatchEvent(event);
    this.ensureTheme()
  },
  methods:{
    bbox: function(){
      return {
        north: this.north,
        south: this.south,
        east: this.east,
        west: this.west
      }
    },
    initBounds () {
      if (this.polygon) {
        var part = this.polygon.match(/(POLYGON\(\()([0-9\-,. ]+)(\)\))/)
        if (part.length > 2) {
          var coords = part[2].split(',')
          var lats = []
          var lngs = []
          coords.forEach(function (coord) {
            var lnglat = coord.split(' ')
            lngs.push(parseFloat(lnglat[0]))
            lats.push(parseFloat(lnglat[1]))
          })
          this.east = Math.max(...lngs)
          this.west = Math.min(...lngs)
          this.north = Math.max(...lats)
          this.south = Math.min(...lats)
        }
      } else {
        this.east = ''
        this.west = ''
        this.north = ''
        this.south = ''
      }
    },
    validForm () {
      var inputs = this.$el.querySelectorAll('input')
      var valid = true
      inputs.forEach(function (input) {
        valid *= (input.validity.valid)
      })
      if (this.south === "" || this.north === "" || this.east === "" || this.west === "") {
        valid = false
      }
      return valid;
    },
    createBbox () {
      if (this.validForm()) {
        return [this.west, this.south, this.east, this.north].join(',')
      } else {
        return false
      }
    },
    createGeometry () {
      if (this.validForm()) {
        var north = Math.round(this.north * 10000) / 10000
        var south = Math.round(this.south * 10000) / 10000
        var east = Math.round(this.east * 10000) / 10000
        var west = Math.round(this.west * 10000) / 10000
        var box = 'POLYGON((' + west + ' ' + north + ','
          box += east + ' ' + north + ',';
          box += east + ' ' + south + ',';
          box += west + ' ' + south + ',';
          box += west + ' ' + north + '))';
        return box;
      } else {
        return false;
      }
    },
    validInput (e) {
      if (e.which === 13) {        
        // @todo rendre + sexy le passage à l'autre input
        var index = parseInt(e.target.dataset.index)+ 1
        var next = this.$el.querySelector('input[data-index="' + index + '"]')
        if (next) {
          next.focus()
        }
      }
    },
    handleChange: function(e){
      if(!e || !e.target.validity.valid) {
        return false;
      }
       // this.areaSelect = false;
      var event = new CustomEvent( 'fmt:bboxChange', { detail:this.bbox()});
      document.dispatchEvent( event);
      return;
    },
    handleDraw:function(){ 
      if(this.areaSelect){
        var event = new CustomEvent( 'fmt:selectAreaDrawEnd', {detail: this.bbox()});
      }else{
         var event = new CustomEvent( 'fmt:selectAreaDrawStart', {detail: this.bbox()});
      }
      this.areaSelect = !this.areaSelect;
      document.dispatchEvent( event);
      return;
    },
    handleReset: function( ) {
      this.north = "";
      this.east = "";
      this.west = "";
      this.south = "";
      
      var event = new CustomEvent( 'fmt:bboxChange', { detail: this.bbox()});
      document.dispatchEvent( event);
    
    },
    handleResetLocal: function () {
      this.handleReset()
      var event = new CustomEvent('fmt:spatialChangeEvent')
      document.dispatchEvent(event)
    },
    handleBounds: function(e){
      this.north = Math.round(e.detail.north * 10000) / 10000;
      this.south = Math.round(e.detail.south * 10000) / 10000;
      this.east = Math.round(e.detail.east * 10000) / 10000;
      this.west = Math.round(e.detail.west * 10000) / 10000;
     
       var event = new CustomEvent('fmt:spatialChangeEvent')
       document.dispatchEvent(event)
    },
    handleSearch: function(e) {
      // add bbox if valid 
      var geometry = this.createGeometry()
      var box = this.createBbox()
      delete e.detail.geometry
      delete e.detail.box
      if (geometry) {
        e.detail.geometry = geometry;
        // this.handleChange();
      } 
      if (box) {
        e.detail.box = box
      }
    },
//     handleTheme: function(theme) {
//       this.theme = theme.detail;
//       this.ensureTheme();
//     },
    ensureTheme: function() {
      if ((this.$el) && (this.$el.querySelector)) {
        var color3 =  this.$shadeColor( this.color, 0.8);
        var nodes= this.$el.querySelectorAll(".formater-input-group");
        [].forEach.call(nodes, function(node){
          node.style.backgroundColor = color3;
        })
           
      }
    }
  }
}
</script>
<style>
.formater-spatial-search.disable{
  pointer-events: none;
  opacity: 0.8;
}
.formater-spatial-search .formater-input-group {
    border: none;
    display:inline-block;
     /* Default color from aeris */
    background-color: rgba(172,220,238,0.3); 
}
div[id="app"] .formater-spatial-search  form .formater-input-group input,
.formater-spatial-search .formater-input-group input {
     border: none;
     background-color: transparent;
     padding: 0 5px;
     outline: none;
}
     
.formater-spatial-search .formater-input-group span:first-letter {
   text-transform: uppercase;
}
.formater-spatial-search .formater-input-group{
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 5px 0;
    width: 48%;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
}
 .mtdt-form .formater-spatial-search .formater-input-group {
    width:48%;
    height:25px;
    margin: 5px auto;
}
 .mtdt-form .formater-spatial-search .formater-input-group input{
  min-width: 80px;
  max-width: 90px;
  text-align:center;
  padding: 0 3px;
  margin: 0 3px;
}
.formater-spatial-search .formater-input-group.cardinal-left{
   float:left;
}
.formater-spatial-search .formater-input-group.cardinal-right{
   float:right;
}
.formater-spatial-search .formater-input-group.cardinal-left input{
   text-align:left;
 }
.formater-spatial-search .formater-input-group.cardinal-right input{
   text-align:right;
   max-width: 70%;
   
 }
.formater-spatial-search .formater-input-group.cardinal-center{
   margin:auto;
   clear:both;
}
.formater-spatial-search .formater-input-group .right {
  min-width: 25px;
  border-right: 1px solid #fff;
  box-sizing: border-box;
  display: block;
  height: 100%;
  text-align: center;
}
.formater-spatial-search .formater-input-group .left {
  min-width: 25px;
  border-left: 1px solid #fff;
  box-sizing: border-box;
  display: block;
  height: 100%;
  text-align: center;
}
.formater-spatial-search .box-toolbar {
  text-align: right;
  display:block;
  margin: 0 0 10px 0;
}
.formater-spatial-search .box-toolbar button{
  margin-left: 3px;
  min-width: 38px;
  padding: 1px 6px;
}
</style>
