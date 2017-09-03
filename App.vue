<template>
    <div class="content"
         id="app"> 
        <div class="header"  v-bind:class="{ 'black-head': blackHead}">
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
            <div class="modal-wrapper"
                 v-if="modal_window"
                 @click="closeModal()">
                <div class="user-data"
                     @click="$event.stopPropagation()">
                    <div class="modal-buttons">
                    <button class="sign-in"
                            :class="{'active-button' : isActiveModalBtn}"
                            @click="signActive($event)">
                        sign
                    </button>
                    <button class="log-in"
                            :class="{'active-button' : isActiveModalBtn}"
                            @click="logActive($event)">
                        login
                    </button>
                        </div>
                    <form method='post'
                          action='/'
                          v-if="sign"
                          class="">
                        <div class="form-group">
                            <label for="sign-name">Name</label>
                            <input type='text'
                                   id="sign-name"
                                   name='name'>
                        </div>
                        <div class="form-group">
                            <label for="sign-email" >Email</label>
                            <input type='text'
                                   id="sign-email"
                                   name='email'>
                        </div>
                        <div class="form-group">
                            <label for="sign-password">Password</label>
                            <input type='password'
                                   id="sign-password"
                                   name='password'>
                        </div>
                        <div class="form-group">
                            <input type='submit' value="Submit">
                        </div>                      
                    </form>  
                    <div v-if="log"
                         class="">
                        <input v-model="name"
                               type='text'
                               name='name'>
                        <input v-model='email'
                               type='text'
                               name='email'>
                        <input v-model='password'
                               type='password'
                               name='password'>
                        <button @click='onSubmit()'>btn</button>
                    </div>
                </div>
            </div>
<!--            <button @click="openModal()">Sign</button> 
            <button @click="logout">logout</button>-->
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
                name: '',
                email: '',
                password: '',
                find: [],
                results: false,
                fail_result: false,
                query: '',
                active_menu: false,
                resultsDescriptionLength: 80,
//                headerVisible: true
                blackHead: true,
                modal_window: false,
                sign: true,
                log: false
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

            onSubmit() {
                var formData = new FormData();
                formData.append('name', this.name);
                formData.append('email', this.email);
                formData.append('password', this.password);

                this.$http.post('/login', formData).then(response => {
                    console.log(response.body)
                }, response => {
                    console.log('proval');
                });
            },

            logout() {
                this.$http.post('/logout').then(response => {
                    console.log('out')
                }, response => {
                    console.log('error');
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
            },
            handleScroll: function (event) {
                console.log(1)
            },
            
            openModal() {
                this.modal_window = true;
            },
            
            closeModal() {
                this.modal_window = false;
            },
            
            signActive(e){
                this.log = false;
                this.sign = true;
            },
            
            logActive(e){
                this.sign = false;
                this.log = true;
                
            }

        },

        watch: {
            '$route': function () {
                this.results = false;
                this.fail_result = false;
                this.active_menu = false;
                if (this.$route.path == '/')
                    this.blackHead = true
                else
                    this.blackHead = false
            }
        },

        created() {
            if (this.$route.path == '/')
                this.blackHead = true;
            else
                this.blackHead = false;
        }
    }
</script>

<style>
    .modal-wrapper{
        position: absolute;
        display: flex;
        justify-content: center;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        background: rgba(255,255,255,.5);
        z-index: 9999;
    }

    .user-data{
        z-index: 99999;
        background: #eee;
        align-self: center;
        width: 400px;
        padding: 40px;
    }
</style>