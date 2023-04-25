<template>
  <input ref="locationInput" type="text" :value="location" @input="updateLocation($event.target.value)" />
</template>

<script>
import { ref } from "vue";
import { loadGoogleMaps } from "../helpers/googleMapsLoader";

export default {
  props: {
    location: String
  },
  setup(props, { emit }) {
    const locationInput = ref(null);

    function initializeAutocomplete(googleMaps) {
      const autocomplete = new googleMaps.places.Autocomplete(locationInput.value);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        emit("update:location", place.formatted_address);
      });
    }

    function updateLocation(value) {
      emit("update:location", value);
    }

    const apiKey = ""; // Replace this with your Google Maps API key
    loadGoogleMaps(apiKey, initializeAutocomplete);

    return { locationInput, updateLocation };
  }
};
</script>
