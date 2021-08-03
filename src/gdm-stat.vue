<template>
<div>
<div style="padding: 10px;">
  <ul class="menu-content">
    <li class="{selected: mode === 'connection'}" @click="setMode('connection')">Connexion
    </li><li class="{selected: mode === 'service'}" @click="setMode('service')">Par Service
    </li><li class="{selected: mode === 'ciest2'}" @click="setMode('ciest2')">CIEST2
    </li>
  </ul>
</div>
<div style="margin-left:20px;">
  <h1 v-if="mode === 'service'">Utilisation des services</h1>
  <h1 v-if="mode === 'connection'">Connection</h1>
  <div class="user-search">
    <label>Du</label> <input v-model="startDate" type="date" @change="search()">
    <label>au</label> <input v-model="endDate" type="date" @change="search()">
    <label>Par</label> 
    <select v-model="by" @change="draw()">
      <option value="day">Jour</option>
      <option value="month">Mois</option>
      <option value="year">Year</option>
    </select>
  </div>
  <div v-show="mode === 'connection'">
    <div id="sessions"></div>
    <div id="newUsers" style="margin-top:30px;"></div>
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
  },
  data () {
    return {
      startDate: null,
      endDate: null,
      by: 'day',
      mode: 'connection',
      sessions: { days:[], months: [], years: []},
      newUsers: { days:{}, months: {}, years: {}},
      userTypes: [],
      days:[],
      months:[],
      years: []
    }
  },
  created () {
    this.getUserTypes()

    
  },
  methods: {
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
      }
    },
    drawHistogram (id, title, categories, series ) {
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
        colors: ['#2f7ed8', '#910000', '#8bbc21', '#0d233a',   '#1aadce',
          '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
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
    initialize (data) {
      this.by = 'day'
      this.startDate = moment().startOf('month').format('YYYY-MM-DD')
      this.endDate = moment().endOf('month').format('YYYY-MM-DD')
      if (data.types) {
        this.userTypes = data.types
      }
      this.search()
    },
    getUserTypes () {
      var url = this.appUrl + '/auth/getOrganismTypes'
      this.$http.get(url)
      .then(function (response) {
        this.initialize(response.body)
      })
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
    searchService () {
      
    },
    searchCiest2 () {
      
    },
    extractSeriesFrom (data, first) {
      console.log(first)
      if (first) {
        this.days = []
        this.months = []
        this.years = []
       // this.sessions = {days: [], months: [], years: []}
      }
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
            _this.days.push(date2.format('DD-MM-YYYY'))
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
          _this.days.push(date2.format('DD-MM-YYYY'))
        }
        results.days.push(day['tot'])
        countMonth += day['tot']
        countYear += day['tot']
        if (month2 !== month) {
          results.push(countMonth)
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
        var results = _this.extractSeriesFrom(tab, true)
        first = false
        _this.sessions.days[tp.t_id] = results.days
        _this.sessions.months[tp.t_id] = results.months
        _this.sessions.years[tp.t_id] = results.years
        
      })
      this.drawConnection()
     
      this.userTypes.forEach(function (tp) {
        var tab = data.newUsers.filter(u => u.type === tp.t_id)
        var results = _this.extractSeriesFrom(tab)
        _this.newUsers.days[tp.t_id] = results.days
        _this.newUsers.months[tp.t_id] = results.months
        _this.newUsers.years[tp.t_id] = results.years
        
      })
      console.log(this.newUsers)
      this.drawNewUsers()

    }
  }
}
</script>
<style>

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