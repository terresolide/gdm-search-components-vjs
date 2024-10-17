<template>
<span>
  <div style="margin-left:20px;">
  <div class="user-search" :class="{'user-search-large': mode === 'job' || mode === 'product' || mode === 'ciest2'}" v-if="mode !== 'service'">
    <label>Du</label> <input v-model="startDate" type="date" @change="search()">
    <label>au</label> <input v-model="endDate" type="date" @change="search()">
    <label>Par</label> 
    <select v-model="by" @change="draw()">
      <option value="day">Jour</option>
      <option value="month">Mois</option>
      <option value="year">Year</option>
    </select>
    <span v-if="mode === 'connection'">
       <label>Par</label>
       <select v-model="group" @change="draw()">
           <option value="type">Type d'utilisateur</option>
           <option value="pole">Pôle de données</option>
       </select>
    </span>
    <span v-if="mode === 'job' || mode === 'ciest2'">
      <label>Statut</label>
      <select v-model="status" @change="search()">
        <option value="" >---</option>
        <option value="RUNNING">EN COURS...</option>
        <option value="ended">TERMINÉ</option>
        <option value="SUCCESS">Terminé avec succès</option>
        <option value="FAILED">Terminé en échec</option>
        <option value="ABORTED">Terminé par abandon</option>
      </select>
      </span>
     <span v-if="mode === 'job' || mode === 'product' || mode === 'ciest2'">
       <label>Groupe</label>
      <select v-model="selectedGroup" @change="changeGroup()">
         <option value="">TOUS</option>
         <option v-for="(group, key) in groups" :value="key">
            {{key}}
         </option>
      </select>
      <label>Service</label>
      <select v-model="selectedService" @change="search()">
         <option value="">TOUS</option>
         <option v-for="service in selectedServices" :value="service.id">
            {{service.name}}
         </option>
      </select>
     </span>
     <span v-if="mode === 'job' || mode === 'ciest2'">
      <label>Regrouper par</label>
      <select v-model="groupBy" @change="search()">
         
         <option value="service">Service</option>
         <option value="status">Statut</option>
         <option value="type">Type d'organisme</option>
         <option value="pole">Pôle de données</option>
      </select>
    </span>
   
  </div>
</div>
 
</span>
</template>
<script>
import moment from 'moment'
export default {
  name: 'GdmStatForm',
  props: {
    mode: {
      type: String,
      default: 'connection'
    },
    services: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    mode (newvalue) {
      this.search()
    }
  },
  computed: {
//     selectedServices () {
//       if (this.selectedGroup !== '') {
//         return this.groups[this.selectedGroup]
//       } else {
//         return this.services
//       }
//     },
    selectedName () {
      if (this.selectedService !== '') {
        var find = this.services.find(s => s.id === this.selectedService)
        if (find) {
          return 'Jobs pour le service ' + find.name
        }
      }
      if (this.selectedGroup !== '') {
        return 'Jobs pour les services ' + this.selectedGroup
      }
      
      return 'Jobs pour tous les services'
    }
  },
  data () {
    return {
      by: 'day',
      startDate: null,
      endDate: null,
      group: 'type',
      groupBy: 'service',
      status: '',
      selectedService: '',
      selectedServices: [],
      selectedGroup: '',
      userType: null
    }
  },
  created () {
    this.by = 'day'
    this.startDate = moment().startOf('month').format('YYYY-MM-DD')
    this.endDate = moment().endOf('month').format('YYYY-MM-DD')
    this.selectedServices = this.services
    this.search()
  },
  methods: {
    details () {
      var details = {}
      if (this.startDate) {
        details.startDate = this.startDate
      }
      if (this.endDate) {
        details.endDate = this.endDate
      }
      if (this.status !== '') {
        details.status = this.status
      }
      if (this.selectedService !== '') {
        details.service = this.selectedService
      } else if (this.selectedGroup !== '') {
        var services = this.selectedServices.map(sv => sv.id)
        details.service = services.join(',')
      }

      details.groupBy = this.groupBy

      if (this.group) {
        details.group = this.group
      }
      details.by = this.by
      return details
    },
    search () {
      this.$emit('search', this.details())
    },
    changeGroup () {
      if (this.selectedGroup !== '') {
        this.selectedService = ''
        this.selectedServices = this.groups[this.selectedGroup]
      } else {
        this.selectedServices = this.services
      }
      this.$emit('servicesChange', this.selectedServices)
      this.search()
    },
    draw () {
      this.$emit('draw', this.details())
    }
  }
}
</script>
