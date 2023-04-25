<template>
  <div class="dropdown border border-[#4BB8B5] rounded-full bg-black p-3">
    <select v-model="selected" @change="onChange" class="flex flex-grow justify-center w-full bg-black text-white text-xl font-bold">
      <option :value="null" selected disabled>{{ placeholder }}</option>
      <option v-for="(option, index) in options" :key="index" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>


<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: String,
      required: false,
      default: null,
    },
    placeholder: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selected: this.modelValue,
    };
  },
  watch: {
    modelValue(newVal) {
      this.selected = newVal;
    },
    selected(newVal) {
      this.$emit('update:modelValue', newVal);
    },
  },
  methods: {
    onChange() {
      this.$emit('change', this.selected);
    },
  },
};
</script>

<style scoped>
.dropdown select {
  /* Add your custom styles for the select element */
}
</style>
