<i18n>
{
   "en":{
    "TERMINATED": "The job ended succefully",
    "WAITING": "The job is only record here",
    "CANCELED": "The job has been stopped",
    "SAVED": "The job is record here and by the service.",
    "EVALUATED": "The job cost has been evaluated by the service",
    "INVALID": "The job was refused by the service because it's invalid",
    "KILLED": "The job has been deleted",
    "FAILED": "The job ended in failure",
    "PURGED": "All results has been cleared",
    "RUNNING": "In progress",
    "ACCEPTED": "The service has accepted the job but has not yet started"
   },
   "fr":{
     "TERMINATED": "Le job s'est terminé avec succès",
    "WAITING": "Le calcul est juste enregistré ici",
    "CANCELED": "Le calcul a été stoppé",
    "SAVED": "Le job a été enregistré auprès du service.",
    "EVALUATED": "Le coût du job a été estimé par le service",
    "INVALID": "Le job a été refusé par le service, car il est invalide",
    "KILLED": "Le job a été supprimé",
    "FAILED": "Le job s'est terminé en échec",
    "PURGED": "Tous les résultats ont été effacés",
    "RUNNING": "Traitement en cours",
    "ACCEPTED": "Le service a accepté le job, mais ce dernier n'a pas encore démarré "  
   }
}
</i18n>
<template>
<div style="text-align:center;cursor:pointer;" :title="$t(status)">
 <span :class="statusToClass(status)" ></span>
   <div style="font-style:italic;font-size:0.9rem;color:grey;margin-bottom:5px;">
     {{title(status)}}
   </div>
</div>         
</template>
<script>
export default {
  name: 'GdmProcessActions',
  props:{
    status: {
      type: String,
      default: 'WAITING'
    },
    lang: {
      type: String,
      default: 'en'
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
  },
  destroyed: function() {
  },
  created: function () {
    this.$i18n.locale = this.lang
  },
  mounted: function(){
  },
  methods:{
    title (status) {
      switch(status) {
      case 'RUNNING':
	      case 'FAILED':
	      case 'TERMINATED':
	      case 'ACCEPTED':
	      case 'PURGED':
	        return status
	        break
	      case 'SAVED':
	      case 'EVALUATED':
	        return 'ACCEPTED';
	      case 'WAITING':
	         return 'SAVED';
	      case 'CANCELED':
	         return 'STOPPED';
        case 'INVALID':
           return 'REFUSED'
      }
    },
    statusToClass (status) {
      switch(status) {
        case 'RUNNING':
          return 'fa fa-refresh fa-spin fa-3x fa-fw ' + status.toLowerCase()
          break
        case 'WAITING':
        case 'ACCEPTED':
        case 'SAVED':
        case 'EVALUATED':
        case 'CANCELED':
          return 'fa fa-pause waiting';
          break;
        case 'FAILED':
        case 'INVALID':
          return 'fa fa-close failed';
          break;
        case 'TERMINATED':
          return 'fa fa-check terminated';
          break;
        case 'PURGED':
        case 'KILLED':
          return 'fa fa-trash-o purged';
          break;
          default:
            return status.toLowerCase()
        }
    }
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
