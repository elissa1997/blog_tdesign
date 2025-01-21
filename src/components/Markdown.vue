<template>
  <div id="Markdown">
    <v-md-preview :text="renderHtml"/>
  </div>
</template>

<script>
import Vue from 'vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
import Prism from 'prismjs';

export default {
  name: "Markdown",
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  components: {
  },
  data() {
    return {
      renderHtml: undefined,
    }
  },
  methods: {
    initMd() {
      console.log("创建md");
      VMdPreview.use(vuepressTheme, {
        Prism,
      });
      VMdPreview.use(createKatexPlugin());
      Vue.use(VMdPreview);
    },

    // remoteJsLoad() {
    //   console.log("remoteJsLoad");
    //   this.pluginLoad = true;
    //   this.$nextTick(() => {
    //     })
    // }
  },
  mounted() {
    this.renderHtml = this.content;
  },
  created() {
    this.initMd();

  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#Markdown{
}
</style>