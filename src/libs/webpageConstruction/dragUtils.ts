// 开始拖动时的事件处理器
const onDragStart = (
    event: MouseEvent,
    fileList: any,
    selectionBoxStyle: any,
    offsetX: any,
    offsetY: any,
    isDragging: any
) => {
    if (fileList && fileList.value && fileList.value[0]) {
    const imageWidth = fileList.value[0].elementViewportW_;
    const imageHeight = fileList.value[0].elementViewportH_;
    const element = document.querySelector('.element_viewport') as HTMLElement;
    const displayedImageWidth = element ? element.offsetWidth : 0;
    const displayedImageHeight = displayedImageWidth ? displayedImageWidth / (imageWidth / imageHeight) : 0;
    const scaleFactorX = imageWidth / displayedImageWidth;
    const scaleFactorY = imageHeight / displayedImageHeight;

    if (selectionBoxStyle.value.left && typeof selectionBoxStyle.value.top === 'string') {
        offsetX.value = event.clientX - parseFloat(selectionBoxStyle.value.left) * scaleFactorX;
        offsetY.value = event.clientY - parseFloat(selectionBoxStyle.value.top) * scaleFactorY;
        isDragging.value = true;
    }
}
};

// 拖动时的事件处理器

const onDrag = (
    event: MouseEvent,
    fileList: any,
    selectionBoxStyle: any,
    offsetX: any,
    offsetY: any,
    isDragging: any,
    prevX: any,
    prevY: any

) => {
    if (event.clientX === 0 && event.clientY === 0) return;

    requestAnimationFrame(() => {
        if (!isDragging.value) return;

        const element = document.querySelector('.element_viewport') as HTMLElement;

        if (!element) return;

        // 获取滚动的位移
        const scrollX = element.scrollLeft;
        const scrollY = element.scrollTop;

        // 图片的边界和尺寸
        const imageWidth = (fileList.value[0] as any).elementViewportW_;
        const imageHeight = (fileList.value[0] as any).elementViewportH_;

        // 获取容器的尺寸
        const displayedImageWidth = element.offsetWidth;
        const displayedImageHeight = displayedImageWidth / (imageWidth / imageHeight);

        // 计算缩放因子
        const scaleFactorX = imageWidth / displayedImageWidth;
        const scaleFactorY = imageHeight / displayedImageHeight;

        // 在计算新位置时加上滚动的位移和缩放因子
        const adjustedX = (event.clientX - offsetX.value + scrollX) * scaleFactorX;
        const adjustedY = (event.clientY - offsetY.value + scrollY) * scaleFactorY;

        // 确保选择框保持在图片内
        let newLeft = Math.max(0, adjustedX);
        let newTop = Math.max(0, adjustedY);
        newLeft = Math.min(newLeft, imageWidth - parseFloat(selectionBoxStyle.value.width));
        newTop = Math.min(newTop, imageHeight - parseFloat(selectionBoxStyle.value.height));

        // 设置选择框的位置
        selectionBoxStyle.value.left = `${newLeft}px`;
        selectionBoxStyle.value.top = `${newTop}px`;

        // 记录日志
        console.log('event.clientX:', event.clientX, 'event.clientY:', event.clientY);
        console.log('scrollX:', scrollX, 'scrollY:', scrollY);
        console.log('scaleFactorX:', scaleFactorX, 'scaleFactorY:', scaleFactorY);
        console.log('adjustedX:', adjustedX, 'adjustedY:', adjustedY);
        console.log('newLeft:', newLeft, 'newTop:', newTop);

        // 更新lastX和lastY的值
        prevX.value = Math.round((parseFloat(selectionBoxStyle.value.left) / imageWidth) * 100);
        prevY.value = Math.round((parseFloat(selectionBoxStyle.value.top) / imageHeight) * 100);
    });
};  


// 拖动结束时的事件处理器
const onDragEnd = (isDragging: any, valueX: any, valueY: any, prevX: any, prevY: any) => {
    isDragging.value = false;
    valueX.value = prevX.value;
    valueY.value = prevY.value;
};

export { onDragStart, onDragEnd, onDrag };
