<template>
  <div class="blog-content about">
    <div class="container">
      <h3>Обо мне</h3>
      <div class="about-container">
        <div class="about-description">
          <p>
            Привет! Меня зовут Александр. Я занимаюсь Front-end разработкой и
            мне нравится создавать классные и удобные пользовательский интерфейсы.
            Занимаюсь этим уже около 5-и лет и есть практический опыт разработки и поддержки
            веб-приложений как и на нативном JavaScript, так и с использованием фреймворков 
            (React, Angular, Vue). Также есть опыт в написании мобильных приложений на React Native.
          </p>
          <p>
            Здесь я по возможности буду вести небольшой блог, в котором буду рассказывать об интересных вещах,
            с которыми приходилось сталкиваться во время работы.
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
