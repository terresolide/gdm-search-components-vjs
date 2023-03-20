<i18n>
{
  "en": {
    "product_type": "Product Type",
    "right_click": "Right click for infos",
    "draw_bbox": "Draw a ROI",
    "search_bbox": "Search a ROI"
  },
  "fr": {
     "product_type": "Type de Produit",
     "right_click": "Clic droit pour + infos",
     "draw_bbox": "Dessiner une zone d'intérêt",
     "search_bbox": "Rechercher une zone d'intérêt"
    }
}
</i18n>
<template>
<span class="gdm-parameters" v-show="show" style="direction:ltr;"> <!--   @contextmenu="$event.preventDefault()" > -->
 <div v-if="!root" style="margin-left: -18px;":title="tr(describe.short)" >
<!--   <div  v-if="used" class="gdm-deployed" @click="deployed = !deployed" style="width:6px;pointer:cursor;">{{deployed ? '-' : '+'}}</div>
 <div v-else="used" class="gdm-deployed" style="color:grey;">{{deployed ? '-' : '+'}}</div>
 -->
  <div  v-show="required" class="gdm-used fa" :class="{'fa-chevron-circle-right': !deployed, 'fa-chevron-circle-down': deployed}" @click="deployed = !deployed" ></div>
  
  <div  v-if="type === 'complexeReturn'"  class="gdm-used fa"  @click="changeUsed"  
  :class="{ 'fa-square-o': !used, 'fa-check-square-o': used, disabled: disabled || mode === 'view'}"></div>
  
  <div v-else v-show="!required" class="gdm-used fa"  @click="used = !used"  :class="{ 'fa-square-o': !used, 'fa-check-square-o': used, 'disabled': mode === 'view'}"></div>
  
  <span class="gdm-complexe-title" v-if="used || mode === 'view'" :style="{color: color}"  @click="deployed = !deployed" 
  @contextmenu="showTooltip($event)" :title="getTitle(describe)">
  {{tr(title)}}
   <span> {{deployed ? '-' : '+'}}</span>
  </span>
  <span v-if="!used && mode !== 'view'" :style="{color: color, opacity:0.7}"  @contextmenu="showTooltip($event)" >{{tr(title)}}</span>
   <div v-if="description" class="gdm-tooltip" @click="hideTooltip()" @contextmenu="hideTooltip()">
    <h4 v-if="describe.short">{{tr(describe.short)}}</h4>
    <div v-html="tr(description)"></div>
   </div>
</div>
<div v-show="deployed && (used || mode === 'view')"  style="margin-left:20px;">
<div v-if="mode !== 'view' && (name === 'dsmopt_use_roi' || name === 'correl_use_roi')"
 style="margin-top:5px;font-size:0.9em;text-align:center;">
   <span class="button" @click="triggerDrawBbox"><i class=" fa fa-edit"></i> &nbsp;{{$t('draw_bbox')}}</span>
</div>
<div v-if="mode !== 'view' && name === 'dsmopt_use_roi'"
 style="margin-top:5px;font-size:0.9em;text-align:center;">
   <span class="button" @click="triggerSearchBbox"><i class="fa fa-search"></i> &nbsp;{{$t('search_bbox')}}</span>
</div>
 <div v-for="(parameter, key) in parameters" style="overflow: visible;position:relative;" :style="{marginTop:'5px'}" :key="key" 
  v-if="!(mode === 'view' && parameter.type === 'customInputImages')">
   <gdm-parameters :ref="parameter.name" :mode="mode" v-if="parameter.type === 'complexe' || parameter.type === 'complexeReturn'" 
   :describe="parameter" :parent="prefix" :color="color" :lang="lang"
   :defaultParameters="defaultParameters">
   </gdm-parameters>
   <div v-if="['complexe', 'complexeReturn', 'hidden'].indexOf(parameter.type) < 0" v-show="parameter.show" :class="parameter.classname">
   <div   style="opacity:0.5;margin-left:-18px;display:inline-block;width:14px;text-align: center;">-</div>
   <div   style="display:inline-block;vertical-align:top;" :style="{maxWidth: (parameter.blockWidth || (width - 30)) + 'px'}">
     <div v-if="parameter.type!== 'complexe' && parameter.type !== 'complexeReturn'" class="gdm-title"
     :style="titleStyle(parameter)"  :title="getTitle(parameter)" @contextmenu="showTooltip($event)">{{tr(parameter.title)}}</div>
     
     <div v-if="parameter.description" class="gdm-tooltip" @click="hideTooltip()" @contextmenu="hideTooltip()">
     <h4 v-if="parameter.short">{{tr(parameter.short)}}</h4>
     <div v-html="tr(parameter.description)"></div>
     </div>
     
     <div v-if="parameter.type === 'select' || parameter.type === 'customTypeSelect'" 
     style="display:inline-block;">
        <select v-if="parameter.associative" :required="parameter.required" :name="prefix + parameter.name" @change="change(parameter)" 
        v-model="values[prefix + parameter.name]" :class="{disabled: (parameter.type === 'customTypeSelect' || parameter.disabled)}"
        :disabled="mode === 'view' || parameter.disabled">
          <option v-for="(option, key) in parameter.options" :value="key">{{tr(option)}}</option>
        </select>
        <select v-else :name="prefix + parameter.name"  v-model="values[prefix + parameter.name]"
        :class="{disabled : (parameter.type === 'customTypeSelect' || parameter.disabled)}" :disabled="mode === 'view' || parameter.disabled"
        @change="change(parameter)">
           <option v-for="option in parameter.options" :value="option">{{option}}</option>
        </select>
     </div>
      <div v-if="parameter.type === 'multipleCheckbox'"  style="display:inline-block;">
       <span  v-for="option in parameter.options" style="margin-right:3px;">
         {{option}}
         <input  type="checkbox" :class="prefix + parameter.name" :name="prefix + parameter.name + '[]'" :value="option" 
         v-model="values[prefix + parameter.name]" @change="change(parameter)" :disabled="mode === 'view'  || parameter.disabled" />
       </span>
     </div>
     <div v-if="parameter.type === 'datalist'">
        <input type="text" :list="'list_' + prefix + parameter.name" v-model="values[prefix + parameter.name]" 
        style="width:250px;min-width:250px" :pattern="parameter.pattern" :name="prefix + parameter.name" :regex="parameter.regex"
         :disabled="mode === 'view' || parameter.disabled">
				<datalist v-if="parameter.associative" :id="'list_' + prefix + parameter.name">
				    <option v-for="(option, key) in parameter.options" :value="key">{{key}} - {{option}}</option>
				</datalist>
				<datalist v-else :id="'list_' + prefix + parameter.name">
            <option v-for="(option, key) in parameter.options" :value="option">{{option}}</option>
        </datalist>
       
     </div>
     <input v-if="parameter.type === 'date'" type="date"  :name="prefix + parameter.name" v-model="values[prefix + parameter.name]" 
         style="max-width:135px;"   :required="parameter.required" :min="parameter.min" :max="parameter.max" 
         :disabled="mode === 'view' || parameter.disabled" @change="change(parameter)" :lang="lang == 'fr' ? 'fr-FR' : 'en-US'"/>
   
     <div v-if="parameter.type === 'text'">
          <input type="text" :required="parameter.required" :name="prefix + parameter.name" :pattern="parameter.pattern" v-model="values[prefix + parameter.name]" 
          :placeholder="parameter.placeholder" :disabled="mode === 'view' || parameter.disabled" @change="change(parameter)"/>
     </div>
     <input v-if="parameter.type === 'number'"
       type="number" :name="prefix + parameter.name" :min="parameter.min" :max="parameter.max" :step="parameter.step"
        v-model="values[prefix + parameter.name]"  @change="change(parameter)" 
        :disabled="mode === 'view' || parameter.disabled" :class="{disabled:(parameter.type === 'customTypeNumber') || parameter.disabled}"/>
     
     <input v-if="parameter.type === 'customTypeNumber'" type="text" :name="prefix + parameter.name" :pattern="parameter.pattern" style="max-width:80px;"
        v-model="values[prefix + parameter.name]" :disabled="mode === 'view' || parameter.disabled"
         @change="change(parameter)" class="disabled"/>
  
     <span v-if="parameter.type === 'checkbox'">
     <input type="checkbox"   style="vertical-align:middle;" v-model="values[prefix + parameter.name]" 
      @click="values[prefix + parameter.name] = !values[prefix + parameter.name]" 
      :disabled="mode === 'view' || parameter.disabled" @change="change(parameter)" />
      <input type="hidden" v-model="values[prefix + parameter.name]" :name="prefix + parameter.name" />
    </span>
     <div v-if="parameter.type === 'customTypeText'">
        <input type="text" class="disabled" :name="prefix + parameter.name" v-model="values[prefix + parameter.name]"
        :disabled="mode === 'view' || parameter.disabled"  placeholder="automatically filled" />
     </div>
     <span v-if="parameter.type === 'customInputImages' && mode !== 'view'"><b>{{parameter.count}}</b>
	     <i v-if="parameter.min || parameter.max" style="font-size:0.9em;margin-left:10px;">
	       (<span v-if="parameter.min">{{parameter.min}} &#x2264; </span>N<span v-if="parameter.max"> &#x2264; {{parameter.max}}</span>)
	     </i>
     </span>
     </div>
     </div>
 </div>

    
    
 </div>
</span>
</template>
<script>
// import moment from 'moment'
const GdmParameters = () => import('./gdm-parameters.vue')
export default {
  name: 'GdmParameters',
  components: {GdmParameters},
  props: {
    describe: {
      type: String | Object,
      default: null
    },
    parent: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#303030'
    },
    width: {
      type: Number,
      default: 280
    },
    mode: {
      type: String,
      default: null
    },
    defaultParameters: {
      type: Object | Array,
      default: () => {}
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  data () {
    return {
      parameters: {},
      title: null,
      required: true,
      used: true,
      deployed: true,
      type: 'root',
      root: false,
      prefix: '',
      name: '',
      description: null,
      filters: {},
      values: {},
      show: true,
      complexes: [],
      listeners: [],
      emit: null,
      disabled: false
    }
  },
  created () {
    this.$i18n.locale = this.lang
    // moment.locale(this.$store.state.lang)
    this.init()
  },
  mounted () {
  },
  beforeDestroy () {
    this.removeListeners()
  },
  methods: {
    tr (name) {
      if (name && name[this.lang]) {
        return name[this.lang]
      } else {
        return name
      }
    },
    change (parameter) {
      if (parameter.type === 'multipleCheckbox') {
        if (parameter.required) {
          var nodes = this.$el.querySelectorAll('input[name="' + this.prefix + parameter.name + '[]"]')
          var required = this.values[this.prefix + parameter.name].length === 0
          nodes.forEach(function(node) {
            node.required = required
            node.classList.remove('invalid')
          })
        }
      }
      var event0 = new CustomEvent('parameterChange')
      document.dispatchEvent(event0)
      if (parameter.emit) {
        var event = new CustomEvent(parameter.emit, {detail: {value: this.values[this.prefix + parameter.name]}})
        document.dispatchEvent(event)
      }
    },
    changeUsed (e) {
      this.$set(this.values, this.name, !this.values[this.name])
      this.used = this.values[this.name]
      if (this.used) {
        this.deployed = true
      }
      var event0 = new CustomEvent('parameterChange')
      document.dispatchEvent(event0)
      if (this.emit) {
        var event = new CustomEvent(this.emit, {detail: {value: this.values[this.name]}})
        document.dispatchEvent(event)
      }
    },
    init () {
      if (typeof this.describe === 'string') {
        this.root = true
        this.load()
      } else {
        this.parameters = this.describe.parameters
        this.title = this.tr(this.describe.title)
        this.type = this.describe.type
        this.description = this.describe.description
        this.initUsed()
        this.listeners = this.describe.listeners ? this.describe.listeners : []
        if (this.describe.emit) {
          this.emit = this.describe.emit
        }
        if (this.describe.defaults) {
          var event = new CustomEvent('gdm-parameters:init', {detail: {name: this.name, values: this.describe.defaults}})
          document.dispatchEvent(event)
        }
        this.prefix = this.parent + (this.describe.prefix ? this.describe.prefix : '')
        this.initListeners()
        
        this.extractChildValues()
       // this.initValues()
      }
    },
    initUsed () {
      this.required = this.describe.required
      this.used = this.describe.default
      if (this.describe.hasOwnProperty('disabled')) {
        this.disabled = this.describe.disabled
      }
      if (this.type === 'complexeReturn') {
        this.required = false
      }
      if (this.describe.hasOwnProperty('show')) {
        this.show = this.describe.show
      }
      this.deployed = this.describe.deployed
      if (this.type.indexOf('complexeReturn') >= 0) {
        this.name = this.parent + this.describe.name
        // init complexe return used
        if (this.defaultParameters && this.defaultParameters.hasOwnProperty(this.name)) {
          this.values[this.name] = this.defaultParameters[this.name]
          this.used = this.defaultParameters[this.name]
        } else {
          this.values[this.name] = this.used
        }
        this.filters[this.name] = 'parseBool'
      }
    },
    initListeners () {
      var _this = this
      this.listeners.forEach(function (listener) {
        listener.funct = function (e) {
          if (listener.show) {
            if (e.detail.value === listener.show) {
              _this.show = true
              _this.$forceUpdate()
            } else {
              _this.show = false
            }
          }
        
//           if (listener.hasOwnProperty('or')) {
//             console.log('or1')
//             e.detail.value = e.detail.value || _this.values[_this.name]
//             console.log(e.detail.value)
//           }
//           if (listener.hasOwnProperty('not')) {
//             e.detail.value = !e.detail.value
//           }
          if (listener.emit) {
            if (listener.emitValue) {
              var steps = listener.emitValue
              steps.forEach(function (operator) {
                switch (operator) {
	                case 'and':
	                  e.detail.value = e.detail.value && _this.values[_this.name]
	                  break
	                case 'or':
	                  e.detail.value = e.detail.value || _this.values[_this.name]
	                  break
	                case 'not':
	                  e.detail.value = !e.detail.value
	                  break
                }
              })
            }
            console.log('valeur emise = ', e.detail.value)
            var event = new CustomEvent(listener.emit, {detail: {value: e.detail.value}})
            document.dispatchEvent(event)
          }
          if (listener.hasOwnProperty('disabled')) {
            if (e.detail.value === listener.disabled) {
              _this.disabled = true
              if (listener.value) {
                _this.values[_this.name] = false
              }
              if (listener.used) {
                _this.used = false
              }
            } else {
              _this.disabled = false
            }
          }
        
          if (listener.hasOwnProperty('used')) {
            if (listener.hasOwnProperty('mode')) {
              // only for use roi
	            if (e.detail.mode === listener.mode) {
	              _this.used = e.detail.value
	              _this.values[_this.name] = e.detail.value
	            } 
            } else if (listener.hasOwnProperty('value')) {
              if (e.detail.value === listener.value) {
                _this.used = true
                _this.deployed = true
              } else {
                console.log('cas unw close')
                _this.used = false
                _this.deployed = false
              }
            }
          }
        }
        document.addEventListener(listener.event, listener.funct)
      })
    },
//     setInitialized (name) {
//       console.log('setInitialized', name)
//       if (this.complexes[name]) {
//         this.initialized += 1
//       }
//       if (!this.root && this.initialized === this.complexes.length) {
//         this.$emit('initialized', this.name)
//       }
//       if (this.root && this.initialized === this.complexes.length) {
//         console.log('finally initValues')
//       }
//     },
//     initValues () {
//       console.log('initvalues')
//       var _this = this
//       for (var parameter in this.values) {
//         _this.change(parameter)
//       }
//       var event0 = new CustomEvent('parameterChange')
//       document.dispatchEvent(event0)
//       if (this.emit) {
//         var event = new CustomEvent(this.emit, {detail: {value: this.values[this.name]}})
//         document.dispatchEvent(event)
//       }
//     },
    emitEventValues () {
      var _this = this
      this.complexes.forEach(function (name) {
        var comp = _this.$refs[name][0]
        comp.emitEventValues()
      })
      for (var key in this.parameters) {
        this.change(this.parameters[key])
      }
      if (this.emit) {
        var event = new CustomEvent(this.emit, {detail: {value: this.values[this.name]}})
        document.dispatchEvent(event)
      }
    },
    getValues () {
      var _this = this
      var values = this.values
      this.complexes.forEach(function (name) {
        var comp = _this.$refs[name][0]
        if (name.substr(name.length - 1) === ':') {
          values[name.substr(0, name.length - 1)] = comp.getValues()
        } else {
          values = Object.assign(values, comp.getValues())
        }
      })
      return values
    },
    hideTooltip (event) {
      document.querySelectorAll('.tooltip-show').forEach(function (node) {
        node.classList.remove('tooltip-show')
      })
    },
    removeListeners () {
      this.listeners.forEach(function (listener) {
        document.removeEventListener(listener.event, listener.funct)
      })
      if (!this.parameters) {
        return
      }
      this.parameters.forEach(function (parameter) {
        if (parameter.listeners) {
          parameter.listeners.forEach(function (listener) {
            document.removeEventListener(listener.event, listener.funct)
          })
        }
      })
    },
    showTooltip (event) {
      event.preventDefault()
      if (event.target.classList.contains('tooltip-show')) {
        event.target.classList.remove('tooltip-show')
        return
      }
      document.querySelectorAll('.tooltip-show').forEach(function (node) {
        node.classList.remove('tooltip-show')
      })
      event.target.classList.add('tooltip-show')
    },
    triggerDrawBbox () {
      var event = new CustomEvent('DrawBbox')
      document.dispatchEvent(event)
    },
    triggerSearchBbox () {
      var event = new CustomEvent('SearchBbox')
      document.dispatchEvent(event)
    },
    extractChildValues () {
      var _this = this
      this.parameters.forEach(function (parameter , index) {
        var name = _this.prefix + parameter.name
        if (parameter.defaults) {
          // the defaults values for the parameters
          var event = new CustomEvent('gdm-parameters:init', {detail: {name: name, values: parameter.defaults}})
          document.dispatchEvent(event)
        }
        // case json format
        if (parameter.name.substr(parameter.name.length - 1) === ':') {
          var params = _this.defaultParameters[name.substr(0, name.length - 1)]
          _this.defaultParameters = Object.assign(_this.defaultParameters, params)
        }
        if (parameter.type.indexOf('complexe') >= 0) {
          _this.complexes.push(parameter.name)
        } else if (parameter.type.indexOf('customInputImages') >= 0 && parameter.separator) {
          _this.values[name] = {
            separator: parameter.separator,
            min: parameter.min ? parameter.min : null,
            max: parameter.max ? parameter.max : null
          }
          parameter.default = parameter.separator
        } else {
          if (_this.defaultParameters.hasOwnProperty(name)) {
//             if (parameter.type === 'select') {
//               // check if value in list value
//               if (parameter.options.indexOf && parameter.options.indexOf(_this.defaultParameters[name])) {
//                 parameter.value = _this.defaultParameters[name]
//               } else {
//                 parameter.value = _this.defaultParameters[name]
//               }
//             } else {
//               parameter.value = _this.defaultParameters[name]
//             }
            parameter.value = _this.defaultParameters[name]
//             if (parameter.emit) {
//               _this.change(parameter)
//             }
          } else {
            parameter.value = typeof parameter.default === 'undefined' ? '' : parameter.default
          }
          _this.values[name] = parameter.value      
        }
        _this.filters[name] = parameter.filter
        if (!parameter.hasOwnProperty('show')) {
          parameter.show = true
          parameter.defaultShow = true
        } else {
          parameter.defaultShow = parameter.show
        }
        if (parameter.listeners && parameter.type.indexOf('complexe') < 0) {
          parameter.listeners.forEach(function (listener) {
            listener.funct = function (e) {
              if (listener.show) {
                if (e.detail.value === listener.show) {
                  parameter.show = true
                } else {
                  parameter.show = false
                }
              }
              if (listener.hasOwnProperty('or')) {
                e.detail.value = e.detail.value || _this.values[_this.name]
              }
              if (listener.hasOwnProperty('map') && listener.map[e.detail.value]) {
                _this.$set(_this.values, name, listener.map[e.detail.value])
              }
              if (listener.hasOwnProperty('value')) {
                for (var prop in listener.value) {
                  if (prop === 'value') {
                    _this.$set(_this.values, name, e.detail[listener.value[prop]])
                    if (listener.hasOwnProperty('disabled')) {
                      parameter.disabled = listener.disabled && e.detail[listener.value[prop]]
                    }
                  } else {
                    if (!parameter.save) {
                      parameter.save = {}
                    }
                    if (!parameter.save.hasOwnProperty(prop)) {
                      parameter.save[prop] = parameter[prop]
                    }
                    parameter[prop] = e.detail[listener.value[prop]]
                  }
                  
                }
              }
              if (listener.function === 'multiple') {
                // case rlookChange
                var value0 = parseInt(e.detail.value)
                var value = value0
                var options = {}
                while (value <= 32) {
                  options[value] = value + '-LOOK' + (value > 1 ? 'S': '')
                  value = value * 2
                }
                _this.parameters[index].options = options
                if (!options[_this.values[name]]) {
                  _this.$set(_this.values, name, value0)
                }
              }
              _this.$forceUpdate()
            }
            // listener.listen = listener.funct.bind(listener)
            document.addEventListener(listener.event, listener.funct)
          })
        }
      })
      // emit event
      this.parameters.forEach(function (parameter) {
         if (parameter.emit) {
           setTimeout(function () {
             var event = new CustomEvent(parameter.emit, {detail: {value: parameter.value}})
             document.dispatchEvent(event)
           }, 0)
         }
      })
//       if (this.complexes.length === 0) {
//         this.$emit('initialized', this.name)
//       }
//       if (!hasChild) {
//         this.$emit('addFilters', this.filters)
//       }
    },
    load () {
      this.$http.get(this.describe).then(function (response) {
        this.parameters = response.body.parameters
        this.prefix = response.body.prefix ? response.body.prefix : ''
        this.extractChildValues()
      }, function (response) {
        console.log('error gdm-parameters - unknown file')
      })
    },
//     printDate (date) {
//       return moment(date).format('lll')
//     },
    reset () {
      if (this.type !== 'root') {
        this.initUsed()
      }
      var _this = this
      this.parameters.forEach(function (parameter) {
        var name = _this.prefix + parameter.name
        parameter.show = parameter.defaultShow
        if (parameter.type.indexOf('complexe') < 0) {
          if (parameter.type.indexOf('customInputImages') >= 0 && parameter.separator) {
            _this.values[name] = {
              separator: parameter.separator,
              min: parameter.min ? parameter.min : null,
              max: parameter.max ? parameter.max : null
            }
            parameter.default = parameter.separator
          } else {
            if (_this.defaultParameters.hasOwnProperty(name)) {
              parameter.value = _this.defaultParameters[name]
            }
            // force update multiple checkbox
            if (Array.isArray(parameter.value)) {
              // get values string
              var nodes = _this.$el.querySelectorAll('.' + name)
              var data = parameter.value.map(val => val + '')
              nodes.forEach(function (node) {
                if (data.indexOf(node.value) >=0) {
                  node.checked = true
                } else {
                  node.checked = false
                }
              })
            }
            _this.$set(_this.values, name, parameter.value)
          }
        }
        if (parameter.save) {
          for (var prop in parameter.save) {
            parameter[prop] = parameter.save[prop]
          }
        }
        if (parameter.emit) {
          var event = new CustomEvent(parameter.emit, {detail: {value: _this.values[_this.prefix + parameter.name]}})
          document.dispatchEvent(event)
        }
      })
      this.complexes.forEach(function (name) {
        var comp = _this.$refs[name][0]
        comp.reset()
      })
      this.$forceUpdate()
    },
    getTitle (parameter) {
      var title = parameter.short ? this.tr(parameter.short) : ''
      if (parameter.description) {
        title += parameter.short ? '\n' : ''
        title += this.$i18n.t('right_click')
      }
      return title
    },
    titleStyle (parameter) {
      if (['checkbox', 'number', 'customTypeNumber', 'multipleCheckbox', 'select', 'customInputImages', 'date', 'text'].indexOf(parameter.type) >= 0) {
        return {
          color: this.color,
          display: parameter.display ? parameter.display : 'inline-block',
          verticalAlign: 'middle',
          width: parameter.width ? parameter.width : '110px',
        //  maxWidth: '200px',
          maxHeight: '30px',
          overflow: 'hidden',
          textAlign: 'left',
          cursor: parameter.description ? 'help' : 'pointer'
        }
      } else {
        return {
          color: this.color,
          display: 'block',
          textAlign: 'left',
          cursor: parameter.description ? 'help' : 'pointer'
        }
      }
    }
  }
}

</script>
<style>
div[id="app"] .gdm-tooltip a {
  color: blue;
  text-decoration: underline;
}
div[id="app"] .gdm-tooltip a:hover {
  color: darkred;
}
</style>
<style scoped>
.gdm-parameters .gdm-used.disabled {
  color:grey;
  pointer-events:none;
}
.gdm-parameters .gdm-complexe-title{
  cursor: pointer;
}
.gdm-parameters .gdm-complexe-title:hover{
  margin-left:3px;
}
.gdm-parameters .gdm-title {
  line-height: 1;
}
/*.gdm-title > div {
  display: flex;
}
.gdm-title > div::after {
 border-bottom: 1px dotted black;
  content: '';
  flex: 1;
}*/

.gdm-tooltip {
  position:absolute;
  top:18px;
  padding:5px;
  z-index:10;
  background-color: #fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  display:none;
}
.gdm-tooltip h4 {
  margin: 3px 0;
  text-align:left;
  font-weight:800;
  font-size:1em;
  font-color:black;
  opacity:1;
}

.tooltip-show + .gdm-tooltip {
  display:block;
}
.gdm-parameters .gdm-deployed {
  display: inline-block;
}
.gdm-parameters .gdm-used{
  display: inline-block;
  width: 14px;
  text-align: center;
  cursor: pointer;
}
.gdm-parameters select{
  min-width: 70px;
}
.gdm-parameters input {
   border-radius: 0;
   height: 19px;
   max-width: 180px;
   border-style:inset;
   padding: 1px 0;
   box-sizing: border-box;
   /* -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;*/
    color: -internal-light-dark-color(black, white);
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    cursor: text;
    margin: 0em;
    /*font: 400 13.3333px Arial;*/
    padding: 1px 0px;
    border-width: 1px;
    border-style: inset;
    border-color: -internal-light-dark-color(rgb(118, 118, 118), rgb(195, 195, 195));

  /* border-color: rgb(238, 238, 238) ;
   border-top-style: inset;
    background-color: -internal-light-dark-color(white, black);
    border-image-outset: 0px;
    box-sizing: border-box;*/
}
.gdm-parameters div.large-input input,
.gdm-parameters div.large-input select{
   max-width:180px;
   width: 180px;
}
.gdm-parameters input.invalid,
.gdm-parameters select.invalid {
  box-shadow: 1px 1px 5px red;
}
.gdm-parameters input[type="text"] {
  padding: 1px 2px;
}
.gdm-parameters input[type="number"] {
  max-width: 70px;
}
.gdm-parameters input[type="checkbox"] {
  vertical-align:middle;
  line-height:19px;
}
.gdm-parameters div.small-number input[type="number"],
.gdm-parameters div.small input[type="text"] {
  max-width: 48px;
}
.gdm-parameters div.small div:not(.gdm-tooltip) {
  display: inline-block;
}
.gdm-parameters div.disabled input[type="text"] {
  background: #F3F3F3;
  pointer-events: none;
  color: #777;
} 
.gdm-parameters input[type="checkbox"] {
  cursor: pointer;
}
.gdm-parameters select {
  -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: -internal-light-dark-color(black, white);
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    -webkit-appearance: menulist;
    box-sizing: border-box;
    align-items: center;
    white-space: pre;
    -webkit-rtl-ordering: logical;
    background-color: -internal-light-dark-color(white, black);
    cursor: default;
    margin: 0em;
    padding:0;
    font: 400 13.3333px Arial;
    border-radius: 0px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(169, 169, 169);
    border-image: initial;
}
.gdm-parameters select:not(:-internal-list-box) {
    background-color: buttonface;
    overflow: visible !important;
}
</style>
