<template>
  <div id="PageFooter">
    <t-row>
      <t-col
        :xs="{ offset: 1, span: 10 }"
        :sm="{ offset: 1, span: 10 }"
        :md="{ offset: 2, span: 8 }"
        :lg="{ offset: 2, span: 8 }"
        :xl="{ offset: 3, span: 6 }"
      >
        <t-row :gutter="16">

          <t-col
            :xs="{ offset: 0, span: 12 }"
            :sm="{ offset: 0, span: 12 }"
            :md="{ offset: 0, span: 12 }"
            :lg="{ offset: 0, span: 12 }"
            :xl="{ offset: 0, span: 6 }"
          >
            <Anpu/>
          </t-col>

          <t-col
            :xs="{ offset: 0, span: 6 }"
            :sm="{ offset: 0, span: 6 }"
            :md="{ offset: 0, span: 6 }"
            :lg="{ offset: 0, span: 6 }"
            :xl="{ offset: 0, span: 3 }"
          >
            <div class="block">
              <div class="title">Related Links</div>
              <div class="content">
                <div class="link">
                  <a href="https://freessl.cn/" target="_blank">
                    <div class="icon"><img :src="require('@/assets/icon/footLink/freessl.png')" alt=""></div>
                    <div class="name">FreeSSL</div>
                  </a>
                </div>

                <div class="link">
                  <a href="https://pan.makedream.site/" target="_blank">
                    <div class="icon"><img :src="require('@/assets/icon/footLink/alist.png')" alt=""></div>
                    <div class="name">AList存储</div>
                  </a>
                </div>
              </div>
            </div>
          </t-col>

          <t-col
            :xs="{ offset: 0, span: 6 }"
            :sm="{ offset: 0, span: 6 }"
            :md="{ offset: 0, span: 6 }"
            :lg="{ offset: 0, span: 6 }"
            :xl="{ offset: 0, span: 3 }"
          >
            <div class="block">
              <div class="title">Powered by</div>
              <div class="content">
                <div class="brand">
                  <div class="icon"><img :src="require('@/assets/icon/brandIcon/tdesign.svg')" alt=""></div>
                  <div class="name">TDesign</div>
                </div>

                <div class="brand">
                  <div class="icon"><img :src="require('@/assets/icon/brandIcon/NestJS.png')" alt=""></div>
                  <div class="name">NestJS</div>
                </div>

                <div class="brand">
                  <div class="icon"><img :src="require('@/assets/icon/brandIcon/qiniuyun.png')" alt=""></div>
                  <div class="name">qiniu</div>
                </div>

                <div class="brand">
                  <div class="icon"><img :src="require('@/assets/icon/brandIcon/HUAWEI.png')" alt=""></div>
                  <div class="name">HUAWEI Cloud</div>
                </div>
              </div>
            </div>
          </t-col>

        </t-row>


        <t-row :gutter="16">

          <t-col
            :xs="{ offset: 0, span: 12 }"
            :sm="{ offset: 0, span: 12 }"
            :md="{ offset: 0, span: 12 }"
            :lg="{ offset: 0, span: 12 }"
            :xl="{ offset: 0, span: 12 }"
          >

            <div class="beian">
              <span>Copyright © 2016 - {{this.$dayjs().format('YYYY')}} Makedream. All Rights Reserved.</span>
              <t-divider layout="vertical" />
              <a data-v-720e943c="" target="_blank" href="https://beian.miit.gov.cn/ ">皖ICP备16002760号-3</a>
            </div>
          </t-col>
        </t-row>


      </t-col>
    </t-row>

  </div>
</template>

<script>
import Anpu from "@/components/Anpu.vue";
export default {
  name: "PageFooter",
  props: {},
  components: {
    Anpu
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
#PageFooter{
  min-height: 60px;
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) 0px;
  .block {

    .title {
      color: var(--td-text-color-placeholder);
      margin-bottom: var(--td-comp-margin-l);
      font-size: var(--td-font-size-link-medium);
    }

    .content {
      // padding: 0px 10px;
      .brand ,.link a{
        display: flex;
        align-items: center;
        text-decoration:none;
        .icon{
          margin-right: var(--td-comp-margin-s);
          height: 20px;
          img {
            width: 20px;
            height: 20px;
            object-fit: cover;
          }
        }
        .name{
          color: var(--td-text-color-secondary);
          font-size: var(--td-font-size-link-medium);
        }
      }

      .brand:not(:last-of-type){
        margin-bottom: var(--td-comp-margin-s);
      }

      .link:not(:last-of-type){
        margin-bottom: var(--td-comp-margin-s);
      }
    }
  }

  .beian {
    margin-top: var(--td-comp-margin-xxl);
    text-align: center;
    color: var(--td-text-color-secondary);
    font-size: var(--td-font-size-link-medium);
    a {
      color: var(--td-text-color-secondary);
      text-decoration:none;
    }
  }
}
</style>