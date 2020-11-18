<i18n>
{
   "en":{
     "nothing": "nothing"
   },
   "fr":{
     "nothing": "nothing"
   }
}
</i18n>
<template>
<div style="text-align:center;cursor:pointer;" :title="title">
 <span :class="statusList[status].icon" ></span>
   <div style="font-style:italic;font-size:0.9rem;color:grey;margin-bottom:5px;">
     {{statusList[status].collection}}
   </div>
</div>         
</template>
<script>
export default {
  name: 'GdmProcessStatus',
  props:{
    status: {
      type: String,
      default: 'WAITING'
    },
    statusList: {
      type: Object,
      default: () => {}
    },
    lang: {
      type: String,
      default: 'en'
    },
    progress: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  data(){
    return {
    }
  },
  computed: {
    title () {
      if (this.status === 'RUNNING') {
        return this.progress + '%'
      } else {
        return this.statusList[this.status].description
      }
    }
  },
  destroyed: function() {
  },
  created: function () {
    this.$i18n.locale = this.lang
  },
  mounted: function(){
  },
  methods:{
  }
}
</script>
<style scoped>
span.failed{
 color: darkred;
}

span.terminated{
 color:darkgreen;
}


span.running, 
span.accepted,
span.waiting{
  color: grey;
  font-size:16px;
}

</style>
