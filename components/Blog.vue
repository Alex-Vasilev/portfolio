<template>
    <div class="blog-content ">
        <div class="container">
            <div class="inner-container">
                <h3>latest news</h3>
                <div class="categories-container">
                    <p>Categories:</p>
                    <ul>
                        <li class="category"
                            v-bind:class="{ 'active-category': isActive }"
                            @click="checkAllActive()">all</li>
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
                categories: [],
                isActive: true,
                activeCategories: [],
                descriptionSize: 320
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
                this.$http.get('api/posts', {
                    headers: {"contentType": "application/json"}
                }).then(response => {
                    self.items = response.data;
                }, response => {
                    console.log(1);
                });
            },

            fethCategoriesData: function () {
                console.log(2);
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
                }, response => {
                    console.log(2);
                });
            },

            fetchDataByCategory(data) {
                console.log(data);
                var self = this;
                var data = JSON.stringify({query: data});
                this.$http.post('api/by_category', data, {
                    headers: {"contentType": "application/json"}
                }).then(response => {
                    self.items = response.data;
                }, response => {
                    console.log(3);
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
            },

            vkontakte: function (event, purl, ptitle, text, pimg) {
                event.stopPropagation();
                event.preventDefault();

                var url = 'http://vkontakte.ru/share.php?';
                url += 'url=' + encodeURIComponent(purl);
                url += '&title=' + encodeURIComponent(ptitle);
                url += '&description=' + encodeURIComponent(text);
                url += '&image=' + encodeURIComponent(pimg);
                url += '&noparse=true';
                this.popup(url);
            },

            facebook: function (event, purl, ptitle, text, pimg) {
                event.stopPropagation();
                event.preventDefault();

                var url = 'http://www.facebook.com/sharer.php?s=100';
                url += '&p[title]=' + encodeURIComponent(ptitle);
                url += '&p[summary]=' + encodeURIComponent(text);
                url += '&p[url]=' + encodeURIComponent(purl);
                url += '&p[images][0]=' + encodeURIComponent(pimg);
                this.popup(url);
            },

            twitter: function (event, purl, ptitle) {
                event.stopPropagation();
                event.preventDefault();

                var url = 'http://twitter.com/share?';
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
