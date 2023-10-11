import { ref } from 'vue';



/* Props */
export const drawerPopup = ref<boolean>(false);

/* Event */
export const showDrawerPopup = () => {
  // drawerPopup变为true
  drawerPopup.value = true
  console.log(drawerPopup.value)
}

export const afterOpenChange = (bool: boolean) => {
  console.log('open', bool);
};