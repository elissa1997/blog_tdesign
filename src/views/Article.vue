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

            <!-- <t-divider dashed></t-divider> -->

            <div class="comments">

              <div class="addComments">
                <t-row :gutter="[12,12]">
                  <t-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                    <t-input v-model="newComment.user_name" clearable placeholder="昵称"/>
                  </t-col>
                  <t-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                    <t-input v-model="newComment.email" clearable placeholder="Email（用于区分用户和确定头像）"/>
                  </t-col>
                  <t-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                    <t-input v-model="newComment.url" clearable placeholder="你的网站URL"/>
                  </t-col>                  
                </t-row>

                <t-textarea
                  v-model="newComment.text"
                  class="newCommentText"
                  placeholder="输入评论内容，评论自动审核"
                  name="description"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                />
                <div class="operat">
                  <t-space align="center">
                    <t-button theme="primary" @click="addComment">发表评论</t-button>
                    <t-button v-if="parentObj" variant="outline" theme="primary" @click="cancelReply">取消对{{parentObj.user_name}}回复</t-button>
                  </t-space>
                </div>
              </div>

              <div class="commentWarp" v-for="comment in comments" :key="comment.id">
                <t-comment
                  :avatar="avatarByemail(comment.email)"
                  :author="comment.user_name"
                  :datetime="$dayjs(comment.updatedAt).format('YYYY-MM-DD HH:mm')"
                  :content="comment.text"
                >

                  <template #actions>
                    <span key="chat" @click="replay(comment)">
                      <comment theme="outline"/>
                      <span class="action-text">回复</span>
                    </span>
                  </template>
                
                  <template #reply v-if="comment.replay">
                    <div class="commentReplayWarp" v-for="comment in comment.replay" :key="comment.id">
                      <t-comment
                        :avatar="avatarByemail(comment.email)"
                        :datetime="$dayjs(comment.updatedAt).format('YYYY-MM-DD HH:mm')"
                        :content="comment.text"
                      >
                        <template #author>{{comment.user_name}} @ {{comment.repliedToUser}}</template>
                        <template #actions>
                          <span key="chat" @click="replay(comment)">
                            <comment theme="outline"/>
                            <span class="action-text">回复</span>
                          </span>
                        </template>
                      </t-comment>
                    </div>
                  </template>
                
                </t-comment>
              </div>
            </div>
          </template>
        </div>

      </t-col>
    </t-row>

    <!-- <remote-script src="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.11.1/katex.min.js"></remote-script> -->


    
  </div>
</template>

<script>
import { random, avatarByemail, createNestedComment, handleResponseMsg } from "@/util/tool.js";
import { detail } from "@/network/article.js";
import { add } from "@/network/comment.js";
import markdown from "@/components/Markdown.vue";
import { Calendar, ApplicationTwo, Comment } from "@icon-park/vue"

export default {
  name: "Article",
  props: {},
  components: {
    markdown,
    Calendar, ApplicationTwo, Comment
  },
  data() {
    return {
      loading: true,
      articleDetail: undefined,
      comments: undefined,
      newComment: {
        aId: this.$route.query.id,
        parent_id: 0,
        user_name: undefined,
        email: undefined,
        url: undefined,
        agent: navigator.userAgent,
        text: undefined,
      },
      parentObj: undefined
    }
  },
  methods: {
    random,
    avatarByemail,
    getArticleDetail() {
      detail(this.articleDetail_params).then(res => {
        if (res.code === 200) {
          this.articleDetail = res.data;
          this.createCommentsReplay();
          console.log(this.articleDetail);
        }
      }).finally(() => {
        this.loading = false;
      })
    },

    // 根据评论Id和Pid组装评论回复
    createCommentsReplay() {
      if (this.articleDetail.comments.length > 0) {
        this.comments = createNestedComment(this.articleDetail.comments);
      }
    },

    replay(comment) {
      this.parentObj = comment;
      this.newComment.parent_id = comment.id;
    },

    cancelReply() {
      this.parentObj = undefined;
    },

    // 发布评论
    addComment() {
      let condition = this.newComment.user_name && this.newComment.email && this.newComment.text;
      if (condition) {
        add(this.newComment).then(res => {
          if (res.code === 200) {
            this.$message.success('评论成功');
            this.newComment.text = undefined;
            this.parentObj = undefined
            this.getArticleDetail();
          } else {
            this.$message.error(handleResponseMsg(res.msg));
          }
        })
      }else{
        this.$message.error('请填写完整评论信息');
      }
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

    .comments {
      margin-top: var(--td-comp-margin-l);
      padding: var(--td-comp-paddingTB-xl);
      background-color: var(--td-bg-color-container);
      .addComments {
        margin-bottom: var(--td-comp-margin-l);
        .newCommentText {
          margin-top: var(--td-comp-margin-m);
        }

        .operat {
          margin-top: var(--td-comp-margin-m);
          width: 100%;
          text-align: center;
        }
      }
      .action-text {
        display: inline-block;
        margin-left: 6px;
        line-height: 15px;
      }
      .commentWarp:not(:last-of-type) {
        margin-bottom: var(--td-comp-margin-l);

        .commentReplayWarp:not(:last-of-type) {
          margin-bottom: var(--td-comp-margin-l);
        }
      }
    }

  }

}
</style>