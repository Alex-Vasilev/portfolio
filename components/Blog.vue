<template>
    <div class="blog-content ">
        <h3>latest news</h3>
        <div class="container">
            <div class="news-item-list ">
                <router-link v-for="(item, index) in items"
                             v-bind:to="'/blog/'+item._id"
                             class="news-item"
                             rrr='uiu'>                  
                    <p class="news-item-title">{{item.name}}</p>
                    <p class="news-item-description">{{item.description}}</p>
                    <div>
                        <span class="posted-date">19 jun 2017</span>
                        <span class="updated-date">Last updated: 21 jun 2017</span>
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
