<script setup lang="ts">

import { ref, computed, watch } from 'vue'

interface UserInfo {
    name: string;
    age: number;
}

const likes = ref(0)
const userInfo = ref<UserInfo>({
    name: '张三',
    age: 15
})
const isAdult = computed(() => {
    return userInfo.value.age >= 18 ? '🔥已经成年了，可以上网拼杀' : '👶早点睡觉吧，未成年人禁止上网哦';
})
watch(() => userInfo.value.age, (newAge, oldAge) => {
    if(newAge === 18 && oldAge < 18){
        alert('🎉 恭喜' + userInfo.value.name + '满18岁！送上100个新人点赞红包！');
        
        likes.value += 100;
    }
})

</script>

<template>
    <div class="my-box">
        <h2>这是我的第一个组件！</h2>
        <p>喜欢这个组件吗？点个赞吧！</p>
        <p>当前登录用户：{{ userInfo.name }}, 年龄：{{ userInfo.age }}</p>
        <p>状态评估：{{ isAdult }}</p>
        <button @click="userInfo.age++">过了一年，长大一岁</button>
        <button @click="userInfo.age--">时光倒流，年轻一岁</button>
        <button @click="likes++">点赞 {{ likes }}</button>
    </div>
</template>

<style scoped>
.my-box {
    border: 2px dashed #42b883;
    /* 画个绿色的虚线框 */
    padding: 20px;
    margin-top: 20px;
    border-radius: 8px;
    /* 圆角边框 */
    background-color: #1a1a1a;
}   
h2 {
    color: #42b883;
    /* 标题颜色 */
}
</style>