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
                <t-button v-if="commentList.parentObj" variant="outline" theme="primary" @click="cancelReply">取消对{{commentList.parentObj.user_name}}回复</t-button>
              </t-space>
            </div>
          </div>

          <div class="commentsListWarp">
            <div class="commentWarp" v-for="comment in commentList.data" :key="comment.id">
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

        </div>

      </t-col>
    </t-row>
  </div>
</template>

<script>
import { json } from "@/network/static.js";
import { list, add } from "@/network/comment.js";
import { avatarByemail, createNestedComment, handleResponseMsg } from "@/util/tool.js";
import { Comment } from "@icon-park/vue"

export default {
  name: "Links",
  props: {},
  components: {
    Comment
  },
  data() {
    return {
      linksList: undefined,
      commentList: {
        total: 0,
        data: undefined,
        parentObj: undefined,
      },
      newComment: {
        aId: 9002,
        parent_id: 0,
        user_name: undefined,
        email: undefined,
        url: undefined,
        agent: navigator.userAgent,
        text: undefined,
      },
    }
  },
  methods: {
    avatarByemail,
    getLinksList() {
      json("links").then(res => {
        if (res) {
          this.linksList = res;
        }
      })
    },
    // 获取评论列表
    getCommentList() {
      list(this.commentList_params).then(res => {
        if (res.code === 200) {
          this.commentList.total = res.data.count;
          this.commentList.data = createNestedComment(res.data.rows);
        }
      })
    },

    // 发布评论
    addComment() {
      let condition = this.newComment.user_name && this.newComment.email && this.newComment.text;
      if (condition) {
        add(this.newComment).then(res => {
          if (res.code === 200) {
            this.$message.success('评论成功');
            this.newComment.text = undefined;
            this.commentList.parentObj = undefined
            this.getCommentList();
          } else {
            this.$message.error(handleResponseMsg(res.msg));
          }
        })
      }else{
        this.$message.error('请填写完整评论信息');
      }
    },

    replay(comment) {
      this.commentList.parentObj = comment;
      this.newComment.parent_id = comment.id;
    },

    cancelReply() {
      this.commentList.parentObj = undefined;
    },

  },
  computed: {
    commentList_params: function() {
      return {
        search: JSON.stringify({a_id: 9001}),
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

  .comments {

    margin: var(--td-comp-paddingTB-xxl) 0px;
    border-radius: var(--td-radius-medium);
    background-color: var(--td-bg-color-container);
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-xl);
    box-sizing: border-box;

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

    .commentsListWarp {
      margin-top: var(--td-comp-margin-l);
      height: 600px;
      overflow-y: auto;
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