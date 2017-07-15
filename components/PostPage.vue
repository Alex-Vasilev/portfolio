<template>          
    <div class="blog-content"> 
        <div class="container">
            <div class="inner-container">
                <div class="head-post-container">
                    <p class="news-item-title post-page-title">{{post.name}}</p>
                    <div class="img-container">
                        <img v-bind:src="'../assets/img/'+ post.file" alt=""/>
                    </div>             
                </div>
                <div v-for="item in post.categories"
                     class="category">{{item}}</div>
                <p class="news-item-description">{{post.description}}</p>
                <p class="news-item-text">{{post.text}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'PostPage',
        data () {
          return {
              post: {}
          };
        },
    
        methods:{
            fetch(){
                var self = this;
                $.ajax({
                    url: "api/posts/" + this.$route.params.id,
                    type: "GET",
                    contentType: "application/json",
                    success: function (post) {              
                        console.log(post.file);
                        self.post = post;
                    },
                    error: function () {
                        console.log('ebalovo');
                    }
                });
            }
        },
        
        watch:{
            '$route': 'fetch'
        },
        
        created () {
            this.fetch();
        }
    }
</script>
