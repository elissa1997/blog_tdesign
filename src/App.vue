<template>
  <div id="App">
    <Nav/>
    <router-view/>
    <PageFooter/>
    <remote-script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.11.1/katex.min.js"></remote-script>
    
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import PageFooter from "@/components/PageFooter.vue"
import "@/util/remoteJs.js";
export default {
  name: "App",
  props: {},
  components: {
    Nav,
    PageFooter
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  watch: {}
}
</script>
<style lang="scss">
// body {
//   margin: 0px !important;
// }
#App{
}
</style>