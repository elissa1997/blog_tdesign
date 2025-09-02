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

    <!-- <iframe class="player" frameborder="no" border="0" marginwidth="0" marginheight="0" height=86 src="//music.163.com/outchain/player?type=2&id=27598340&auto=0&height=66"></iframe> -->
    
    <img class="img" :src="require('@/assets/img/footer_anpu.png')">
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
  display: flex;
  @include respond-to('desktop') {
    flex-direction: column;

    .player {
      width: 90%;
    }

    .img {
      width: auto;
      height: 100px;
      object-fit: contain;
    }
  }

  @include respond-to('phone') {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .player {
      width: 68%;
    }

    .img {
      width: 30%;
      height: auto;
      object-fit: contain;
    }
  }

  .player {
    background-color: var(--td-bg-color-container) !important;

    :deep(.aplayer-title) {
      color: var(--td-text-color-primary);
    }
  }


  margin-bottom: var(--td-comp-margin-xxl);
}
</style>