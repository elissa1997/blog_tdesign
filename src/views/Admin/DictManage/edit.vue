<template>
  <div id="Admin-Dict-Edit">
    <t-form
      :data="editForm"
      ref="editForm"
      @submit="onSubmit"
      @reset="onReset"
    >
      <t-form-item label="字典分类" name="dict_type">
        <t-input v-model="editForm.dict_type" placeholder="请输入内容" />
      </t-form-item>

      <t-form-item label="字典分类名称" name="dict_type_name">
        <t-input v-model="editForm.dict_type_name" placeholder="请输入内容" />
      </t-form-item>

      <t-form-item label="显示内容" name="name">
        <t-input v-model="editForm.name" placeholder="请输入内容" />
      </t-form-item>

      <t-form-item label="字典值" name="value">
        <t-input-number v-model="editForm.value" />
      </t-form-item>

      <t-form-item style="margin-left: 100px">
        <t-space size="10px">
          <t-button theme="primary" type="submit">提交</t-button>
          <t-button theme="default" variant="base" type="reset">重置</t-button>
        </t-space>
      </t-form-item>

    </t-form>

  </div>
</template>

<script>
import { resetObj, filterObj } from "@/util/tool.js";
import { add, update } from "@/network/dict.js"
export default {
  name: "Admin-Dict-Edit",
  props: {
    type: {
      type: String,
      default: 'add'
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
  },
  data() {
    return {
      editForm: {
        dict_type: undefined,
        dict_type_name: undefined,
        name: undefined,
        value: undefined
      }
    }
  },
  methods: {
    initData() {
      if (this.type === 'edit') {
        this.editForm['id'] = undefined;
        Object.keys(this.editForm).forEach(key => {
          if (this.data.hasOwnProperty(key)) {
            this.editForm[key] = this.data[key];
          }
        });
      }
    },
    onReset() {
      resetObj(this.editForm);
    },
    onSubmit() {
      Object.keys(this.editForm).forEach(key => {
          if (this.data.hasOwnProperty(key)) {
            if(!this.editForm[key]){
              this.$message.error(`表单不能为空`);
            }
          }
      });
      if (this.type === 'add') {
        add(this.editForm).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功');
            this.$emit('refreshList');
          }
        })
      }else if (this.type === 'edit') {
        update(this.editForm).then(res => {
          if (res.code === 200) {
            this.$message.success('修改成功');
            this.$emit('refreshList');
          }
        })
      }
    },
  },
  mounted() {
    this.initData();
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
  #Admin-Dict-Edit {
    
  }
</style>