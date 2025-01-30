<template>
  <div id="Admin-Dict-list">

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

        <t-form-item label="字典类型" name="dict_type_name">
          <t-input v-model="searchData.dict_type_name" placeholder="请输入字典内容"></t-input>
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

          <t-button theme="primary" @click="gotoDictEdit('add')">
            <template #icon><AddOne theme="outline"/></template>新增字典
          </t-button>

          <t-button theme="danger" :disabled="!dictList.selectedRowKeys.length" @click="del('multiple')">
            <template #icon><Delete theme="outline"/></template>删除勾选
          </t-button>
        </t-space>
      </div>

      <t-table
        :selected-row-keys="dictList.selectedRowKeys"
        rowKey="id"
        :data="dictList.data"
        :columns="dictList.columns"
        :stripe="false"
        :bordered="true"
        :hover="false"
        size="medium"
        :height="dictList.tableHeight"
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

        <template #action="{ row }">
          <t-space>
          <t-button theme="primary" size="small" @click="gotoDictEdit('edit', row)">
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

    <t-dialog
      :header="editModal.title"
      :visible.sync="editModal.visible"
      :onClose="() => {this.editModal.visible = false}"
      draggable
      :footer="false"
    >
      <div slot="body">
        <editForm v-if="editModal.visible" :type="editModal.type" :data="editModal.data" @refreshList="refreshList"/>
      </div>
    </t-dialog>

  </div>
</template>

<script>
import { resetObj, filterObj } from "@/util/tool.js";
import { list, del } from "@/network/dict.js"
import { Edit, Delete, AddOne } from "@icon-park/vue";
import editForm from "@/views/Admin/DictManage/edit.vue";
export default {
  name: "Admin-Dict-list",
  props: {},
  components: {
    Edit, Delete, AddOne,
    editForm
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
        dict_type_name: undefined,
      },
      dictList: {
        data: undefined,
        columns: [
          { colKey: 'row-select', type: 'multiple', width: 20, align: 'center'},
          { title: 'ID', colKey: 'id', width: 30, align: 'center'},
          { title: '字典分类', colKey: 'dict_type' , width: 100, align: 'center'},
          { title: '字典分类名称', colKey: 'dict_type_name', width: 100, align: 'center'},
          { title: '显示内容', colKey: 'name', width: 70, align: 'center'},
          { title: '字典值', colKey: 'value', width: 70, align: 'center'},
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

      editModal: {
        title: "字典编辑",
        visible: false,
        type: undefined,
        data: undefined
      },

      resizeObserver: undefined
    }
  },
  methods: {

    listSearchDomChange() {
      this.resizeObserver = new ResizeObserver(entries => {
        let searchHeight = entries[0].borderBoxSize[0].blockSize;
        this.dictList.tableHeight = 905 - 40 - 40 - 64 - searchHeight - 8;

      })
      this.resizeObserver.observe(this.$refs.search);
    },

    // 表格行选择
    tableSelectChange(val, ctx) {
      this.dictList.selectedRowKeys = val;
      // console.log(keys);
    },

    // 获取字典列表
    getDictList() {
      list(this.dictList_params).then(res => {
        if (res.code === 200) {
          this.page.total = res.data.count;
          this.dictList.data = res.data.rows;
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
      this.getDictList();
    },

    // 页面条数改变
    limitsChange(page, pageSize) {
      this.page.offset = 1;
      this.page.limits = pageSize;
      this.getDictList();
    },

    onReset() {
      resetObj(this.searchData);
      this.page.offset = 1;
      this.page.limits = 10;
      this.getDictList();
    },
    onSubmit() {
      this.page.offset = 1;
      this.page.limits = 10;
      this.getDictList();
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
          this.getDictList();
        }else{
          this.$message.error('删除失败');
        }
        this.delConfirm.visible = false;
      })
    },

    gotoDictEdit(type, row) {
      this.editModal.type = type;
      this.editModal.visible = true;
      if (type === 'add') {
        this.editModal.title = '添加字典';
      }else if (type === 'edit') {
        this.editModal.title = '编辑字典';
        this.editModal.data = row;
      }
    },
    refreshList(){
      this.editModal = {
        title: "字典编辑",
        visible: false,
        type: undefined,
        data: undefined
      },
      this.getDictList();
    }
  },
  mounted() {
    this.getDictList();
    this.$nextTick(() => {
      this.listSearchDomChange();
    })
  },
  watch: {},
  computed: {
    dictList_params: function() {
      return {
        search: JSON.stringify(filterObj(this.searchData)),
        offset: this.page.offset,
        limits: this.page.limits,
      }
    },

    del_data: function () {
      if (this.delConfirm.type === 'multiple') {
        return {
          id: this.dictList.selectedRowKeys
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
  #Admin-Dict-list {
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