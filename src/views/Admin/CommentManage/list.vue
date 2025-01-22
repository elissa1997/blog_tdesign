<template>
  <div id="Admin-Comment-list">
    <div class="card search" ref="search">
      <t-form
        :data="searchData"
        layout="inline"
        ref="searchForm"
        @reset="onReset"
        @submit="onSubmit"
        scrollToFirstError="smooth"
        v-if="$store.state.dict"
      >

        <t-form-item label="所属文章" name="article">
          <t-select
            v-model="belongArticleSearchData.selectedObj"
            value-type="object"
            filterable
            placeholder="请输入搜索"
            :options="belongArticleSearchData.options"
            :loading="belongArticleSearchData.loading"
            @focus="belongArticleSearch(null)"
            @search="belongArticleSearch"
            @change="belongArticleChange"
            reserveKeyword
          />
        </t-form-item>

        <t-form-item label="评论内容" name="text">
          <t-input v-model="searchData.text" placeholder="请输入评论内容"></t-input>
        </t-form-item>



        <t-form-item label="评论状态" name="status">
          <t-select v-model="searchData.status">
            <t-option :label="option.name" :value="option.value" v-for="option in $store.getters['dictv2/getDictObj']('statusType')" :key="option.value" />
          </t-select>
        </t-form-item>

        <t-form-item>
          <t-space size="10px">
            <t-button theme="primary" type="submit">提交</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-space>
        </t-form-item>

      </t-form>
    </div>

    <div class="card table">

      <div class="operate">
        <t-space>
          <t-button theme="danger" :disabled="!commentList.selectedRowKeys.length" @click="del('multiple')">
            <template #icon><Delete theme="outline"/></template>删除勾选
          </t-button>
        </t-space>
      </div>

      <t-table
        :selected-row-keys="commentList.selectedRowKeys"
        rowKey="id"
        :data="commentList.data"
        :columns="commentList.columns"
        :stripe="false"
        :bordered="true"
        :hover="false"
        size="medium"
        :height="commentList.tableHeight"
        table-layout="fixed"
        @page-change="pageChange"
        @select-change="tableSelectChange"
        :pagination="{
          pageSize: page.limits,
          current: page.offset,
          total: page.total,
          pageSizeOptions: page.limitsOptions,
        }"
        :footerAffixedBottom="true"
        :showHeader="true"
        cellEmptyContent="-"
        resizable
      >
        <template #createdAt="{ row }">
          {{ $dayjs(row.createdAt).format('YYYY-MM-DD HH:MM') }}


        </template>

        <template #article="{ row }">
          <span v-if="row.article">{{row.article.title}}</span>
          <!-- {{row.aId}} -->
          <t-tag v-if="row.aId == 9001">关于页面</t-tag>
          <t-tag v-if="row.aId == 9002">友链页面</t-tag>
          <t-tag v-if="row.aId == 9004">音乐页面</t-tag>
        </template>

        <template #email="{ row }">
          <t-tooltip v-if="row.email" :content="row.email">
            <Mail theme="outline"/>
          </t-tooltip>
        </template>

        <template #url="{ row }">
          <t-tooltip v-if="row.url" :content="row.url">
            <World theme="outline" v-if="row.url"/>
          </t-tooltip>
        </template>

        <template #agent="{ row }">
          <t-tooltip v-if="row.agent" :content="`${parseUa(row.agent).os.name} ${parseUa(row.agent).os.version} ${parseUa(row.agent).browser.name} ${parseUa(row.agent).browser.major}`">
            <Devices theme="outline" v-if="row.agent"/>
          </t-tooltip>
          <!-- {{parseUa(row.agent)}} -->
        </template>

        <template #status="{ row }">
          <t-tag :theme="row.status? 'success':'danger'">{{$store.getters['dictv2/transDict']('statusType', row.status)}}</t-tag>
        </template>

        <template #action="{ row }">
          <t-space>

          <t-button theme="primary" size="small" @click="changeStatus(row)">
            <template #icon>
              <PreviewCloseOne theme="outline" v-if="row.status"/>
              <PreviewOpen theme="outline" v-else/>
            </template>
            {{ row.status? '隐藏':'显示' }}
          </t-button>

          <t-button theme="danger" size="small" @click="del('single', row.id)">
            <template #icon><Delete theme="outline"/></template>删除
          </t-button>

          </t-space>
        </template>

      </t-table>
    </div>

    <t-dialog 
      :visible.sync="delConfirm.visible" 
      :header="delConfirm.title"
      confirmBtn="确认删除"
      cancelBtn="暂不删除"
      @confirm="confirmDel"
    >
      <p>{{delConfirm.content}}</p>
    </t-dialog>

  </div>
</template>

<script>

import { resetObj, filterObj } from "@/util/tool.js";
import { list, del, update } from "@/network/comment.js";
import { list as articleList } from "@/network/article.js";
import { Edit, Delete, Mail, World, Devices, PreviewCloseOne, PreviewOpen } from "@icon-park/vue";
import uaParser from 'ua-parser-js';
export default {
  name: "Admin-Comment-list",
  props: {},
  components: {
    Edit, Delete, Mail, World, Devices, PreviewCloseOne, PreviewOpen
  },
  data() {
    return {

      page: {
        offset: Number(this.$route.query.page) || 1,
        limits: 10,
        total: 0,
        limitsOptions: ['10', '15', '20'],
      },
      belongArticleSearchData: {
        selectedObj: undefined,
        options: [],
        loading: false
      },
      searchData: {
        articleTitle: undefined,
        text: undefined,
        status: undefined
      },

      commentList: {
        data: undefined,
        columns: [
          { colKey: 'row-select', type: 'multiple', width: 50, align: 'center'},
          { title: 'ID', colKey: 'id', width: 60, align: 'center'},
          { title: 'PID', colKey: 'parent_id', width: 60, align: 'center'},
          { title: '内容', colKey: 'text', width: 300, ellipsis: { placement: 'bottom'}},
          { title: '所属文章', colKey: 'article', cell: 'article' , width: 200, ellipsis: { placement: 'bottom'}},
          { title: '用户名', colKey: 'user_name', width: 100, align: 'center'},
          { title: '邮箱', colKey: 'email', width: 70, align: 'center'},
          { title: '网站', colKey: 'url', cell: 'url' , width: 70, align: 'center'},
          { title: 'UA', colKey: 'agent', cell: 'agent' , width: 70, align: 'center'},
          { title: '状态', colKey: 'status', cell: 'status' , width: 80, align: 'center'},
          { title: '创建时间', colKey: 'createdAt', cell: 'createdAt' , width: 130, align: 'center'},
          { title: '操作', colKey: 'action', cell: 'action', width: 160, align: 'center', fixed: 'right'},
        ],
        tableHeight: 751,
        selectedRowKeys: [],
      },

      delConfirm: {
        title: "删除确认",
        content: undefined,
        visible: false,
        type: undefined,
        id: undefined
      },

      resizeObserver: undefined

    }
  },
  methods: {
    async getDict() {
      await this.$store.dispatch('dictv2/cacheDict', {
        dict_type: 'articleType',
      });

      await this.$store.dispatch('dictv2/cacheDict', {
        dict_type: 'statusType',
      });
    },

    listSearchDomChange() {
      this.resizeObserver = new ResizeObserver(entries => {
        let searchHeight = entries[0].borderBoxSize[0].blockSize;
        this.commentList.tableHeight = 905 - 16 - 24 - 40 - 64 - searchHeight - 2;

      })
      this.resizeObserver.observe(this.$refs.search);
    },

    // 远程搜索所属文章列表
    belongArticleSearch(search) {
      let articleList_params = undefined
      if (search) {        
        articleList_params = {
          search: JSON.stringify({title: search}),
          offset: 1,
          limits: 500,
        }
      }else{
        articleList_params = {
          offset: 1,
          limits: 500,
        }
      }
      articleList(articleList_params).then(res => {
        if (res.code === 200) {
          this.belongArticleSearchData.options = res.data.rows.map(item => {
            return {
              label: item.title,
              value: item.id
            }
          });
          this.belongArticleSearchData.loading = false;
        }
      })
    },

    //
    belongArticleChange(value, ctx) {
      if (value.hasOwnProperty('value')) {
        this.searchData.articleTitle = value.label;
      }
    },
    // 解析UA头
    parseUa(agent) {
      const ua = uaParser(agent);
      return ua;
    },

    // 表格行选择
    tableSelectChange(val, ctx) {
      this.commentList.selectedRowKeys = val;
      // console.log(keys);
    },

    // 获取评论列表
    getCommentList() {
      list(this.commentList_params).then(res => {
        if (res.code === 200) {
          this.page.total = res.data.count;
          this.commentList.data = res.data.rows;
        }
      })
    },

    // 分页组件改变
    pageChange(pageInfo) {
      if (pageInfo.current !== this.page.offset) {
        // 页码改变
        this.offsetChange(pageInfo.current, pageInfo.pageSize);
      }

      if (pageInfo.pageSize !== this.page.limits) {
        // 页面条数改变
        this.limitsChange(pageInfo.current, pageInfo.pageSize);
      }
    },

    // 页码改变
    offsetChange(page, pageSize) {
      this.page.offset = page;
      this.page.limits = pageSize;
      this.getCommentList();
    },

    // 页面条数改变
    limitsChange(page, pageSize) {
      this.page.offset = 1;
      this.page.limits = pageSize;
      this.getCommentList();
    },

    // 解析UA
    parseUa(agent) {
      const ua = uaParser(agent);
      return ua;
    },

    onReset() {
      this.belongArticleSearchData = {
        selectedObj: undefined,
        options: [],
        loading: false
      };
      resetObj(this.searchData);
      this.page.offset = 1;
      this.page.limits = 10;
      this.getCommentList();
    },
    onSubmit() {
      this.page.offset = 1;
      this.page.limits = 10;
      this.getCommentList();
    },

    // 改变状态
    changeStatus(record) {
      let update_data = {
        id: record.id,
        status: Number(!record.status)
      }
      update(update_data).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功');
          this.getCommentList();
        }
      })
    },

   del(type, id) {
      if (type === 'multiple') {
        this.delConfirm.visible = true;
        this.delConfirm.type = type;
        this.delConfirm.content = `确定删除选中ID为${this.commentList.selectedRowKeys.join(',')}的评论吗？`;
      }else if (type === 'single') {
        this.delConfirm.visible = true;
        this.delConfirm.type = type;
        this.delConfirm.content = `确定删除选中ID为${id}的评论吗？`;
        this.delConfirm.id = id;
      }
    },

    confirmDel() {
      del(this.del_data).then(res => {
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.getCommentList();
        }else{
          this.$message.error('删除失败');
        }
        this.delConfirm.visible = false;
      })

    },

  },
  async mounted() {

    await this.getDict();
    this.getCommentList();
    this.$nextTick(() => {
      this.listSearchDomChange();
    })

  },

  computed: {
    commentList_params: function() {
      return {
        search: JSON.stringify(filterObj(this.searchData)),
        offset: this.page.offset,
        limits: this.page.limits,
      }
    },

    del_data: function () {
      if (this.delConfirm.type === 'multiple') {
        return {
          id: this.commentList.selectedRowKeys
        }
      }else if (this.delConfirm.type === 'single') {
        return {
          id: this.delConfirm.id
        }
      }
        
    }
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver == null;
      console.log('销毁resizeObserver');
    }
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#Admin-Comment-list{
  padding: var(--td-size-4);
  height: 100%;
  width: calc(100vw - 248px);
  box-sizing: border-box;

  .card {
    padding: var(--td-size-4);
    background-color: var(--td-bg-color-container);
    border-radius: var(--td-radius-medium);
    box-sizing: border-box;
  }

  .table {
    margin-top: var(--td-size-4);
    .operate {
      margin-bottom: var(--td-size-4);
    }
  }
}
</style>