<template>
  <div id="App">
    <Nav/>
    <router-view/>
    <PageFooter/>
  </div>
</template>

<script>
import Nav from "@/components/Nav.vue";
import PageFooter from "@/components/PageFooter.vue"
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