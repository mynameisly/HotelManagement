module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/json':{
                target:'http://120.24.186.190:8080',
                changeOrigin:true,
                pathRewrite:{
                    '/json':''
                }
            }
        }
    }
}