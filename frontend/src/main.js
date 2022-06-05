/*eslint-disable*/
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'
import ToggleButton from 'vue-js-toggle-button'
import UploadImage from 'vue-upload-image';
import VueSocialSharing from 'vue-social-sharing'

import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"
import VueIziToast from 'vue-izitoast';
import JwPagination from 'jw-vue-pagination';

Vue.use(ToggleButton)
Vue.use(VModal, {
    dynamicDefaults: {
        draggable: true,
        resizable: true,
        scrollable: true,
        height: 'auto'
    }
});

import VueGoodshare from "vue-goodshare";
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'izitoast/dist/css/iziToast.css';

Vue.use(Vuetify)
Vue.use(VueIziToast);
Vue.use(VueSocialSharing);

Vue.component('upload-image', UploadImage)
Vue.component('vue-goodshare', VueGoodshare)
Vue.component('jw-pagination', JwPagination);

import vSelect from 'vue-select'
import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
Vue.use(VueSidebarMenu)
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use(CKEditor);
Vue.component('v-select', vSelect)
Vue.use(new VueSocketIO({
    debug: true,
    // connection: SocketIO("http://18.221.248.4:3000"),
    connection: SocketIO("http://127.0.0.1:3000")
}));

// Vue.prototype.$baseUrl = 'http://18.221.248.4:3000/api';
Vue.prototype.$baseUrl = "http://127.0.0.1:3000/api";

// Vue.prototype.$clientUrl = 'http://naijap-vue-app.s3-website.eu-west-2.amazonaws.com';
Vue.prototype.$clientUrl = "http://127.0.0.1:8080";
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')


