<template>
  <div id="Article">

    <t-row>
      <t-col
        :xs="{ offset: 1, span: 10 }"
        :sm="{ offset: 1, span: 10 }"
        :md="{ offset: 2, span: 8 }"
        :lg="{ offset: 2, span: 8 }"
        :xl="{ offset: 3, span: 6 }"
      >
        <div class="warp">
          <template v-if="!loading">
            <div class="head">
              <img class="cover" v-if="!articleDetail.cover" :src="require('@/assets/img/defaultCover/coverbg'+random(1,3)+'.jpg')">
              <img class="cover" v-else :src="articleDetail.cover">
              <div class="blur"></div>
              <div class="text">
                <div class="title">{{articleDetail.title}}</div>
                <div class="meta">
                  <div class="category metaItem"><ApplicationTwo theme="outline" :strokeWidth="3"/>{{$store.getters['dictv2/transDict']('articleType', articleDetail.category)}}</div>
                  <div class="datetime metaItem"><Calendar theme="outline" :strokeWidth="3"/>{{$dayjs(articleDetail.createdAt).format('YYYY-MM-DD HH:mm')}}</div>
                </div>
              </div>
            </div>
            <markdown :content="articleDetail.content"/>
          
            <CommentCpn :comments="articleDetail.comments" from="comment" @addComment="addComment"/>
          </template>
        </div>

      </t-col>
    </t-row>



    
  </div>
</template>

<script>
import { random } from "@/util/tool.js";
import { detail } from "@/network/article.js";
import markdown from "@/components/Markdown.vue";
import { Calendar, ApplicationTwo } from "@icon-park/vue"
import CommentCpn from "@/components/CommentCpn.vue";
import { add } from "@/network/comment.js";

export default {
  name: "Article",
  props: {},
  components: {
    markdown,
    CommentCpn,
    Calendar, ApplicationTwo
  },
  data() {
    return {
      loading: true,
      articleDetail: undefined,
    }
  },
  methods: {
    random,
    getArticleDetail() {
      detail(this.articleDetail_params).then(res => {
        if (res.code === 200) {
          this.articleDetail = res.data;
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    addComment(newComment) {
      newComment['a_id'] = Number(this.$route.query.id);
      add(newComment).then(res => {
        if (res.code === 200) {
          this.getArticleDetail();
        }
      })
    }

  },
  async mounted() {
    await this.$store.dispatch('dictv2/cacheDict', {
      dict_type: 'articleType',
    });

    this.getArticleDetail();

  },
  computed: {
    articleDetail_params: function() {
      return {
        a_id: this.$route.query.id
      }
    },
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#Article{

  background-color: var(--td-bg-color-page);

  :deep(.v-md-editor-preview) {
    .vuepress-markdown-body {
      background-color: var(--td-bg-color-container);
    }
  }

  .warp {
    margin: var(--td-comp-margin-xxxl) 0;
    .head {
      height: 300px;
      position: relative;
      .cover {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .blur {
        position: absolute;
        top: 0px;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(7px);
      }

      .text {
        position: absolute;
        top: calc(50% - 36px);
        left: 2.5rem;
        width: calc(100% - 5rem);
        // height: 100%;

        .title {
          font-size: var(--td-font-size-headline-large);
          line-height: calc(8px + var(--td-font-size-headline-large));
          color: #fff;
          text-shadow: 0px 0px 10px #00000066;
        }

        .meta {
          margin-top: var(--td-comp-paddingTB-s);
          font-size: var(--td-font-size-title-medium);
          line-height: calc(8px + var(--td-font-size-title-medium));
          color: #f0f0f0;
          text-shadow: 0px 0px 10px #00000066;

          display: flex;
          align-items: center;

          .metaItem {
            display: inline-flex;
            align-items: center;
            ::v-deep .i-icon {
              margin-right: 5px;
            }
          }

          .metaItem:not(:last-of-type) {
            margin-right: var(--td-comp-margin-l);
          }
        }
      }
    }

  }

}
</style>