import { ref } from 'vue';



/* Props */
export const drawerPopup = ref<boolean>(true);

/* Event */
export const showDrawerPopup = () => {
  drawerPopup.value = true
  console.log(123)
}

export const disabledDrawer = () =>{
  drawerPopup.value = false
}

export const afterOpenChange = (bool: boolean) => {
  console.log('open', bool);
};

export const carouselOnChange = (current: number) => {
  console.log(current);
};