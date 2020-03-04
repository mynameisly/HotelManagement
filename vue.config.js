module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/HotelManagement':{
                target:'http://120.24.186.190:8080',
                changeOrigin:true,
                pathRewrite:{
                    '^/HotelManagement':'/HotelManagement'
                }
            }
        }
    }
}