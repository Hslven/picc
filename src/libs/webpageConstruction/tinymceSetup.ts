import { ref, reactive } from "vue";
import {
    convertPxToRem, getInitialFormValues, updateSelectionBox
} from '@/libs/webpageConstruction/elementUtils';

export function getTinymceInit(tinymceId: any, editorInstance: any, formState: any) {
    //富文本初始化
    //定义一个对象 init初始化
    let isSliderChanged = false;

    const init = reactive({
        selector: '#' + tinymceId.value, //富文本编辑器的id,
        language_url: process.env.BASE_URL + 'tinymce/langs/zh-Hans.js', // 语言包的路径，具体路径看自己的项目，文档后面附上中文js文件
        language: 'zh-Hans', //语言
        skin_url: process.env.BASE_URL + 'tinymce/skins/ui/oxide', // skin路径，具体路径看自己的项目
        height: 300, //编辑器高度
        branding: false, //是否禁用“Powered by TinyMCE”
        menubar: true, //顶部菜单栏显示
        plugins: ['letterspacing'],
        // toolbar: ' opacitySlider | undo redo  | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent   ｜ customLineHeight |  letterspacing  ',
        toolbar: ' opacitySlider | undo redo  | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent  ',
        font_family_formats: `
                    宋体=SimSun;
                    黑体=SimHei;
                    微软雅黑=Microsoft YaHei;
                    等线=DengXian;
                    仿宋=FangSong;
                    楷体=KaiTi;
                    幼圆=YouYuan;
                    隶书=LiSu;        
                    Arial=Arial;
                    Calibri=Calibri;
                    Times New Roman=新罗马时代;
                    Verdana=Verdana;
                    Tahoma=Tahoma;
                    Georgia=Georgia;
                    Cambria=Cambria;
                    Courier New=新宋体;
                    Trebuchet MS=Trebuchet MS;
                    Lucida Sans Unicode=Lucida Sans Unicode;
                    Constantia=Constantia;
                    Corbel=Corbel;
                    Segoe UI=Segoe UI;
                    Palatino Linotype=Palatino Linotype;
                    Garamond=Garamond;
        `,
        font_size_formats: '10px 11px 12px 13px 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px 48px 56px 72px',
        font_size_input_default_unit: 'px',
        line_height_formats: '1 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2',
        // letterspacing_val: '1px 2px 3px 4px 5px 6px 7px 8px 9px 10px',
        // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: 'all',
        block_formats: 'Paragraph=p;  一级标题=h1; 二级标题=h2; 三级标题=h3;  四级标题=h4;  五级标题=h5;  六级标题=h6',
        paste_preprocess: function (plugin: any, args: any) {
            // 使用正则表达式去除样式中的背景图
            const strippedContent = args.content.replace(/background[^;]+;/g, '');
            args.content = strippedContent;
        },
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,
        file_picker_types: 'file',
        formats: {
            setLineHeight: {
                inline: 'span',
                styles: { 'line-height': '%value' }
            }
        },
        menu: {
            format: {
                title: '格式',
                items: 'bold italic underline strikethrough superscript subscript code blocks align   fontfamily fontsize lineheight forecolor backcolor  opacitySlider removeformat'
            }
        },
        content_css: '/tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
        setup: (editor: any) => {
            editor.on('init', function (e: any) {
                var ps = editor.getBody().getElementsByTagName('p');
                // console.log(tinyMCE.activeEditor.ui.registry.getAll().menuItems,33333333);  // 打印当前编辑器的完整设置

                for (var i = 0; i < ps.length; i++) {
                    ps[i].style.fontSize = '12px';
                }
                editor.formatter.register('setOpacity', {
                    inline: 'span',
                    styles: {
                        'opacity': '%value'
                    }
                });
            });

            // 注册一个透明度菜单项
            editor.ui.registry.addMenuItem('opacitySlider', {
                text: '字体透明度',
                onAction: function () {
                    let percentageElem: HTMLSpanElement;

                    const updatePercentageDisplay = (opacityValue: any) => {
                        if (!percentageElem) {
                            const sliderElem = document.querySelector('.tox-slider__rail');
                            percentageElem = document.createElement('span');
                            percentageElem.classList.add('opacity-percentage');
                            percentageElem.style.position = 'absolute';
                            percentageElem.style.top = '-20px';

                            if (sliderElem) {
                                sliderElem.appendChild(percentageElem);
                            }
                        }

                        percentageElem.textContent = opacityValue + '%';  // 这里不再需要调整透明度

                        if (percentageElem.parentElement) {
                            const sliderWidth = percentageElem.parentElement.offsetWidth;
                            const percentagePosition = (opacityValue / 100) * sliderWidth;
                            percentageElem.style.left = (percentagePosition) + 'px';
                        }
                    };



                    editor.windowManager.open({
                        title: '字体透明度',
                        body: {
                            type: 'panel',
                            items: [{
                                type: 'slider',
                                name: 'opacity',
                                label: '透明度:',
                                min: 0,
                                max: 100,
                                value: 100 // 0%表示完全不透明
                            }]
                        },
                        buttons: [
                            {
                                type: 'cancel',
                                text: '取消'
                            },
                            {
                                type: 'submit',
                                text: '确定',
                                primary: true
                            }
                        ],
                        onChange: function (api: any) {
                            const data = api.getData();
                            const opacityValue = data.opacity;
                            updatePercentageDisplay(opacityValue);
                            isSliderChanged = true; // 设置标志
                        },
                        onSubmit: function (api: any) {

                            const data = api.getData();
                            let opacityValue;
                            if (isSliderChanged) {
                                // 透明度反向计算
                                opacityValue = (100 - data.opacity) / 100;
                            } else {
                                opacityValue = 0.001;
                            }
                            // console.log(opacityValue)
                            editor.formatter.apply('setOpacity', { value: opacityValue });
                            api.close();
                        }
                    });

                    setTimeout(function () {
                        const sliderHandle = document.querySelector('.tox-slider__handle') as HTMLElement;
                        if (sliderHandle) {
                            sliderHandle.style.left = '297.75px'; // Adjust the slider handle if necessary
                        }
                        updatePercentageDisplay(100); // Display default value (fully opaque)
                        isSliderChanged = false;
                    }, 50);
                }
            });


            editor.ui.registry.addButton('customLineHeight', {
                text: '自定义行高',
                onAction: function () {
                    // 打开弹窗，让用户输入行高
                    editor.windowManager.open({
                        title: '自定义行高',
                        body: {
                            type: 'panel',
                            items: [
                                {
                                    type: 'input',
                                    name: 'lineHeight',
                                    label: 'Line Height',
                                    inputMode: 'numeric'
                                }
                            ]
                        },
                        buttons: [
                            {
                                type: 'cancel',
                                text: '取消'
                            },
                            {
                                type: 'submit',
                                text: '确定',
                                primary: true
                            }
                        ],
                        onSubmit: function (api: any) {
                            const data = api.getData();
                            console.log(data);  // 这将显示弹窗中输入的数据
                            editor.formatter.apply('setLineHeight', { value: data.lineHeight + 'px' }); // 记得添加 'px' 或其他单位
                            api.close();
                        }
                    });
                }
            });

            editorInstance.value = editor;

            editor.on('change', () => {
                const maxLength = 100;
                const currentContent = editor.getContent({ format: 'text' });
                updateSelectionBox(editorInstance, formState);
            });
            editor.on('input', () => {
                const currentContent = editor.getContent({ format: 'text' });
            });


            editor.on('keydown', (event: KeyboardEvent) => {
                const currentContentLength = editor.getContent({ format: 'text' }).length;
                const maxLength = 100;
                updateSelectionBox(editorInstance, formState);
            });

            editor.on('paste', (event: ClipboardEvent) => {
                // const maxLength = 100;
                updateSelectionBox(editorInstance, formState);
            });
        },
    });
    return init;

}