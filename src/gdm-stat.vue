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
  <h1 v-if="mode === 'connection'">Connexions aux services</h1>
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
      
    },
    drawConnection() {
      Highcharts.chart('sessions', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Histogram using a column chart'
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          categories: this.days,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0,
            borderWidth: 0,
            groupPadding: 0,
            shadow: false
          }
        },
        series: [{
          name: 'Data',
          data: this.sessions.days

        }]
      });
    },
    initialize () {
      this.by = 'month'
      this.startDate = moment().year() + '-01-01'
      this.endDate = (moment().year() + 1) + '-01-01'
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
      console.log(this.startDate)
      var date = moment(this.startDate, 'YYYY-MM-DD')
      var _this = this
      data.sessions.forEach(function (day) {
        console.log(day)
        var strDay = day['year'].toString() + day['month'].toString().padStart(2, '0') + day['day'].toString().padStart(2, '0')
        var date2 =  moment(strDay, 'YYYYMMDD')
        console.log(date2.diff(date, 'days'))
        while (date2.diff(date, 'days') > 0) {
          _this.days.push(date.format('MM-DD'))
          _this.sessions.days.push(0)
          date.add(1, 'days')
        }
        date = date2
        _this.days.push(date.format('MM-DD'))
        _this.sessions.days.push(day['tot'])
        
      })
      console.log(this.days)
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