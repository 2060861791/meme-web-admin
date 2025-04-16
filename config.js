const config = {
    // 服务器配置
    server: {
        // API服务器地址 - 使用相对路径让请求通过 Nginx 代理
        baseURL: '',  // 或使用 '/api' 作为基础路径
        // 上传文件的基础URL
        uploadURL: '',  // 或使用 '/api' 作为基础路径
        // API超时时间（毫秒）
        timeout: 5000
    },

    // 上传配置
    upload: {
        // 图片大小限制（MB）
        maxSize: 5,
        // 支持的图片类型
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        // 建议的图片尺寸
        recommendedSize: {
            width: 800,
            height: 600
        },
        // 最大上传数量
        maxCount: 10
    },

    // 静态资源配置
    assets: {
        // 默认占位图片路径
        placeholderImage: '/src/assets/placeholder.png'
    }
}

export default config 