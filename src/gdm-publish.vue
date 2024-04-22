<template>
 <div>
    <div><label>Service</label><input v-model="post.service" /></div>
    <div><label>Nom</label><input v-model="post.name" /></div>
    <div><label>Description</label> <textarea v-model="post.description"></textarea></div>
    <div><label>Mots-clés</label> <input type="text" v-model="search" />
      <div style="border: 1px solid grey;padding:5px;"></div>
    </div>
 </div>
</template>
<script>
export default {
  name: 'GdmPublish',
  props: {
    thesaurus: {
      type: String,
      default: 'https://catalogue-terresolide.ipgp.fr'
    },
    processId: {
      type: Number,
      default: null
    },
    api: {
      type: String,
      default: 'https://gdm.formater/api/process'
    }
  },
  data () {
    return {
      post: {
        service: 'machin',
        name: 'name',
        description: 'ma description',
        keywords: []
        
      }
    }
  }
  
}
</script>