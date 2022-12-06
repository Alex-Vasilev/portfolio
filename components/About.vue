<template>
  <div class="blog-content about">
    <div class="container">
      <h3>About</h3>
      <div class="about-container">
        <div class="about-description">
          <p>
            Hello! My name is Alex. I'm a Front-end developer and i like
            building beautiful and usable interfaces. I've experiences building
            responsive and cross-browser web sites with a different stacks both
            with the use of a native js, and with the use of frameworks (React,
            Vue, Angular etc) and mobile apps (React Native).
          </p>
          <p>
            Here I will keep a small blog, in which I will describe interesting
            things that I will encounter in the process of work.
          </p>
        </div>
        <div class="about-image"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
  created() {
    ga("send", "pageview", "about");
  },
};
</script>
