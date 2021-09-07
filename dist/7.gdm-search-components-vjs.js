(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{245:function(e,t,n){var r=n(329);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);(0,n(3).default)("7ecbb387",r,!0,{})},328:function(e,t,n){"use strict";n(245)},329:function(e,t,n){(t=n(2)(!1)).push([e.i,'\n.gdm-add-role {\n display: inline-block;\n font-size: 0.9rem;\n border:1px solid grey;\n padding:10px;\n background: #F3F3F3;\n margin:5px 0 0 10px;\n}\n.gdm-add-role input[type="text"]{\n  min-width:80px;\n  width:80px;\n  max-width:80px;\n}\n.gdm-add-role input[type="text"],\n.gdm-add-role select{\n  line-height:1;\n  border-radius: 0;\n   height: 19px;\n   border-style:inset;\n   padding: 1px 3px;\n   box-sizing: border-box;\n\n    margin: 0em;\n    /*font: 400 13.3333px Arial;*/\n    border-width: 1px;\n    border-style: inset;\n    border-color: -internal-light-dark-color(rgb(118, 118, 118), rgb(195, 195, 195));\n}\n.gdm-add-role input[type="button"],\n.gdm-add-role select {\n\n  padding: 0 2px;\n}\n.gdm-add-role input[type="button"] {\nline-height:1;\nvertical-align:baseline;\n}\n',""]),e.exports=t},340:function(e,t,n){"use strict";n.r(t);var r={name:"GdmRestrictTo",components:{},props:{selected:{type:String,default:null},url:{type:String,default:null}},created:function(){this.current=this.selected,this.initialize()},mounted:function(){this.current=this.selected},destroyed:function(){},data:function(){return{roles:[],current:null,mode:null,newRole:null,providers:[],userProviders:[],selectedProvider:null,description:{fr:"",en:""},msg:null}},methods:{addNewRole:function(e){if(e.error)this.msg=e.error;else if(e.success){this.msg=null,this.mode=null;var t=this.newRole;if(this.selectedProvider){var n=this.selectedProvider;t+=" ("+this.providers.find((function(e){return e.id===n})).name+")"}this.roles.push({index:this.newRole,value:t}),this.selectedProvider=null,this.current=this.newRole,this.newRole=null}},addRole:function(){console.log(this.description),this.$http.post(this.url+"roles/addService",{role:this.newRole,provider:this.selectedProvider,description_fr:this.description.fr,description_en:this.description.en},{credentials:!0,emulateJSON:!0}).then((function(e){this.addNewRole(e.body)}),(function(e){return console.log("error server")}))},cancel:function(){this.msg=null,this.mode=null},getRoles:function(){var e=this;this.$http.get(this.url+"roles/getService",{credentials:!0}).then((function(t){return e.initRoles(t.body)}),(function(e){return console.log("error roles not found")}))},getUserProviders:function(){this.$http.get(this.url+"api/getUserProviders",{credentials:!0}).then((function(e){this.providers=e.body,this.userProviders=this.providers.filter((function(e){return e.checked})),this.userProviders.length>0&&(this.selectedProvider=this.userProviders[0].id),this.getRoles()}),(function(e){return console.log("error providers")}))},initialize:function(){this.description.fr="",this.description.en="",this.getUserProviders()},initRoles:function(e){var t=this;e.forEach((function(e){if("PRIME"!==e.r_id){var n=e.r_id;if(e.r_fk_provider_id)n+=" ("+t.providers.find((function(t){return t.id===e.r_fk_provider_id})).name+")";t.roles.push({index:e.r_id,value:n})}}))}}},i=(n(328),n(1)),o=Object(i.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("span",{staticClass:"gdm-restrict-to"},[n("select",{directives:[{name:"model",rawName:"v-model",value:e.current,expression:"current"}],attrs:{name:"s_restrictTo"},on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.current=t.target.multiple?n:n[0]}}},[n("option"),e._v(" "),e._l(e.roles,(function(t){return n("option",{domProps:{value:t.index,selected:t.index===e.current}},[e._v(e._s(t.value))])}))],2),e._v(" "),"add"===e.mode?n("div",[n("div",{staticClass:"gdm-add-role"},[e._v("\n\t     Nouveau \n\t\t   "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.newRole,expression:"newRole"}],attrs:{type:"text",placeholder:"ROLE",pattern:"[A-Z]{3,10}"},domProps:{value:e.newRole},on:{input:function(t){t.target.composing||(e.newRole=t.target.value)}}}),e._v(" "),e.userProviders.length>0?n("span",{attrs:{title:"Seuls les responsables de ce fournisseur pourront donner ce rôle à un utilisateur"}},[e._v("\n\t\t     associé à \n\t\t\t   "),n("select",{directives:[{name:"model",rawName:"v-model",value:e.selectedProvider,expression:"selectedProvider"}],on:{change:function(t){var n=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.selectedProvider=t.target.multiple?n:n[0]}}},e._l(e.userProviders,(function(t){return n("option",{domProps:{value:t.id}},[e._v(e._s(t.name))])})),0)]):e._e(),e._v(" "),n("div",[e._v("Description:")]),e._v(" "),n("div",{staticStyle:{"margin-left":"5px"}},[n("span",{staticStyle:{"vertical-align":"top"}},[e._v("fr: ")]),n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.description.fr,expression:"description['fr']"}],domProps:{value:e.description.fr},on:{input:function(t){t.target.composing||e.$set(e.description,"fr",t.target.value)}}}),e._v(" "),n("span",{staticStyle:{"vertical-align":"top"}},[e._v("en: ")]),n("textarea",{directives:[{name:"model",rawName:"v-model",value:e.description.en,expression:"description['en']"}],domProps:{value:e.description.en},on:{input:function(t){t.target.composing||e.$set(e.description,"en",t.target.value)}}})]),e._v(" "),n("div",{staticStyle:{float:"right",padding:"10px 0"}},[n("input",{attrs:{type:"button",value:"Ajouter"},on:{click:e.addRole}}),e._v(" "),n("input",{attrs:{type:"button",value:"Annuler"},on:{click:e.cancel}})]),e._v(" "),n("div",{staticStyle:{clear:"right",color:"darkred","font-style":"italic"}},[e._v(e._s(e.msg))])])]):e._e(),e._v(" "),"add"!==e.mode&&e.userProviders.length>0?n("input",{attrs:{type:"button",value:"Nouveau Rôle"},on:{click:function(t){e.mode="add"}}}):e._e()])}),[],!1,null,null,null);t.default=o.exports}}]);
//# sourceMappingURL=7.gdm-search-components-vjs.js.map