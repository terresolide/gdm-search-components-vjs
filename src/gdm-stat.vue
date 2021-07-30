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
  <div id="sessions"></div>
 </div>
</div>
</template>
<script>
import * as Highcharts from 'highcharts'
import moment from 'moment'
export default {
  name: 'GdmStat',
  props: {
    appUrl: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      startDate: null,
      endDate: null,
      mode: 'connection',
      sessions: { days:[], months: [], years: []},
      days:[],
      months:[],
      years: []
    }
  },
  created () {
    this.initialize()
    this.search()
  },
  methods: {
    draw () {
      switch (this.mode) {
        case 'connection':
          this.drawConnection()
          break
      }
    },
    drawConnection() {
      var categories = this[this.by + 's']
      var data = this.sessions[this.by + 's']
      Highcharts.chart('sessions', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Nombre de connexions'
        },
        credits: {
          enabled:false
        },
        legend: {
          enabled: false
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
          title: {
            text: ''
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.x}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
//           formatter (e) {
//              if (!this.point) {
//                return false
//              }
//              return this.point.x
//           },
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0,
            borderWidth: 1,
            groupPadding: 0,
            shadow: false
          }
        },
        series: [{
          name: 'Total',
          data: data

        }]
      });
    },
    initialize () {
      this.by = 'day'
      this.startDate = moment().startOf('month').format('YYYY-MM-DD')
      this.endDate = moment().endOf('month').format('YYYY-MM-DD')
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
    treatmentConnection (data) {
      this.days = []
      this.months = []
      this.years = []
      this.sessions =  {days: [], months: [], years: []}
      var date = moment(this.startDate, 'YYYY-MM-DD')
      var _this = this
      var year = date.year()
      var month = (date.month() + 1).toString().padStart(2, '0') + '-' + year
      var year2 = null
      var month2 = null
      this.years.push(year)
      this.months.push(month)
      var countMonth = 0
      var countYear = 0
      data.sessions.forEach(function (day) {
        // day data
        var strDay = day['year'].toString() + day['month'].toString().padStart(2, '0') + day['day'].toString().padStart(2, '0')
        var date2 =  moment(strDay, 'YYYYMMDD')
        year2 = date2.year()
        month2 = (date2.month() + 1).toString().padStart(2, '0') + '-' + year2
        console.log(month2)
        while (date2.diff(date, 'days') > 0) {
          _this.days.push(date.format('DD-MM-YYYY'))
          _this.sessions.days.push(0)
          date.add(1, 'days')
          year2 = date.year()
          month2 = (date.month() + 1).toString().padStart(2, '0') + '-' + year2
          if (month2 !== month) {
            _this.sessions.months.push(countMonth)
            _this.months.push(month2)
            month = month2
            countMonth = 0
          }
          if (year2 !== year) {
            _this.sessions.years.push(countYear)
            _this.years.push(year2)
            year = year2
            countYear = 0
          }
        }
       // date = date2
        _this.days.push(date2.format('DD-MM-YYYY'))
        _this.sessions.days.push(day['tot'])
        countMonth += day['tot']
        countYear += day['tot']
        if (month2 !== month) {
          _this.sessions.months.push(countMonth)
          _this.months.push(month2)
          month = month2
          countMonth = 0
        }
        if (year2 !== year) {
          _this.sessions.years.push(countYear)
          _this.years.push(year2)
          year = year2
          countYear = 0
        }
        date = date2.add(1, 'days')
      })
      var end = moment(this.endDate, 'YYYY-MM-DD')
      while(end.diff(date, 'days') >= 0) {
        this.days.push(date.format('DD-MM-YYYY'))
        this.sessions.days.push(0)
        year2 = date.year()
        month2 = (date.month() + 1).toString().padStart(2, '0') + '-' + year2
        if (month2 !== month) {
          _this.sessions.months.push(countMonth)
          _this.months.push(month2)
          month2 = month
          countMonth = 0
        }
        if (year2 !== year) {
          _this.sessions.years.push(countYear)
          _this.years.push(year2)
          year2 = month
          countYear = 0
        }
        date.add(1, 'days')
      }
      if (this.years.length > this.sessions.years.length) {
        this.sessions.years.push(countYear)
      }
      if (this.months.length > this.sessions.months.length) {
        this.sessions.months.push(countMonth)
      }
      console.log(countMonth)
      console.log(countYear)
      console.log(this.years)
      console.log(this.months)
      console.log(this.sessions)
      this.drawConnection()
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
   margin-left: calc(50% - 450px);
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