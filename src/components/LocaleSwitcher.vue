<template>
  <div class="locale-switcher">
     <el-select v-model="$i18n.locale" placeholder="Language" size="small">    
      <el-option value="en-us" label="EN">EN-US</el-option>
      <el-option value="en-uk" label="EN">EN-UK</el-option>
      <el-option value="de-de" label="DE">DE</el-option>
    </el-select>
  </div>
</template>

<script>
//code ref:
//https://phrase.com/blog/posts/ultimate-guide-to-vue-localization-with-vue-i18n/#vueconfigjs
export default {
    
}
</script>