
<template>
 <span class="gdm-restrict-to">
  <select name="s_restrictTo" v-model="current">
     <option></option>
     <option v-for="role in roles" :value="role.index" :selected="role.index===current">{{role.value}}</option>
   </select>
   <div  v-if="mode === 'add'">
	   <div class="gdm-add-role">
	     Nouveau 
		   <input  type="text"  placeholder="ROLE" v-model="newRole" pattern="[A-Z]{3,10}"/>
		   <span v-if="userProviders.length > 0" title="Seuls les responsables de ce fournisseur pourront donner ce rôle à un utilisateur">
		     associé à 
			   <select v-model="selectedProvider">
			     <option v-for="provider in userProviders" :value="provider.id">{{provider.name}}</option>
			   </select>
		   </span>
		   <div>Description:</div>
		   <div style="margin-left:5px;" >
		     <span style="vertical-align:top;">fr: </span><textarea v-model="description['fr']"></textarea>
		     <span style="vertical-align:top;">en: </span><textarea v-model="description['en']"></textarea>
		   </div>
		   <div style="float:right;padding:10px 0;">
		   <input type="button" value="Ajouter"@click="addRole"/>
		   <input type="button" value="Annuler" @click="cancel"/>
		   </div>
		   <div style="clear:right;color:darkred;font-style:italic;">{{msg}}</div>
		   
	   </div>  
   </div> 
   <input v-if="mode !== 'add' && userProviders.length > 0" type="button" value="Nouveau Rôle" @click="mode='add'"/>
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
      description: {fr: '', en: ''},
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
      console.log(this.description)
      this.$http.post(this.url + 'roles/addService', 
        {
          role: this.newRole,
          provider: this.selectedProvider,
          description_fr: this.description.fr,
          description_en: this.description.en
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
      this.description['fr'] = ''
      this.description['en'] = ''
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
<style>
.gdm-add-role {
 display: inline-block;
 font-size: 0.9rem;
 border:1px solid grey;
 padding:10px;
 background: #F3F3F3;
 margin:5px 0 0 10px;
}
.gdm-add-role input[type="text"]{
  min-width:80px;
  width:80px;
  max-width:80px;
}
.gdm-add-role input[type="text"],
.gdm-add-role select{
  line-height:1;
  border-radius: 0;
   height: 19px;
   border-style:inset;
   padding: 1px 3px;
   box-sizing: border-box;

    margin: 0em;
    /*font: 400 13.3333px Arial;*/
    border-width: 1px;
    border-style: inset;
    border-color: -internal-light-dark-color(rgb(118, 118, 118), rgb(195, 195, 195));
  
}
.gdm-add-role input[type="button"],
.gdm-add-role select {

  padding: 0 2px;
}
.gdm-add-role input[type="button"] {
line-height:1;
vertical-align:baseline;
}
</style>