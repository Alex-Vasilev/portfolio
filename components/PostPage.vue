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
                <div class="post-page-categories">
                    <div v-for="item in post.categories"
                         class="category">{{item}}
                    </div>
                </div>
                <div class='footer-post'>
                    <span class="posted-date">{{post.createDate}}</span>
                    <span class="updated-date"
                          v-if="post.updateDate">Last updated: {{post.updateDate}}</span>
                    <span class="share-post">Share</span>
                </div>
                <p class="post-page-description">{{post.description}}</p>
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
                this.$http.get("api/posts/" + this.$route.params.id, {
                    headers: {"contentType": "application/json"}
                }).then(response => {
                    self.post = response.data;
                }, response => {
                    console.log(6);
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
