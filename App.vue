<template>
    <div class="content"
         id="app">           
        <div class="header">
            <router-link to="/" class="logo"></router-link>               
            <ul class="main-menu">
                <li><router-link to="/about">About</router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
                <li><router-link to="/blog">Blog</router-link></li>
                <li><router-link to="/works">Works</router-link></li>
            </ul>   
        </div>

    <!--             отображение компонента, для которого совпал путь -->
        <transition name="component-fade" mode="out-in">
           <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
