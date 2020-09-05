
<template>
 <span class="gdm-restrict-to">
  <select name="s_restrictTo" v-model="current">
     <option></option>
     <option v-for="role in roles" :value="role.index" :selected="role.index===current">{{role.value}}</option>
   </select>
   <span v-if="mode === 'add'">
	   <input  type="text" style="width:80px;" placeholder="ROLE" v-model="newRole" pattern="[A-Z]{3,10}"/>
	   <span v-if="userProviders.length > 0" title="Seuls les responsables de ce fournisseur pourront donner ce rôle à un utilisateur">
	     associé à 
		   <select v-model="selectedProvider">
		     <option v-for="provider in userProviders" :value="provider.id">{{provider.name}}</option>
		   </select>
	   </span>
	   <input type="button" value="Ajouter"@click="addRole"/>
	   <input type="button" value="Annuler" @click="cancel"/>
   </span>   
   <input v-if="mode !== 'add' && userProviders.length > 0" type="button" value="Nouveau Rôle" @click="mode='add'"/>
   <span style="color:darkred;font-style:italic;">{{msg}}</span>
 </span>
</template>
<script>
export default {
  name: 'GdmRestrictTo',
  components: {
  },
  props: {
    selected: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    }
  },
  created () {
    this.current = this.selected
    this.initialize()
    
  },
  mounted () {
    this.current = this.selected
  },
  destroyed () {
  },

  data() {
    return {
      roles: [],
      current: null,
      mode: null,
      newRole: null,
      providers: [],
      userProviders: [],
      selectedProvider: null,
      msg: null
    }
  },  
  methods: {
    addNewRole (data) {
      if (data.error) {
        this.msg = data.error
        return
      }
      if (data.success) {
        this.msg = null
        this.mode = null
        var value = this.newRole
        if (this.selectedProvider) {
          var pid = this.selectedProvider
          var provider = this.providers.find(pvd => {return pvd.id === pid})
          value += ' (' + provider.name + ')'
        }
        this.roles.push({index:this.newRole, value: value})
        this.selectedProvider = null
        
        this.current = this.newRole
        this.newRole = null
      }
    },
    addRole () {
      this.$http.post(this.url + 'roles/addService', 
        {
          role: this.newRole,
          provider: this.selectedProvider
        },
        {credentials: true, emulateJSON: true}
      ).then(function (resp) {
        this.addNewRole(resp.body)
      }, resp => console.log('error server'))
    },
    cancel () {
      this.msg = null
      this.mode = null
    },
    getRoles () {
      this.$http.get(this.url + 'roles/getService', {credentials: true})
      .then(resp => this.initRoles(resp.body), resp => console.log('error roles not found'))
    },
    getUserProviders () {
      this.$http.get(this.url + 'api/getUserProviders', {credentials: true})
      .then(function (resp) {
        this.providers = resp.body
        this.userProviders = this.providers.filter(provider => {return provider.checked})
        if (this.userProviders.length > 0) {
          this.selectedProvider = this.userProviders[0].id
        }
        this.getRoles()
      }, resp => console.log('error providers'))
    },
    initialize () {
      this.getUserProviders()
    },
    initRoles (data) {
      var _this = this
      data.forEach(function (role) {
        if (role.r_id !== 'PRIME') {
          var value = role.r_id
          if (role.r_fk_provider_id) {
            var provider = _this.providers.find(pvd => {return pvd.id === role.r_fk_provider_id})
            value += ' (' + provider.name + ')'
          }
          _this.roles.push({index: role.r_id, value: value})
        }
      })
    }
  }
}
</script>