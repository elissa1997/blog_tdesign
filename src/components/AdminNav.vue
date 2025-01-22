<template>
  <div id="AdminNav">
    <t-menu theme="light" v-model="current">
      <t-menu-item value="Article" :to="{path: '/admin/articlelist'}">文章管理</t-menu-item>
      <t-menu-item value="Comment" :to="{path: '/admin/commentlist'}">评论管理</t-menu-item>
      <t-menu-item value="OtherComment" :to="{path: '/admin/othercommentlist'}">其它评论管理</t-menu-item>
      <t-menu-item value="item3">系统设置</t-menu-item>
    </t-menu>
  </div>
</template>

<script>
export default {
  name: "AdminNav",
  props: {},
  components: {},
  data() {
    return {
      current: 'Article',
    }
  },
  methods: {
    getActive() {
      this.$router.onReady(() => {
        this.current = this.$route?.meta.active[1]
        this.$forceUpdate();
      })
    },
  },
  mounted() {
    this.getActive();
  },
  watch: {
    '$route': function(to, from) {
      this.getActive();
    }
  }
}
</script>
<style lang="scss" scoped>
#AdminNav{
  width: $adminNav-width;
}
</style>