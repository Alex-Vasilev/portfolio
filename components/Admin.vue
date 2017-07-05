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
            <div class="panel-body" v-if="!image">
                <input class="form-control"
                       name="file"
                       type="file"
                       @change="onFileChange"/>
            </div>
            <div v-else>
                <img class="img" :src="image"/>
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
                image: ''
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

            onSubmit: function () {
                var name = this.name;
                var description = this.description;
                var id = this.id;
                var self = this;
                if (this.edit) {
                    $.ajax({
                        url: "api/posts",
                        contentType: "application/json",
                        method: "PUT",
                        data: JSON.stringify({
                            id: id,
                            name: name,
                            description: description
                        }),
                        success: function (post) {
                            for (var i = 0; i < self.items.length; i++) {
                                if (self.items[i]._id == post._id) {
                                    self.items[i].name = name;
                                    self.items[i].description = description;
                                    break;
                                }
                            }
                            self.description = '';
                            self.name = '';
                            self.edit = false;
                            console.log(post);
                        }
                    });
                } else {
                    $.ajax({
                        url: "api/posts",
                        contentType: "application/json",
                        method: "POST",
                        data: JSON.stringify({
                            name: name,
                            description: description
                        }),
                        success: function (post) {
                            self.items.push(post);
                            self.description = '';
                            self.name = '';
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
                var files = e.target.files || e.dataTransfer.files;
                if (!files.length)return;
                this.createImage(files[0]);
            },
            createImage(file) {
                var image = new Image();
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