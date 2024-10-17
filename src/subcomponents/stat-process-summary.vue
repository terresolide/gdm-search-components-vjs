<template>
    <div class="job-header">
        <div>
          <h2>Total jobs</h2>
           <div v-for="(type, index) in userTypes" v-if="groupBy === 'type'">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="jobs.count && jobs.count[type.t_id]">{{jobs.count[type.t_id].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <div v-for="(pole, index) in poles" v-if="groupBy === 'pole'">
             <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
             <b>{{poleName(pole.po_id)}}</b>:
             <span v-if="jobs.count && jobs.count[pole.po_id]">{{jobs.count[pole.po_id].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <div v-for="(status, index) in status" v-if="groupBy === 'status'">
             <span class="fa fa-circle" :style="{color: status.color}"></span>
             <b>{{status.name}}</b>:
             <span v-if="jobs.count && jobs.count[status.id]">{{jobs.count[status.id].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <div v-for="service in selectedServices" v-if="groupBy === 'service' && (selectedService === '' || selectedService === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="jobs.count && jobs.count[service.name]">{{jobs.count[service.name].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <hr v-if="selectedService === '' || groupBy !== 'service'" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService === '' || groupBy !== 'service'">
              <b>Total</b>: {{jobs.avg.count}}
           </div>
       </div>
       <div>
           <h2>Coût moyen</h2>
           <div v-for="(type, index) in userTypes" v-if="groupBy === 'type'">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="jobs.cost && jobs.cost[type.t_id]">{{Math.round(jobs.cost[type.t_id]/jobs.countCost[type.t_id]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
            <div v-for="(pole, index) in poles" v-if="groupBy === 'pole'">
             <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
             <b>{{poleName(pole.po_id)}}</b>:
             <span v-if="jobs.cost && jobs.cost[pole.po_id]">{{Math.round(jobs.cost[pole.po_id]/jobs.countCost[pole.po_id]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <div v-for="(status, index) in status" v-if="groupBy === 'status'">
             <span class="fa fa-circle" :style="{color: status.color}"></span>
             <b>{{status.name}}</b>:
             <span v-if="jobs.cost && jobs.cost[status.id]">{{Math.round(jobs.cost[status.id]/jobs.countCost[status.id]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <div v-for="service in selectedServices" v-if="groupBy === 'service' && (selectedService === '' || selectedService === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="jobs.cost && jobs.cost[service.name]">{{Math.round(jobs.cost[service.name]/jobs.countCost[service.name]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService === '' || groupBy !== 'service'" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService === '' || groupBy !== 'service'">
              <b>Tout {{groupBy}}</b>:
              <span v-if="jobs.avg && jobs.avg.cost">{{Math.round(jobs.avg.cost).toLocaleString()}} CPU Secondes</span>
              <span v-else>---</span>
           </div>
       </div>
       <div >
           <h2>Durée moyenne</h2>
           <div v-for="(type, index) in userTypes" v-if="groupBy === 'type'">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="jobs.duration[type.t_id] && jobs.countDuration[type.t_id]">{{secondToStr(jobs.duration[type.t_id]/jobs.countDuration[type.t_id])}}</span>
             <span v-else>---</span>
           </div>
            <div v-for="(pole, index) in poles" v-if="groupBy === 'pole'">
             <span class="fa fa-circle" :style="{color: pole.po_color}"></span>
             <b>{{poleName(pole.po_id)}}</b>:
             <span v-if="jobs.duration[pole.po_id] && jobs.countDuration[pole.po_id]">{{secondToStr(jobs.duration[pole.po_id]/jobs.countDuration[pole.po_id])}}</span>
             <span v-else>---</span>
           </div>
           <div v-for="(status, index) in status" v-if="groupBy === 'status'">
             <span class="fa fa-circle" :style="{color: status.color}"></span>
             <b>{{status.name}}</b>:
             <span v-if="jobs.duration[status.id] && jobs.countDuration[status.id]">{{secondToStr(jobs.duration[status.id]/jobs.countDuration[status.id])}}</span>
             <span v-else>---</span>
           </div>
           <div v-for="service in selectedServices" v-if="groupBy === 'service'  && (selectedService === '' || selectedService === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="jobs.duration[service.name] && jobs.countDuration[service.name]">{{secondToStr(jobs.duration[service.name]/jobs.countDuration[service.name])}}</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService === '' || groupBy !== 'service'" style="width:60%;margin-left:5px;color:gray;">
            <div v-if="selectedService === '' || groupBy !== 'service'" >
              <b>Tout {{groupBy}}</b>:
              <span v-if="jobs.avg.duration">{{secondToStr(jobs.avg.duration)}}</span>
              <span v-else>---</span>
            </div>
       </div>
    </div>

</template>
<script>
export default {
    name: 'StatProcessSummary',
    props: {
      colors: {
        type: Array,
        default: () => []
      },
      groupBy: {
        type: String,
        default: 'service'
      },
      userTypes: {
        type: Array,
        default: () => []
      },
      poles: {
        type: Array,
        default: () => []
      },
      status: {
        type: Array,
        default: () => []
      },
      selectedName: {
        type: String,
        default: ''
      },
      selectedService: {
        type: String,
        default: ''
      },
      selectedServices: {
        type: Array,
        default: () => []
      },
      jobs: {
        type: Object,
        default: null
      }
    },
    methods: {
        secondToStr (totalSeconds) {
            totalSeconds = Math.round(totalSeconds)
            var days = Math.floor(totalSeconds / 86400)
            totalSeconds %= 86400
            var hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            return (days > 0 ? days + 'j ' : '') + hours.toString().padStart(2, '0') +
                ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
        },
        poleName (key) {
            var find = this.poles.find(pl => pl.po_id === key)
            if (find) {
                if (find.po_name) {
                return find.po_name
                } else {
                return find.po_description.fr
                }
            } else {
                return 'inconnu'
            }
        }
    }
}
</script>
