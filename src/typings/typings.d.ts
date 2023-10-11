interface Module {
    /**
     * 多语言
     */
    i18n(): object;
}

declare module '*.json' {
    const value: any;
    export default value;
}
