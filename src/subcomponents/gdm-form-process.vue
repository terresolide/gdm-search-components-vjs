<i18n>{
   "en":{
     "results": "Results: {from} to {to} among {notExactly}{count}"
   },
   "fr":{
     "results":  "Résultats: <strong>{from}</strong> à <strong>{to}</strong> sur {notExactly}{count}"
   }
}
</i18n>
<template>
 <span class="gdm-form-process">
  <div>
   <div v-if="user" class="selected">{{user.email}}<span class="fa fa-close" @click="removeUser"></span></div>
   
  </div>
  <div style="clear:both;"></div>
 </span>
</template>
<script>
export default {
  name: 'GdmFormProcess',
  components: {
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    service: {
      type: Array,
      default: null
    },
    status: {
      type: Array,
      default: null
    },
    color: {
      type: String,
      default: '#808080'
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
    
  },
  created () {
    this.$i18n.locale = this.lang
  },
  mounted () {
  },
  destroyed () {
  },

  data() {
    return {
      
    }
  },
  methods: {
    removeUser () {
      this.$emit('remove', 'user')
    }
  }
}
</script>
<style >
.gdm-form-process > div:first-child {
  margin-bottom: 30px;
  min-height: 20px;
}
.gdm-form-process .fa-close{
  color: darkred;
  margin-left:10px;
  cursor:pointer;
  vertical-align:top;
}
.gdm-form-process div.selected{
  float:left;
  padding: 5px;
  margin: 5px;
  background: lightgrey;
  border: 1px solid grey;
  border-radius:2px;
}

</style>