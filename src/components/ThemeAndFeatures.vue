<template>
    <div class="theme-features-manager">
        <el-row :gutter="20">
            <!-- 左侧功能区 -->
            <el-col :span="16">
                <el-card class="feature-tabs">
                    <el-tabs v-model="activeTab">
                        <!-- 主题管理标签页 -->
                        <el-tab-pane label="主题管理" name="theme">
                            <div class="manage-section">
                                <el-input v-model="themeForm.label" placeholder="请输入主题名称" class="input-with-button">
                                    <template #append>
                                        <el-button type="primary" @click="addTheme">
                                            <el-icon>
                                                <Plus />
                                            </el-icon>
                                            添加主题
                                        </el-button>
                                    </template>
                                </el-input>

                                <div class="theme-list">
                                    <el-card v-for="theme in themeList" :key="theme.value" class="theme-item"
                                        shadow="hover">
                                        <div class="theme-content">
                                            <span class="theme-label">{{ theme.label }}</span>
                                            <div class="theme-actions">
                                                <el-button type="danger" link @click="deleteTheme(theme)">
                                                    <el-icon>
                                                        <Delete />
                                                    </el-icon>
                                                </el-button>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                            </div>
                        </el-tab-pane>

                        <!-- 技术特点管理标签页 -->
                        <el-tab-pane label="技术特点管理" name="features">
                            <div class="manage-section">
                                <el-input v-model="featureForm.label" placeholder="请输入技术特点名称" class="input-with-button">
                                    <template #append>
                                        <el-button type="primary" @click="addFeature">
                                            <el-icon>
                                                <Plus />
                                            </el-icon>
                                            添加特点
                                        </el-button>
                                    </template>
                                </el-input>

                                <div class="feature-list">
                                    <el-card v-for="feature in featureList" :key="feature.value" class="feature-item"
                                        shadow="hover">
                                        <div class="feature-content">
                                            <span class="feature-label">{{ feature.label }}</span>
                                            <div class="feature-actions">
                                                <el-button type="danger" link @click="deleteFeature(feature)">
                                                    <el-icon>
                                                        <Delete />
                                                    </el-icon>
                                                </el-button>
                                            </div>
                                        </div>
                                    </el-card>
                                </div>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </el-col>

            <!-- 右侧预览区 -->
            <el-col :span="8">
                <el-card class="preview-card">
                    <template #header>
                        <div class="preview-header">
                            <span>预览效果</span>
                        </div>
                    </template>

                    <div class="preview-section">
                        <h3>已添加的主题</h3>
                        <div class="theme-tags">
                            <template v-if="themeList.length > 0">
                                <el-tag v-for="theme in themeList" :key="theme.value" class="theme-tag" type="success"
                                    effect="dark">
                                    {{ theme.label }}
                                </el-tag>
                            </template>
                            <div v-else class="empty-text">
                                暂无主题
                            </div>
                        </div>

                        <el-divider />

                        <h3>已添加的技术特点</h3>
                        <div class="feature-tags">
                            <template v-if="featureList.length > 0">
                                <el-tag v-for="feature in featureList" :key="feature.value" class="feature-tag"
                                    type="info" effect="plain">
                                    {{ feature.label }}
                                </el-tag>
                            </template>
                            <div v-else class="empty-text">
                                暂无技术特点
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { Plus, Delete } from '@element-plus/icons-vue'
    import axios from 'axios'
    import { useRouter } from 'vue-router'

    const activeTab = ref('theme')
    const themeList = ref([])
    const featureList = ref([])

    const themeForm = reactive({
        label: '',
        value: ''
    })

    const featureForm = reactive({
        label: '',
        value: ''
    })

    const router = useRouter()

    // 修改 generateValue 函数
    const generateValue = (label) => {
        return label.trim()  // 直接使用 label 作为 value，因为后端 API 只需要 value
    }

    // 修改 addTheme 方法
    const addTheme = async () => {
        if (!themeForm.label.trim()) {
            ElMessage.warning('请输入主题名称')
            return
        }

        // 检查是否已存在相同的主题
        if (themeList.value.some(theme => theme.label === themeForm.label.trim())) {
            ElMessage.warning('该主题已存在')
            return
        }

        try {
            const submitData = {
                value: themeForm.label.trim()  // 直接使用输入的文本作为 value
            }
            await axios.post('/api/admin/themes', submitData)
            ElMessage.success('添加主题成功')
            await fetchThemes()  // 使用 await 确保列表更新
            themeForm.label = ''
        } catch (error) {
            if (error.response?.status === 401) {
                ElMessage.error('登录已过期，请重新登录')
                router.push('/login')
                return
            }
            ElMessage.error('添加主题失败：' + (error.response?.data?.message || error.message))
        }
    }

    // 修改 addFeature 方法
    const addFeature = async () => {
        if (!featureForm.label.trim()) {
            ElMessage.warning('请输入技术特点名称')
            return
        }

        // 检查是否已存在相同的特点
        if (featureList.value.some(feature => feature.label === featureForm.label.trim())) {
            ElMessage.warning('该技术特点已存在')
            return
        }

        try {
            const submitData = {
                value: featureForm.label.trim()  // 直接使用输入的文本作为 value
            }
            await axios.post('/api/admin/features', submitData)
            ElMessage.success('添加技术特点成功')
            await fetchFeatures()  // 使用 await 确保列表更新
            featureForm.label = ''
        } catch (error) {
            if (error.response?.status === 401) {
                ElMessage.error('登录已过期，请重新登录')
                router.push('/login')
                return
            }
            ElMessage.error('添加技术特点失败：' + (error.response?.data?.message || error.message))
        }
    }

    // 修改获取主题列表的方法
    const fetchThemes = async () => {
        try {
            const res = await axios.get('/api/admin/themes')
            // 后端返回的是字符串数组，需要转换成对象数组
            if (Array.isArray(res.data.data)) {
                themeList.value = res.data.data.map(theme => ({
                    label: theme,  // 使用字符串作为 label
                    value: theme   // 使用字符串作为 value
                }))
            } else {
                console.error('Invalid themes data format:', res.data)
                ElMessage.error('获取主题列表失败：数据格式错误')
            }
        } catch (error) {
            if (error.response?.status === 401) {
                ElMessage.error('登录已过期，请重新登录')
                router.push('/login')
                return
            }
            console.error('Fetch themes error:', error)
            ElMessage.error('获取主题列表失败：' + (error.response?.data?.message || error.message))
        }
    }

    // 修改获取特点列表的方法
    const fetchFeatures = async () => {
        try {
            const res = await axios.get('/api/admin/features')
            // 后端返回的是字符串数组，需要转换成对象数组
            if (Array.isArray(res.data.data)) {
                featureList.value = res.data.data.map(feature => ({
                    label: feature,  // 使用字符串作为 label
                    value: feature   // 使用字符串作为 value
                }))
            } else {
                console.error('Invalid features data format:', res.data)
                ElMessage.error('获取特点列表失败：数据格式错误')
            }
        } catch (error) {
            if (error.response?.status === 401) {
                ElMessage.error('登录已过期，请重新登录')
                router.push('/login')
                return
            }
            console.error('Fetch features error:', error)
            ElMessage.error('获取特点列表失败：' + (error.response?.data?.message || error.message))
        }
    }

    // 修改 deleteTheme 方法
    const deleteTheme = async (theme) => {
        try {
            await ElMessageBox.confirm(
                `确定要删除主题"${theme.label}"吗？如果该主题正在被作品使用，将无法删除。`,
                '提示',
                {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    distinguishCancelAndClose: true
                }
            )

            await axios.delete(`/api/admin/themes/${theme.value}`)
            ElMessage.success('删除成功')
            await fetchThemes()
        } catch (error) {
            if (error === 'cancel') return

            if (error.response?.status === 401) {
                ElMessage.error('登录已过期，请重新登录')
                router.push('/login')
                return
            }

            // 处理主题被使用的情况
            if (error.response?.data?.message?.includes('正在被使用')) {
                ElMessage({
                    type: 'warning',
                    message: '该主题正在被作品使用，无法删除。请先修改或删除使用该主题的作品。',
                    duration: 5000
                })
                return
            }

            console.error('Delete theme error:', error)
            ElMessage.error('删除失败：' + (error.response?.data?.message || error.message))
        }
    }

    // 修改 deleteFeature ���法
    const deleteFeature = async (feature) => {
        try {
            await ElMessageBox.confirm(
                `确定要删除特点"${feature.label}"吗？如果该特点正在被作品使用，将无法删除。`,
                '提示',
                {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    distinguishCancelAndClose: true
                }
            )

            await axios.delete(`/api/admin/features/${feature.value}`)
            ElMessage.success('删除成功')
            await fetchFeatures()
        } catch (error) {
            if (error === 'cancel') return

            if (error.response?.status === 401) {
                ElMessage.error('登录已过期，请重新登录')
                router.push('/login')
                return
            }

            // 处理特点被使用的情况
            if (error.response?.data?.message?.includes('正在被使用')) {
                ElMessage({
                    type: 'warning',
                    message: '该技术特点正在被作品使用，无法删除。请先修改或删除使用该特点的作品。',
                    duration: 5000
                })
                return
            }

            console.error('Delete feature error:', error)
            ElMessage.error('删除失败：' + (error.response?.data?.message || error.message))
        }
    }

    // 初始化加载数据
    fetchThemes()
    fetchFeatures()
</script>

<style scoped>
    .theme-features-manager {
        height: 100%;
    }

    .feature-tabs {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .input-with-button {
        margin-bottom: 20px;
    }

    .theme-list,
    .feature-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }

    .theme-item,
    .feature-item {
        border-radius: 8px;
        transition: all 0.3s;
    }

    .theme-content,
    .feature-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
    }

    .theme-label,
    .feature-label {
        font-size: 14px;
        color: #606266;
    }

    .theme-actions,
    .feature-actions {
        opacity: 0;
        transition: opacity 0.3s;
    }

    .theme-item:hover .theme-actions,
    .feature-item:hover .feature-actions {
        opacity: 1;
    }

    .preview-card {
        height: 100%;
        border-radius: 8px;
    }

    .preview-header {
        font-size: 16px;
        font-weight: bold;
        color: #303133;
    }

    .preview-section {
        padding: 10px;
    }

    .preview-section h3 {
        margin: 15px 0;
        font-size: 14px;
        color: #606266;
    }

    .theme-tags,
    .feature-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        min-height: 40px;
        padding: 8px;
        background-color: #f5f7fa;
        border-radius: 4px;
    }

    .theme-tag,
    .feature-tag {
        margin: 0;
        /* ��除原有的 margin */
    }

    .empty-text {
        width: 100%;
        text-align: center;
        color: #909399;
        font-size: 14px;
        padding: 10px 0;
    }

    .el-divider {
        margin: 20px 0;
    }

    :deep(.el-tabs__nav-wrap::after) {
        height: 1px;
    }

    :deep(.el-tabs__active-bar) {
        height: 3px;
    }
</style>