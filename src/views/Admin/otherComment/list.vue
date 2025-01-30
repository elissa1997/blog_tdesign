<template>
  <div id="Admin-OtherComment-List">
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

      <t-form-item label="评论类型" name="type">
          <t-select v-model="searchData.type">
            <t-option :label="option.name" :value="option.value" v-for="option in $store.getters['dictv2/getDictObj']('otherCommentType')" :key="option.value" />
          </t-select>
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
          <t-button theme="danger" :disabled="!otherCommentList.selectedRowKeys.length" @click="del('multiple')">
            <template #icon><Delete theme="outline"/></template>删除勾选
          </t-button>
        </t-space>
      </div>

      <t-table
        :selected-row-keys="otherCommentList.selectedRowKeys"
        rowKey="id"
        :data="otherCommentList.data"
        :columns="otherCommentList.columns"
        :stripe="false"
        :bordered="true"
        :hover="false"
        size="medium"
        :height="otherCommentList.tableHeight"
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

        <template #type="{ row }">
          {{$store.getters['dictv2/transDict']('otherCommentType', row.type)}}
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
import { list, del, update } from "@/network/otherComment.js";
import { Edit, Delete, Mail, World, Devices, PreviewCloseOne, PreviewOpen } from "@icon-park/vue";
import uaParser from 'ua-parser-js';
export default {
  name: "Admin-OtherComment-List",
  props: {},
  components: {
    Edit, Delete, Mail, World, Devices, PreviewCloseOne, PreviewOpen
  },
  data() {
    return {
      page: {
        offset: 1,
        limits: 10,
        total: 0,
        limitsOptions: ['10', '15', '20'],
      },
      searchData: {
        type: undefined,
        text: undefined,
        status: undefined
      },
      otherCommentList: {
        data: undefined,
        columns: [
          { colKey: 'row-select', type: 'multiple', width: 50, align: 'center'},
          { title: 'ID', colKey: 'id', width: 60, align: 'center'},
          { title: '分类', colKey: 'type', cell: 'article' , width: 100, ellipsis: { placement: 'bottom'}},
          { title: '内容', colKey: 'text', width: 300, ellipsis: { placement: 'bottom'}},
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
        dict_type: 'otherCommentType',
      });

      await this.$store.dispatch('dictv2/cacheDict', {
        dict_type: 'statusType',
      });
    },

    listSearchDomChange() {
      this.resizeObserver = new ResizeObserver(entries => {
        let searchHeight = entries[0].borderBoxSize[0].blockSize;
        this.otherCommentList.tableHeight = 905 - 16 - 24 - 40 - 64 - searchHeight - 8;

      })
      this.resizeObserver.observe(this.$refs.search);
    },

    // 解析UA头
    parseUa(agent) {
      const ua = uaParser(agent);
      return ua;
    },

    // 表格行选择
    tableSelectChange(val, ctx) {
      this.otherCommentList.selectedRowKeys = val;
      // console.log(keys);
    },


    // 获取评论列表
    getOtherCommentList() {
      list(this.commentList_params).then(res => {
        if (res.code === 200) {
          this.page.total = res.data.count;
          this.otherCommentList.data = res.data.rows;
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
      this.getOtherCommentList();
    },

    // 页面条数改变
    limitsChange(page, pageSize) {
      this.page.offset = 1;
      this.page.limits = pageSize;
      this.getOtherCommentList();
    },

    onReset() {
      resetObj(this.searchData);
      this.page.offset = 1;
      this.page.limits = 10;
      this.getOtherCommentList();
    },
    onSubmit() {
      this.page.offset = 1;
      this.page.limits = 10;
      this.getOtherCommentList();
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
          this.getOtherCommentList();
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
          this.getOtherCommentList();
        }else{
          this.$message.error('删除失败');
        }
        this.delConfirm.visible = false;
      })
    },

  },
  async mounted() {
    await this.getDict();
    this.getOtherCommentList();
    this.$nextTick(() => {
      this.listSearchDomChange();
    })

  },
  watch: {},
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
}
</script>
<style lang="scss" scoped>
  #Admin-OtherComment-List {
    padding: var(--td-size-4);
    height: 100%;
    width: calc(100vw - 240px);
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