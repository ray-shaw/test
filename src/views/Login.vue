<template>
  <div class="w-full">
    <form @submit.prevent="handleSubmit" class="flex flex-col text-center p-5 gap-5">
      <h1 class="text-3xl font-bold">Login</h1>
      <div class="">
        <label class="hidden text-sm font-bold mb-2" for="email">
          <font-awesome-icon :icon="['fas', 'envelope']" class="mr-1" />
          Email
        </label>
        <input class="t-input w-full" type="text" id="email" placeholder="Email" />
      </div>
      <div class="">
        <label class="hidden text-sm font-bold mb-2" for="password">
          <font-awesome-icon :icon="['fas', 'key']" class="mr-1" />
          Password
        </label>
        <label class="relative text-gray-400 focus-within:text-gray-600 block">
          <input :type="showPassword ? 'text' : 'password'" id="password" placeholder="Password" class="t-input w-full" />
          <font-awesome-icon
            :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']"
            @click="showPassword = !showPassword"
            class="h-8 absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
          />
        </label>
      </div>

      <div class="flex flex-grow w-full items-end">
        <div class="flex flex-col w-full gap-3">
          <button type="submit" class="primary">
            <Loading class="h-5 w-5" v-if="loading" />
            <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2" v-else />
            Login
          </button>
          <button type="button" @click="googleSignUp" class="secondary">
            <font-awesome-icon :icon="['fab', 'google']" class="mr-2" />
            Sign in with Google
          </button>
          <div class="flex justify-between">
            <router-link :to="{ name: 'SignUp' }" class="">Sign Up</router-link>
            <router-link :to="{ name: 'ForgotPassword' }">Forgot Password?</router-link>
          </div>
          <div v-if="error.length > 0" class="mt-4 p-4 bg-error rounded">
            {{ error }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";
import Loading from "@/components/Loading.vue";
import Dialog from "@/components/Dialog.vue";
import { isValidEmail } from "@/helpers";

export default {
  components: {
    Loading,
    Dialog,
  },
  setup() {
    const auth = getAuth();
    const router = useRouter();
    const showPassword = ref(false);

    const loading = ref(false);
    const error = ref("");

    const handleSubmit = async (e) => {
      loading.value = true;
      const { email, password } = e.target.elements;
      if (
        email.value.length > 0 &&
        password.value.length > 0 &&
        isValidEmail(email.value)
      ) {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          await router.replace({ name: "Profile" });
        } catch (e) {
          error.value = e.message;
        }
      } else {
        error.value = "Enter valid Email and Password";
      }
      loading.value = false;
    };

    const googleSignUp = async () => {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      try {
        const result = await signInWithPopup(auth, provider);
        GoogleAuthProvider.credentialFromResult(result);
        router.replace({ name: "User" });
      } catch (e) {
        error.value = e.message;
      }
    };
    return { showPassword, handleSubmit, googleSignUp, error, loading };
  },
};
</script>

