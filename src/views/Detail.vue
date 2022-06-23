<template>
  <el-page-header title="返回" :content="title" @back="goBack" style="margin:0.8rem 0"/>
  <el-dialog v-model="deleteDialog" title="删除确认" center>
    <span
    >你确定要删除这条数据吗？此操作不能逆。</span
    >
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmDelete"
        >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
  <el-container v-loading="loading">
    <el-header>
      <el-row>
        <el-col :span="12" class="row">
          生效
        </el-col>
        <el-col :span="12">
          <el-switch
              v-model="data.listen"
          />
        </el-col>
      </el-row>
    </el-header>
    <el-divider/>
    <el-main>
      <el-form :model="data" label-width="5rem">
        <el-form-item label="关键字">
          <el-input v-model="data.text"/>
        </el-form-item>
        <el-form-item label="使用相似">
          <el-switch
              v-model="data.useLike"
          />
        </el-form-item>
        <el-form-item v-if="data.useLike" label="相似度">
          <el-input v-model="data.like"/>
        </el-form-item>
        <el-form-item v-if="!data.useLike" label="匹配规则">
          <el-select v-model="data.match" placeholder="请选择规则">
            <el-option label="相等" value="EQ"/>
            <el-option label="包含" value="IN"/>
          </el-select>
        </el-form-item>
        <el-form-item label="消息回复">
          <el-switch v-model="data.send"/>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input v-model="data.sendMessage" :disabled="!data.send" type="textarea"/>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button v-if="!isAdd" type="danger" @click="onDelete" style="margin-right: 1rem">删除</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="!edit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import {getCurrentInstance, watch, reactive, ref, onBeforeMount} from 'vue'
import {ElMessage} from 'element-plus'

const title = ref("")
const loading = ref(true)
const edit = ref(false)
const isAdd = ref(false)
const deleteDialog = ref(false)
const {proxy} = getCurrentInstance()
const data = reactive({
  listen: false,
  text: '',
  like: 0.6,
  useLike: true,
  id: -1,
  match: 'IN',
  send: false,
  sendMessage: ''
});
const startLoading = () => {
  loading.value = true;
}
const endLoading = () => {
  loading.value = false;
}
onBeforeMount(() => {
  isAdd.value = proxy.$route.params.id === '-'
  title.value = isAdd.value ? "添加" : "修改"
  if (!isAdd.value) {
    proxy.$axios.get(`/api/info/${proxy.$route.params.id}`).then(response => {
      console.log('detail info', response.data);
      Object.assign(data, response.data.data);
      endLoading();
      watch(data, (newValue, oldValue) => {
        console.log('change', newValue, oldValue)
        edit.value = true;
      })
    })
  } else {
    watch(data, (newValue, oldValue) => {
      console.log('change', newValue, oldValue)
      edit.value = true;
    })
    endLoading();
  }
})
const onSubmit = () => {
  startLoading();
  if (isAdd.value) {
    proxy.$axios.post(`/api/info/add`, data).then(response => {
      console.log('add info', response.data);
      endLoading();
      ElMessage({
        message: `${title.value}成功`,
        type: 'success',
      })
      proxy.$router.push('/');
    })
  } else {
    proxy.$axios.post(`/api/info/${proxy.$route.params.id}`, data).then(response => {
      console.log('update info', response.data);
      endLoading();
      ElMessage({
        message: `${title.value}成功`,
        type: 'success',
      })
      edit.value = false;
    })
  }
}
const onDelete = () => {
  deleteDialog.value = true;
}
const confirmDelete = () => {
  startLoading();
  proxy.$axios.post(`/api/info/delete/${proxy.$route.params.id}`).then(response => {
    console.log('delete info', response.data);
    endLoading();
    ElMessage({
      message: `删除成功`,
      type: 'success',
    })
    deleteDialog.value = false;
    proxy.$router.push('/');
  })
}
const goBack = () => {
  proxy.$router.push('/')
}
</script>

<style lang="scss" scoped>
.row {
  line-height: 32px;
}
</style>