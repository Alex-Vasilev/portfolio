import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from './Main'
//import HomePage from './HomePage'



const routes = [
    {path: '/', component: Main},
//    {path: '/blog', component: Blog},
//    {path: '/works', component: Works},
//    {path: '/contact', component: Contact},
//    {path: '/about', component: About},
//    {path: '/admin', component: Admin}
];

//import Vue from 'vue';
//import VueRouter from 'vue-router';

// 3. Создаём инстанс роутера с опцией `routes`
// Можно передать и другие опции, но пока не будем усложнять
const router = new VueRouter({
    routes
});

new Vue({
  router,
  el: '#main-page',
  render: h => h(Main)
});

export default router