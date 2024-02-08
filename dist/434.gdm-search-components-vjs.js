(self.webpackChunkgdm_search_components_vjs=self.webpackChunkgdm_search_components_vjs||[]).push([[434],{8768:e=>{e.exports=function(e){e.options.__i18n=e.options.__i18n||[],e.options.__i18n.push('{"en":{"common":"Common products","copied_to_clipboard":"The curl command has been copied to clipboard","copy_curl":"Curl cmd","copy_in_clipboard":"Copy the curl command\\nin clipboard","download":"Download","folder":"Folder","preview":"Visualization","product_license":"The products resulting from the DSM-OPT service are made available under a <a class=\'gdm-link\'  href=\'https://creativecommons.org/licenses/by-nc/4.0/legalcode.fr\' target=\'_blank\'>CC-BY-NC</a> license, excluding any commercial use.","results":"Results","series":"Interferogram list","unauthorized_clipboard":"Your browser does not allow copying to the clipboard"},"fr":{"common":"Produits communs","copied_to_clipboard":"La commande Curl a été copiée dans le presse-papier","copy_curl":"Cmd Curl","copy_in_clipboard":"Copier la commande curl\\ndans le presse-papier","download":"Télécharger","folder":"Répertoire","preview":"Visualisation","product_license":"Les produits issus du service DSM-OPT sont mis à disposition sous licence <a class=\'gdm-link\' href=\'https://creativecommons.org/licenses/by-nc/4.0/legalcode.fr\' target=\'_blank\'>CC-BY-NC</a> excluant toute exploitation commerciale.","results":"Résultats","series":"Liste d\'interférogrammes","unauthorized_clipboard":"Votre navigateur ne permet la copie dans le presse-papier"}}'),delete e.options._Ctor}},9278:(e,t,i)=>{(t=i(3645)(!1)).push([e.id,"\n.gdm-image-layer h4[data-v-63a9a313] {\n  margin: 10px 5px 0 5px;\n  font-size: 0.9rem;\n}\n.gdm-image-layer h4[data-v-63a9a313]:first-child {\n  margin-top:0;\n}\n.gdm-image-layer > div[data-v-63a9a313] {\n  margin-left:5px;\n}\ndiv.partial-result[data-v-63a9a313] {\n  max-width:150px;\n  display:inline-block;\n  margin-top:10px;\n}\ndiv.partial-result a.button[data-v-63a9a313] {\n min-width:145px;\n}\ndiv.partial-result div.cmd-curl[data-v-63a9a313] {\n  position:relative;\n  cursor:pointer;\n  font-size:0.8em;\n  text-align:center;\n  color:#555;\n}\ndiv.partial-result div.cmd-curl[data-v-63a9a313]:hover {\n  color:black;\n}\ndiv.partial-result div.cmd-curl span[data-v-63a9a313] {\n text-decoration: underline;\n}\ndiv.partial-result a.button span[data-v-63a9a313] {\n  text-transform: capitalize;\n}\n.gdm-image-layer[data-v-63a9a313] {\n  cursor: pointer;\n}\n.gdm-process-result[data-v-63a9a313] {\n  padding: 0 0 0 5px;\n}\n.gdm-process-result > div[data-v-63a9a313] {\n  display:inline-block;\n  padding-left:5px;\n  vertical-align:top;\n}\n.gdm-comment[data-v-63a9a313] {\n  display:block;\n  margin-top:10px;\n  font-style:italic;\n  font-size: 0.8rem;\n  line-height: 1;\n  color: #333;\n  text-align:justify;\n}\n.gdm-process-result h3[data-v-63a9a313] {\n  margin-top:0; \n  margin-bottom:5px;\n}\n.result-tooltip[data-v-63a9a313] {\n  position: absolute;\n  background-color: #fafafa;\n  border: 1px solid #a3a3a3;\n  font-size: smaller;\n  padding: 4px;\n  width: 160px;\n  text-align: left;\n  left:150px;\n  color:black;\n  z-index:100;\n  -webkit-box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);\n  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);\n}\nspan div.result-tooltip[data-v-63a9a313]  {\n  cursor: pointer;\n  font-size:0.8rem;\n  left:0;\n}\n",""]),e.exports=t},8e3:(e,t,i)=>{(t=i(3645)(!1)).push([e.id,"\n.gdm-serie-navigation[data-v-7e5bbf2b] {\n  background: #fff;\n  border-radius: 5px;\n  padding: 8px 3px;\n  font-size:0.8rem;\n  border: 2px solid rgba(0,0,0,0.2);\n  max-width:330px;\n  text-align:center;\n}\nspan.serie-navigation span[data-v-7e5bbf2b]{\n  font-size: 1.3em;\n  cursor: pointer;\n  margin: 0 1px;\n  padding:5px;\n cursor:pointer;\n border-radius:3px;\n /*background:#8c0209;*/\n background:grey;\n padding:3px 5px;\n color:white;\n  vertical-align:middle;\n  opacity:0.9;\n}\nspan.serie-navigation.disabled span[data-v-7e5bbf2b]{\n  opacity:0.3;\n  cursor:not-allowed;\n}\nspan.serie-navigation:not(.disabled) span[data-v-7e5bbf2b]:hover{\n  opacity:1;\n  font-size:1.31em;\n}\n",""]),e.exports=t},5434:(e,t,i)=>{"use strict";i.d(t,{Z:()=>o});const a={name:"GdmProcessResult",components:{GdmSerieNavigation:i(1235).Z},props:{result:{type:Object,default:null},lang:{type:String,default:"en"},images:{type:Array,default:null},series:{type:Object,default:null},serieIndex:{type:Number,default:0},serviceName:{type:String,default:null},synthesis:{type:String,default:null},color:{type:String,default:null}},data:function(){return{cmdCurl:null,partialCurl:{},showTooltip:!1,list:null}},watch:{result:function(e){this.initCmdCurl(e)},images:function(e){console.log(e)}},computed:{serieName:function(){if(!this.images)return null;var e=this.images.find((function(e){return e.checked}));return e?e.title:null},hasFirst:function(){return this.images.some((function(e){return e.first}))}},destroyed:function(){},created:function(){this.$i18n.locale=this.lang,this.initCmdCurl(this.result)},methods:{close:function(e,t){this.showTooltip[t]=!1,e.stopPropagation()},copyCmd:function(){var e=this;navigator.clipboard.writeText(this.cmdCurl).then((function(){e.showTooltip=!0,setTimeout((function(){e.showTooltip=!1}),2e3)}),(function(){alert(e.$i18n.t("unauthorized_clipboard"))}))},copyPartialCmd:function(e){var t=this;navigator.clipboard.writeText(this.partialCurl[e]).then((function(){t.$set(t.showTooltip,e,!0),setTimeout((function(){t.$set(t.showTooltip,e,!1)}),2e3)}),(function(){alert(t.$i18n.t("unauthorized_clipboard"))}))},dateSerieChange:function(e){this.$emit("dateSerieChange",e)},initCmdCurl:function(e){var t="";if(e.results&&(t=e.results.split("/").pop().split("#")[0].split("?")[0],this.cmdCurl='curl "'+e.results+'" -o '+t),e["partial results"]){var i=e["partial results"];for(var a in this.showTooltip={},i)t=i[a].split("/").pop().split("#")[0].split("?")[0],this.partialCurl[a]='curl "'+i[a]+'" -o '+t}},toggleImage:function(e){this.$emit("toggleImage",{index:e})},toggleImageTio:function(e,t){this.$emit("toggleImage",{index:e,indexImage:t})}}};i(520);var s=i(1900),n=i(8768);const r=i.n(n)();var l=(0,s.Z)(a,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"gdm-process-result"},[t("div",[t("h3",{style:{color:e.color}},[e._v(e._s(e.$t("results")))]),e._v(" "),e.result["partial results"]?t("div",e._l(e.result["partial results"],(function(i,a){return t("div",{staticClass:"partial-result"},[t("a",{staticClass:"button",attrs:{href:i}},[t("i",{staticClass:"fa fa-download"}),e._v(" "),t("span",[e._v(e._s(a))])]),e._v(" "),t("div",{staticClass:"cmd-curl",attrs:{title:e.$t("copy_in_clipboard")},on:{click:function(t){return e.copyPartialCmd(a)}}},[e._v("\n\t           ("),t("i",{staticClass:"fa fa-clipboard"}),e._v(" "),t("span",[e._v(e._s(e.$t("copy_curl"))+")")]),e._v(" "),t("div",{directives:[{name:"show",rawName:"v-show",value:e.showTooltip[a],expression:"showTooltip[name]"}],staticClass:"result-tooltip",on:{click:function(t){return e.close(t,a)}}},[e._v(e._s(e.$t("copied_to_clipboard")))])])])})),0):e.result.results?t("div",{staticStyle:{"margin-top":"10px"}},[t("a",{staticClass:"button",attrs:{href:e.result.results}},[t("i",{staticClass:"fa fa-download"}),e._v(" "+e._s(e.$t("download"))+"\n\t      ")]),e._v(" "),t("a",{staticClass:"button",staticStyle:{position:"relative"},attrs:{title:e.$t("copy_in_clipboard")},on:{click:function(t){return e.copyCmd(e.result.results)}}},[t("i",{staticClass:"fa fa-clipboard"}),e._v(" "+e._s(e.$t("copy_curl"))+"\n\t        "),t("div",{directives:[{name:"show",rawName:"v-show",value:e.showTooltip,expression:"showTooltip"}],staticClass:"result-tooltip"},[e._v(e._s(e.$t("copied_to_clipboard")))]),e._v(" "),t("textarea",{directives:[{name:"model",rawName:"v-model",value:e.cmdCurl,expression:"cmdCurl"},{name:"show",rawName:"v-show",value:!1,expression:"false"}],ref:"areaCmd",domProps:{value:e.cmdCurl},on:{input:function(t){t.target.composing||(e.cmdCurl=t.target.value)}}},[e._v(e._s(e.cmdCurl))])])]):e._e()]),e._v(" "),"DSM-OPT"===e.serviceName?t("div",{staticClass:"gdm-comment",domProps:{innerHTML:e._s(e.$t("product_license"))}}):e._e(),e._v(" "),e.result.dir?t("div",{staticStyle:{display:"block"}},[t("a",{staticClass:"button",staticStyle:{margin:"10px 0 20px 0"},attrs:{href:e.result.dir,target:"_blank"}},[t("i",{staticClass:"fa fa-folder"}),e._v(" "+e._s(e.$t("folder"))+"\n      ")]),e._v(" "),e.result.synthesis?t("a",{staticClass:"button",staticStyle:{margin:"10px 0 20px 10px"},attrs:{href:e.result.synthesis,target:"_blank"}},[t("i",{staticClass:"fa fa-file-text"}),e._v(" Synthèse")]):e._e()]):e._e(),e._v(" "),!e.result.dir&&e.images&&e.images.length>0?t("div",{staticStyle:{"margin-bottom":"5px"},style:{width:e.series?"35%":"100%"}},[t("h3",{staticStyle:{margin:"10px 0 0 0"},style:{color:e.color}},[e._v(e._s(e.$t("preview")))]),e._v(" "),e._l(e.images,(function(i,a){return"serie"!==i.type&&"list"!==i.type?t("div",{staticClass:"gdm-image-layer"},[i.first?t("h4",{staticStyle:{"margin-bottom":"0"},style:{color:e.color}},[e._v(e._s(e.$t(i.first)))]):e._e(),e._v(" "),i.images?t("div",e._l(i.images,(function(s,n){return t("div",[t("i",{staticClass:"fa",class:i.checked&&i.indexImage===n?"fa-eye":"fa-eye-slash",staticStyle:{"vertical-align":"top"},on:{click:function(t){return e.toggleImageTio(a,n)}}}),e._v(" "),t("div",{staticStyle:{display:"inline-block",margin:"0","max-width":"calc(100% - 30px)"}},[e._v(e._s(s.title))])])})),0):t("div",[t("i",{staticClass:"fa",class:i.checked?"fa-eye":"fa-eye-slash",staticStyle:{"vertical-align":"top"},on:{click:function(t){return e.toggleImage(a)}}}),e._v(" "),t("div",{staticStyle:{display:"inline-block",margin:"0","max-width":"calc(100% - 30px)"}},[e._v(e._s(i.title))])])]):e._e()}))],2):e._e(),e._v(" "),e.result.dir&&e.images&&e.images.length>0?t("div",[t("h3",{staticStyle:{margin:"10px 0 0 0"},style:{color:e.color}},[e._v(e._s(e.$t("preview")))]),e._v(" "),e.images&&e.images.length>0?t("div",{staticStyle:{"margin-bottom":"5px"}},e._l(e.images,(function(i,a){return"serie"!==i.type&&"list"!==i.type?t("div",{staticClass:"gdm-image-layer"},[i.first?t("h4",{staticStyle:{"margin-bottom":"0"},style:{color:e.color}},[e._v(e._s(e.$t(i.first)))]):e._e(),e._v(" "),t("div",{staticStyle:{"margin-left":"5px"}},[t("i",{staticClass:"fa",class:i.checked?"fa-eye":"fa-eye-slash",staticStyle:{"vertical-align":"top"},on:{click:function(t){return e.toggleImage(a)}}}),e._v(" "),i.tif&&e.serviceName.indexOf("SAR")>=0?t("a",{staticClass:"fa fa-download",staticStyle:{padding:"0 5px",color:"black"},attrs:{href:i.tif,title:e.$t("download")}}):e._e(),e._v(" "),t("div",{staticStyle:{display:"inline-block",margin:"0","max-width":"calc(100% - 20px)"}},[e._v(e._s(i.title))])])]):e._e()})),0):e._e()]):e._e(),e._v(" "),e.series?t("div",{staticStyle:{"max-width":"330px","min-width":"300px"}},[t("div",[t("gdm-serie-navigation",{attrs:{series:e.series,"serie-name":e.serieName,"serie-index":e.serieIndex,color:e.color,lang:e.lang,main:!0},on:{dateChange:e.dateSerieChange}})],1),e._v(" "),e._l(e.images,(function(i,a){return"serie"===i.type||"list"===i.type?t("div",{staticClass:"gdm-image-layer"},[i.first?t("h4",{staticStyle:{"margin-bottom":"0"},style:{color:e.color}},[e._v(e._s(i.first))]):e._e(),e._v(" "),t("div",[t("i",{staticClass:"fa",class:i.checked?"fa-eye":"fa-eye-slash",staticStyle:{"vertical-align":"top"},on:{click:function(t){return e.toggleImage(a)}}}),e._v(" "),i.tif?t("a",{staticClass:"fa fa-download",staticStyle:{padding:"0 5px",color:"black"},attrs:{href:i.tif,title:e.$t("download")}}):e._e(),e._v(" "),t("div",{staticStyle:{display:"inline-block",margin:"0","max-width":"calc(100% - 20px)"}},[e._v(e._s(i.title))])])]):e._e()}))],2):e._e()])}),[],!1,null,"63a9a313",null);"function"==typeof r&&r(l);const o=l.exports},1235:(e,t,i)=>{"use strict";i.d(t,{Z:()=>r});var a=i(381),s=i.n(a);const n={name:"GdmSerieNavigation",props:{main:{type:Boolean,default:!1},lang:{type:String,default:"en"},fullscreen:{type:Boolean,default:!1},series:{type:Object,default:null},serieIndex:{type:Number,default:0},serieName:{type:String,default:null},color:{type:String,default:null}},computed:{lastIndex:function(){return this.series&&this.serieName&&this.series[this.serieName]?this.series[this.serieName].images.length-1:0}},data:function(){return{serieDate:"Serie navigation",timer:null,playerChangeListener:null}},watch:{serieIndex:function(e){this.computeSerieDate(this.serieName,e)},serieName:function(e){this.computeSerieDate(e,0),this.goToFirst()}},created:function(){this.$i18n.locale=this.lang,s().locale(this.lang),this.playerChangeListener=this.changePlayer.bind(this),document.addEventListener("SeriePlayerChange",this.playerChangeListener)},mounted:function(){},destroyed:function(){this.main&&this.timer&&(clearInterval(this.timer),this.timer=!1),document.removeEventListener("SeriePlayerChange",this.playerChangeListener),this.playerChangeListener=null},methods:{computeSerieDate:function(e,t){if(this.series&&this.series[e])if(Object.keys(this.series)[0],console.log(this.series[this.serieName].images[t]),this.series[this.serieName].images[t].date){if(this.series[this.serieName].images[t].date.indexOf("-")<5){var i=this.series[this.serieName].images[t].date;this.serieDate=s()(i,"YYYY-MM-DD").format("ll")}else{i=this.series[this.serieName].images[t].date.substring(0,8);var a=this.series[this.serieName].images[t].date.substring(9);this.serieDate=s()(i,"YYYYMMDD").format("ll")}a&&(this.serieDate+=" &rarr; "+s()(a,"YYYYMMDD").format("ll"))}else this.series[this.serieName].images[t].startDate&&(i=this.series[this.serieName].images[t].startDate,this.serieDate=s()(i,"YYYY-MM-DD").format("ll"),a=this.series[this.serieName].images[t].completionDate,this.serieDate+=" &rarr; "+s()(i,"YYYY-MM-DD").format("ll"));else this.serieDate="Serie navigation"},goToFirst:function(){this.$emit("dateChange",0)},goToLast:function(){this.$emit("dateChange",this.lastIndex)},next:function(){this.serieIndex<this.lastIndex&&this.$emit("dateChange",this.serieIndex+1)},play:function(){this.timer||(this.timer=setInterval(this.next,1e3))},previous:function(){this.$emit("dateChange",this.serieIndex-1)},togglePlay:function(){var e=new CustomEvent("SeriePlayerChange");document.dispatchEvent(e)},changePlayer:function(){this.main?this.timer?(clearInterval(this.timer),this.timer=!1):this.play():this.timer=!this.timer}}};i(1454);const r=(0,i(1900).Z)(n,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"gdm-serie-navigation",style:{background:e.fullscreen?"#fff":e.$shadeColor(e.color,.85)}},[t("span",{staticClass:"serie-navigation",class:{disabled:0===e.serieIndex}},[t("span",{staticClass:"fa fa-angle-double-left",style:{backgroundColor:e.color},on:{click:function(t){return e.goToFirst()}}}),e._v(" "),t("span",{staticClass:"fa fa-angle-left",style:{backgroundColor:e.color},on:{click:function(t){return e.previous()}}})]),e._v(" "),t("span",{staticClass:"serie-navigation",class:{disabled:e.serieIndex===e.lastIndex},staticStyle:{display:"inline-block","vertical-align":"top","text-align":"center"}},[t("div",{domProps:{innerHTML:e._s(e.serieDate)}}),e._v(" "),t("span",{staticClass:"fa",class:e.timer?"fa-pause":"fa-play",style:{backgroundColor:e.color},on:{click:e.togglePlay}})]),e._v(" "),t("span",{staticClass:"serie-navigation",class:{disabled:e.serieIndex===e.lastIndex}},[t("span",{staticClass:"fa fa-angle-right",style:{backgroundColor:e.color},on:{click:function(t){return e.next()}}}),e._v(" "),t("span",{staticClass:"fa fa-angle-double-right",style:{backgroundColor:e.color},on:{click:function(t){return e.goToLast()}}})])])}),[],!1,null,"7e5bbf2b",null).exports},520:(e,t,i)=>{var a=i(9278);a.__esModule&&(a=a.default),"string"==typeof a&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals),(0,i(5346).Z)("9f59f534",a,!0,{})},1454:(e,t,i)=>{var a=i(8e3);a.__esModule&&(a=a.default),"string"==typeof a&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals),(0,i(5346).Z)("70b8fb74",a,!0,{})}}]);
//# sourceMappingURL=434.gdm-search-components-vjs.js.map