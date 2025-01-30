<template>
  <div id="Admin-Article-edit">
    <div class="warp">
      <div class="header">
        <ArrowLeft theme="outline" class="icon" @click="confirm.visible = true"/>
        <div class="aTitle" v-if="this.$route.query">{{ routeQuery.type === 'edit'? '编辑文章' : '新建文章'}}</div>
      </div>

      <div class="content" v-if="articleDetail">

        <t-form
          :data="articleDetail"
          layout="vertical"
          ref="form"
          @submit="onSubmit"
          scrollToFirstError="smooth"
        >

          <t-row :gutter="8">
            <t-col :span="12">

              <t-form-item class="aTitle" name="title">
                <t-input  v-model="articleDetail.title" placeholder="请输入文章标题"/>
              </t-form-item>

            </t-col>
          </t-row>
          <t-row :gutter="8">
            <t-col :span="8">
              <t-form-item name="content">
                <v-md-editor v-model="articleDetail.content" class="edit"></v-md-editor>
              </t-form-item>
            </t-col>

            <t-col :span="4">
              <t-form-item label="文章封面" name="cover">
                <t-input  v-model="articleDetail.cover" placeholder="请输入文章封面URL"/>
              </t-form-item>

              <t-form-item label="文章状态" name="status">
                <t-select v-model="articleDetail.status">
                  <t-option :label="option.name" :value="option.value" v-for="option in $store.getters['dictv2/getDictObj']('statusType')" :key="option.value" />
                </t-select>
              </t-form-item>

              <t-form-item label="文章分类" name="category">
                <t-select v-model="articleDetail.category">
                  <t-option :label="option.name" :value="option.value" v-for="option in $store.getters['dictv2/getDictObj']('articleType')" :key="option.value" />
                </t-select>
              </t-form-item>

              <t-form-item style="margin-left: 100px">
                <t-space>
                  <t-button theme="primary" type="submit">保存</t-button>
                </t-space>
              </t-form-item>
            </t-col>
          </t-row>

        </t-form>
      </div>
    </div>

    <t-dialog 
      :visible.sync="confirm.visible" 
      :header="confirm.title"
      confirmBtn="确认退出"
      cancelBtn="暂不退出"
      @confirm="exit"
    >
      <p>确认返回吗？</p>
    </t-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import { ArrowLeft } from "@icon-park/vue";
import { detail, add, update } from "@/network/article.js";
import VueMarkdownEditor from '@kangc/v-md-editor';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';
import Prism from 'prismjs';
export default {
  name: "Admin-Article-edit",
  props: {},
  components: {
    ArrowLeft
  },
  data() {
    return {

      routeQuery: {
        type: undefined,
        id: undefined
      },

      articleDetail: undefined,

      confirm: {
        title: "退出确认",
        visible: false
      }
    }
  },
  methods: {
    getRouterQuery() {
      if (this.$route.query) {
        this.routeQuery = this.$route.query
      }else{
        this.$message.error("路由参数丢失")
      }
    },

    async getDict() {
      await this.$store.dispatch('dictv2/cacheDict', {
        dict_type: 'otherCommentType',
      });

      await this.$store.dispatch('dictv2/cacheDict', {
        dict_type: 'statusType',
      });
    },

    getArticle() {
      if (this.routeQuery.type === 'edit' && this.routeQuery.id) {

        detail(this.articleDetail_params).then(res => {
          if (res.code === 200) {
            this.articleDetail = res.data;

          }
        })

      }else if (this.routeQuery.type === 'add') {
        this.articleDetail = {
          title: undefined,
          content: undefined,
          cover: undefined,
          category: undefined,
          status: 1
        }
      }
    },


    onSubmit() {
      if (this.routeQuery.type === 'edit') {
        let update_data = this.save_data;
        update_data['a_id'] = Number(this.routeQuery.id);
        update(update_data).then(res => {
          if (res.code === 200) {
            this.$message.success('修改文章成功');
            this.$router.go(-1);
          }else{
            this.$message.error('修改文章失败，请重试');
          }
        })


      }else if (this.routeQuery.type === 'add') {
        add(this.save_data).then(res => {
          if (res.code === 200) {
            this.$message.success('撰写新文章成功');
            this.$router.go(-1);
          }else{
            this.$message.error('撰写新文章失败，请重试');
          }
        })
      }
    },

    exit() {
      this.confirm.visible = false;
      this.$router.go(-1);
    }
  },
  async mounted() {
    await this.getDict();
    this.getRouterQuery();
    this.getArticle();
  },
  created() {
    VueMarkdownEditor.use(vuepressTheme, {
      Prism,
    });
    VueMarkdownEditor.use(createKatexPlugin());
    Vue.use(VueMarkdownEditor);
  },
  computed: {
    articleDetail_params: function() {
      return {
        a_id: this.routeQuery.id
      }
    },

    save_data() {
      delete this.articleDetail.comments
      this.articleDetail.updatedAt = this.$dayjs().toDate();
      return this.articleDetail
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#Admin-Article-edit{
  padding: var(--td-size-4);
  height: 100%;
  width: calc(100vw - 248px);
  box-sizing: border-box;

  .warp {
    padding: var(--td-size-4);
    background-color: var(--td-bg-color-container);
    border-radius: var(--td-radius-medium);
    box-sizing: border-box;
    height: 100%;
    width: 100%;

    .header {
      display: flex;
      align-items: center;

      .aTitle {
        font-size: var(--td-font-size-body-large);
      }

      .icon {
        font-size: var(--td-font-size-body-large);
        color: var(--td-brand-color);
        cursor: pointer;
        margin-right: var(--td-comp-paddingLR-m);
      }
    }
  }

  .content {
    .aTitle {
      margin: var(--td-size-4) 0;
    }

    .edit {
      height: calc(100vh - #{$nav-height} - 32px - 21px - 32px - 16px);
    }
  }
}
</style>