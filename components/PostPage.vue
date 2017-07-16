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
                     class="category">{{item}}
                </div>
                <div class='footer-post'>
                    <span class="posted-date">{{post.createDate}}</span>
                    <span class="updated-date"
                          v-if="post.updateDate">Last updated: {{post.updateDate}}</span>
                    <span class="share-post">Share</span>
                </div>
                <p class="">{{post.description}}</p>
                <p class="news-item-text"
                   v-html="post.text"></p>
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
