<template>
    <div class="content"
         id="app">           
        <div class="header">
            <router-link to="/" class="logo"></router-link>
            <input type="text"
                   @input="queryValue($event.target.value)">
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
    name: 'App',
    data: function(){
        return {
            find: []
        };
    },
      
    methods: {
        queryValue(value){
            console.log(value);
            if(!value) return;
            var self = this;
            $.ajax({
                url: "api/search",
                type: "POST",
                data: JSON.stringify({
                        query: value
                    }),
                contentType: "application/json",
                success: function (posts) {
                    self.find = posts;
                    console.log(self.find);
                },
                error: function () {
                    console.log('sukablyat');
                }
            });
        }
    }
}
</script>
