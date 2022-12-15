<template>
  <div class="blog-content storm">
    <div class="container">
      <h3>Štorm</h3>
      <div class="storm-container">
        <div class="storm-description">
          <p>
            Проект Štorm начал свою историю в 2019 году в подземельях города
            Минска, а именно студии "Boom", где были сочинены первые партии.
            2021 год ознаменовался выходом первого EP,
            <a target="_blanc"href="https://links.freshtunes.com/tnrnx/" class="storm-link"
              >ознакомиться с которым можно тут.
            </a>
            На данный момент ведется работа над новым материалом.
          </p>
        </div>
        <div class="storm-image storm-cover"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Storm",
  created() {
    ga("send", "pageview", "storm");
  },
};
</script>
