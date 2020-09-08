import Vue from 'vue'
import App from './App'
import request from 'common/request.js'
import moment from 'moment';
console.log(moment)
Vue.config.productionTip = false
Vue.prototype.$request = request
Vue.prototype.$moment = moment;
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
