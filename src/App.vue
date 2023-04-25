<template>
  <div
    v-if="isLoading"
    class="grid place-items-center h-screen"
  >
    <Loading class="h-16 w-16" />
  </div>
  <div v-else class="flex flex-col min-h-screen">
    
    <div class="flex flex-col h-screen m-auto">
      <Navbar />
      <div class="flex flex-grow">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, onMounted, onUnmounted } from "vue";
  import Navbar from "@/components/Navbar.vue";
  import Loading from "@/components/Loading.vue";
  import Footer from "@/components/Footer.vue";
  import { getUserState } from "@/firebase";
  export default defineComponent({
    name: "App",
    components: {
      Navbar,
      Loading,
      Footer,
    },
    setup(props) {
      const isLoading = ref(true);
      const menuOpen = ref(false);
      
      getUserState().then(() => {
        isLoading.value = false;
      }).catch(() => {
        isLoading.value = false; // Error check if you have properly configured .env.local file
      });

      const handleClickOutside = (event) => {
        if (menuOpen.value && !event.target.closest('.hamburger, .router-links')) {
          menuOpen.value = false
        }
      }

      onMounted(() => {
        document.addEventListener('click', handleClickOutside)
      })

      onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside)
      })

      return {
        isLoading,
        menuOpen,
      };
    },
  });
</script>


<style scoped>
.slide-leave-active {}
</style>


<style lang="scss" global>
  body {
    @apply bg-[#10090C] text-white;

    height: 100vh;
  }

  button {
    @apply flex flex-grow justify-center rounded-full w-full;

    &.primary {
      @apply text-white bg-[#4BB8B5] uppercase text-xl font-bold px-6 py-3;
    }

    &.secondary {
      @apply text-[#4BB8B5] bg-white uppercase text-xl font-bold px-6 py-3;

      &.small {
        @apply text-xs p-1;
      }
    }
  }

  input[type=text] {
    @apply flex flex-grow justify-center rounded-full w-full border border-[#4BB8B5] text-white bg-black text-xl font-bold px-6 py-3;

    &.disabled {
      @apply bg-black border-0 p-0 text-3xl rounded-none;
    }
  }

  .router-link {
    @apply block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-[#4BB8B5] focus:outline-none focus:ring-2 focus:ring-[#4BB8B5] focus:text-[#4BB8B5] dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white;

    &s {
      @apply w-auto mb-4 bg-black;
    }
  }
</style>

