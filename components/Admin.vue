<template>
  <div class="blog-content" v-if="authorized">
    <div class="container">
      <h3>последние новости</h3>
      <form name="postsForm" @submit.prevent="onSubmit">
        <input type="hidden" name="id" value="0" />
        <div class="form-group">
          <input
            class="form-control"
            name="name"
            placeholder="Title"
            v-model="name"
          />
        </div>
        <div class="form-group">
          <textarea
            class="form-control"
            name="description"
            placeholder="Description"
            v-model="description"
          ></textarea>
        </div>
        <div class="form-group">
          <textarea
            class="form-control"
            name="text"
            placeholder="Text"
            v-model="text"
          ></textarea>
        </div>
        <div class="form-group">
          <textarea
            class="form-control"
            name="categories"
            placeholder="Categories"
            v-model="categories"
          ></textarea>
        </div>
        <div class="panel-body" v-if="!image">
          <input
            class="form-control"
            name="file"
            type="file"
            @change="onFileChange"
          />
        </div>
        <div v-else>
          <img class="img" v-bind:src="image" />
          <button @click="removeImage">Remove image</button>
        </div>
        <div class="panel-body">
          <button type="submit" class="btn btn-sm btn-primary">Save</button>
          <button type="reset" @click="onCancel">Cancel</button>
        </div>
      </form>
      <ul class="news-item-list container">
        <li v-for="item in items" class="news-item">
          <p><img src="" /></p>
          <p class="news-item-title">{{ item.name }}</p>
          <p class="news-item-description">{{ item.description }}</p>
          <button @click="editPost(item)">Edit</button>
          <button @click="deletePost(item._id)">Delete</button>
        </li>
      </ul>
    </div>
    <div class="modal-wrapper" v-if="modal_window" @click="closeModal()">
      <div class="user-data" @click="$event.stopPropagation()">
        <p>Are you sure?</p>
        <div class="modal-buttons">
          <button @click="confirmDelete()">
            <span>Yes</span>
            Yes
          </button>
          <button @click="closeModal()">
            <span>No</span>
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Admin",
  data: function () {
    return {
      items: [],
      id: "",
      description: "",
      name: "",
      text: "",
      edit: false,
      authorized: false,
      image: "",
      files: null,
      file: "",
      updateDate: "",
      createDate: "",
      categories: "",
      modal_window: false,
    };
  },

  created() {
    this.fethPostsData();
  },

  watch: {
    $route: "fetchData",
  },

  methods: {
    fethPostsData() {
      let self = this;
      this.$http
        .get("/admin", {
          headers: { contentType: "application/json" },
        })
        .then(
          (response) => {
            self.items = response.data;
            console.log(self.items);
            self.authorized = true;
          },
          (response) => {
            //                    console.log(1);
          }
        );
    },

    getPostDate() {
      let date = new Date();
      let day = date.getDate();
      let monthArr = [
        "jan",
        "feb",
        "mar",
        "apr",
        "may",
        "june",
        "july",
        "aug",
        "sept",
        "oct",
        "nov",
        "dec",
      ];
      let month = date.getMonth();
      let year = date.getFullYear();
      let fullDate = "" + day + " " + monthArr[month] + " " + year;
      return fullDate;
    },

    onSubmit() {
      let name = this.name;
      let description = this.description;
      let text = this.text;
      let categories = this.categories;
      let self = this;

      let formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("text", text);
      formData.append("categories", categories);
      if (this.files !== null) formData.append("file", this.files[0]);

      if (this.edit) {
        let updateDate = this.getPostDate();
        formData.append("updateDate", updateDate);
        formData.append("createDate", this.createDate);
        let id = this.id;
        formData.append("id", id);

        let file = this.file;

        this.$http
          .put("api/posts", formData, {
            headers: { cache: false, contentType: false, processData: false },
          })
          .then((post) => {
            for (let i = 0; i < self.items.length; i++) {
              if (self.items[i]._id === post._id) {
                self.items[i].name = name;
                self.items[i].description = description;
                self.items[i].updateDate = updateDate;
                self.items[i].file = file;
                self.items[i].categories = categories;
                break;
              }
            }
            self.description = "";
            self.name = "";
            self.text = "";
            self.categories = "";
            self.files = null;
            self.edit = false;
            self.image = "";
            self.updateDate = "";
            self.createDate = "";
          });
      } else {
        let createDate = this.getPostDate();
        formData.append("createDate", createDate);
        this.$http
          .post("api/posts", formData, {
            headers: { cache: false, contentType: false, processData: false },
          })
          .then((post) => {
            self.items.push(post);
            self.description = "";
            self.text = "";
            self.name = "";
            self.image = "";
            self.files = null;
            self.categories = "";
          });
      }
    },

    onCancel() {
      this.description = "";
      this.name = "";
      this.text = "";
      this.image = "";
      this.files = null;
      this.categories = "";
    },

    editPost(item) {
      this.name = item.name;
      this.description = item.description;
      this.text = item.text;
      this.file = item.file;
      this.createDate = item.createDate;
      this.id = item._id;
      this.edit = true;
      this.categories = item.categories.join(", ");
    },

    deletePost(id) {
      this.modal_window = true;
      this.id = id;
    },

    confirmDelete() {
        let self = this;
        this.$http
          .delete("api/posts/" + this.id, {
            headers: { contentType: "application/json" },
          })
          .then((response) => {
            for (let i = 0; i < self.items.length; i++) {
              if (self.items[i]._id === this.id) {
                self.items.splice(i, 1);
                break;
              }
            }
            this.modal_window = false;
          });
    },

    closeModal() {
      this.modal_window = false;
    },

    onFileChange(e) {
      this.files = e.target.files || e.dataTransfer.files;
      if (!this.files.length) {
        return;
      }
      this.createImage(this.files[0]);
    },

    createImage(file) {
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removeImage: function (e) {
      this.image = "";
    },
  },
};
</script>
<style>
.img {
  width: 30%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
</style>