<template>          
    <div class="blog-content"> 
        <p class="news-item-title">{{post.name}}</p>
        <p class="news-item-description">{{post.description}}</p>
        <img v-bind:src="'../assets/img/'+ post.file" alt=""/>
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
