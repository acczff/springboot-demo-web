import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWorkOrderStore = defineStore('workorder', () => {

    const workOrderStatus = ref<string[]>([]);


    return { workOrderStatus };
})