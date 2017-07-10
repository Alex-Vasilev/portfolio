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
                    <p class="news-item-description">{{item.description}}</p>
                    <div class='footer-post'>
                        <span class="posted-date">{{item.createDate}}</span>
                        <span class="updated-date"
                              v-if="item.updateDate">Last updated: {{item.updateDate}}</span>
                        <span class="share-post">Share</span>
                    </div>
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
                items: []
            };
        },

        created() {
            this.fethPostsData();
        },

        watch: {
            // в случае изменения маршрута запрашиваем данные вновь
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
            }
        }
    }
</script>
