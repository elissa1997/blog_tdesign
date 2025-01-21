<template>
  <div id="Nav">
    <div class="desktop">

    <t-head-menu theme="light" v-model="current">
      <template #logo>
        <img height="28" :src="require('@/assets/icon/logo.png')" alt="logo" />
      </template>
        <t-menu-item value="Home"  :to="{path: '/'}">主页</t-menu-item>
        <t-menu-item value="Links" :to="{path: '/links'}">友链</t-menu-item>
        <t-menu-item value="About" :to="{path: '/about'}">关于</t-menu-item>
        <t-menu-item value="Toolbox" href="https://tool.makedream.site/" target="_blank">工具箱</t-menu-item>
      <template #operations>
        <t-radio-group variant="default-filled" default-value="light" @change="darkModeChange">
          <t-radio-button value="light"><SunOne theme="filled" fill="#ffdc29"/></t-radio-button>
          <t-radio-button value="dark"><Moon theme="filled" fill="#bbbbbb"/></t-radio-button>
        </t-radio-group>

        <t-button variant="text" shape="square">
          <User theme="outline" size="20" @click="gotoAdmin"/>
        </t-button>

        <!-- <t-button variant="text" shape="square">
          <ApplicationMenu theme="outline" size="20"/>
        </t-button> -->

      </template>
    </t-head-menu>

    </div>

    <div class="mobile">
      <div class="head">
        <div class="logo">
          <img height="100%" :src="require('@/assets/icon/logo.png')" alt="logo" />
        </div>

        <div class="operations">
          <t-radio-group variant="default-filled" default-value="light" @change="darkModeChange">
            <t-radio-button value="light"><SunOne theme="filled" fill="#ffdc29"/></t-radio-button>
            <t-radio-button value="dark"><Moon theme="filled" fill="#bbbbbb"/></t-radio-button>
          </t-radio-group>

          <t-button variant="text" shape="square">
            <User theme="outline" size="20" @click="gotoAdmin"/>
          </t-button>

          <t-button variant="text" shape="square" @click="mobileFold = !mobileFold">
            <ApplicationMenu theme="outline" size="20"/>
          </t-button>
        </div>
      </div>

      <div class="mobile-menu-warp" :class="mobileFold? 'fold':'unfold'">
        <t-menu v-model="current" style="width: 100%;">
          <t-menu-item value="Home"  :to="{path: '/'}">主页</t-menu-item>
          <t-menu-item value="Links" :to="{path: '/links'}">友链</t-menu-item>
          <t-menu-item value="About" :to="{path: '/about'}">关于</t-menu-item>
          <t-menu-item value="Toolbox" href="https://tool.makedream.site/">工具箱</t-menu-item>
        </t-menu>
      </div>
    </div>
  </div>
</template>

<script>
import { User, SunOne, Moon, ApplicationMenu } from "@icon-park/vue"
export default {
  name: "Nav",
  props: {},
  components: {
    User, SunOne, Moon, ApplicationMenu
  },
  data() {
    return {
      current: 'Home',

      mobileFold: true
    }
  },
  methods: {
    getActive() {
      this.$router.onReady(() => {
        this.current = this.$route?.meta.active[0]
        this.$forceUpdate();
      })
    },

    darkModeChange(value) {
      if (value === "light") {
        document.documentElement.removeAttribute('theme-mode');
      }else if (value === "dark") {
        document.documentElement.setAttribute('theme-mode', 'dark');
      }
    },

    gotoAdmin() {
      this.$router.push({path: '/admin'});
    }
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
#Nav{
  ::deep(.t-head-menu .t-menu__operations:not(:empty)) {
    line-height: unset !important;
  }



  .mobile {
    @include respond-to('desktop') {
      display: none;
    }

    position: relative;

    .head {
      position: relative;
      background-color: var(--td-bg-color-container);
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px var(--td-comp-paddingLR-s);
      z-index: 21;

      .logo {
        height: 23px;
      }

      .operations {
        display: flex;
        :deep(.t-button) {
          margin-left: var(--td-comp-margin-s);
        }
      }
    }

    .mobile-menu-warp {
      @include animation_cubic-bezier;
      position: absolute;
      z-index: 20;
      width: 100%;
      box-shadow: var(--td-shadow-1);
    }

    .fold {
      top: -250px;
    }

    .unfold {
      top: 50px;
    }
  }

  .desktop {
    @include respond-to('phone') {
      display: none;
    }

    :deep(.t-menu__operations .t-button) {
      margin-left: var(--td-comp-margin-s);
    }
  }
}
</style>