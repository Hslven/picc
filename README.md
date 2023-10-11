# 目录结构说明

- libs：公共函数
- style：公共样式
- modules：各个模块的页面
    - XXXX：具体模块文件夹
        - api：调用后台的请求
        - components：可重用的组件、页面
        - router：路径导出
        - store：状态存储
        - views：与路由绑定的组件、页面
        - i18n.json：多语言文件
        - index.tsx：功能对应的store、导出路由信息

# 使用到的插件

- axios 网络请求工具，用来发送ajax请求给后台。封好的公用类为`BaseApi`，常用方法示例如下：

    - post
