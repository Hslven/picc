// generateFullHTML.ts

interface ElementInfo {
  buildingId: string;
  elementType: string;
  // ... 其他属性 ...
}
const convertPxToRem = (content: string): string => {
  const pxToRem = (match: string, p1: string): string => {
      const pxValue = parseFloat(p1);
      const remValue = (pxValue / 16).toFixed(2); // 16px为1rem
      return `${remValue}rem`;
  };
  return content.replace(/(\d+)px/g, pxToRem);
};

export function generateFullHTML(newElements: any, formStateSEO: any): string {
  
  let dynamicDivsContent = '';
  let floatingModulePlaceholder = null; // 用于存储浮动模块的内容作为占位符
  
  for (let index = 0; index < newElements.length; index++) {
      const item = newElements[index];
  
      let divClass = 'dynamic-div';
      let styles = '';
  
      // 检查当前元素是否是数组中的最后一个元素并且其filePosition为3
      if (index === newElements.length - 1 && item.filePosition === '3') {
          divClass += ' fixed-div';
          styles = 'position: fixed; bottom: 0; width: 100%;';
      }
  
      let divContent = `
        <div class="${divClass} dynamic-div-${item.filePosition}" style="${styles}">
          <img src="${item.filePath}" alt="${item.fileDescription}" style="width:100%;height:auto;background-size:100% auto;">
      `;
  
      for (const element of item.elementsList || []) {
          if (element.elementType === '1') {
              divContent += `
                <a href="${element.elementContent}" target="_blank" class="selection-box" style="left:${element.hotspotXAxis}%;top:${element.hotspotYAxis}%;width:${element.hotspotWidth}%;height:${element.hotspotHigh}%;position:absolute;"></a>
              `;
          } else if (element.elementType === '2') {
              divContent += `
                <div class="selection-box" style="left:${element.hotspotXAxis}%;top:${element.hotspotYAxis}%;width:${element.hotspotWidth}%;height:${element.hotspotHigh}%;position:absolute;">
                ${convertPxToRem(element.elementContent)}
                </div>
              `;
          }
      }
  
      divContent += '</div>';
  
      if (divClass.includes('fixed-div')) {
          // 如果是浮动模块，则复制其内容作为占位符，并加入"floating-placeholder"类名，但移除fixed样式
          floatingModulePlaceholder = divContent.replace('fixed-div', 'floating-placeholder').replace('position: fixed; bottom: 0; width: 100%;', '');
      }
      
      dynamicDivsContent += divContent;
  }
  
  // 如果存在浮动模块，那么在最后添加一个相同的模块作为占位符
  if (floatingModulePlaceholder) {
      dynamicDivsContent += floatingModulePlaceholder;
  }
  

  
      
      
      

  const fullHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" id="description" content="${formStateSEO.descriptionContent}">
    <meta name="keywords" id="keywords" content="${formStateSEO.keywordsContent}">
    <title>${formStateSEO.titleName}</title>
    <style>
  html,
  body,
  div,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td {
      margin: 0;
      padding: 0;
      border: 0;
  }
  strong,span{
      margin: 0;
      padding: 0;
      border: 0;
  }
  a{outline: none;}

a:active{outline:none;star:expression(this.onFocus=this.blur());}
a:focus{outline:none;}
.selection-box:active {
  background-color: transparent;
}


  img{
      display:block;
      float: left;
  }
  .floating-placeholder {
  z-index: 1 !important;
  visibility: hidden;

  }
  .selection-box:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent; /* 针对移动浏览器的点击高亮效果 */

}
h1, h2, h3, h4, h5, h6 {
  color: rgba(0,0,0,.85);
  font-weight: 500;
  margin-bottom: 0.5em;
  margin-top: 0;
}
h1{
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;

}
  body {
    font-feature-settings: "tnum";
    background-color: #fff;
    color: rgba(0,0,0,.85);
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }
  .dynamic-div {
      position: relative;
      overflow: hidden;
  }

  html {
    font-size: 16px; /* 默认字体大小 */
}

/* 根据屏幕宽度进行适配 */
@media (max-width: 375px) {
    html {
        font-size: 14px;
    }
}

@media (min-width: 376px) and (max-width: 390px) {
    html {
        font-size: 15px;
    }
}

@media (min-width: 391px) and (max-width: 439px) {
    html {
        font-size: 16px;
    }
}
@media (min-width: 440px) and (max-width: 450px) {
  html {
      font-size: 17px;
  }
}
@media (min-width: 451px) and (max-width: 520px) {
  html {
      font-size: 18px;
  }
}
@media (min-width: 521px) and (max-width: 540px) {
    html {
        font-size: 20px;
    }
}


@media (min-width: 541px) and (max-width: 820px) {
    html {
        font-size: 22px;
    }
}
                                                                           
          p {
          font-size: .75rem;
          }

  .selection-box{
      position: absolute;
          box-sizing: border-box;
          /* background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          border: 1px solid #ffffff; */
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;

          padding-top:0px;
          user-select: none;
          -webkit-user-select: none; /* 针对 Webkit 浏览器 */
          -moz-user-select: none;    /* 针对 Firefox */
          -ms-user-select: none;     /* 针对 IE 10+/Edge */
          -webkit-tap-highlight-color: rgba(0,0,0,0);  /* 使其完全透明 */
      
  }
  .dynamic-div-3 {
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10; /* 使元素位于其他内容之上 */
    transition: visibility 0.3s;
}
p{
    overflow: hidden;
    text-overflow: ellipsis;

}
</style>
  </head>
  <body>
    <!-- body部分内容 -->
    <div class="dynamic-divs">
    ${dynamicDivsContent}

    </div>
<script>
const baseSize = 14; // 设计稿是基于375px宽度设计的，这里设置16px为基准字体大小
const designWidth = 375; // 设计稿的宽度

function setRem() {
  const scale = document.documentElement.clientWidth / designWidth;
  document.documentElement.style.fontSize = (baseSize * scale) + 'px';
}

setRem();
window.addEventListener('resize', setRem);

</script>
  </body>
  </html>
  `;

  return fullHTML;
}
