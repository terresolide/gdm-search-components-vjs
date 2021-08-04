<template>
<div>
<div style="padding: 10px;">
  <ul class="menu-content">
    <li class="{selected: mode === 'connection'}" @click="setMode('connection')">Connexion
    </li><li class="{selected: mode === 'service'}" @click="setMode('service')">Services
    </li><li class="{selected: mode === 'job'}" @click="setMode('job')">Jobs
    </li><li class="{selected: mode === 'ciest2'}" @click="setMode('ciest2')">CIEST2
    </li>
  </ul>
</div>
<div style="margin-left:20px;">
  <div class="user-search" :class="{'user-search-large': mode === 'job'}" v-if="mode !== 'service'">
    <label>Du</label> <input v-model="startDate" type="date" @change="search()">
    <label>au</label> <input v-model="endDate" type="date" @change="search()">
    <label>Par</label> 
    <select v-model="by" @change="draw()">
      <option value="day">Jour</option>
      <option value="month">Mois</option>
      <option value="year">Year</option>
    </select>
    <span v-if="mode === 'job'">
      <label>Statut</label>
      <select v-model="status" @change="search()">
        <option value="" >---</option>
        <option value="ended">Terminé</option>
        <option value="success">Terminé avec succès</option>
        <option value="failed">En échec</option>
        <option value="aborted">Abandonné</option>
      </select>
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
      <label>Type utilisateur</label>
      <input type="checkbox" v-model="userType" @change="search()"/>
    </span>
   
  </div>
  <div v-else>
  Il ne s'agit pas d'un historique. L'accès aux services d'un utilisateur peut changer au cours du temps et l'information historique n'est pas enregistrée.
  </div>
  <div v-show="mode === 'connection'">
    <div id="sessions"></div>
    <div id="newUsers" style="margin-top:30px;"></div>
  </div>
   <div v-show="mode === 'service'">
     <div id="services" style="margin-top:30px;"></div>
   </div>
    <div v-show="mode === 'job'" class="job-content" >
    <h1>{{selectedName}}</h1>
    <div class="job-header" >

       <div>
          <h2>Total jobs</h2>
           <div v-for="(type, index) in userTypes" v-if="userType">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="count && count[type.t_id]">{{count[type.t_id].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <div v-for="service in selectedServices" v-if="!userType && (selectedService === '' || selectedService === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="count && count[service.name]">{{count[service.name].toLocaleString()}}</span>
             <span v-else>0</span>
           </div>
           <hr v-if="selectedService === '' || userType" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService === '' || userType">
              <b>Total</b>: {{avg.count}}
           </div>
       </div>
       <div>
           <h2>Coût moyen</h2>
           <div v-for="(type, index) in userTypes" v-if="userType">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="cost && cost[type.t_id]">{{Math.round(cost[type.t_id]/countCost[type.t_id]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <div v-for="service in selectedServices" v-if="!userType && (selectedService === '' || selectedService === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="cost && cost[service.name]">{{Math.round(cost[service.name]/countCost[service.name]).toLocaleString()}} CPU secondes</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService === '' || userType" style="width:60%;margin-left:5px;color:gray;">
           <div v-if="selectedService === '' || userType">
              <b v-if="userType">Tout type</b>
              <b v-else>Tout service</b>:
              <span v-if="avg && avg.cost">{{Math.round(avg.cost).toLocaleString()}} CPU Secondes</span>
              <span v-else>---</span>
           </div>
       </div>
       <div >
           <h2>Durée moyenne</h2>
           <div v-for="(type, index) in userTypes" v-if="userType">
             <span class="fa fa-circle" :style="{color: colors[index]}"></span>
             <b>{{type.t_name_fr}}</b>:
             <span v-if="status === 'success' && duration && countDuration[type.t_id]">{{secondToStr(duration[type.t_id]/countDuration[type.t_id])}}</span>
             <span v-else>---</span>
           </div>
           <div v-for="service in selectedServices" v-if="!userType && (selectedService === '' || selectedService === service.id)">
             <span class="fa fa-circle" :style="{color: service.color}"></span>
             <b>{{service.name}}</b>:
             <span v-if="status === 'success' && duration && countDuration[service.name]">{{secondToStr(duration[service.name]/countDuration[service.name])}}</span>
             <span v-else>---</span>
           </div>
           <hr v-if="selectedService === '' || userType" style="width:60%;margin-left:5px;color:gray;">
            <div v-if="selectedService === '' || userType" >
              <b v-if="userType">Tout type</b>
              <b v-else>Tout service</b>:
              <span v-if="status === 'success' && avg.duration">{{secondToStr(avg.duration)}}</span>
              <span v-else>---</span>
            </div>
       </div>
     </div>
     <div id="jobs" style="margin-top:30px;"></div>
   </div>
 </div>
</div>
</template>
<script>
import * as Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
// import FullScreen from 'highcharts/modules/full-screen'

import Accessibility from 'highcharts/modules/accessibility'

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts)
  Accessibility(Highcharts)
  ExportData(Highcharts)
 // FullScreen(Highcharts)
}
import moment from 'moment'
export default {
  name: 'GdmStat',
  props: {
    appUrl: {
      type: String,
      default: null
    }
  },
  computed: {
    selectedServices () {
      if (this.selectedGroup !== '') {
        return this.groups[this.selectedGroup]
      } else {
        return this.services
      }
    },
    selectedName () {
      if (this.selectedService !== '') {
        var find = this.services.find(s => s.id === this.selectedService)
        if (find) {
          return 'Résultats pour le service ' + find.name
        }
      }
      if (this.selectedGroup !== '') {
        return 'Résultats pour les services ' + this.selectedGroup
      }
      
      return 'Résultats pour tous les services'
    }
  },
  data () {
    return {
      startDate: null,
      endDate: null,
      by: 'day',
      mode: 'connection',
      sessions: { days:[], months: [], years: []},
      newUsers: { days:{}, months: {}, years: {}},
      process: { days: {}, months: {}, years: {}},
      serviceUsers: [],
      userTypes: [],
      days:[],
      months:[],
      years: [],
      services: [],
      groups: {},
      count: {},
      cost:{},
      countCost: {},
      duration: {},
      countDuration: {},
      status: '',
      avg: {},
      selectedService: '',
      selectedGroup: '',
      userType: false,
      colors: ['#2f7ed8', '#910000', '#8bbc21',   '#1aadce',
        '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a', '#0d233a']
    }
  },
  created () {
    this.getUserTypes()

    
  },
  methods: {
    changeGroup () {
      if (this.selectedGroup !== '') {
        this.selectedService = ''
      }
      this.search()
    },
    userTypeName (type) {
      var find = this.userTypes.find(tp => tp.t_id === type)
      if (find) {
        return find.t_name_fr
      } else {
        'Inconnu'
      }
    },
    draw () {
      switch (this.mode) {
        case 'connection':
          this.drawConnection()
          this.drawNewUsers()
          break
        case 'services':
          this.drawServices()
          break
        case 'job':
          this.drawJobs()
      }
    },
    drawHistogram (id, title, categories, series, options ) {
      var colors = this.colors
      if (options && options.colors) {
        colors = options.colors
      }
      Highcharts.chart(id, {
        chart: {
          type: 'column'
        },
        title: {
          text: title,
          align: 'left',
          style: {'color': '#000000', 'fontSize': '20px', 'fontWeight': 700}
        },
        credits: {
          enabled:false
        },
        colors: colors,
        legend: {
          labelFormatter: function() {
            return this.name
          }
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: categories,
          crosshair: true
        },
        yAxis: {
          min: 0,
          allowDecimals: false,
          title: {
            text: ''
          }
        },
        tooltip: {
          formatter: function(e) {
            var currentPoint = this
            var tot = 0
            var stackValues = '<b>' + this.x.replaceAll('-', '/') + '</b><br />'
              currentPoint.points.forEach(function(point, i) {
                  stackValues += '<span style="color: ' + point.color + '">\u25CF</span> ' + series[i].name + ': ' + point.y + '<br/>'
                  tot += point.y
              })
            return stackValues +
              '<span style="margin-left:10px;font-weight:700">Total: </span>' + tot;
          },
  //         headerFormat: '<span style="font-size:10px">{point.x}</span><table>',
  //         pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  //           '<td style="padding:0"><b>{point.y}</b></td></tr>',
  //         footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            pointPadding: 0,
            borderWidth: 1,
            groupPadding: 0,
            shadow: false
          }
        },
        series: series
      });
    },
    drawNewUsers () {
      var categories = this[this.by + 's']
      var data = this.newUsers[this.by + 's']
      var series = []
      for(var type in data) {
        series.push({
          name: this.userTypeName(type),
          data: data[type]
        })
      }
      this.drawHistogram('newUsers', 'Nouvels utilisateurs', categories, series)
    },
    drawConnection() {
      var categories = this[this.by + 's']
      var data = this.sessions[this.by + 's']
      var series = []
      for(var type in data) {
        series.push({
          name: this.userTypeName(type),
          data: data[type]
        })
      }
      this.drawHistogram('sessions', 'Nombre de connexions', categories, series)
    },
    drawJobs () {
      var categories = this[this.by + 's']
      var data = this.process[this.by + 's']
      var series = []
      var colors = []
      var name = ''
      for (var index in data) {
        if (this.userType) {
          name = this.userTypeName(index)
        } else {
          var find = this.services.find(s => s.name === index)
          name = index
          colors.push(find.color)
        }
        series.push({
          name: name,
          data: data[index]
        })
        
      }
      var options = {}
      if (colors.length > 0) {
        options = {colors: colors}
      }
      this.drawHistogram('jobs', 'Nombre de jobs', categories, series, options)
    },
    getUserTypes () {
      var url = this.appUrl + '/auth/getOrganismTypes'
      this.$http.get(url)
      .then(function (response) {
        this.initialize(response.body)
      })
    },
    initialize (data) {
      this.by = 'day'
      this.startDate = moment().startOf('month').format('YYYY-MM-DD')
      this.endDate = moment().endOf('month').format('YYYY-MM-DD')
      if (data.types) {
        this.userTypes = data.types
      }
      this.search()
    },
    jobsAverage () {
      var _this = this
      var count = 0
      var duration = 0
      var countDuration = 0
      var cost = 0
      var countCost = 0
      if (this.userType) {
        this.userTypes.forEach(function (type) {
          count += _this.count[type.t_id]
          countDuration += _this.countDuration[type.t_id]
          duration += _this.duration[type.t_id]
          cost += _this.cost[type.t_id]
          countCost += _this.countCost[type.t_id]
        })
      } else {
	      this.selectedServices.forEach(function (sv) {
	        count += _this.count[sv.name]
	        countDuration += _this.countDuration[sv.name]
	        duration += _this.duration[sv.name]
	        cost += _this.cost[sv.name]
	        countCost += _this.countCost[sv.name]
	      })
      }
      this.avg = {
        count: count,
        cost: countCost > 0 ? Math.round(cost / countCost) : 0,
        duration: countDuration > 0 ? Math.round(duration / countDuration) : 0
      }
    },
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
    setMode (value) {
      this.mode = value
      this.search()
    },
    search () {
      if (!this.appUrl) {
        return
      }
      switch (this.mode) {
        case 'connection':
          this.searchConnection()
          break
        case 'service':
          this.searchService()
          break
        case 'job':
          this.searchJob()
          break
        case 'ciest2':
          this.searchCiest2()
          break
      }
    },
    searchConnection () {
      var url = this.appUrl + '/statistics/searchSession?'
      var params = [];
          if (this.startDate) {
        params.push('start=' + this.startDate)
      }
      if (this.endDate) {
        params.push('end=' + this.endDate)
      }
      url += params.join('&')
      this.$http.get(url)
      .then(function (response) {
        this.treatmentConnection(response.body)
      })
    },
    searchJob () {
      var url = this.appUrl + '/statistics/searchJobs?'
      var params = [];
          if (this.startDate) {
        params.push('start=' + this.startDate)
      }
      if (this.endDate) {
        params.push('end=' + this.endDate)
      }
      if (this.status !== '') {
        params.push('status=' + this.status)
      }
      if (this.selectedService !== '') {
        params.push('service=' + this.selectedService)
      } else if (this.selectedGroup !== '') {
        var services = this.selectedServices.map(sv => sv.id)
        params.push('service=' + services.join(','))
      }
      if (this.userType) {
        params.push('type=1')
      }
      url += params.join('&')
      this.$http.get(url)
      .then(function (response) {
        this.treatmentJobs(response.body)
      })
    },
    searchService () {
      this.$http.get(this.appUrl + '/statistics/serviceUsers')
      .then(function (response) {
        this.treatmentServices(response.body)
      })
    },
    searchCiest2 () {
      
    },
    extractSeriesFrom (data, cat, first) {
      if (first) {
        this.days = []
        this.months = []
        this.years = []
        this.cost = {}
        this.count = {}
        this.countCost = {}
        this.duration = {}
        this.countDuration = {}
       // this.sessions = {days: [], months: [], years: []}
      }
      this.count[cat] = 0
      this.cost[cat] = 0
      this.countCost[cat] = 0
      this.duration[cat] = 0
      this.countDuration[cat] = 0
      var date = moment(this.startDate, 'YYYY-MM-DD')
      var results = {days: [], months: [], years: []}
      var date = moment(this.startDate, 'YYYY-MM-DD')
      var _this = this
      var year = date.year()
      var month = (date.month() + 1).toString().padStart(2, '0') + '-' + year
      var year2 = null
      var month2 = null
      if (first) {
        this.years.push(year + '')
        this.months.push(month)
      }
      var countMonth = 0
      var countYear = 0
      data.forEach(function (day) {
        // day data
        var strDay = day['year'].toString() + day['month'].toString().padStart(2, '0') + day['day'].toString().padStart(2, '0')
        var date2 =  moment(strDay, 'YYYYMMDD')
        year2 = date2.year()
        month2 = (date2.month() + 1).toString().padStart(2, '0') + '-' + year2
        while (date2.diff(date, 'days') > 0) {
          if (first) {
            _this.days.push(date.format('DD-MM-YYYY'))
          }
          results.days.push(0)
          date.add(1, 'days')
          year2 = date.year()
          month2 = (date.month() + 1).toString().padStart(2, '0') + '-' + year2
          if (month2 !== month) {
            results.months.push(countMonth)
            if (first) {
              _this.months.push(month2)
            }
            month = month2
            countMonth = 0
          }
          if (year2 !== year) {
            results.years.push(countYear)
            if (first) {
              _this.years.push(year2 + '')
            }
            year = year2
            countYear = 0
          }
        }
       // date = date2
        if (first) {
          _this.days.push(date.format('DD-MM-YYYY'))
        }
        results.days.push(day['tot'])
        _this.count[cat] = _this.count[cat] + day['tot']
        if (day['cost']) {
          _this.cost[cat] = _this.cost[cat] + day['cost']
          _this.countCost[cat]= _this.countCost[cat] + day['tot']
        }
        if (day['duration']) {
          _this.duration[cat] = _this.duration[cat] + parseInt(day['duration'])
          _this.countDuration[cat] = _this.countDuration[cat] + day['tot']
        }
        countMonth += day['tot']
        countYear += day['tot']
        if (month2 !== month) {
          results.months.push(countMonth)
          if (first) {
            _this.months.push(month2)
          }
          month = month2
          countMonth = 0
        }
        if (year2 !== year) {
          results.years.push(countYear)
          if (first) {
            _this.years.push(year2 + '')
          }
          year = year2
          countYear = 0
        }
        date = date2.add(1, 'days')
      })
      var end = moment(this.endDate, 'YYYY-MM-DD')
      while(end.diff(date, 'days') >= 0) {
        if (first) {
          _this.days.push(date.format('DD-MM-YYYY'))
        }
        results.days.push(0)
        year2 = date.year()
        month2 = (date.month() + 1).toString().padStart(2, '0') + '-' + year2
        if (month2 !== month) {
          results.months.push(countMonth)
          if (first) {
          _this.months.push(month2)
          }
          month = month2
          countMonth = 0
        }
        if (year2 !== year) {
          results.years.push(countYear)
          if (first) {
            _this.years.push(year2 + '')
          }
          year = year2
          countYear = 0
        }
        date.add(1, 'days')
      }
      if (this.years.length > results.years.length) {
        results.years.push(countYear)
      }
      if (this.months.length > results.months.length) {
        results.months.push(countMonth)
      }
      return results
    },
    treatmentConnection (data) {
     // this.sessions = this.extractSeriesFrom(data.sessions, true)
      var _this = this 
      var first = true
      this.userTypes.forEach(function (tp) {
        var tab = data.sessions.filter(u => u.type === tp.t_id)
        var results = _this.extractSeriesFrom(tab, tp.t_id, true)
        first = false
        _this.sessions.days[tp.t_id] = results.days
        _this.sessions.months[tp.t_id] = results.months
        _this.sessions.years[tp.t_id] = results.years
        
      })
      this.drawConnection()
     
      this.userTypes.forEach(function (tp) {
        var tab = data.newUsers.filter(u => u.type === tp.t_id)
        var results = _this.extractSeriesFrom(tab, tp.t_id)
        _this.newUsers.days[tp.t_id] = results.days
        _this.newUsers.months[tp.t_id] = results.months
        _this.newUsers.years[tp.t_id] = results.years
        
      })
      this.drawNewUsers()

    },
    treatmentJobs (data) {
      var _this = this
      if (this.services.length === 0) {
        this.services = data.services
        this.services.forEach(function (sv) {
          if (!_this.groups[sv.group]) {
            _this.groups[sv.group] = [sv]
          } else {
            _this.groups[sv.group].push(sv)
          }
        })
      }
      
      this.process = {days: {}, months: {}, years: {}}
      var first = true

      if (this.userType) {
        this.userTypes.forEach(function (tp) {
            var tab = data.process.filter(ps => ps.type === tp.t_id)
            var results = _this.extractSeriesFrom(tab, tp.t_id, first)
            first = false
            _this.process.days[tp.t_id] = results.days
            _this.process.months[tp.t_id] = results.months
            _this.process.years[tp.t_id] = results.years 
        })
      } else {
	      this.selectedServices.forEach(function (service) {
	        if (_this.selectedService === '' || _this.selectedService === service.id) {
		        var tab = data.process.filter(p => p.service === parseInt(service.id))
		        var results = _this.extractSeriesFrom(tab, service.name, first)
		        first = false
		        _this.process.days[service.name] = results.days
		        _this.process.months[service.name] = results.months
		        _this.process.years[service.name] = results.years 
	        }
	      })
      }
      this.jobsAverage()
      this.drawJobs()
    },
    treatmentServices(data) {
      var currentService = null
      var categories = []
      var aux = {}
      this.userTypes.forEach(function (tp) {
        aux[tp.t_id] = []
      })

      data.serviceUsers.forEach(function (obj) {
        if (obj.service !== currentService) {
          categories.push(obj.service)
          currentService = obj.service
          // search count for this service
          for (var type in aux) {
            var find = data.serviceUsers.find(el => el.type === type && el.service === currentService)
            if (find) {
              aux[type].push(find.tot)
            } else {
              aux[type].push(0)
            }
          }
        }
      })
      var series = []
      for (var tp in aux) {
        series.push({
          name: this.userTypeName(tp),
          data: aux[tp]
        })
      }
      this.drawHistogram('services', "Nombre d'utilisateurs par service", categories, series)
    }
  }
}
</script>
<style>
.job-header {
  display:flex;
}
.job-header > div {
  padding: 0 10px 0 0;
  flex-grow:1;
}

.job-header h2,
.job-content h1 {
  color:black;
  font-size:20px;
  font-family: "Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif;
}
.job-content h1 {
  font-size: 24px;
}
.user-search {
   margin:auto;
   margin-bottom:20px;
   text-align: left;
   display: inline-block;
   background: #F5f5f5;
   margin-bottom: 40px;
   margin-left: calc(50% - 225px);
   padding: 10px;
   border: 1px solid grey;
   border-radius: 5px;
 }
 .user-search-large {
   margin-left:5px;
 }
 .user-search > div {
   display: inline-block;
 }
 .user-search label {
   margin-left:10px;
   font-weight: 700;
 }
 ul.menu-content {
  border-bottom: 1px solid #adadad;
 }
 ul.menu-content li {
  display: inline-block;
   min-width: 50px;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  border: 1px solid #adadad;
  border-bottom: none;
  text-align: center;
  color: black;
  height: 30px;
  vertical-align: middle;
  margin: 0;
  background: #efefef;
  cursor: pointer;
}

ul.menu-content li{
    text-transform: capitalize;
    vertical-align: middle;
    font-size: 1.1rem;
    height: 30px;
    min-width:50px;
    color:black;
    padding: 5px 10px 0 10px;
    text-decoration: none;
    display:inline-block;
}
ul.menu-content li:hover {
  color:#b8412c;
}
ul.menu-content li.selected {
  background:white;
  color:#b8412c;
}
ul.menu-content li.isDisabled {
  pointer-events: none;
  color:grey;
}
</style>