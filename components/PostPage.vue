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
                <p class="news-item-description">{{post.description}}</p>               
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'PostPage',
        data () {
          return {
              post: {},
              image: ''
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
//                        self.image = '../img/' + post.file;
                    },
                    error: function () {
                        console.log('ebalovo');
                    }
                });
            }
        },
        
        created () {
            this.fetch();
        }
    }
</script>
