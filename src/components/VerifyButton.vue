<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

// 1. 老板（App.vue）只管给“总量规则”：倒计时初始是多少秒？
const props = defineProps<{
    time: number;
}>()

const emits = defineEmits(['get-code'])

// 2. 按钮员工自己的私有“小本本”（局部状态）
const currentTime = ref(props.time) // 自己掏出秒表记下老板规定的时间
const isCounting = ref(false) // 记录：现在是不是正处于倒数状态？

let agingtimer: number;

// 3. 产生点击行为
function handleClick() {
    // 刚点下去，马上把状态设为“正在倒数”，并重置秒表时间
    isCounting.value = true;
    currentTime.value = props.time;
    emits('get-code'); // 立刻告诉老板：我点了，快发验证码！
    // 启动诅咒引擎！每秒干两件事：
    agingtimer = setInterval(() => {
        currentTime.value--; // 第一件事：时间减一
        
        // 第二件事：检查是不是数到 0 了
        if (currentTime.value <= 0) {
            clearInterval(agingtimer); // 数到了，立刻销毁引擎
            isCounting.value = false; // 状态恢复，又能再次点击了！
        }
    }, 1000)
}

// 4. 断后遗愿（生命周期）
onUnmounted(() => {
    console.log(`💀 验证按钮被抹除了，连带那个倒计时引擎也毁了...`)
    clearInterval(agingtimer);
})
</script>

<template>
    <!-- class不变。如果 isCounting 是 true，那就彻底把按钮 disabled（变成灰不可点）。显示文字也跟着 isCounting 变化 -->
    <button class="verify-btn" :disabled="isCounting" @click="handleClick">
        {{ isCounting ? currentTime + 's 后重试' : '获取验证码' }}
    </button>
</template>

<style scoped>
.verify-btn {
    padding: 10px 20px;
    background-color: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>