<template>
  <div class="blog-content">
    <div class="container page-container">
      <div class="head-post-container">
        <p class="news-item-title post-page-title">{{ post.name }}</p>
        <div
          v-bind:style="{
            background: `url(img/${post.file}) no-repeat 50% 50% / cover`,
          }"
          class="img-container"
        ></div>
      </div>
      <div class="post-page-categories">
        <div v-for="item in post.categories" class="category">{{ item }}</div>
      </div>
      <div class="footer-post">
        <span class="posted-date">{{ post.createDate }}</span>
        <span class="updated-date" v-if="post.updateDate"
          >Ред: {{ post.updateDate }}</span
        >
        <span class="share-post" @click="showShareIcons">
          <span>Share</span>
          <div class="share-icons">
            <a
              href="#"
              target="_blank"
              @click.stop.prevent="
                vkontakte(
                  'http://avdevelop.com/#/blog/' + post._id,
                  post.name,
                  post.description,
                  './public/assets/img/' + post.file
                )
              "
            >
              <i class="fa fa-vk" aria-hidden="true"></i>
            </a>
            <a
              href="#"
              target="_blank"
              @click.stop.prevent="
                facebook(
                  'http://avdevelop.com/#/blog/' + post._id,
                  post.name,
                  post.description,
                  '../assets/img/' + post.file
                )
              "
            >
              <i class="fa fa-facebook-official" aria-hidden="true"></i>
            </a>
            <a
              href="#"
              target="_blank"
              @click.stop.prevent="
                twitter('http://avdevelop.com/#/blog/' + post._id, post.name)
              "
            >
              <i class="fa fa-twitter" aria-hidden="true"></i>
            </a>
          </div>
        </span>
      </div>
      <p class="post-page-description">{{ post.description }}</p>
      <p class="news-item-text" v-html="post.text"></p>
    </div>
  </div>
</template>
<script>
export default {
  name: "PostPage",
  data() {
    return {
      post: {},
      shareIcons: false,
    };
  },

  // mounted() {
  //   window.scrollTo(0, 0);
  // },

  methods: {
    fetch() {
      var self = this;
      this.$http
        .get("api/posts/" + this.$route.params.id, {
          headers: { contentType: "application/json" },
        })
        .then(
          (response) => {
            self.post = response.data;
          },
          (response) => {
          }
        );
    },
    vkontakte: function (purl, ptitle, text, pimg) {
      var url = "http://vkontakte.ru/share.php?";
      url += "url=" + encodeURIComponent(purl);
      url += "&title=" + encodeURIComponent(ptitle);
      url += "&description=" + encodeURIComponent(text);
      url += "&image=" + encodeURIComponent(pimg);
      url += "&noparse=true";
      this.popup(url);
    },

    showShareIcons() {
      this.shareIcons = !this.shareIcons;
    },

    facebook: function (purl, ptitle, text, pimg) {
      var url = "http://www.facebook.com/sharer.php?s=100";
      url += "&p[title]=" + encodeURIComponent(ptitle);
      url += "&p[summary]=" + encodeURIComponent(text);
      url += "&p[url]=" + encodeURIComponent(purl);
      url += "&p[images][0]=" + encodeURIComponent(pimg);
      this.popup(url);
    },

    twitter: function (purl, ptitle) {
      var url = "http://twitter.com/share?";
      url += "text=" + encodeURIComponent(ptitle);
      url += "&url=" + encodeURIComponent(purl);
      url += "&counturl=" + encodeURIComponent(purl);
      this.popup(url);
    },

    popup: function (url) {
      window.open(url, "", "toolbar=0,status=0,width=626,height=436");
    },
  },

  watch: {
    $route: "fetch",
  },

  created() {
    this.fetch();
    ga("send", "pageview", "postpage");
  },
};
</script>
