module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        ['@babel/proposal-decorators', { legacy: true }],
        ['@babel/proposal-class-properties', { loose: true }],
        [
            'import',
            {
                libraryName: 'ant-design-vue',
                libraryDirectory: 'es',
                style: 'css',
            },
        ], // `style: true` 会加载 less 文件
    ],
};
