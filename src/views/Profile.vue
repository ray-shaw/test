<template>
  <div class="w-full">
    
    <div @submit.prevent="handleSubmit" class="flex flex-col text-center p-5 gap-5">
      <h1 class="text-3xl font-bold">Welcome {{ user?.displayName }}</h1>
      <p>What do you need to do?</p>
      <div class="flex flex-grow w-full items-end">
        <div class="flex flex-col w-full gap-3">
          <button class="primary" @click="goToStart">Get Started</button>
          <button class="secondary" @click="signOutUser">
            <Loading class="h-5 w-5" v-if="loading" />
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" class="mr-2" v-else />
            LogOut
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { useAuthState, useSignOut } from "@/firebase";
  import { useRouter } from "vue-router";
  import { defineComponent, ref } from "vue";
  import Dialog from "@/components/Dialog.vue";
  import Loading from "@/components/Loading.vue";

  const router = useRouter()

  function goToStart() {
    router.push('/user')
  }

  export default defineComponent({
    name: "Home",
    components: {
      Dialog,
      Loading,
    },
    setup() {
      const { user } = useAuthState();
      const router = useRouter();

      const loading = ref(false);

      const signOutUser = async () => {
        loading.value = true;
        await useSignOut();
        await router.replace({ name: "Login" });
        loading.value = false;
      };

      return { user, signOutUser, loading };
    },
  });
</script>

