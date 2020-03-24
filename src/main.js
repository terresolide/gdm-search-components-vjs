require("exports-loader?!./l.min.js")

import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);



//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import GdmProcessSearch from './gdm-process-search.vue';

ljs.addAliases({
  dep: [
     // font-awesome
     'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
     // leaflet
     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.css',
   ]
})
ljs.load('dep', function() {
  Vue.customElement('gdm-process-search', GdmProcessSearch)
})
    	  