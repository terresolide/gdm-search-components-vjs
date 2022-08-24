(self.webpackChunkgdm_search_components_vjs=self.webpackChunkgdm_search_components_vjs||[]).push([[602],{9371:(t,e,n)=>{(e=n(3645)(!1)).push([t.id,'\n.gdm-step {\n  width: 400px;\n  border: 1px dotted grey;\n  padding: 5px 10px;\n  min-height: 25px;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.85);\n  margin: 5px 0;\n}\n.gdm-step label {\n  display: inline-block;\n  min-width: 120px;\n  width: 120px;\n  text-align:right;\n  font-weight: 800;\n  vertical-align:top;\n}\n.gdm-step input[type="text"],\n.gdm-step textarea {\n min-width: 250px;\n}\n.gdm-step textarea {\n  padding:6px;\n}\n.gdm-step .gdm-button-serie {\n   margin: 10px 0 10px 125px;\n}\n.gdm-manage-step input[type="submit"].gdm-button {\n  font-family:inherit;\n  opacity:1;\n  font-size: inherit;\n}\n.gdm-manage-step span.gdm-button,\n.gdm-manage-step input.gdm-button {\n  \n  cursor: pointer;\n  border: 1px solid grey;\n  border-radius: 3px;\n  padding: 3px;\n  background: #eee;\n  opacity:0.8;\n  min-width: 16px;\n  text-align: center;\n   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);\n}\n.gdm-step span.gdm-button.gdm-disable {\n  pointer-events: none;\n  opacity: 0.5;\n}\n.gdm-step span.gdm-button:hover {\n  opacity: 1;\n}\n',""]),t.exports=e},2602:(t,e,n)=>{"use strict";n.r(e),n.d(e,{default:()=>i});const s={name:"GdmManageStep",components:{},props:{api:{type:String,default:null},serviceId:{type:Number,default:null}},computed:{},created:function(){this.getSteps()},mounted:function(){},destroyed:function(){},data:function(){return{steps:[],mode:null,newStep:{stp_name:null,stp_title:null,stp_description:null}}},methods:{add:function(){var t=this;this.$el.querySelectorAll("#form_new input:invalid").length>0||this.api&&this.serviceId&&this.$http.post(this.api+"/add/"+this.serviceId,this.newStep,{emulateJSON:!0,credentials:!0}).then((function(e){return t.display(e)}),(function(e){return t.error(e)}))},getSteps:function(){var t=this;this.api&&this.serviceId&&this.$http.get(this.api+"/get/"+this.serviceId,{credentials:!0}).then((function(e){return t.display(e)}),(function(e){return t.error(e)}))},display:function(t){this.mode=null,this.newStep={stp_name:null,stp_title:null,stp_description:null},this.steps=t.body},displayForm:function(){this.mode="add"},edit:function(t){console.log(t),this.$set(this.steps[t],"edit",!0)},error:function(t){switch(t.status){case 403:alert("Accès interdit: déconnecté?");break;case 402:alert("Vous n'avez pas l'autorisation d'éditer ce service")}},moveDown:function(t){var e=this.steps[t],n=this.steps[t+1];this.reverse(e,n)},moveUp:function(t){var e=this.steps[t-1],n=this.steps[t];this.reverse(e,n)},remove:function(t){var e=this;this.api&&this.serviceId&&this.$http.post(this.api+"/remove/"+this.serviceId,{step_id:this.steps[t].stp_id},{emulateJSON:!0,credentials:!0}).then((function(t){return e.display(t)}),(function(t){return e.error(t)}))},reverse:function(t,e){var n=this;this.api&&this.serviceId&&this.$http.post(this.api+"/reverse/"+this.serviceId,{step1:t,step2:e},{emulateJSON:!0,credentials:!0}).then((function(t){return n.display(t)}),(function(t){return n.error(t)}))},reset:function(t){null===t?this.mode=null:this.$set(this.steps[t],"edit",!1)},save:function(t){var e=this,n=this.steps[t];this.$el.querySelectorAll("#form_"+t+" input:invalid").length>0||(delete n.edit,this.api&&this.serviceId&&this.$http.post(this.api+"/update/"+this.serviceId,n,{emulateJSON:!0,credentials:!0}).then((function(t){return e.display(t)}),(function(t){return e.error(t)})))}}};n(828);const i=(0,n(1900).Z)(s,(function(){var t=this,e=t._self._c;return e("span",{staticClass:"gdm-manage-step"},[t._l(t.steps,(function(n,s){return e("div",{staticClass:"gdm-step"},[t.steps[s].edit?e("div",[e("form",{attrs:{id:"form_"+s}},[e("label",[t._v("Identifiant")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:n.stp_name,expression:"step.stp_name"}],attrs:{type:"text",pattern:"[a-zA-Z0-9_-]{3,30}",title:"Chaîne alphanumérique  entre 3 et 20 caractères"},domProps:{value:n.stp_name},on:{input:function(e){e.target.composing||t.$set(n,"stp_name",e.target.value)}}}),t._v(" "),e("label",[t._v("Titre")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:n.stp_title,expression:"step.stp_title"}],attrs:{type:"text"},domProps:{value:n.stp_title},on:{input:function(e){e.target.composing||t.$set(n,"stp_title",e.target.value)}}}),t._v(" "),e("label",[t._v("Description")]),t._v(" "),e("textarea",{directives:[{name:"model",rawName:"v-model",value:n.stp_description,expression:"step.stp_description"}],domProps:{value:n.stp_description},on:{input:function(e){e.target.composing||t.$set(n,"stp_description",e.target.value)}}}),t._v(" "),e("div",{staticClass:"gdm-button-serie"},[e("span",{staticClass:"gdm-button",on:{click:function(e){return t.reset(s)}}},[t._v("Annuler")]),t._v(" "),e("span",{staticClass:"gdm-button",on:{click:function(e){return t.save(s)}}},[t._v("Enregistrer")])])])]):e("span",[t._v(t._s(n.stp_name))]),t._v(" "),t.steps[s].edit?t._e():e("div",{staticStyle:{float:"right"}},[e("span",{staticClass:"fa fa-pencil gdm-button",on:{click:function(e){return t.edit(s)}}}),t._v(" "),e("span",{staticClass:"fa fa-arrow-up gdm-button",class:{"gdm-disable":0===s},on:{click:function(e){return t.moveUp(s)}}}),t._v(" "),e("span",{staticClass:"fa fa-arrow-down gdm-button",class:{"gdm-disable":s===t.steps.length-1},on:{click:function(e){return t.moveDown(s)}}}),t._v(" "),e("span",{staticClass:"fa fa-close gdm-button",on:{click:function(e){return t.remove(s)}}})])])})),t._v(" "),e("div",{staticStyle:{"margin-top":"20px"}},["add"!==t.mode?e("div",[e("span",{staticClass:"gdm-button",on:{click:t.displayForm}},[t._v("Ajouter")])]):e("div",{staticClass:"gdm-step"},[e("form",{attrs:{id:"form_new"}},[e("label",[t._v("Identifiant")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.newStep.stp_name,expression:"newStep.stp_name"}],attrs:{type:"text",name:"",pattern:"[a-zA-Z0-9_-]{3,30}",title:"Chaîne alphanumérique  entre 3 et 20 caractères"},domProps:{value:t.newStep.stp_name},on:{input:function(e){e.target.composing||t.$set(t.newStep,"stp_name",e.target.value)}}}),t._v(" "),e("label",[t._v("Titre")]),t._v(" "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.newStep.stp_title,expression:"newStep.stp_title"}],attrs:{type:"text",name:""},domProps:{value:t.newStep.stp_title},on:{input:function(e){e.target.composing||t.$set(t.newStep,"stp_title",e.target.value)}}}),t._v(" "),e("label",[t._v("Description")]),t._v(" "),e("textarea",{directives:[{name:"model",rawName:"v-model",value:t.newStep.stp_description,expression:"newStep.stp_description"}],domProps:{value:t.newStep.stp_description},on:{input:function(e){e.target.composing||t.$set(t.newStep,"stp_description",e.target.value)}}}),t._v(" "),e("div",{staticClass:"gdm-button-serie"},[e("span",{staticClass:"gdm-button",on:{click:function(e){return t.reset(null)}}},[t._v("Annuler")]),t._v(" "),e("span",{staticClass:"gdm-button",on:{click:function(e){return t.add()}}},[t._v("Enregistrer")])])])])])],2)}),[],!1,null,null,null).exports},828:(t,e,n)=>{var s=n(9371);s.__esModule&&(s=s.default),"string"==typeof s&&(s=[[t.id,s,""]]),s.locals&&(t.exports=s.locals),(0,n(5346).Z)("99eb2870",s,!0,{})}}]);
//# sourceMappingURL=602.gdm-search-components-vjs.js.map