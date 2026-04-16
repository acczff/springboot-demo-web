<script setup lang="ts">
import { onMounted, onUpdated, onUnmounted } from 'vue';

const props = defineProps<{
    name: string;
    age: number;
}>()

const emit = defineEmits(['grow-up'])
// let agingtimer: number;
function handleBirthday() {
    emit('grow-up')
}

onMounted(() => {
    // console.log(`👶 ${props.name} 出生在了网页上！`)
    // agingtimer = setInterval(() => {
    //     emit('grow-up')
    //     console.log(`${props.name} 不受控制地老了1岁！`)
    // }, 5000)
})

onUpdated(() => {
//    console.log(`🔄 页面重画了！可能有人改了大小、岁数！`)
})

onUnmounted(() => {
    // clearInterval(agingtimer)
    // console.log(`💀 啊！我被抹除了，遗愿是消灭诅咒引擎...`)
})

</script>

<template>

    <div class="card">
        <h3>员工姓名: {{ props.name }}</h3>
        <p>员工年龄: {{ props.age }}</p>
        <button @click="handleBirthday">过生日啦！呼叫老板！</button>
    </div>
    
    <div class="action-area">
        <slot></slot>
    </div>

</template>

<style scoped>

.card {
  border: 1px solid #646cff;
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  background-color: #1a1a1a;
}

.action-area {
   margin-top: 10px; 
   border-top: 1px solid #ccc; 
   padding-top: 10px; 
}

</style>