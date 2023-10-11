<template>
    <a-collapse v-model:activeKey="activeKey" :expand-icon-position="expandIconPosition">
      <a-collapse-panel key="1" header="This is panel header 1">
        <p>{{ text }}</p>
        <template #extra><setting-outlined @click="handleClick" /></template>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="This is panel header 2">
        <p>{{ text }}</p>
        <template #extra><setting-outlined @click="handleClick" /></template>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="This is panel header 3">
        <p>{{ text }}</p>
        <template #extra><setting-outlined @click="handleClick" /></template>
      </a-collapse-panel>
    </a-collapse>
  </template>
  <script lang="ts" setup>
  import { SettingOutlined } from '@ant-design/icons-vue';
  import { ref, watch } from 'vue';
  import type { CollapseProps } from 'ant-design-vue';
  
  const text = `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`;
  const activeKey = ref(['0']);
  const expandIconPosition = ref<CollapseProps['expandIconPosition']>('start');
  
  const handleClick = (event: MouseEvent) => {
    // If you don't want click extra trigger collapse, you can prevent this:
    event.stopPropagation();
  };
  watch(activeKey, val => {
     
  });
  </script>
  
  