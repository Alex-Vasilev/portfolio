<template>
  <div class="content" id="app">
    <div class="header" v-bind:class="{ 'black-head': blackHead }">
      <router-link
        to="/"
        class="logo"
        v-bind:class="{ 'white-logo': blackHead }"
      ></router-link>
      <div class="form-group search">
        <input
          type="text"
          class="input-search"
          placeholder="Поиск"
          @input="queryValue($event.target.value)"
          @keypress="onEnter($event)"
          @blur="close()"
        />
        <i class="fa fa-search" aria-hidden="true"></i>
        <transition name="component-fade" mode="out-in">
          <div class="results" v-if="results">
            <ul>
              <li v-for="item in find" class="result-item">
                <router-link v-bind:to="'/blog/' + item._id">
                  <h4>{{ item.name }}</h4>
                  <p v-slice="{ size: resultsDescriptionLength }">
                    {{ item.description }}
                  </p>
                </router-link>
              </li>
            </ul>
          </div>
        </transition>
        <transition name="component-fade" mode="out-in">
          <div v-if="fail_result" class="fail-result">
            Not found '{{ query }}'
          </div>
        </transition>
      </div>
      <div class="modal-wrapper" v-if="modal_window" @click="closeModal()">
        <div class="user-data" @click="$event.stopPropagation()">
          <div class="modal-buttons">
            <button @click="signActive($event)" :class="{ 'active-btn': sign }">
              <span>sign</span>
              sign
            </button>
            <button @click="logActive($event)" :class="{ 'active-btn': log }">
              <span>login</span>
              login
            </button>
          </div>
          <form method="post" action="/" v-if="sign" class="">
            <div class="form-group">
              <input
                type="text"
                id="sign-name"
                name="name"
                placeholder="Name"
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                id="sign-email"
                name="email"
                placeholder="Email"
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                id="sign-password"
                name="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" class="btn btn-sm btn-primary">
              <span>register</span>
              register
            </button>
          </form>
          <div v-if="log" class="">
            <div class="form-group">
              <input
                v-model="email"
                id="log-email"
                type="text"
                placeholder="Email"
                name="email"
              />
            </div>
            <div class="form-group">
              <input
                v-model="password"
                id="log-password"
                placeholder="Password"
                type="password"
                name="password"
              />
            </div>
            <button @click="onSubmit()">
              <span>Sign in</span>
              Sign in
            </button>
          </div>
        </div>
      </div>
      <div v-if="isAuthenicated">Nice to see you {{ userData.name }}!</div>
      <ul class="main-menu" v-bind:class="{ 'show-menu': active_menu }">
        <li><router-link to="/about">Обо мне</router-link></li>
        <li><router-link to="/blog">Статьи</router-link></li>
        <li><router-link to="/contact">Контакты</router-link></li>
        <li><router-link to="/storm">Štorm</router-link></li>
        <li>
          <a @click="openModal()" v-if="!isAuthenicated">Войти</a>
          <a @click="logout" v-if="isAuthenicated">Выйти</a>
        </li>
      </ul>
      <div
        class="hamburger"
        @click="triggerMenu()"
        v-bind:class="{ 'active-hamburger': active_menu }"
      >
        <span></span>
      </div>
    </div>
    <transition name="component-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data: function () {
    return {
      name: "",
      email: "",
      password: "",
      find: [],
      results: false,
      fail_result: false,
      query: "",
      active_menu: false,
      resultsDescriptionLength: 80,
      //                headerVisible: true
      blackHead: true,
      modal_window: false,
      sign: true,
      log: false,
      isAuthenicated: null,
    };
  },

  methods: {
    queryValue(value) {
      window.postMessage(value, "*");

      if (!value) {
        this.results = false;
        this.fail_result = false;
        return;
      }
      this.query = value;
      var self = this;
      let data = JSON.stringify({ query: value });

      this.$http
        .post("api/search", data, {
          before(request) {
            if (this.previousRequest) {
              this.previousRequest.abort();
            }
            this.previousRequest = request;
          },
        })
        .then(
          (response) => {
            self.find = response.data;
            self.showResults();
          },
          (response) => {}
        );
    },

    onSubmit() {
      var formData = new FormData();
      formData.append("name", this.name);
      formData.append("email", this.email);
      formData.append("password", this.password);

      this.$http.post("/login", formData).then(
        (response) => {
          this.isAuthenicated = true;
          this.userData = response.data;
          this.modal_window = false;
        },
        (response) => {}
      );
    },

    logout() {
      this.$http.post("/logout").then(
        (response) => {
          console.log("out");
          this.isAuthenicated = false;
        },
        (response) => {
          //                    console.log('error');
        }
      );
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
      if (this.active_menu) this.active_menu = false;
      else this.active_menu = true;
    },

    openModal() {
      this.modal_window = true;
    },

    closeModal() {
      this.modal_window = false;
    },

    signActive(e) {
      this.log = false;
      this.sign = true;
    },

    logActive(e) {
      this.sign = false;
      this.log = true;
    },
  },

  watch: {
    $route: function () {
      this.results = false;
      this.fail_result = false;
      this.active_menu = false;
      if (this.$route.path == "/" || this.$route.path == "/storm") {
        this.blackHead = true;
      } else {
        this.blackHead = false;
      }
    },
  },

  created() {
    if (this.$route.path == "/" || this.$route.path == "/storm") {
      this.blackHead = true;
    } else {
      this.blackHead = false;
    }

    this.$http.get("/is_authenicated").then(
      (response) => {
        console.log(response);
        this.isAuthenicated = true;
        this.userData = response.data;
      },
      (response) => {
        console.log(response);
      }
    );

    (function (i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function () {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "https://www.google-analytics.com/analytics.js",
      "ga"
    );

    ga("create", "UA-104951957-1", "auto");
    ga("send", "pageview");
  },
};
</script>

<style>
.modal-wrapper {
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
  z-index: 9999;
}

.modal-buttons {
  display: flex;
  margin-bottom: 30px;
}

.user-data {
  z-index: 99999;
  background: #fff;
  box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.15);
  align-self: center;
  width: 400px;
  padding: 40px;
}
</style>