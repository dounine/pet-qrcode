import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {viteMockServe} from 'vite-plugin-mock'
import htmlConfig from 'vite-plugin-html-config';
import importToCDN, {autoComplete} from 'vite-plugin-cdn-import'

const localEnabled: boolean = (process.env.USE_MOCK as unknown as boolean) || false;
const prodEnabled: boolean = (process.env.USE_CHUNK_MOCK as unknown as boolean) || false;

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        reportCompressedSize: false,
        assetsDir: './assets',
        chunkSizeWarningLimit: 500,
        minify: 'terser',
        cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
        terserOptions: {
            compress: {
                drop_console: true,  //打包时删除console
                drop_debugger: true, //打包时删除 debugger
                pure_funcs: ['console.log'],
            },
            output: {
                // 去掉注释内容
                comments: true,
            },
        },
        rollupOptions: {
            external: ['axios', 'vue', 'vue-router', 'element-plus'],
        },
        brotliSize: false,
    },
    plugins: [vue(),
        importToCDN({
            modules: [
                {
                    name: 'axios',
                    var: 'axios',
                    path: 'https://douyin.61week.com/pet-qrcode/static/js/axios-0.21.4.js'//可自己找其它cdn地址
                },
                {
                    name: 'vue',
                    var: 'Vue',
                    path: 'https://douyin.61week.com/pet-qrcode/static/js/vue-3.2.36.js'//可自己找其它cdn地址
                },
                {
                    name: 'vue-router',
                    var: 'VueRouter',
                    path: 'https://douyin.61week.com/pet-qrcode/static/js/vue-router-4.0.13.js'//可自己找其它cdn地址
                },
                {
                    name: 'element-plus',
                    var: 'element',
                    path: 'https://douyin.61week.com/pet-qrcode/static/js/element-plus-2.2.6.js'//可自己找其它cdn地址
                },
            ],
        }),
        viteMockServe({
            // ↓解析根目录下的mock文件夹
            mockPath: "mock",
            localEnabled: localEnabled,  // 开发打包开关
            prodEnabled: true, // 生产打包开关
            supportTs: true, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
            watchFiles: true, // 监视文件更改
        })],
    server: {
        port: 8080,
        host: true
        // proxy: localEnabled ? {} : {
        //     '/api': {
        //         target: 'https://127.0.0.1:40000',   //实际请求地址
        //         changeOrigin: true,
        //         rewrite: (path) => path.replace(/^\/api/, '/api')
        //     },
        // }
    },
})
