<template>
  <div id="Home">

    <t-row>
      <t-col
        :xs="{ offset: 1, span: 10 }"
        :sm="{ offset: 1, span: 10 }"
        :md="{ offset: 2, span: 8 }"
        :lg="{ offset: 2, span: 8 }"
        :xl="{ offset: 3, span: 6 }"
      >
        <div class="col">

          <div class="card" v-for="item in articleList" :key="item.id" @click="toArticleDetail(item)">
            <div class="cover">
              <img v-if="!item.cover" :src="require('@/assets/img/defaultCover/coverbg'+random(1,3)+'.jpg')">
              <img v-else :src="item.cover">
            </div>

            <div class="text">

              <div class="title">{{item.title}}</div>
              <div class="meta">
                <!-- <span class="metaItem author">
                  <icon-user theme="outline" size="18" :strokeWidth="3"/>
                  {{item.author}}
                </span> -->
                <span class="metaItem time">
                  <Calendar theme="outline" :strokeWidth="3"/>
                  {{$dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}}
                </span>
                <span class="metaItem category">
                  <ApplicationTwo theme="outline" :strokeWidth="3"/>
                  {{$store.getters['dict/transDict']('article', 'category', item.category)}}
                </span>
                <span class="metaItem comment">
                  <Comment theme="outline" :strokeWidth="3"/>
                  {{item.commentNum}}
                </span>
              </div>
              <div class="summary">
                <template v-if="parseMarkdown(item.content, 155)">
                  {{parseMarkdown(item.content, ($store.state.style.screenWidth &lt; 920)?90:175)}}......
                </template>
                <template v-else>暂无摘要</template>
              </div>
    
            </div>

          </div>



          <div class="desktop-pagination">
            <t-pagination 
              v-model="page.offset" :total="page.total" :page-size.sync="page.limits" :pageSizeOptions="page.limitsOptions"
              @change="offsetChange" @pageSizeChange="limitsChange"
            />
          </div>

          <div class="mobile-pagination">
            <t-pagination 
              v-model="page.offset" :total="page.total" :page-size.sync="page.limits" :pageSizeOptions="page.limitsOptions"
              :showPageSize="false" size="small"
              pageEllipsisMode="both-ends" :maxPageBtn="3" :foldedMaxPageBtn="3"
              @change="offsetChange" @pageSizeChange="limitsChange"
            />
          </div>

        </div>
      </t-col>
    </t-row>

  </div>
</template>

<script>
import { list } from "@/network/article.js";
import { random,parseMarkdown } from "@/util/tool.js";
import { Calendar, ApplicationTwo, Comment } from "@icon-park/vue"

export default {
  name: "Home",
  props: {},
  components: {
    Calendar, ApplicationTwo, Comment
  },
  data() {
    return {
      page: {
        offset: Number(this.$route.query.page) || 1,
        limits: 5,
        total: 0,
        limitsOptions: ['5', '10', '15', '20'],
      },

      articleList: undefined

    }
  },
  methods: {
    random,
    parseMarkdown,

    getList() {
      list(this.articleList_params).then(res => {
        if (res.code === 200) {
          console.log(res.data);
          this.page.total = res.data.count;
          this.articleList = res.data.rows;
        }
      })
    },

    // 页码改变
    offsetChange(pageInfo) {
      this.page.offset = pageInfo.current;
      this.page.limits = pageInfo.pageSize;
      this.getList();
    },

    // 页面条数改变
    limitsChange(pageSize, pageInfo) {
      this.page.offset = 1;
      this.page.limits = pageSize;
      this.getList();
    },
    // 查看文章详情
    toArticleDetail(item) {
      this.$router.push({
        path: '/article',
        query: {
          id: item.id
        }
      })
    }

  },
  async mounted() {
    await this.$store.dispatch('dict/cacheDict', {
      fileName: 'dict_article',
      mutationsName: 'SET_ARTICLE'
    });

    this.getList();
  },
  computed: {
    articleList_params: function() {
      return {
        offset: this.page.offset,
        limits: this.page.limits,
      }
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#Home{
  background-color: var(--td-bg-color-page);
  min-height: calc(100vh - 56px);
  .col {
    margin: var(--td-comp-paddingTB-xxl) 0px;

    .card {
      border-radius: var(--td-radius-medium);
      background-color: var(--td-bg-color-container);
      cursor: pointer;

      @include respond-to('desktop') {
        display: flex;
        height: 250px;
        margin-bottom: var(--td-comp-paddingTB-l);
        $cover-width: 340px;
        .cover {
          width: $cover-width;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
            border-top-left-radius: var(--td-radius-medium);
            border-bottom-left-radius: var(--td-radius-medium);
          }
        }

        .text {
          width: calc(100% - #{$cover-width});
        }
      }

      @include respond-to('phone') {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--td-comp-paddingTB-l);

        .cover {
          width: 100%;
          height: 180px;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
            border-top-left-radius: var(--td-radius-medium);
            border-top-right-radius: var(--td-radius-medium);
          }
        }

        .text {
          width: 100%;
        }
      }

      .text {
        box-sizing: border-box;
        padding: var(--td-comp-paddingTB-m);
        .title {
          font-size: var(--td-font-size-title-large);
          font-weight: 700;
          color: var(--td-text-color-primary);
          margin-bottom: var(--td-comp-margin-s);
        }

        .meta {
          font-size: var(--td-font-size-link-small);
          color: var(--td-text-color-placeholder);
          margin-bottom: var(--td-comp-margin-s);
          display: flex;
          align-items: center;

          .metaItem {
            display: inline-flex;
            align-items: center;
            ::v-deep .i-icon {
              margin-right: 5px;
            }
          }

          .metaItem:not(:last-of-type){
            margin-right: 15px;
          }
        }

        .summary {
          font-size: var(--td-font-size-link-medium);
          color: var(--td-text-color-secondary);
          line-height: calc(var(--td-font-size-link-medium) + 8px);
        }

      }

      // box-shadow: var(--td-shadow-1);
    }

    .desktop-pagination {
      @include respond-to('phone') {
        display: none;
      }
    }

    .mobile-pagination {
      @include respond-to('desktop') {
        display: none;
      }
    }
  }
}
</style>