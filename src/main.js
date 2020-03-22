import Vue from 'vue';

import vueCustomElement from 'vue-custom-element';
Vue.use(vueCustomElement);



//pour la traduction 
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import GdmProcessSearch from './gdm-process-search.vue';

Vue.customElement('gdm-process-search', GdmProcessSearch);
    	  