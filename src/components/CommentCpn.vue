<template>
  <div id="CommentCpn">
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
        :datetime="$dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')"
        :content="comment.text"
      >

        <template #actions>
          <span key="chat" @click="replay(comment)">
            <comment theme="outline"/>
            <span class="action-text">回复</span>
          </span>
        </template>

        <template #author>
          <template v-if="findParent(comment.parent_id)">{{comment.user_name}} @ {{findParent(comment.parent_id)}}</template>
          <template v-else>{{comment.user_name}} </template>
           
        </template>
      
        <!-- <template #reply v-if="comment.replay">
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
        </template> -->
      
      </t-comment>
    </div>

  </div>
</template>

<script>
import { avatarByemail, handleResponseMsg } from "@/util/tool.js";
import { Comment } from "@icon-park/vue"

export default {
  name: "CommentCpn",
  props: {
    from: {
      type: String,
      default: 'article'
    },
    comments: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    Comment
  },
  data() {
    return {
      newComment: {
        parent_id: 0,
        is_regist: 0,
        user_name: undefined,
        email: undefined,
        url: undefined,
        agent: navigator.userAgent,
        text: undefined,
        status: 1
      },
      parentObj: undefined
    }
  },
  methods: {
    avatarByemail,

    findParent(pid) {
      const comment = this.comments.find(item => item.id === pid);
      return comment ? comment.user_name : false;
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
        (this.newComment.user_name === "elissa" && this.newComment.email === "524948583@qq.com")? this.newComment.is_regist = 1 : this.newComment.is_regist = 0;
        // 抛出事件
        this.$emit('addComment', this.newComment);
        // add(this.newComment).then(res => {
        //   if (res.code === 200) {
        //     this.$message.success('评论成功');
        //     this.newComment.text = undefined;
        //     this.parentObj = undefined
        //     this.getArticleDetail();
        //   } else {
        //     this.$message.error(handleResponseMsg(res.msg));
        //   }
        // })
      }else{
        this.$message.error('请填写完整评论信息');
      }
    }
  },
  mounted() {

  },
  watch: {}
}
</script>
<style lang="scss" scoped>
  #CommentCpn {
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
</style>