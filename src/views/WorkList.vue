<template>
    <div class="work-list">
        <el-card>
            <template #header>
                <div class="card-header">
                    <div class="header-left">
                        <h3>作品列表</h3>
                        <el-tag type="info">共 {{ workList.length }} 个作品</el-tag>
                    </div>
                    <el-button type="primary" @click="$router.push('/work/add')">
                        <el-icon>
                            <Plus />
                        </el-icon>添加作品
                    </el-button>
                </div>
            </template>

            <!-- 添加排序和筛选工具栏 -->
            <div class="table-toolbar">
                <div class="toolbar-left">
                    <el-input v-model="searchKeyword" placeholder="搜索作品标题" style="width: 200px" clearable>
                        <template #prefix>
                            <el-icon>
                                <Search />
                            </el-icon>
                        </template>
                    </el-input>
                </div>
                <div class="toolbar-right">
                    <el-select v-model="sortBy" placeholder="排序方式" style="width: 150px">
                        <el-option v-for="option in sortOptions" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </div>
            </div>

            <el-table :data="filteredWorkList" style="width: 100%" v-loading="loading" border stripe>
                <el-table-column label="缩略图" width="150">
                    <template #default="scope">
                        <div v-if="scope.row.thumbnail && scope.row.thumbnail.length > 0" class="thumbnail-container">
                            <el-image :src="getImageUrl(scope.row.thumbnail[0])" fit="cover"
                                :preview-src-list="getPreviewImages(scope.row.thumbnail)" class="thumbnail-image"
                                @error="handleImageError">
                                <template #error>
                                    <div class="image-error">
                                        <el-icon>
                                            <Picture />
                                        </el-icon>
                                        <span>加载失败</span>
                                    </div>
                                </template>
                            </el-image>
                        </div>
                        <div v-else class="no-image">
                            <el-icon>
                                <Picture />
                            </el-icon>
                            <span>无图片</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="title" label="标题" min-width="180" />

                <el-table-column prop="theme" label="主题" width="120" align="center">
                    <template #default="{ row }">
                        <el-tag type="success" effect="dark">{{ row.theme }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="features" label="技术特点" min-width="200">
                    <template #default="{ row }">
                        <el-tag v-for="feature in row.features" :key="feature" type="info" effect="plain"
                            class="feature-tag">
                            {{ feature }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="price" label="价格" width="100" align="center">
                    <template #default="{ row }">
                        <span class="price">¥{{ row.price }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="pageCount" label="页数" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag type="info" effect="plain">{{ row.pageCount }}页</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" fixed="right" align="center">
                    <template #default="{ row }">
                        <el-button-group>
                            <el-button type="primary" @click="handleEdit(row)" :icon="Edit">
                                编辑
                            </el-button>
                            <el-button type="danger" @click="handleDelete(row)" :icon="Delete">
                                删除
                            </el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 修改分页器 -->
            <div class="pagination-container">
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 编辑对话框 -->
        <el-dialog v-model="editDialogVisible" title="编辑作品" width="60%" :before-close="handleDialogClose"
            destroy-on-close>
            <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="100px">
                <el-form-item label="作品标题" prop="title">
                    <el-input v-model="editForm.title" />
                </el-form-item>

                <el-form-item label="技术特点" prop="features">
                    <el-select v-model="editForm.features" multiple placeholder="请选择技术特点" style="width: 100%"
                        :collapse-tags="false" filterable>
                        <el-option v-for="item in featureOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="价格" prop="price">
                    <el-input-number v-model="editForm.price" :min="0" />
                </el-form-item>

                <el-form-item label="页数" prop="pageCount">
                    <el-input-number v-model="editForm.pageCount" :min="1" />
                </el-form-item>

                <el-form-item label="主题" prop="theme">
                    <el-select v-model="editForm.theme" placeholder="请选择主题" style="width: 100%">
                        <el-option v-for="item in themeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="缩略图">
                    <el-upload class="upload-demo" :show-file-list="true" :before-upload="beforeUpload"
                        :http-request="customUpload" multiple list-type="picture-card" :on-remove="handleRemove">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleUpdate" :loading="updating">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import { ref, onMounted, reactive, computed, watch } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { Edit, Delete, Picture, Plus, Search } from '@element-plus/icons-vue'
    import axios from 'axios'
    import config from '../../config.js'

    const loading = ref(false)
    const updating = ref(false)
    const workList = ref([])
    const editDialogVisible = ref(false)
    const editFormRef = ref(null)
    const themeOptions = ref([])
    const featureOptions = ref([])

    const editForm = reactive({
        id: '',
        title: '',
        thumbnails: [],
        features: [],
        price: 0,
        pageCount: 1,
        theme: ''
    })

    const rules = {
        title: [{ required: true, message: '请输入作品标题', trigger: 'blur' }],
        theme: [{ required: true, message: '请选择主题', trigger: 'change' }],
        features: [{ type: 'array', message: '请选择技术特点', trigger: 'change' }],
        price: [{ type: 'number', required: true, message: '请输入价格', trigger: 'blur' }],
        pageCount: [{ type: 'number', required: true, message: '请输入页数', trigger: 'blur' }]
    }

    const searchKeyword = ref('')
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const sortBy = ref('')

    const sortOptions = [
        { label: '默认排序', value: '' },
        { label: '价格从低到高', value: 'priceAsc' },
        { label: '价格从高到低', value: 'priceDesc' }
    ]

    // 过滤后的作品列表
    const filteredWorkList = computed(() => {
        const keyword = searchKeyword.value.toLowerCase()
        return workList.value.filter(work =>
            work.title.toLowerCase().includes(keyword) ||
            work.theme.toLowerCase().includes(keyword) ||
            work.features.some(feature => feature.toLowerCase().includes(keyword))
        )
    })

    // 分页处理
    const handleSizeChange = (val) => {
        pageSize.value = val
        currentPage.value = 1
        fetchWorkList()
    }

    const handleCurrentChange = (val) => {
        currentPage.value = val
        fetchWorkList()
    }

    // 获取作品列表
    const fetchWorkList = async () => {
        loading.value = true
        try {
            const params = {
                page: currentPage.value,
                pageSize: pageSize.value
            }

            // 添加排序参数
            if (sortBy.value) {
                params.sortBy = sortBy.value
            }

            const res = await axios.get('/api/works', { params })

            // 更新数据
            workList.value = res.data.data.works
            total.value = res.data.data.total

            console.log('总页数:', res.data.data.totalPages)
            console.log('当前页:', res.data.data.currentPage)

        } catch (error) {
            ElMessage.error('获取作品列表失败：' + error.message)
        } finally {
            loading.value = false
        }
    }

    // 监听排序变化
    watch(sortBy, () => {
        currentPage.value = 1  // 重置页码
        fetchWorkList()
    })

    // 获取主题列表
    const fetchThemes = async () => {
        try {
            const res = await axios.get('/api/admin/themes')
            themeOptions.value = res.data.data.map(theme => ({
                label: theme,
                value: theme
            }))
        } catch (error) {
            ElMessage.error('获取主题列表失败：' + error.message)
        }
    }

    // 获取特点列表
    const fetchFeatures = async () => {
        try {
            const res = await axios.get('/api/admin/features')
            featureOptions.value = res.data.data.map(feature => ({
                label: feature,
                value: feature
            }))
        } catch (error) {
            ElMessage.error('获取特点列表失败：' + error.message)
        }
    }

    // 处理编辑
    const handleEdit = (row) => {
        Object.assign(editForm, row)
        editDialogVisible.value = true
    }

    // 处理删除
    const handleDelete = async (row) => {
        try {
            await ElMessageBox.confirm(`确定要删除作品"${row.title}"吗？`, '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            })

            await axios.delete(`/api/admin/works/${row.id}`)
            ElMessage.success('删除成功')
            fetchWorkList()
        } catch (error) {
            if (error === 'cancel') return
            ElMessage.error('删除失败：' + error.message)
        }
    }

    // 处理更新
    const handleUpdate = async () => {
        if (!editFormRef.value) return

        await editFormRef.value.validate(async (valid) => {
            if (valid) {
                updating.value = true
                try {
                    await axios.put(`/api/admin/works/${editForm.id}`, editForm)
                    ElMessage.success('更新成功')
                    editDialogVisible.value = false
                    fetchWorkList()
                } catch (error) {
                    ElMessage.error('更新失败：' + error.message)
                } finally {
                    updating.value = false
                }
            }
        })
    }

    // 处理对话框关闭
    const handleDialogClose = (done) => {
        ElMessageBox.confirm('确认关闭？未保存的修改将会丢失')
            .then(() => {
                done()
            })
            .catch(() => { })
    }

    // 处理图片上传
    const customUpload = async (options) => {
        try {
            const formData = new FormData()
            formData.append('files[]', options.file)

            const res = await axios.post('/api/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (res.data.status === 200 && res.data.data.length > 0) {
                const uploadedFile = res.data.data[0]
                editForm.thumbnails.push(uploadedFile.fileUrl)
                ElMessage.success('上传成功')
                options.onSuccess()
            } else {
                throw new Error(res.data.message || '上传失败')
            }
        } catch (error) {
            options.onError(error)
            ElMessage.error('上传失败：' + error.message)
        }
    }

    // 处理图片删除
    const handleRemove = (file) => {
        const index = editForm.thumbnails.indexOf(file.url)
        if (index > -1) {
            editForm.thumbnails.splice(index, 1)
        }
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

    onMounted(() => {
        fetchWorkList()
        fetchThemes()
        fetchFeatures()
    })
</script>

<style scoped>
    .work-list {
        height: 100%;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .header-left h3 {
        margin: 0;
        font-size: 18px;
    }

    .table-toolbar {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .toolbar-left {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    .toolbar-right {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    .feature-tag {
        margin: 2px;
    }

    .image-error,
    .no-image {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background-color: #f5f7fa;
        color: #909399;
        border-radius: 4px;
    }

    .image-error i,
    .no-image i {
        font-size: 24px;
        margin-bottom: 5px;
    }

    .price {
        color: #f56c6c;
        font-weight: bold;
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }

    :deep(.el-button-group) {
        display: flex;
        gap: 4px;
    }

    :deep(.el-table) {
        margin: 16px 0;
    }

    :deep(.el-table th) {
        background-color: #f5f7fa;
    }

    :deep(.el-dialog__body) {
        padding: 20px 40px;
    }

    .thumbnail-container {
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 4px;
    }

    .thumbnail-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>