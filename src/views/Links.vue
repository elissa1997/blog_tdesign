<template>
  <div id="Links">
    <t-row>
      <t-col
        :xs="{ offset: 1, span: 10 }"
        :sm="{ offset: 1, span: 10 }"
        :md="{ offset: 2, span: 8 }"
        :lg="{ offset: 2, span: 8 }"
        :xl="{ offset: 3, span: 6 }"
      >

        <div class="content">
          <template v-if="linksList">
            <div class="linkItem" v-for="item in linksList" :key="item.name">
              <t-image
                class="icon"
                :src="`${item.link}favicon.ico`"
                :key="item.name"
                shape="circle"
                fit="cover"
              >
                <template #error>
                  <img class="icon" :src="require('@/assets/img/earth.png')"/>
                </template>

                <template #loading>
                  <t-loading />
                </template>
              </t-image>
              <div class="name">{{item.name}}</div>
              <t-link class="link" :href="item.link" target="_blank">{{item.link}}</t-link>
            </div>
          </template>
        </div>


        <t-alert message="如需添加友情链接，可在下方评论区留言，确认可以访问后即会添加；友链图标使用网站的favicon，如无法访问则使用默认图标。" />

        <CommentCpn :comments="this.commentList" from="otherComment" v-if="this.commentList" @addComment="addComment"/>

      </t-col>
    </t-row>
  </div>
</template>

<script>
import { json } from "@/network/static.js";
import { findbytype, add } from "@/network/otherComment.js";
import CommentCpn from "@/components/CommentCpn.vue";

export default {
  name: "Links",
  props: {},
  components: {
    CommentCpn
  },
  data() {
    return {
      linksList: undefined,
      commentList: undefined,
    }
  },
  methods: {
    getLinksList() {
      json("links").then(res => {
        if (res) {
          this.linksList = res;
        }
      })
    },
    // 获取评论列表
    getCommentList() {
      findbytype(this.commentList_params).then(res => {
        if (res.code === 200) {
          this.commentList = res.data.rows;
          
        }
      })
    },

    // 添加新评论
    addComment(newComment) {
      newComment['type'] = 1
      add(newComment).then(res => {
        if (res.code === 200) {
          this.$message.success('评论成功');
          this.getCommentList();
          // 清除评论框内内容，等待添加
        }
      })
    }

  },
  computed: {
    commentList_params: function() {
      return {
        type: 1,
      }
    },
  },
  mounted() {
    this.getLinksList();
    this.getCommentList();
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#Links{
  background-color: var(--td-bg-color-page);
  min-height: calc(100vh - 56px);

  @include respond-to('phone') {
    .content {
      grid-template-columns: 1fr;
    }
  }

  @include respond-to('desktop') {
    .content {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .content {
    margin: var(--td-comp-paddingTB-xxl) 0px;
    border-radius: var(--td-radius-medium);
    background-color: var(--td-bg-color-container);
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-xl);
    box-sizing: border-box;

    display: grid;
    // grid-template-columns: repeat(4, 1fr);
    gap: var(--td-comp-paddingLR-xl);

    .linkItem{
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0px 0px 6px #00000026;
      border-radius: var(--td-radius-medium);
      padding: var(--td-comp-paddingTB-l) 0;
      .icon {
        height: 60px;
        width: 60px;
        margin: var(--td-comp-paddingTB-xl) 0px;
      }
      .name {
        font-size: var(--td-font-size-xxl);
        font-weight: bold;
        margin-bottom: var(--td-comp-paddingTB-s);
      }
      .link {
        font-size: var(--td-font-size-sm);
        color: var(--td-text-color-placeholder);
        margin-bottom: var(--td-comp-paddingTB-s);
      }
    }
  }
}
</style>