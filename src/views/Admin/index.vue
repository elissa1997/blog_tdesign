<template>
  <div id="AdminIndex">
    <AdminNav/>
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
import AdminNav from "@/components/AdminNav.vue";
export default {
  name: "AdminIndex",
  props: {},
  components: {
    AdminNav
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
#AdminIndex{
  height: calc(100vh - #{$nav-height});
  display: flex;
  .main {
    height: 100%;
    width: calc(100vw - #{$adminNav-width});
    background-color: var(--td-bg-color-page);
  }
}
</style>