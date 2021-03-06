require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);



//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import {VueTools} from 'formater-commons-components-vjs'
Vue.use(VueTools)

import GdmProcessSearch from './gdm-process-search.vue'
import GdmManageStep from './gdm-manage-step.vue'
import GdmProcessView from './gdm-process-view.vue'
import GdmRestrictTo from './gdm-restrict-to.vue'
import AerisTheme from 'aeris-commons-components-vjs/src/aeris-theme/aeris-theme.vue'

ljs.addAliases({
  dep: [
     // font-awesome
     'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
     // leaflet
     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.css',
     'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js'
     
   ]
})
ljs.load('dep', function() {
  Vue.customElement('gdm-process-search', GdmProcessSearch)
  Vue.customElement('gdm-manage-step', GdmManageStep)
  Vue.customElement('gdm-process-view', GdmProcessView)
  Vue.customElement('gdm-restrict-to', GdmRestrictTo)
  Vue.customElement('aeris-theme', AerisTheme)
})
    	  
