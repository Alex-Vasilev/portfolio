import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import VueResource from 'vue-resource'
Vue.use(VueResource);

import Hello from './components/Hello.vue'
import About from './components/About.vue'
import Blog from './components/Blog.vue'
import Storm from './components/Storm.vue'
import Contact from './components/Contact.vue'
import Admin from './components/Admin.vue'
import PostPage from './components/PostPage.vue'


const routes = [
  { path: '/', component: Hello },
  { path: '/about', component: About },
  { path: '/blog', component: Blog },
  { path: '/storm', component: Storm },
  { path: '/contact', component: Contact },
  { path: '/admin', component: Admin },
  { path: '/blog/:id', component: PostPage }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.directive('slice', {
  inserted: function (el, size) {
    if (el.innerText.length >= size.value.size) {
      el.innerText = el.innerText.slice(0, size.value.size) + '...';
    }
  }
})

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
}).$mount('#app');

