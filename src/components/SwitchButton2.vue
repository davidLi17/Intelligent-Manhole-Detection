<template>
    <div class="radio-inputs">
  <label class="radio">
    <input type="radio" name="radio" checked="">
    <span class="name">HTML</span>
  </label>
  <label class="radio">
    <input type="radio" name="radio">
    <span class="name">React</span>
  </label>
      
</div>
</template>

<script>

export default {
    name: 'SwitchButton2'
}
</script>

<style scoped>
.radio-inputs {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  border-radius: 99px;;
  background-color: #EEE;
  box-sizing: border-box;
  box-shadow: 0 0 1px 0 rgba(24, 94, 224, 0.15), 0 6px 12px 0 rgba(24, 94, 224, 0.15);
  padding: 0.25rem;
  width: 300px;
  font-size: 14px;
}

.radio-inputs .radio {
  flex: 1 1 auto;
  text-align: center;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  border: none;
  padding: .5rem 0;
  color: rgba(51, 65, 85, 1);
  transition: all .15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
  background-color: #eff171;
  font-weight: 600;
}

</style>