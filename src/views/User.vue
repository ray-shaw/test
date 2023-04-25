<template>
  <div class="flex flex-col items-center w-full">
    <!-- Admin section -->
    <div class="admin-section w-full" >
      <h1 class="text-xl font-semibold mb-4">Admin Section</h1>
      <table class="table-auto w-full mb-4">
        <thead>
          <tr>
            <th class="text-left">Username</th>
            <th class="text-left">Email</th>
            <th class="text-left">Location</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.userName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.location }}</td>
            <td class="flex">
              <button @click="editUser(user)">Edit</button>
              <button @click="confirmDeleteUser(user)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button v-if="!showAddUserPanel" class="primary" @click="addNewUser">Add User</button>
      <div v-if="showAddUserPanel" class="add-user-panel flex flex-col gap-5 mt-4">
        <input type="text" v-model="newUser.userName" placeholder="Username" />
        <input type="text" v-model="newUser.email" placeholder="Email" />
        <input type="text" v-model="newUser.location" placeholder="Location" />
        <button class="primary" @click="saveNewUser">Save User</button>
        <button class="secondary" @click="showAddUserPanel = false">Cancel</button>
      </div>
    </div>

    <!-- User details section -->
    <div v-if="!showAddUserPanel" class="user-details-section w-full mt-4">
      <h1 class="text-xl font-semibold mb-4">User Details</h1>
      <div class="flex flex-col gap-5">
        <input type="text" v-model="selectedUser.userName" @blur="updateUser('userName')" placeholder="Username" :disabled="detailsDisabled" :class="detailsDisabled ? 'opacity-75' : 'opacity-100'" />
        <input type="text" v-model="selectedUser.email" @blur="updateUser('email')" placeholder="Email" :disabled="detailsDisabled" :class="detailsDisabled ? 'opacity-75' : 'opacity-100'" />
        <input type="text" v-model="selectedUser.location" @blur="updateUser('location')" placeholder="Location" :disabled="detailsDisabled" :class="detailsDisabled ? 'opacity-75' : 'opacity-100'" />
        <button class="primary" @click="detailsDisabled = false" v-show="detailsDisabled">Edit Details</button>
        <button class="secondary" @click="detailsDisabled = true" v-show="!detailsDisabled">Save Details</button>
      </div>
    </div>

    <!-- Tokens section -->
    <div class="user-details-section w-full mt-4">
      <h1 class="text-xl font-semibold mb-4">Tokens</h1>
      <div class="flex flex-col gap-5">
        <button class="primary" @click="addTokens(10)">Add 10 tokens</button>
      </div>
    </div>

  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { getFirestore, collection, doc, getDocs, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firebaseApp } from "@/firebase";
import { loadStripe } from '@stripe/stripe-js';

export default {
  name: 'UserManagement',
  setup() {

    let detailsDisabled = ref(true);

    const showTick = reactive({ userName: false, email: false, location: false });

    const db = getFirestore(firebaseApp);
    const users = ref([]);
    const selectedUser = reactive({ id: null, userName: '', email: '', location: '' });
    const newUser = reactive({ userName: '', email: '', location: '' });
    const showAddUserPanel = ref(false);

    async function initStripe() {
      const stripePublicKey = 'pk_test_';
      const stripe = await loadStripe(stripePublicKey);
      return stripe;
    }

    async function addTokens(tokenCount) {
      alert(`this isnt really working :/`)
      const stripe = await initStripe();
      let baseUrl = '';

      if (process.env.NODE_ENV === 'production') {
        baseUrl = 'https://test-d9b75.web.app';
      } else {
        baseUrl = 'https://47bf-14-2-41-74.au.ngrok.io';
      }

      const url = `${baseUrl}/createCheckoutSession`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokenCount: tokenCount,
          userId: selectedUser.id
        })
      });

      const session = await response.json();
      if (session.error) {
        console.error(session.error.message);
        return;
      }

      // Redirect user to the Stripe Checkout page
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) {
        console.error(error.message);
      }
    }

    function fetchUsers() {
      const userCollection = collection(db, 'users');
      
      const unsubscribe = onSnapshot(userCollection, (querySnapshot) => {
        users.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });

      onUnmounted(() => {
        unsubscribe();
      });
    }

    function addNewUser() {
      showAddUserPanel.value = true;
    }

    async function saveNewUser() {
      const userCollection = collection(db, 'users');
      await setDoc(doc(userCollection), { userName: newUser.userName, email: newUser.email, location: newUser.location });
      newUser.userName = '';
      newUser.email = '';
      newUser.location = '';
      showAddUserPanel.value = false;
      await fetchUsers();
    }


    function editUser(user) {
      selectedUser.id = user.id;
      selectedUser.userName = user.userName;
      selectedUser.email = user.email;
      selectedUser.location = user.location;
    }

    async function updateUser(field) {
      if (!selectedUser.id) return;
      const userDoc = doc(db, 'users', selectedUser.id);
      await updateDoc(userDoc, { [field]: selectedUser[field] });
      
      showTick[field] = true;
      setTimeout(() => {
        showTick[field] = false;
      }, 1000);
    }


    async function confirmDeleteUser(user) {
      if (confirm(`Are you sure you want to delete user ${user.userName}?`)) {
        await deleteUser(user.id);
      }
    }

    async function deleteUser(userId) {
      const userDoc = doc(db, 'users', userId);
      await deleteDoc(userDoc);
      await fetchUsers();
    }

    onMounted(() => {
      fetchUsers();
    });
    return {
      users,
      selectedUser,
      newUser,
      showAddUserPanel,
      addNewUser,
      editUser,
      updateUser,
      confirmDeleteUser,
      saveNewUser,
      detailsDisabled,
      addTokens
    };

  },
};
</script>
