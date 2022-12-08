<template>
    <div class="blog-content ">
        <div class="container">
            <h3>Последние новости</h3>
            <div class="categories-container">
                <p>Категории:</p>
                <ul>
                    <li class="category"
                        v-bind:class="{ 'active-category': isActive }"
                        @click="checkAllActive()">Все</li>
                    <li class="category"
                        v-bind:class="{ 'active-category': category.isActive }"
                        v-for="category in categories"
                        @click="checkActive(category)">{{category.cat}}</li>
                </ul>
            </div>
            <router-link v-for="item in items"
                         v-bind:to="'/blog/'+item._id"
                         v-bind:data="item"
                         v-bind:key="item._id"
                         class="news-item">                  
                <p class="news-item-title">{{item.name}}</p>
                <div v-for="itemCategory in item.categories"
                     class="category">{{itemCategory}}</div>
                <p class="news-item-description" v-slice="{size: descriptionSize}">{{item.description}}</p>
                <div class='footer-post'>
                    <span class="posted-date">{{item.createDate}}</span>
                    <span class="updated-date"
                          v-if="item.updateDate">Ред.: {{item.updateDate}}</span>
                    <!--<span class="share-post">Share</span>-->
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Blog',
        data: function () {
            return {
                items: [],
                categories: [],
                isActive: true,
                activeCategories: [],
                descriptionSize: 320
            };
        },

        created() {
            this.fethPostsData();
            this.fethCategoriesData();
            ga('send', 'pageview', 'blog');
        },

        watch: {
            '$route': 'fetchData'
        },

        methods: {
            fethPostsData: function () {
//                console.log(1);
                var self = this;
                this.$http.get('api/posts', {
                    headers: {"contentType": "application/json"}
                }).then(response => {
                    self.items = response.data;
                }, response => {
//                    console.log(1);
                });
            },

            fethCategoriesData: function () {
//                console.log(2);
                var self = this;
                this.$http.get('api/categories', {
                    headers: {"contentType": "application/json"}
                }).then(response => {
                    var data = response.data.map(function (i, v) {
                        return  v = {
                            cat: i,
                            isActive: false
                        };
                    });
                    self.categories = data;
//                    console.log(self.categories)
                }, response => {
//                    console.log(2);
                });
            },

            fetchDataByCategory(data) {
//                console.log(data);
                var self = this;
                var data = JSON.stringify({query: data});
                this.$http.post('api/by_category', data, {
                    headers: {"contentType": "application/json"}
                }).then(response => {
                    self.items = response.data;
                }, response => {
//                    console.log(3);
                });
            },

            checkActive(category) {
                this.isActive = false;
                if (!category.isActive) {
                    category.isActive = true;
                    this.activeCategories.push(category.cat);
                    var data = this.activeCategories.join('|');
                    this.fetchDataByCategory(data);
                } else {
                    category.isActive = false;
                    var idx = this.activeCategories.indexOf(category.cat);
                    this.activeCategories.splice(idx, 1);
                    var data = this.activeCategories.join('|');
                    this.fetchDataByCategory(data);
                }
            },

            checkAllActive() {
                this.activeCategories = [];
                this.isActive = true;
                this.categories.forEach(function (i) {
                    i.isActive = false;
                });
                this.fethPostsData();
            }
        }
    }
</script>
