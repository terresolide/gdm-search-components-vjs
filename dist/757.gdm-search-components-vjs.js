(self.webpackChunkgdm_search_components_vjs=self.webpackChunkgdm_search_components_vjs||[]).push([[757],{6036:e=>{function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t(e)}L.Control.Gdmlayer=L.Control.Layers.extend({options:{position:"topleft"},bbox:null,tiles:{osm:{name:"OSM",url:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'},osmFr:{name:"OSM France",url:"//{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",attribution:'donn&eacute;es &copy; <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>'},opentopomap:{name:"OSM Topo",url:"//{s}.tile.opentopomap.org/{z}/{x}/{y}.png",attribution:'Kartendaten: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="http://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'},arcgisTopo:{name:"ArcGIS",url:"//server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",attribution:'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>'}},initialize:function(e,t,i){for(var n in L.Control.Layers.prototype.initialize.call(this,e,t,i),this.tiles){var a=L.tileLayer(this.tiles[n].url,{attribution:this.tiles[n].attribution});this.tiles[n].layer=a,this.addBaseLayer(a,this.tiles[n].name)}},addBboxLayer:function(){},setBboxLayer:function(e){},removeBboxLayer:function(){},_addItem:function(e){var i=this._overlaysList;if(e.layer.first&&("object"===t(e.layer.first)?(title=e.layer.first.title,(n=document.createElement("div")).className="leaflet-control-layers-separator",i.appendChild(n)):title=e.layer.first,(n=document.createElement("b")).innerHTML=title,this._overlaysList.appendChild(n)),e.layer.images){var n=document.createElement("div"),a=this._map.hasLayer(e.layer),o=this;return e.layer.images.forEach((function(t,l){var r,s=document.createElement("label"),d=a&&e.layer.indexImage===l;(r=document.createElement("input")).type="checkbox",r.className="leaflet-control-layers-selector",r.defaultChecked=d,o._layerControlInputs.push(r),r.layerId=L.Util.stamp(e.layer),r.index=l,L.DomEvent.on(r,"click",o._onInputClick,o);var p=document.createElement("span");p.innerHTML=" "+t.title;var c=document.createElement("div");s.appendChild(c),c.appendChild(r),c.appendChild(p),n.appendChild(s),i.appendChild(n),o._checkDisabledLayers()})),n}if(L.Control.Layers.prototype._addItem.call(this,e),e.layer.last){if(n=document.createElement("div"),e.layer.last.classname&&n.classList.add(e.layer.last.classname),e.layer.last.funct){n.style.textAlign="center";var l=document.createElement("input");l.setAttribute("type","button"),l.setAttribute("value",e.layer.last.name),e.layer.last.title&&l.setAttribute("title",e.layer.last.title),l.addEventListener("click",(function(t){e.layer.last.funct(t),t.stopPropagation()}),{once:!0,useCapture:!0}),n.appendChild(l)}else n.innerHTML="<b>"+e.layer.last.name+"</b>";this._overlaysList.appendChild(n)}},_onInputClick:function(e){var t,i,n=e.target.layerId,a=(i=this._getLayer(n).layer).hasOwnProperty("type"),o=this._layerControlInputs,l=[],r=[];this._handlingClick=!0;for(var s=o.length-1;s>=0;s--){t=o[s],i=this._getLayer(t.layerId).layer;var d=!e.target.hasOwnProperty("index")||e.target.index===t.index;!t.checked||!d||t.layerId!==n&&a?(!t.checked||i.type&&a)&&(t.checked=!1,i.checked=!1,r.push(i)):(l.push(i),e.target.hasOwnProperty("index")&&(i.setUrl(i.images[e.target.index].png),i.legend=i.images[e.target.index].legend,i.indexImage=e.target.index,i.checked=!0))}for(s=0;s<r.length;s++)this._map.hasLayer(r[s])&&this._map.removeLayer(r[s]);for(s=0;s<l.length;s++)this._map.hasLayer(l[s])||this._map.addLayer(l[s]);this._handlingClick=!1,this._refocusOnMap()},_update:function(){if(!this._container)return this;L.DomUtil.empty(this._baseLayersList),L.DomUtil.empty(this._overlaysList),this._layerControlInputs=[];var e,t,i,n,a=0;for(i=0;i<this._layers.length;i++)n=this._layers[i],this._addItem(n),t=t||n.overlay,e=e||!n.overlay,a+=n.overlay?0:1;return this.options.hideSingleBase&&(e=e&&a>1,this._baseLayersList.style.display=e?"":"none"),this._separator.style.display=t&&e?"":"none",this}}),e.exports=L.Control.Gdmlayer},7715:e=>{L.Control.Opacity=L.Control.extend({options:{position:"topright"},_value:.5,_layers:[],_bbox:null,_lang:"en",_hidden:!0,_translate:{en:{opacity:"Opacity"},fr:{opacity:"Opacité"}},initialize:function(e,t){this.setLang(e),t&&(this._value=t)},getValue:function(){return this._value},setLang:function(e){this._lang=["en","fr"].indexOf(e)>=0?e:"en"},setLayers:function(e){this._layers=e},setVisible:function(e){e?this._container.classList.remove("hidden"):this._container.classList.add("hidden")},setBbox:function(e){this._bbox=e,this._container.classList.remove("hidden")},onAdd:function(e){var t=L.DomUtil.create("div","leaflet-bar leaflet-control lfh-control-opacity hidden");L.DomEvent.disableScrollPropagation(t),L.DomEvent.disableClickPropagation(t);var i=L.DomUtil.create("a","icon-progress");i.setAttribute("title",this._translate[this._lang].opacity),t.appendChild(i);var n=L.DomUtil.create("div"),a=L.DomUtil.create("strong");a.textContent=this._translate[this._lang].opacity,n.appendChild(a);var o=L.DomUtil.create("input");o.setAttribute("type","range"),o.setAttribute("name","opacity"),o.setAttribute("min",0),o.setAttribute("max",1),o.setAttribute("step",.1),o.setAttribute("value",this._value),n.appendChild(o),t.appendChild(n);var l=this;return L.DomEvent.on(o,"change",(function(e){return l._layers.forEach((function(t){t.setOpacity(e.target.value)})),l._bbox&&l._bbox.setStyle((function(t){return{fillOpacity:e.target.value}})),L.DomEvent.stopPropagation(e),L.DomEvent.preventDefault(e),!1})),L.DomEvent.on(a,"click",(function(e){l._container.classList.remove("expand")})),L.DomEvent.on(i,"click",(function(e){l._container.classList.add("expand")})),t}}),e.exports=L.Control.Legend},9733:(e,t,i)=>{var n=i(3645),a=i(1667),o=i(5922);t=n(!1);var l=a(o);t.push([e.id,'\n.gdm-mouseposition {\n     position:absolute;\n     bottom:5px;\n     left:130px;\n  \n     padding: 0 5px;\n     color: #333;\n     z-index:1;\n     background: rgba(255, 255, 255, 0.7);\n}\n.research-map{\n  float:left;\n  margin-right: 10px;\n}\ndiv.map-container {\n}\ndiv[id="fmtMap"]{\n position:relative;\n width: 100%;\n min-height: 200px;\n z-index: 0;\n}\ndiv[id="fmtMap"].mtdt-small {\n max-height:200px;\n}\ndiv[id="fmtMap"].mtdt-small .leaflet-top .leaflet-control{\n   margin-top: 3px;\n}\ndiv[id="fmtMap"].mtdt-small .leaflet-left .leaflet-control{\n   margin-left: 3px;\n}\ndiv[id="fmtMap"].mtdt-small.leaflet-control .leaflet-control-zoom-in, \ndiv[id="fmtMap"].mtdt-small .leaflet-control .leaflet-control-zoom-out{\n  font-size:16px;\n}\ndiv[id="fmtMap"].mtdt-small .leaflet-bar a,\ndiv[id="fmtMap"].mtdt-small .leaflet-control a{\n width: 15px;\n height:15px;\n line-height:15px;\n}\ndiv[id="fmtMap"] .lfh-control-fullscreen {\n   cursor:pointer;\n}\ndiv[id="fmtMap"] .lfh-control-legend {\n   cursor: pointer;\n   background: white;\n   display:none;\n}\ndiv[id="fmtMap"] .lfh-control-opacity {\n  background:white;\n  display:block;\n}\ndiv[id="fmtMap"] .lfh-control-opacity.hidden {\n  display:none;\n}\ndiv[id="fmtMap"] .lfh-control-opacity.expand {\n  padding:5px;\n}\ndiv[id="fmtMap"] .lfh-control-opacity a.icon-progress{\n   background-image: url('+l+');\n   background-size: cover;\n   pointer-events:auto;\n   cursor:pointer;\n   display:block;\n}\ndiv[id="fmtMap"] .lfh-control-opacity.expand a.icon-progress{\n   display:none;\n}\ndiv[id="fmtMap"] .lfh-control-opacity div{\n   display:none;\n}\ndiv[id="fmtMap"] .lfh-control-opacity strong{\n   display:block;\n   text-align:right;\n   cursor:pointer;\n}\ndiv[id="fmtMap"] .lfh-control-opacity input{\n   pointer-events:auto;\n}\ndiv[id="fmtMap"] .lfh-control-opacity.expand div {\n    display:block;\n}\ndiv[id="fmtMap"] .lfh-control-legend img{\n    display:block;\n    max-height:250px;\n    max-width: 300px;\n}\ndiv[id="fmtMap"]  div.lfh-control-legend{\n    display:block;\n}\ndiv[id="fmtMap"]  div.lfh-control-legend.hidden,\n    div[id="fmtMap"]  div.lfh-control-legend.opacity{\n    display:none;\n}\ndiv[id="fmtMap"].mtdt-small .lfh-control-legend img{\n   max-width:120px;\n   max-height:100px;\n}\ndiv[id="fmtMap"] .lfh-control-legend img{\n    display: none;\n}\n/*  div[id="fmtMap"] .lfh-control-legend a{\n   display:block;\n } */\ndiv[id="fmtMap"] .lfh-control-legend.expand img{;\n   display:block;\n   margin-left:5px;\n}\ndiv[id="fmtMap"] .lfh-control-legend.expand img:first-child{\n    margin-left:0px;\n}\ndiv[id="fmtMap"] .lfh-control-legend.expand a{\n   display:none;\n}\ndiv[id="fmtMap"].mtdt-fullscreen{\n   min-height:400px;\n   width:100%;\n   font-size: 16px;\n}\ndiv[id="fmtMap"] a.leaflet-control-layers-toggle{\n  background-image: none;\n  color: black;\n  text-decoration: none;\n  text-align:center;\n}\ndiv[id="fmtMap"] a.leaflet-control-layers-toggle::before{\n   font-family:Formater;\n   content: "\\e806";\n}\ndiv[id="fmtMap"] .leaflet-control-layers-expanded {\n          padding: 3px 5px;\n}\ndiv[id="fmtMap"] section.leaflet-control-layers-list input[type=radio],\n     div[id="fmtMap"] section.leaflet-control-layers-list input[type=checkbox]{\n     display:none;\n}\ndiv[id="fmtMap"] section.leaflet-control-layers-list  input[type=radio] + span:before {\n     font-family: FontAwesome;\n     content: "\\f10c";\n     opacity:0.8;\n     cursor: pointer;\n}\ndiv[id="fmtMap"] section.leaflet-control-layers-list input[type=radio]:checked + span:before {\n     content: "\\f111";\n     opacity:1;\n}\ndiv[id="fmtMap"] section.leaflet-control-layers-list  input[type=checkbox] + span:before {\n     font-family: FontAwesome;\n     content: "\\f096";\n     opacity:0.8;\n     cursor: pointer;\n}\ndiv[id="fmtMap"] section.leaflet-control-layers-list input[type=checkbox]:checked + span:before {\n     content: "\\f046";\n     opacity:1;\n}\ndiv[id="fmtMap"] .leaflet-control-layers-base label span{\n   vertical-align: middle;\n}\ndiv[id="fmtMap"].mtdt-fullscreen{\n   min-height:300px;\n   font-size: 16px;\n}\ndiv[id="fmtMap"].mtdt-fullscreen a.leaflet-control-layers-toggle{\n   width: 30px;\n   height: 30px;\n   border-radius: 2px;\n   line-height: 30px;\n}\ndiv[id="fmtMap"].mtdt-fullscreen a.leaflet-control-layers{\n   border-radius: 2px;\n}\ndiv[id="fmtMap"].mtdt-small .leaflet-popup-content{\n\n   font-size: 10px;\n}\ndiv[id="fmtMap"].mtdt-fullscreen .leaflet-popup-content{\n\n   font-size: 14px;\n}\ndiv[id="fmtMap"] .leaflet-popup-content h3 {\n   margin: 0 0 5px 0;\n}\ndiv[id="fmtMap"] .leaflet-popup-content label {\n   font-weight:700;\n}\ndiv[id="fmtMap"] .leaflet-pane > svg path {\n  pointer-events: auto;\n}\ndiv[id="fmtMap"] h3 {\n   color: inherit;\n}\n',""]),e.exports=t},5922:e=>{e.exports="data:image/png;base64,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"},757:(e,t,i)=>{"use strict";i.d(t,{Z:()=>l});var n=i(739),a=i(5243);a.Control.Gdmlayer=i(6036),a.Control.Fullscreen=i(8665),a.Control.Legend=i(4221),i(7715),i(4812),a.ImageOverlay.Rotated.Tio=n.Z;const o={name:"GdmMap",components:{TioGraph:function(){return Promise.all([i.e(298),i.e(215)]).then(i.bind(i,4215))}},props:{featureCollection:{type:Object,default:null},bbox:{type:Object,default:null},tile:{type:Array,default:null},fullscreen:{type:String,default:null},removeHeight:{type:Number,default:null},images:{type:Array,default:null},series:{type:Object,default:null},serieIndex:{type:Number,default:0},lidar:{type:Object,default:null},serviceName:{type:String,default:null},lang:{type:String,default:"en"}},data:function(){return{map:null,controlLayer:null,controlLegend:null,controlOpacity:null,featureGroup:null,lidarFeature:null,bboxLayer:null,bboxTile:null,defaultRectangleOptions:{interactive:!1,fillColor:"orange",fillOpacity:.05,stroke:!0,weight:1,color:"orange"},selectListener:null,highlightListener:null,highlightedLayer:null,mouseposition:null,selectedLayer:null,fullscreenLayer:null,imageLayers:[],countImages:0,tio:{ptValues:{ns:[],ew:[]},showGraph:!1,img:null,searching:!1}}},watch:{bbox:function(e){this.initBbox()},featureCollection:function(e){this.initFeatureCollection()},removeHeight:function(e){this.fullscreenLayer&&this.fullscreenLayer.setRemoveHeight(newvalue)},images:function(e,t){this.initImageLayers(e)},serieIndex:function(e){this.serieDateChange(e)},lidar:function(e){e?this.lidarFeature=a.geoJSON(e,{style:function(e){return{interactive:!1,fillColor:"darkgreen",fillOpacity:.05,stroke:!0,weight:1,color:"darkgreen"}}}).addTo(this.map):this.lidarFeature&&(this.lidarFeature.remove(),this.lidarFeature=null)}},created:function(){this.tile&&(this.bboxTile=[[this.tile[1],this.tile[0]],[this.tile[3],this.tile[2]]]),this.highlightListener=this.changeHighlightedLayer.bind(this),document.addEventListener("gdm:processHighlight",this.highlightListener),this.selectListener=this.selectLayer.bind(this),document.addEventListener("gdm:processSelect",this.selectListener)},mounted:function(){this.initialize()},destroyed:function(){document.removeEventListener("gdm:processHighlight",this.highlightListener),this.highlightListener=null,document.removeEventListener("gdm:processSelect",this.selectListener),this.selectListener=null,this.map&&this.map.remove()},methods:{toggleImageLayer:function(e,t){var i=e.index;if(t){var n=this;this.imageLayers.forEach((function(t,a){a===i?(e.hasOwnProperty("indexImage")&&(t.indexImage=e.indexImage,t.legend=t.images[e.indexImage].legend,n.controlLegend.removeLegend(i),n.controlLegend.addLegend(0,i,t.images[e.indexImage].legend),t.setUrl(t.images[e.indexImage].png),n.controlLayer._update()),t.addTo(n.map)):n.map.hasLayer(t)&&t.remove()}))}else this.imageLayers[i].remove()},serieDateChange:function(e){var t=this,i=this.imageLayers.findIndex((function(e){return t.map.hasLayer(e)}));if(!(i<0||"serie"!==this.imageLayers[i].type&&"list"!==this.imageLayers[i].type)){var n=this.series[this.imageLayers[i].name].images[e];this.$emit("loadingLayer",!0),this.imageLayers[i].setUrl(n.png)}},changeHighlightedLayer:function(e){var t=e.detail.id;this.unHighlightLayer(),this.highlightLayer(t)},initialize:function(){var e=this.$el.querySelector("#fmtMap");if(this.map=a.map(e,{scrollWheelZoom:!1}).setView([51.505,-.09],1),this.controlLayer=new a.Control.Gdmlayer(null,null,{position:"topleft"}),this.controlLayer.tiles.arcgisTopo.layer.addTo(this.map),this.serviceName&&("GDM-OPT-ICE"===this.serviceName||"MPIC-OPT-ICE"===this.serviceName)){var t=a.tileLayer.wms("https://www.glims.org/mapservice?",{layers:"GLIMS_GLACIERS",format:"image/png"});this.controlLayer.addOverlay(t,"GLIMS Glaciers")}this.controlLayer.addTo(this.map),this.fullscreen&&(this.fullscreenLayer=new a.Control.Fullscreen(this.fullscreen,{lang:this.$i18n.locale,removeHeight:this.removeHeight,mouseWheel:!0}),this.fullscreenLayer.addTo(this.map)),this.controlLegend=new a.Control.Legend(this.$i18n.locale,(function(e){return"i"+e})),this.controlLegend.addTo(this.map),a.control.scale().addTo(this.map),this.controlLegend._container.classList.add("expand"),this.controlOpacity=new a.Control.Opacity(this.$i18n.locale),this.controlOpacity.addTo(this.map),this.map.getPane("overlayPane").style.pointerEvents="auto",this.initBbox(),this.initFeatureCollection(),this.initImageLayers(this.images);var i=this;this.map.on("mousemove",(function(e){var t=Math.round(1e4*e.latlng.lat)/1e4,n=Math.round(1e4*e.latlng.lng)/1e4;i.mouseposition="Latlng("+t+", "+n+")",i.$emit("mousemove",i.mouseposition)})),this.map.on("mouseout",(function(e){i.mouseposition=null}))},initBbox:function(){this.bboxLayer&&(this.bboxLayer.clearLayers(),this.bboxLayer.remove(),this.bboxLayer=null),this.map&&this.bbox&&(this.bboxLayer=a.geoJSON(this.bbox,{style:function(e){return{interactive:!1,fillColor:"red",fillOpacity:.05,stroke:!0,weight:1,color:"red"}}}).addTo(this.map),this.controlLayer.addOverlay(this.bboxLayer,"bbox")),this.bboxLayer&&this.map.fitBounds(this.bboxLayer.getBounds())},initFeatureCollection:function(){if(this.featureGroup&&(this.featureGroup.clearLayers(),this.featureGroup=null),this.map&&this.featureCollection&&this.featureCollection.type){var e=this;this.featureGroup=a.geoJSON(this.featureCollection,{style:function(t){return e.defaultRectangleOptions},onEachFeature:function(e,t){t.className="row"+e.properties.id,t.id=e.properties.id;var i="";void 0!==e.properties.processusName&&(i+="<h3>"+e.properties.processusName+"</h3>"),i+="<div><label>Id</label>: "+t.id+"</div>",e.properties.token&&(i+="<div><label>token</label>: "+e.properties.token+"</div>"),i+="<div><label>email</label>: "+e.properties.email+"</div>",i+="<div><label>service</label>: "+e.properties.serviceName+"</div>",t.bindPopup(i),t.on("click",(function(){this.openPopup();var e=new CustomEvent("gdm:selectProcessLayer",{detail:{id:t.id}});document.dispatchEvent(e)}))},interactive:!0,zIndex:100}).addTo(this.map),this.featureGroup&&this.featureGroup.getLayers().length>0?this.map.fitBounds(this.featureGroup.getBounds()):this.map.fitBounds([[-60,-120],[75,130]])}},initImageLayers:function(e){if(!(this.imageLayers.length>0)&&e&&e.length>0){var t=this;e.forEach((function(e,i){t.initImageLayer(e,i)})),this.controlOpacity.setLayers(this.imageLayers)}},initImageLayer:function(e,t){if(e.bbox)var i=[[e.bbox[1],e.bbox[0]],[e.bbox[3],e.bbox[2]]];else i=this.bboxTile&&"T"===e.title.charAt(0)?this.bboxTile:this.bboxLayer.getBounds();var n=this;if(e.mp4)var o=a.videoOverlay(e.mp4,i,{interactive:!0,opacity:this.controlOpacity.getValue()});else e.png&&!e.bounds?o=a.imageOverlay(e.png,i,{opacity:this.controlOpacity.getValue()}):e.png&&e.bounds?o=new a.ImageOverlay.Rotated(e.png,[e.bounds.pointTL[1],e.bounds.pointTL[0]],[e.bounds.pointTR[1],e.bounds.pointTR[0]],[e.bounds.pointBL[1],e.bounds.pointBL[0]],{opacity:.5}):e.root&&((o=new a.ImageOverlay.Rotated.Tio(e.root)).on("TIO:RESET",(function(e){n.tio.ptValues={ew:[],ns:[]},n.tio.showGraph=!1})),o.on("TIO:DATA",(function(e){n.$set(n.tio.ptValues,e.dimension,e.values),n.tio.showGraph=!0})),o.on("TIO:SEARCHING",(function(e){n.tio.searching=e.searching})),o.on("TIO:READY",(function(e){n.controlLayer.addOverlay(this,"Inversion"),n.$emit("tioReady",{layer:o,index:t})})),this.tio.img=o);e.legend&&(o.legend=e.legend),e.first&&(o.first=e.first),o.type=e.type?e.type:"image",o.name=e.title,o.on("load",(function(e){n.$emit("loadingLayer",!1)})),o.on("add",(function(){e.mp4&&(o.getElement().currentTime=0,o.getElement().play()),this.legend&&n.controlLegend.addLegend(0,t,this.legend),n.countImages=n.countImages+1,n.countImages>0?n.controlOpacity.setVisible(!0):n.controlOpacity.setVisible(!1),n.$emit("imageAdded",{index:t,indexImage:o.indexImage})})),o.on("remove",(function(){(n.images[t].legend||this.legend)&&n.controlLegend.removeLegend(t),n.countImages=n.countImages-1,n.countImages>0?n.controlOpacity.setVisible(!0):n.controlOpacity.setVisible(!1),n.$emit("imageRemoved",t)})),this.imageLayers.push(o),e.root||this.controlLayer.addOverlay(o,e.title,"common")},highlightLayer:function(e){0!==this.featureGroup.getLayers().length&&(this.highlightedLayer=this.featureGroup.getLayers().find((function(t){return t.id===e})),this.highlightedLayer&&this.highlightedLayer.setStyle({fillColor:"red",color:"red"}))},selectLayer:function(e){var t=e.detail.id,i=this.selectedLayer?this.selectedLayer.id:null;this.unselectLayer(),t&&t!==i&&(this.selectedLayer=this.featureGroup.getLayers().find((function(e){return e.id===t})),this.selectedLayer&&(this.selectedLayer.setStyle({fillColor:"red",color:"red"}),this.selectedLayer.openPopup())),this.selectedLayer?this.map.fitBounds(this.selectedLayer.getBounds(),{maxZoom:10}):this.map.fitBounds(this.featureGroup.getBounds())},unHighlightLayer:function(){var e=this.selectedLayer?this.selectedLayer.id:null;this.highlightedLayer&&this.highlightedLayer.id!==e&&(this.highlightedLayer.setStyle(this.defaultRectangleOptions),this.highlightedLayer=null)},unselectLayer:function(){this.selectedLayer&&(this.selectedLayer.setStyle(this.defaultRectangleOptions),this.selectedLayer.closePopup(),this.selectedLayer=null)}}};i(8721),i(1052),i(2969),i(3224);const l=(0,i(1900).Z)(o,(function(){var e=this,t=e._self._c;return t("span",{staticClass:"gdm-map"},[e.tio&&e.tio.searching?t("div",{staticClass:"fa fa-spinner fa-spin fa-2x fa-fw",staticStyle:{position:"fixed",top:"50%",left:"50%","z-index":"3002",color:"#333"}}):e._e(),e._v(" "),e.tio.img?t("tio-graph",{directives:[{name:"show",rawName:"v-show",value:e.tio.showGraph,expression:"tio.showGraph"}],attrs:{dates:e.tio.img.dates,"ns-values":e.tio.ptValues.ns,"ew-values":e.tio.ptValues.ew,keys:e.tio.img.keys,maximum:e.tio.img.max,lang:e.lang},on:{close:function(t){e.tio.showGraph=!1}}}):e._e(),e._v(" "),t("div",{staticClass:"mtdt-small",attrs:{id:"fmtMap"}})],1)}),[],!1,null,null,null).exports},3224:(e,t,i)=>{var n=i(9733);n.__esModule&&(n=n.default),"string"==typeof n&&(n=[[e.id,n,""]]),n.locals&&(e.exports=n.locals),(0,i(5346).Z)("444dc944",n,!0,{})}}]);
//# sourceMappingURL=757.gdm-search-components-vjs.js.map