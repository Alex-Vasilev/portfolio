<template>
    <div class="blog-content ">
        <div class="container">
            <div class="inner-container">
                <h3>latest news</h3>
                <router-link v-for="item in items"
                             v-bind:to="'/blog/'+item._id"
                             v-bind:data="item"
                             v-bind:key="item._id"
                             class="news-item">                  
                    <p class="news-item-title">{{item.name}}</p>
                    <div v-for="category in item.categories"
                         class="category">{{category}}</div>
                    <p class="news-item-description">{{item.description}}</p>
                    <div class='footer-post'>
                        <span class="posted-date">{{item.createDate}}</span>
                        <span class="updated-date"
                              v-if="item.updateDate">Last updated: {{item.updateDate}}</span>
                        <span class="share-post">Share</span>
                    </div>
<!--                    <div>
                        <a href="#" target="_blank" @click="vkontakte($event, 'http://localhost:3000/#/blog/' + item._id, item.name, 'lol', '/assets/img/IrXwrfE9gts.jpg')">
                            vk</a>
                        <a href="#" target="_blank" @click="facebook($event, 'http://localhost:3000/#/blog/' + item._id, item.name, 'lol', '/assets/img/IrXwrfE9gts.jpg')">fb</a>
                        <a href="#" target="_blank" @click="twitter()">tw</a>
                    </div>-->
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Blog',
        data: function () {
            return {
                items: [],
                categories: []
            };
        },

        created() {
            this.fethPostsData();
            this.fethCategoriesData(); 
        },

        watch: {
            '$route': 'fetchData'
        },

        methods: {
            fethPostsData: function () {
                console.log(1);
                var self = this;
                $.ajax({
                    url: "api/posts",
                    type: "GET",
                    contentType: "application/json",
                    success: function (posts) {
                        self.items = posts;
                        console.log(self.items);
                    },
                    error: function () {
                        console.log('sukablyat');
                    }
                });
            },
            
            fethCategoriesData: function () {
                console.log(2);
                var self = this;
                $.ajax({
                    url: "api/categories",
                    type: "GET",
                    contentType: "application/json",
                    success: function (categories) {
                        self.categories = categories;
                        console.log(self.categories);
                    },
                    error: function () {
                        console.log('ebanarot');
                    }
                });
            },
            
            vkontakte: function(event, purl, ptitle, text, pimg) {
                event.stopPropagation();
                event.preventDefault();

               var url  = 'http://vkontakte.ru/share.php?';
                url += 'url='          + encodeURIComponent(purl);
                url += '&title='       + encodeURIComponent(ptitle);
                url += '&description=' + encodeURIComponent(text);
                url += '&image='       + encodeURIComponent(pimg);
                url += '&noparse=true';
                this.popup(url);
            },
    
            facebook: function(event, purl, ptitle, text,  pimg) {
                event.stopPropagation();
                event.preventDefault();
                
                var url  = 'http://www.facebook.com/sharer.php?s=100';
                url += '&p[title]='     + encodeURIComponent(ptitle);
                url += '&p[summary]='   + encodeURIComponent(text);
                url += '&p[url]='       + encodeURIComponent(purl);
                url += '&p[images][0]=' + encodeURIComponent(pimg);
                this.popup(url);
            },
          
            twitter: function(event, purl, ptitle) {
                event.stopPropagation();
                event.preventDefault();
                
                var url  = 'http://twitter.com/share?';
                url += 'text=' + encodeURIComponent(ptitle);
                url += '&url=' + encodeURIComponent(purl);
                url += '&counturl=' + encodeURIComponent(purl);
                this.popup(url);
            },

            popup: function (url) {
                window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
            }     
        }
    }
</script>
