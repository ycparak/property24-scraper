<template>
  <div>
    <h1>List</h1>
    <div
      class="property"
      v-for="(property, index) in propertyData"
      :key="index">
        <a :href="property.url" taget="_blank"><h5>{{ property.title }}</h5></a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PropertyList',
  props: ['propertyData']
}
</script>

<style scoped>
</style>
