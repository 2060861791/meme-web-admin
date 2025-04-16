<template>
  <div class="work-add">
    <el-row :gutter="20">
      <!-- 左侧表单 -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>添加作品</span>
              <el-button type="primary" @click="$router.push('/work/list')">
                <el-icon><List /></el-icon>
                查看作品列表
              </el-button>
            </div>
          </template>

          <el-form :model="workForm" :rules="rules" ref="workFormRef" label-width="100px">
            <el-form-item label="作品标题" prop="title">
              <el-input v-model="workForm.title" />
            </el-form-item>

            <el-form-item label="缩略图" prop="thumbnail">
              <div class="thumbnail-container">
                <el-upload 
                    class="thumbnail-uploader" 
                    :show-file-list="true"
                    :before-upload="beforeUpload"
                    :http-request="customUpload"
                    multiple
                    :limit="10"
                    list-type="picture-card"
                    :on-exceed="handleExceed"
                    :on-remove="handleRemove"
                >
                    <div class="upload-trigger">
                        <el-icon class="upload-icon"><Plus /></el-icon>
                        <div class="el-upload__text">点击上传</div>
                    </div>
                </el-upload>
                <div class="upload-info">
                    <div class="upload-tip">
                        <p>支持 jpg、png 格式，大小不超过 5MB</p>
                        <p>建议尺寸：800x600px</p>
                        <p>可以选择多张图片上传</p>
                    </div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="技术特点" prop="features">
              <el-select 
                  v-model="workForm.features" 
                  multiple 
                  placeholder="请选择技术特点" 
                  style="width: 100%" 
                  :collapse-tags="false"
                  filterable
              >
                  <el-option 
                      v-for="item in featureOptions" 
                      :key="item.value" 
                      :label="item.label" 
                      :value="item.value" 
                  />
              </el-select>
            </el-form-item>

            <el-form-item label="价格" prop="price">
              <el-input-number v-model="workForm.price" :min="0" />
            </el-form-item>

            <el-form-item label="页数" prop="pages">
              <el-input-number v-model="workForm.pages" :min="1" />
            </el-form-item>

            <el-form-item label="主题" prop="theme">
              <el-select 
                  v-model="workForm.theme" 
                  placeholder="请选择主题" 
                  style="width: 100%"
                  :popper-append-to-body="false"
              >
                  <el-option 
                      v-for="item in themeOptions" 
                      :key="item.value" 
                      :label="item.label" 
                      :value="item.value" 
                  />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="loading">
                提交
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧预览 -->
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>预览效果</span>
            </div>
          </template>

          <el-card class="preview-card" shadow="hover">
            <div class="work-thumbnail">
              <img 
                  :src="previewImage" 
                  alt="thumbnail" 
              />
              <div class="work-theme" v-if="workForm.theme">
                  <el-tag size="small" effect="dark" type="success">
                      {{ getThemeLabel(workForm.theme) }}
                  </el-tag>
              </div>
            </div>
            <div class="work-content">
              <h3 class="work-title" :title="workForm.title">
                {{ workForm.title || '作品标题' }}
              </h3>
              <div class="work-features">
                <el-tag v-for="feature in workForm.features" :key="feature" size="small" type="info" effect="plain"
                  class="feature-tag">
                  {{ getFeatureLabel(feature) }}
                </el-tag>
              </div>
              <div class="work-footer">
                <div class="work-meta">
                  <el-tag size="small" type="warning" effect="plain">
                    <el-icon>
                      <Document />
                    </el-icon>
                    <span>{{ workForm.pages }}页</span>
                  </el-tag>
                </div>
                <div class="price">￥{{ workForm.price }}</div>
              </div>
            </div>
          </el-card>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加主题和技术特点的对话框 -->
    <el-dialog v-model="dialogVisible" title="管理主题和技术特点" width="80%" :before-close="handleDialogClose">
      <theme-and-features />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, computed } from 'vue'
  import { ElMessage, ElLoading, ElNotification, ElMessageBox } from 'element-plus'
  import axios from 'axios'
  import ThemeAndFeatures from '../components/ThemeAndFeatures.vue'
  import { useRouter } from 'vue-router'
  // 导入配置
  import config from '../../config.js'
  // 添加图标导入
  import { List } from '@element-plus/icons-vue'

  const loading = ref(false)
  const workFormRef = ref(null)

  const workForm = reactive({
    title: '',
    thumbnail: [],
    features: [],
    price: 0,
    pages: 1,
    theme: ''
  })

  const featureOptions = ref([])
  const themeOptions = ref([])

  const rules = {
    title: [{ required: true, message: '请输入作品标题', trigger: 'blur' }],
    theme: [{ required: true, message: '请选择主题', trigger: 'change' }],
    features: [{ type: 'array', message: '请选择技术特点', trigger: 'change' }],
    price: [{ type: 'number', required: true, message: '请输入价格', trigger: 'blur' }],
    pages: [{ type: 'number', required: true, message: '请输入页数', trigger: 'blur' }]
  }

  const handleSubmit = async () => {
    if (!workFormRef.value) return

    await workFormRef.value.validate(async (valid) => {
        if (valid) {
            if (!workForm.thumbnail || workForm.thumbnail.length === 0) {
                ElMessage.warning('请至少上传一张图片')
                return
            }

            loading.value = true
            try {
                const submitData = {
                    title: workForm.title,
                    thumbnails: workForm.thumbnail,
                    price: Number(workForm.price),
                    pageCount: Number(workForm.pages),
                    theme: workForm.theme,
                    features: workForm.features || []
                }

                console.log('提交数据:', submitData)

                const res = await axios.post('/api/admin/works', submitData)
                if (res.data.status === 200) {
                    ElMessage.success(res.data.message || '添加成功')
                    resetForm()
                } else {
                    throw new Error(res.data.message || '添加失败')
                }
            } catch (error) {
                console.error('提交失败:', error)
                ElMessage.error('添加失败：' + (error.response?.data?.message || error.message))
            } finally {
                loading.value = false
            }
        }
    })
  }

  const resetForm = () => {
    if (workFormRef.value) {
        workFormRef.value.resetFields()
        workForm.thumbnail = []
    }
  }

  // 添加工具函数用于获取标签文本
  const getThemeLabel = (value) => {
    return value
  }

  const getFeatureLabel = (value) => {
    return value
  }

  // 上传前验证
  const beforeUpload = (file) => {
    const isValidType = config.upload.allowedTypes.includes(file.type)
    const isLtSize = file.size / 1024 / 1024 < config.upload.maxSize

    if (!isValidType) {
        ElMessage.error(`图片只能是 ${config.upload.allowedTypes.join('/')} 格式!`)
        return false
    }
    if (!isLtSize) {
        ElMessage.error(`图片大小不能超过 ${config.upload.maxSize}MB!`)
        return false
    }
    return true
  }

  // 在 script setup 中添加一个用于本地预览的方法
  const createLocalPreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      reader.readAsDataURL(file)
    })
  }

  // 修改 customUpload 方法
  const customUpload = async (options) => {
    try {
        const formData = new FormData()
        formData.append('files', options.file)
        
        const loadingInstance = ElLoading.service({
            text: '图片上传中...',
            background: 'rgba(0, 0, 0, 0.7)'
        })

        try {
            const token = localStorage.getItem('token')
            if (!token) {
                throw new Error('未登录或登录已过期')
            }

            const res = await axios.post('/api/admin/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentage = (progressEvent.loaded / progressEvent.total) * 100
                    console.log(`上传进度: ${Math.round(percentage)}%`)
                }
            })

            console.log('Upload response:', res.data)

            if (res.data.status === 200 && res.data.data.length > 0) {
                const uploadedFile = res.data.data[0]
                if (!Array.isArray(workForm.thumbnail)) {
                    workForm.thumbnail = []
                }
                workForm.thumbnail.push(uploadedFile.fileUrl)
                
                ElMessage({
                    message: '上传成功',
                    type: 'success',
                    duration: 2000
                })

                options.onSuccess({
                    url: uploadedFile.fileUrl,
                    ...uploadedFile
                })
            } else {
                throw new Error(res.data.message || '上传失败')
            }
        } catch (error) {
            console.error('Upload failed:', error)
            console.error('Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            })
            options.onError(error)
            ElMessage.error(error.response?.data?.message || '上传失败，请检查网络连接或稍后重试')
        } finally {
            loadingInstance.close()
        }
    } catch (error) {
        console.error('File handling error:', error)
        options.onError(error)
        ElMessage.error('文件处理失败')
    }
  }

  // 修改预览图片的计算属性
  const previewImage = computed(() => {
    // 如果有上传的图片，显示第一张
    if (Array.isArray(workForm.thumbnail) && workForm.thumbnail.length > 0) {
        // 如果路径已经包含完整的URL，直接使用
        if (workForm.thumbnail[0].startsWith('http')) {
            return workForm.thumbnail[0]
        }
        // 否则拼接服务器地址
        return `${config.server.uploadURL}${workForm.thumbnail[0]}`
    }
    // 使用默认的占位图片
    return new URL('../assets/placeholder.png', import.meta.url).href
  })

  // 删除图片
  const removeImage = () => {
    ElMessageBox.confirm(
      '确定要删除已上传的图片吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      workForm.thumbnail = ''
      ElMessage.success('图片已删除')
    })
  }

  // 添加对话框相关的代码
  const dialogVisible = ref(false)

  const showThemeFeatureDialog = () => {
    dialogVisible.value = true
  }

  const handleDialogClose = (done) => {
    // 关闭对话框时刷新主题和特点的选项
    fetchThemes()
    fetchFeatures()
    done()
  }

  // 修改原有的 fetchThemes 和 fetchFeatures 方法，确保它们在组件中可用
  const fetchThemes = async () => {
    try {
      const res = await axios.get('/api/admin/themes')
      if (Array.isArray(res.data.data)) {
        // 直接使用返回的字符串作为 value 和 label
        themeOptions.value = res.data.data.map(theme => ({
          value: theme,
          label: theme
        }))
        console.log('Themes loaded:', themeOptions.value) // 添加调试日志
      }
    } catch (error) {
      if (error.response?.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
        return
      }
      ElMessage.error('获取主题列表失败：' + error.message)
    }
  }

  const fetchFeatures = async () => {
    try {
      const res = await axios.get('/api/admin/features')
      if (Array.isArray(res.data.data)) {
        // 直接使用返回的字符串作为 value 和 label
        featureOptions.value = res.data.data.map(feature => ({
          value: feature,
          label: feature
        }))
        console.log('Features loaded:', featureOptions.value) // 添加调试日志
      }
    } catch (error) {
      if (error.response?.status === 401) {
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
        return
      }
      ElMessage.error('获取特点列表失败：' + error.message)
    }
  }

  // 添加处理超出限制的方法
  const handleExceed = (files, uploadFiles) => {
    ElMessage.warning(
        `最多只能上传 ${config.upload.maxCount} 张图片，本次选择了 ${files.length} 张图片，共选择了 ${files.length + uploadFiles.length} 张图片`
    )
  }

  // 在组件挂载时获取最新的主题和特点列表
  onMounted(() => {
    fetchThemes()
    fetchFeatures()
  })

  // 修改 handleRemove 方法，确保正确处理图片路径
  const handleRemove = (file) => {
    const fileUrl = file.url || file
    const index = workForm.thumbnail.findIndex(url => {
        // 处理完整URL和相对路径的情况
        return url === fileUrl || url === fileUrl.replace(config.server.uploadURL, '')
    })
    if (index > -1) {
        workForm.thumbnail.splice(index, 1)
    }
  }
</script>

<style scoped>
  .work-add {
    height: 100%;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 预览卡片样式 */
  .preview-card {
    margin-bottom: 20px;
  }

  .work-thumbnail {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 4px;
    background-color: #f5f7fa;
  }

  .work-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.3s ease;
    display: block;
  }

  .work-theme {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .work-content {
    padding: 15px 0;
  }

  .work-title {
    margin: 0 0 10px;
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .work-features {
    margin-bottom: 15px;
  }

  .feature-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }

  .work-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .work-meta {
    display: flex;
    gap: 10px;
  }

  .price {
    font-size: 18px;
    color: #f56c6c;
    font-weight: bold;
  }

  .thumbnail-container {
    width: 100%;
  }

  .thumbnail-uploader {
    width: 100%;
  }

  .upload-trigger {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .thumbnail-uploader :deep(.el-upload--picture-card) {
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
  }

  .thumbnail-uploader :deep(.el-upload-list--picture-card) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .thumbnail-uploader :deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 148px;
    height: 148px;
    margin: 0;
  }

  .thumbnail-uploader :deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload-icon {
    font-size: 28px;
    color: #8c939d;
    margin-bottom: 8px;
  }

  .el-upload__text {
    color: #8c939d;
    font-size: 14px;
  }

  .upload-tip {
    color: #909399;
    font-size: 12px;
    line-height: 1.5;
  }

  .preview-wrapper {
    position: relative;
    width: 200px;
    height: 200px;
  }

  .preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
    color: white;
  }

  .preview-wrapper:hover .preview-overlay {
    opacity: 1;
  }

  .preview-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .upload-placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #8c939d;
  }

  .upload-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .preview-actions {
    display: flex;
    gap: 15px;
  }

  .delete-btn {
    color: #f56c6c;
  }

  .delete-btn:hover {
    color: #f78989;
  }

  :deep(.image-preview-dialog) {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-message-box__content {
      text-align: center;
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }
</style>