<template>
  <v-container>
    <div class="pb-2">
      <v-progress-linear model-value="100" height="25" color="cyan">
        <small class="text-black">All votes cast</small>
      </v-progress-linear>
    </div>
    <v-row class="text-center">
      <v-col cols="6">
        <img src="/assets/studentport.jpg" class="my-3" contain height="200" />
      </v-col>
      <v-col cols="6">
        <img src="/assets/farmer.jpg" class="my-3" contain height="200" />
      </v-col>
      <v-col class="mb-4">
        <h1 class="text-h3 font-weight-bold mb-3">Thank you for voting!</h1>

        <p class="subheading font-weight-regular">
          Stay tuned for results! </p>
        <v-btn href="https://forms.gle/VVTP6pkSHE83b31n8" target="_blank">What did you think of this quiz?
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>