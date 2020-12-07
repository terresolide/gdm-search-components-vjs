<template>
 <span class="gdm-manage-step">
 <div v-for="(step, index) in steps" class="gdm-step">
   <span v-if="!steps[index].edit">{{step.stp_name}}</span>
   <div v-else>
     <form :id="'form_' + index">
      <label>Identifiant</label>
      <input type="text"  v-model="step.stp_name" pattern="[a-zA-Z0-9_-]{3,30}" title="Chaîne alphanumérique  entre 3 et 20 caractères">
      <label>Titre</label>
      <input type="text"  v-model="step.stp_title"  >
      <label>Description</label>
      <textarea v-model="step.stp_description"></textarea>
      <div class="gdm-button-serie" >
      <span class="gdm-button" @click="reset(index)">Annuler</span>
      <span  class="gdm-button" @click="save(index)">Enregistrer</span>
      </div>
    </form>
   </div>
   <div style="float:right;" v-if="!steps[index].edit">
	   <span class="fa fa-pencil gdm-button" @click="edit(index)"></span>
	   <span class="fa fa-arrow-up gdm-button" :class="{'gdm-disable': index === 0 }" @click="moveUp(index)" ></span>
	   <span class="fa fa-arrow-down gdm-button" :class="{'gdm-disable': index === steps.length - 1 }" @click="moveDown(index)"></span>
	   <span class="fa fa-close gdm-button" @click="remove(index)"></span> 
   </div>
 </div>
 <div style="margin-top:20px;">
	 <div v-if="mode !== 'add'">
	    <span class="gdm-button"  @click="displayForm" >Ajouter</span>
	 </div>
	 <div v-else class="gdm-step">
	   <form id="form_new">
	     <label>Identifiant</label>
	     <input type="text" name="" v-model="newStep.stp_name" pattern="[a-zA-Z0-9_-]{3,30}" title="Chaîne alphanumérique  entre 3 et 20 caractères">
	       <label>Titre</label>
       <input type="text" name="" v-model="newStep.stp_title"  >
      <label>Description</label>
	      <textarea v-model="newStep.stp_description"></textarea>
	      <div class="gdm-button-serie">
		      <span class="gdm-button" @click="reset(null)">Annuler</span>
		      <span class="gdm-button" @click="add()">Enregistrer</span>
        </div>
     </form>
   </div>
 </div>
 </span>
</template>
<script>

export default {
  name: 'GdmManageStep',
  components: {
  },
  props: {

    api: {
      type: String,
      default: null
    },
    serviceId: {
      type: Number,
      default: null
    }
  },
  computed: {
   
  },
  created () {
    this.getSteps()
  },
  mounted () {
  },
  destroyed () {
  },

  data() {
    return {
      steps: [],
      mode: null,
      newStep: {
        stp_name: null,
        stp_title: null,
        stp_description: null
      }
    }
  },
  methods: {
    add () {
      var nodes = this.$el.querySelectorAll('#form_new input:invalid')
      if (nodes.length > 0) {
        return
      }
      if (this.api && this.serviceId) {
        this.$http.post(
            this.api + '/add/' + this.serviceId, 
            this.newStep, 
            { emulateJSON: true,
              credentials: true})
        .then(
            response => this.display(response),
            response => this.error(response)
        )
      }
    },
    getSteps () {
      if (this.api && this.serviceId) {
        this.$http.get(this.api + '/get/' + this.serviceId, {credentials: true})
        .then(
            response => this.display(response),
            response => this.error(response)
        )
      }
    },
    display (response) {
      this.mode = null
      this.newStep = {
        stp_name: null,
        stp_title: null,
        stp_description: null
      }
      this.steps = response.body
    },
    displayForm () {
      this.mode = 'add'
    },
    edit (index) {
      console.log(index)
      this.$set(this.steps[index], 'edit' ,true)
    },
    error (response) {
      switch(response.status) {
      case 403:
        alert('Accès interdit: déconnecté?')
        break
      case 402:
        alert("Vous n'avez pas l'autorisation d'éditer ce service")
        break
      }
      
    },
    moveDown (index) {
      var step1 = this.steps[index]
      var step2 = this.steps[index + 1]
      this.reverse(step1, step2)
    },
    moveUp (index) {
      var step1 = this.steps[index -1]
      var step2 = this.steps[index]
      this.reverse(step1, step2)
    },
    remove (index) {
      if (this.api && this.serviceId) {
        this.$http.post(
            this.api + '/remove/' + this.serviceId, 
            {step_id: this.steps[index]['stp_id']}, 
            { emulateJSON: true,
              credentials: true})
        .then(
            response => this.display(response),
            response => this.error(response)
        )
      }
    },
    reverse (step1, step2) {
      if (this.api && this.serviceId) {
        this.$http.post(
            this.api + '/reverse/' + this.serviceId, 
            {step1: step1, step2: step2}, 
            { emulateJSON: true,
              credentials: true})
        .then(
            response => this.display(response),
            response => this.error(response)
        )
      }
    },

    reset (index) {
      if (index === null) {
        this.mode = null
      } else {
        this.$set(this.steps[index], 'edit' ,false)
      }
    },
    save (index) {
      var step = this.steps[index]
      var nodes = this.$el.querySelectorAll('#form_' + index + ' input:invalid')
      if (nodes.length > 0) {
        return
      }
      delete step.edit
      if (this.api && this.serviceId) {
        this.$http.post(
            this.api + '/update/' + this.serviceId, 
            step, 
            { emulateJSON: true,
              credentials: true})
        .then(
            response => this.display(response),
            response => this.error(response)
        )
      }
    }
   
  
  }
}
</script>
<style>
.gdm-step {
  width: 400px;
  border: 1px dotted grey;
  padding: 5px 10px;
  min-height: 25px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.85);
  margin: 5px 0;
}
.gdm-step label {
  display: inline-block;
  min-width: 120px;
  width: 120px;
  text-align:right;
  font-weight: 800;
  vertical-align:top;
}
.gdm-step input[type="text"],
.gdm-step textarea {
 min-width: 250px;

}
.gdm-step textarea {
  padding:6px;
}
.gdm-step .gdm-button-serie {
   margin: 10px 0 10px 125px;
}
.gdm-manage-step input[type="submit"].gdm-button {
  font-family:inherit;
  opacity:1;
  font-size: inherit;
  }
.gdm-manage-step span.gdm-button,
.gdm-manage-step input.gdm-button {
  
  cursor: pointer;
  border: 1px solid grey;
  border-radius: 3px;
  padding: 3px;
  background: #eee;
  opacity:0.8;
  min-width: 16px;
  text-align: center;
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.65);
}
.gdm-step span.gdm-button.gdm-disable {
  pointer-events: none;
  opacity: 0.5;
}
.gdm-step span.gdm-button:hover {
  opacity: 1;
}
</style>