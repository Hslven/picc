/**
 * Created by cn.mashuai@gmail.com on 2022/8/5.
 */

import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators';
import store from '@/store';

@Module({ name: 'theme', dynamic: true, store, namespaced: true })
export class Theme extends VuexModule {
    public currentTheme = '';
    public themes: Map<string, Array<string>> = new Map();
    // 主体色,main,绿色；背景，如：标题背景、大按钮背景、按钮线框、大面积色块、标题前lab线、选中按钮背景等
    public mColor = '';
    // 辅助色,auxiliary,黑色；字体，如：标题字体颜色、用户填写后字体颜色等
    public aColor = '';
    // 衬托色,set off,灰色；辅助字体，如：非用户填写类字体、注释说明类字体等，用于衬托用户录入的信息。
    public soColor = '';
    // 融合色,fused,浅绿；次要背景，如：表格标题栏背景、未选中按钮背景等
    public fColor = '';
    // 强调色,stress,橙黄；高亮突出显示，如金额类、重要状态类信息
    public sColor = '';
    // 主体色字体颜色，主体色为背景时，显示在它上面字体的颜色,白色
    public mftColor = '';
    // 衬托色字体颜色，衬托色为背景时，显示在它上面字体的颜色,深灰色
    public softColor = '';

    @Mutation
    public setThemes(themes: Map<string, Array<string>>) {
        this.themes = themes;
    }

    public get themesOptions(): Array<string> {
        const array: Array<string> = new Array<string>();
        for (const key of this.themes.keys()) {
            array.push(key);
        }
        return array;
    }

    @Mutation
    public chooseTheme(theme: string) {
        this.currentTheme = theme;
        const colors: Array<string> | undefined = this.themes.get(theme);
        if (!colors) {
            return;
        }
         
        this.mColor = colors[0];
        this.aColor = colors[1];
        this.soColor = colors[2];
        this.fColor = colors[3];
        this.sColor = colors[4];
        this.mftColor = colors[5];
        this.softColor = colors[6];
    }

    @Mutation
    public setMColor(value: string) {
        this.mColor = value;
    }

    @Mutation
    public setAColor(value: string) {
        this.aColor = value;
    }

    @Mutation
    public setSOColor(value: string) {
        this.soColor = value;
    }

    @Mutation
    public setFColor(value: string) {
        this.fColor = value;
    }

    @Mutation
    public setSColor(value: string) {
        this.sColor = value;
    }

    @Mutation
    public setMFTColor(value: string) {
        this.mftColor = value;
    }

    @Mutation
    public setSOFTColor(value: string) {
        this.softColor = value;
    }
}

export const themeStore = getModule(Theme);
