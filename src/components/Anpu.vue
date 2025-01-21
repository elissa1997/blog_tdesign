<template>
  <div id="Anpu">
    <aplayer
      class="player"
      :music="{
        title: '关于我爱你',
        artist: '张悬',
        src: 'https://cdn.makedream.site/blog/audio/%E5%85%B3%E4%BA%8E%E6%88%91%E7%88%B1%E4%BD%A0-%E5%BC%A0%E6%82%AC.mp3',
        pic: 'https://cdn.makedream.site/blog/audio/%E5%85%B3%E4%BA%8E%E6%88%91%E7%88%B1%E4%BD%A0-%E5%BC%A0%E6%82%AC.jpg'
      }"
    />
    <div class="img">
      <img :src="require('@/assets/img/footer_anpu.png')">
    </div>
  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'
export default {
  name: "Anpu",
  props: {},
  components: {
    Aplayer
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#Anpu{
  .img {
    // width: 100%;
    padding-bottom: 5px;
    img {
      height: auto;
      // mix-blend-mode: difference;
      @include respond-to('desktop') {
        width: 70%;
      }

      @include respond-to('phone') {
        width: 100%;
      }
    }
  }

  .player {
    @include respond-to('desktop') {
      width: 70%;
    }

    @include respond-to('phone') {
      width: 100%;
    }

    background-color: var(--td-bg-color-container) !important;

    :deep(.aplayer-title) {
      color: var(--td-text-color-primary);
    }
  }


  margin-bottom: var(--td-comp-margin-xxl);
}
</style>