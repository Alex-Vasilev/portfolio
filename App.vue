<template>
    <div class="content"
         id="app">           
        <div class="header">
            <router-link to="/" class="logo"></router-link>
            <div class="form-group search">
                <input type="text"
                       class="input-search"
                       placeholder="Search"
                       @input="queryValue($event.target.value)"
                       @keypress="onEnter($event)"
                       @blur="close()">
                <i class="fa fa-search" aria-hidden="true"></i>
                <transition name="component-fade" mode="out-in">
                    <div class="results" 
                         v-if="results">
                        <ul>
                            <li v-for="item in find"
                                class="result-item">
                            <router-link  v-bind:to="'/blog/'+item._id">
                                <h4>{{item.name}}</h4>
                                <p v-slice="{size: resultsDescriptionLength}">
                                    {{item.description}}
                                </p>
                            </router-link>
                            </li>
                        </ul>
                    </div>
                </transition>
                <transition name="component-fade"
                            mode="out-in">
                    <div v-if="fail_result"
                         class="fail-result">
                        Not found '{{query}}'??
                    </div>
                </transition>
            </div>
            <ul class="main-menu"
                v-bind:class="{'show-menu': active_menu}">
                <li><router-link to="/about">About</router-link></li>
                <li><router-link to="/contact">Contact</router-link></li>
                <li><router-link to="/blog">Blog</router-link></li>
                <li><router-link to="/works">Works</router-link></li>
            </ul>
            <div class="hamburger"
                 @click="triggerMenu()"
                 v-bind:class="{'active-hamburger': active_menu}">
                <span></span>
            </div>
        </div>
        <div class="background"></div>
        <transition name="component-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data: function () {
            return {
                find: [],
                results: false,
                fail_result: false,
                query: '',
                active_menu: false,
                resultsDescriptionLength: 80
            };
        },

        methods: {
            queryValue(value) {
                console.log(value);
                if (!value || value.length < 2) {
                    this.results = false;
                    this.fail_result = false;
                    return;
                }
                this.query = value;
                var self = this;
                let data = JSON.stringify({query: value});
                this.$http.post('api/search', data, {
                    headers: {"contentType": "application/json"}
                }).then(response => {
                    self.find = response.data;
                    self.showResults();
                }, response => {
                    console.log(4);
                });
            },

            close() {
                this.results = false;
                this.fail_result = false;
            },

            onEnter(e) {
                if (e.keyCode == 13) {
                    this.queryValue(e.target.value);
                }
            },

            showResults() {
                if (this.find.length) {
                    this.results = true;
                    this.fail_result = false;
                } else {
                    this.results = false;
                    this.fail_result = true;
                }
            },

            triggerMenu() {
                if (this.active_menu)
                    this.active_menu = false;
                else
                    this.active_menu = true;
            }
        },

        watch: {
            '$route': function () {
                this.results = false;
                this.fail_result = false;
                this.active_menu = false;
            }
        }
    }
</script>
