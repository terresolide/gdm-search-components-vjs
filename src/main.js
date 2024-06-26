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


ljs.addAliases({
  dep: [
     // font-awesome
     'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', 
     // leaflet
    // 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/leaflet.css',
    // 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js'
     
   ]
})
ljs.load('dep', function() {
  // lazy loading
//  Vue.customElement('gdm-spatial-search', () => new Promise((resolve) => {
//    require(['./subcomponents/gdm-spatial-search.vue'], (GdmSpatialSearch) => resolve(GdmSpatialSearch.default))
//  }))
  Vue.customElement('gdm-process-sar', () => new Promise((resolve) => {
    require(['./gdm-process-sar.vue'], (GdmProcessSar) => resolve(GdmProcessSar.default))
  }))
  Vue.customElement('gdm-process-search', () => new Promise((resolve) => {
    require(['./gdm-process-search.vue'], (GdmProcessSearch) => resolve(GdmProcessSearch.default))
  }))
  Vue.customElement('gdm-manage-step', () => new Promise((resolve) => {
    require(['./gdm-manage-step.vue'], (GdmManageStep) => resolve(GdmManageStep.default))
  }))
  Vue.customElement('gdm-process-view', () => new Promise((resolve) => {
    require(['./gdm-process-view.vue'], (GdmProcessView) => resolve(GdmProcessView.default))
  }))
  Vue.customElement('gdm-restrict-to', () => new Promise((resolve) => {
    require(['./gdm-restrict-to.vue'], (GdmRestrictTo) => resolve(GdmRestrictTo.default))
  }))
  Vue.customElement('gdm-stat', () => new Promise((resolve) => {
    require(['./gdm-stat.vue'], (GdmStat) => resolve(GdmStat.default))
  }))
  Vue.customElement('gdm-earthquake', () => new Promise((resolve) => {
    require(['./gdm-earthquake.vue'], (GdmEarthquake) => resolve(GdmEarthquake.default))
  }))
   Vue.customElement('gdm-publish', () => new Promise((resolve) => {
    require(['./gdm-publish.vue'], (GdmPublish) => resolve(GdmPublish.default))
  }))
 /* Vue.customElement('gdm-test', () => new Promise((resolve) => {
    require(['./subcomponents/gdm-test.vue'], (GdmEarthquake) => resolve(GdmEarthquake.default))
  }))*/
})
    	  
