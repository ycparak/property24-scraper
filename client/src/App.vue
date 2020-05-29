<template>
  <div id="app">
    <PropertyList :property-data="PropertyData" />
  </div>
</template>

<script>
import PropertyData from '../../property24.json'
import PropertyList from './components/PropertyList.vue'

export default {
  name: 'app',
  components: {
    PropertyList
  },
  data() {
    return {
      PropertyData,
    }
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
