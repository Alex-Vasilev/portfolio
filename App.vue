<template>
    <div class="content"
         id="app">           
        <div class="header">
            <router-link to="/" class="logo"></router-link>
            <div class="form-group search">
                <input type="text"
                   class="input-search"
                   placeholder="Search"
                   @input="queryValue($event.target.value)"
                   @keypress="onEnter($event)"
                   @blur="close()">
                <transition name="component-fade" mode="out-in">
                    <div class="results" 
                         v-if="results">
                        <ul>
                            <li v-for="item in find"
                                class="result-item">
                                <router-link  v-bind:to="'/blog/'+item._id">
                                    <h4>{{item.name}}</h4>
                                    <p>{{item.description}}</p>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </transition>
                <transition name="component-fade"
                            mode="out-in">
                    <div v-if="fail_result"
                         class="fail-result">
                        Wtf is it '{{query}}'??
                    </div>
                </transition>
            </div>
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
            find: [],
            results: false,
            fail_result: false,
            query: ''
        };
    },
      
    methods: {
        queryValue(value){
            console.log(value);
            if(!value || value.length<2){
                this.results = false;
                this.fail_result = false;
                return;
            }
            this.query = value;
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
                    self.showResults(posts); 
                },
                error: function () {
                    console.log('sukablyat');
                }
            });
        },
        
        close(){
            this.results = false; 
            this.fail_result = false;
        },
        
        onEnter(e){          
        if(e.keyCode==13){
            this.queryValue(e.target.value);
            }
        },
        
        showResults(posts){
            if(posts.length){
               this.results = true; 
               this.fail_result = false;
            } else {
                this.results = false; 
                this.fail_result = true;
            }
        }    
    },
    
    watch:{
        '$route': function(){
            this.results = false;
            this.fail_result = false;
        }
    }
}
</script>
