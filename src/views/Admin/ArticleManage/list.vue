<template>
  <div id="Admin-Article-list">
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
        <t-form-item label="文章标题" name="title">
          <t-input v-model="searchData.title" placeholder="请输入文章标题"></t-input>
        </t-form-item>

        <t-form-item label="文章分类" name="category">
          <t-select v-model="searchData.category">
            <t-option :label="option.name" :value="option.value" v-for="option in $store.getters['dictv2/getDictObj']('articleType')" :key="option.value" />
          </t-select>
        </t-form-item>

        <t-form-item label="文章状态" name="status">
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
          <t-button theme="primary" @click="gotoArticleEdit('add')">
            <template #icon><AddOne theme="outline"/></template>新增文章
          </t-button>

          <t-button theme="danger" :disabled="!articleList.selectedRowKeys.length" @click="del('multiple')">
            <template #icon><Delete theme="outline"/></template>删除勾选
          </t-button>
        </t-space>
      </div>

      <t-table
        :selected-row-keys="articleList.selectedRowKeys"
        rowKey="id"
        :data="articleList.data"
        :columns="articleList.columns"
        :stripe="false"
        :bordered="true"
        :hover="false"
        size="medium"
        :height="articleList.tableHeight"
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
        <template #created_at="{ row }">
          {{ $dayjs(row.createdAt).format('YYYY-MM-DD HH:MM') }}
        </template>

        <template #category="{ row }">
          <t-tag theme="primary">{{$store.getters['dictv2/transDict']('articleType', row.category)}}</t-tag>
        </template>

        <!-- <template #comments="{ row }">
          <t-tag>{{ row.comments.length }}</t-tag>
        </template> -->

        <template #status="{ row }">
          <t-tag :theme="row.status? 'success':'danger'">{{$store.getters['dictv2/transDict']('statusType', row.status)}}</t-tag>
        </template>

        <template #action="{ row }">
          <t-space>

          <t-button theme="primary" size="small" @click="gotoArticleEdit('edit', row.id)">
            <template #icon><Edit theme="outline"/></template>编辑
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
import { list, del } from "@/network/article.js";
import { AddOne, Edit, Delete } from "@icon-park/vue";
export default {
  name: "Admin-Article-list",
  props: {},
  components: {
    AddOne, Edit, Delete
  },
  data() {
    return {
      page: {
        offset: Number(this.$route.query.page) || 1,
        limits: 10,
        total: 0,
        limitsOptions: ['10', '15', '20'],
      },

      searchData: {
        title: undefined,
        category: undefined,
        status: undefined
      },

      articleList: {
        data: undefined,
        columns: [
          { colKey: 'row-select', type: 'multiple', width: 50},
          { title: 'ID', colKey: 'id', width: 60},
          { title: '标题', colKey: 'title'},
          { title: '创建时间', colKey: 'created_at', cell: 'created_at', width: 160},
          { title: '分类', colKey: 'category', cell: 'category', width: 100, align: 'center'},
          { title: '评论', colKey: 'commentNum', width: 70, align: 'center'},
          { title: '状态', colKey: 'status', cell: 'status', width: 80, align: 'center'},
          { title: '操作', cell: 'action', width: 160, align: 'center'},
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
        this.articleList.tableHeight = 905 - 16 - 24 - 40 - 64 - searchHeight - 2;

      })
      this.resizeObserver.observe(this.$refs.search);
    },

    // 表格行选择
    tableSelectChange(val, ctx) {
      this.articleList.selectedRowKeys = val;
      // console.log(keys);
    },

    // 获取文章列表
    getArticleList() {
      list(this.articleList_params).then(res => {
        if (res.code === 200) {
          this.page.total = res.data.count;
          this.articleList.data = res.data.rows;
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
      this.getArticleList();
    },

    // 页面条数改变
    limitsChange(page, pageSize) {
      this.page.offset = 1;
      this.page.limits = pageSize;
      this.getArticleList();
    },
    onReset() {
      resetObj(this.searchData);
      this.page.offset = 1;
      this.page.limits = 10;
      this.getArticleList();
    },

    onSubmit() {
      this.page.offset = 1;
      this.page.limits = 10;
      this.getArticleList();
    },

    del(type, id) {
      if (type === 'multiple') {
        this.delConfirm.visible = true;
        this.delConfirm.type = type;
        this.delConfirm.content = `确定删除选中ID为${this.articleList.selectedRowKeys.join(',')}的文章吗？`;
      }else if (type === 'single') {
        this.delConfirm.visible = true;
        this.delConfirm.type = type;
        this.delConfirm.content = `确定删除选中ID为${id}的文章吗？`;
        this.delConfirm.id = id;
      }
    },

    confirmDel() {
      del(this.del_data).then(res => {
        if (res.code == 200) {
          this.$message.success('删除成功');
          this.getArticleList();
        }else{
          this.$message.error('删除失败');
        }
        this.delConfirm.visible = false;
      })

    },

    gotoArticleEdit(type, id) {
      let query = undefined;
      if (type === 'add') {
        query = {
          type: type
        }
      }else if (type === 'edit') {
        query = {
          type: type,
          id: id
        }
      }
      this.$router.push({
        path: '/admin/articleedit',
        query: query
      })
      
    }
  },
  async mounted() {
    await this.getDict();
    this.getArticleList();
    this.$nextTick(() => {
      this.listSearchDomChange();
    })
  },
  computed: {
    articleList_params: function() {
      return {
        search: JSON.stringify(filterObj(this.searchData)),
        offset: this.page.offset,
        limits: this.page.limits,
      }
    },

    del_data: function () {
      if (this.delConfirm.type === 'multiple') {
        return {
          id: this.articleList.selectedRowKeys
        }
      }else if (this.delConfirm.type === 'single') {
        return {
          id: [this.delConfirm.id]
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
#Admin-Article-list{
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