import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'animate.css';
import {WidgetJsPlugin} from "@widget-js/vue3";
import '@widget-js/vue3/dist/style.css'

createApp(App).use(WidgetJsPlugin).use(router).mount('#app')
