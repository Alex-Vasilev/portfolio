<template>
    <div class="blog-content" v-if="authorized">
        <h3>latest news</h3>
        <form name="postsForm" @submit.prevent="onSubmit">
            <input type="hidden" name="id" value="0" />
            <div class="form-group">
                <input class="form-control"
                       name="name"
                       placeholder="Title"
                       v-model="name"/>
            </div>
            <div class="form-group">
                <textarea class="form-control"
                          name="description"
                          placeholder="Text"
                          v-model="description"></textarea>
            </div>
            <div class="form-group">
                <textarea class="form-control"
                          name="categories"
                          placeholder="Categories"
                          v-model="categories"></textarea>
            </div>
            <div class="panel-body"
                 v-if="!image">
                <input class="form-control"
                       name="file"
                       type="file"
                       @change="onFileChange"/>
            </div>
            <div v-else>
                <img class="img"
                     v-bind:src="image"/>
                <button @click="removeImage">Remove image</button>
            </div>
            <div class="panel-body">
                <button type="submit"
                        class="btn btn-sm btn-primary">Save</button>
                <button>Cancel</button>
                <button @click="logout()">Log out</button>
            </div>
        </form>
        <ul class="news-item-list container">
            <li v-for="item in items"
                class="news-item">
                <p><img src=""></p>
                <p class="news-item-title">{{item.name}}</p>
                <p class="news-item-description">{{item.description}}</p>
                <button @click="editPost(item)">Edit</button>
                <button @click="deletePost(item._id)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'Admin',
        data: function () {
            return {
                items: [],
                id: '',
                description: '',
                name: '',
                edit: false,
                authorized: false,
                image: '',
                files: null,
                file: '',
                updateDate: '',
                createDate: '',
                categories: ''
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
                    url: "/admin",
                    type: "GET",
                    contentType: "application/json",
                    success: function (posts) {
                        self.items = posts;
                        console.log(self.items);
                        self.authorized = true;
                    },
                    error: function () {
                        console.log('sukablyat');
                    }
                });
            },

            logout: function () {
                $.ajax({
                    url: "/logout",
                    contentType: "application/json",
                    method: "GET",
                    success: function () {
                        console.log('exit');
                    }
                });
            },
            
            getPostDate: function(){
                var date = new Date();
                var day = date.getDate();
                var monthArr = ['jan', 'feb', 'mar',
                                'apr', 'may', 'june',
                                'july', 'aug', 'spet',
                                'oct', 'nov', 'dec'];
                var month = date.getMonth();
                var year = date.getFullYear();
                var fullDate = '' + day + ' ' + monthArr[month] + ' ' + year;
                return fullDate;
            },

            onSubmit: function () {
                var name = this.name;
                var description = this.description;
                var categories = this.categories;
                var self = this;
                
                var formData = new FormData();
                formData.append('name', name);
                formData.append('description', description);
                formData.append('categories', categories);
                formData.append('file', this.files[0]);

                if (this.edit){
                    var updateDate = this.getPostDate();
                    formData.append('updateDate', updateDate);
                    formData.append('createDate', this.createDate);
                    var id = this.id; 
                    formData.append('id', id);
                    
                    var file = this.file;

                    $.ajax({
                        url: "api/posts",
                        cache: false,
                        contentType: false,
                        processData: false,
                        method: "PUT",
                        data: formData,
                        success: function (post) {
                            for (var i = 0; i < self.items.length; i++) {
                                if (self.items[i]._id == post._id){
                                    self.items[i].name = name;
                                    self.items[i].description = description;
                                    self.items[i].updateDate = updateDate;
                                    self.items[i].file = file;
                                    break;
                                }
                            }
                            self.description = '';
                            self.name = '';
                            self.files = null;
                            self.edit = false;
                            self.image = '';
                            self.updateDate = '';
                            self.createDate = '';
                            console.log(post);
                        }
                    });
                } else {
                    var createDate = this.getPostDate();
                    formData.append('createDate', createDate);
                    formData.append('updateDate', '');

                    $.ajax({
                        url: "api/posts",
                        method: "POST",
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (post) {
                            self.items.push(post);
                            self.description = '';
                            self.name = '';
                            self.image = '';
                            self.files = null;
                            self.updateDate = '';
                            self.createDate = '';
                            self.categories = '';
                        }
                    });
                }
            },

            onCancel: function () {
                this.description = '';
                this.name = '';
            },

            editPost: function (item) {
                this.name = item.name;
                this.description = item.description;
                this.file = item.file;
                this.createDate = item.createDate;
                this.id = item._id;
                this.edit = true;
            },

            deletePost: function (id) {
                var self = this;
                $.ajax({
                    url: "api/posts/" + id,
                    contentType: "application/json",
                    method: "DELETE",
                    success: function () {
                        for (var i = 0; i < self.items.length; i++) {
                            if (self.items[i]._id == id) {
                                self.items.splice(i, 1);
                                break;
                            }
                        }
                    }
                });
            },
            onFileChange(e) {
                this.files = e.target.files || e.dataTransfer.files;
                console.log(this.files);
                if (!this.files.length)return;
                this.createImage(this.files[0]);
            },
            createImage(file) {
//                var image = new Image();
                var reader = new FileReader();
                var vm = this;
                
                reader.onload = (e) => {
                  vm.image = e.target.result;
                };
                reader.readAsDataURL(file);
            },
            removeImage: function (e) {
                this.image = '';
            }
        }
    }
</script>
<style>
    .img {
        width: 30%;
        margin: auto;
        display: block;
        margin-bottom: 10px;
    }
</style>