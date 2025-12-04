<script setup>
// import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()


//fetch profiles from local storage and display the relevant one

const profiles = ref([])
const profile = ref({})
const disablebuttons = ref(false)
const nextprofileexists = ref(true)
profiles.value = JSON.parse(localStorage.getItem("profiles"))
const currentprofile = parseInt(route.params.id)
const numberofprofiles = profiles.value.length
profile.value = profiles.value[currentprofile - 1]
console.log(profile.value)

nextprofileexists.value = currentprofile < numberofprofiles ? true : false

async function vote(v) {
  disablebuttons.value = true
  console.log(v)
  try {

    const r = await useFetch(runtimeConfig.public.writeVoteFunctionUrl.value,
      {
        body: {
          'campaignid': localStorage.getItem("campaignid"),
          'userid': localStorage.getItem("userid"),
          'profileid': profile.value.profileid,
          'votevalue': v
        },
        method: 'post'
      })
    if (!r.data.value) {
      throw new Error("Failed to register vote")
    }
    if (!nextprofileexists.value) {
      //reached end..go to thank you page
        await navigateTo("/thankyou")


    }
  }
  catch (e) {
    console.log(e)

  }
}


async function next() {
  await navigateTo(`/profile/${currentprofile + 1}`)
}

</script>
<style>
@import url("~/assets/markdown.css");
</style>

<template>
  <v-card>
    <v-img height="200px" :src="`/assets/${profile.profileid}.jpg`" cover></v-img>
    <v-card-title style="font-size: 40px;">
      {{ profile.profileheading }}

    </v-card-title>
    <v-card-subtitle style="font-size: 40px;">
      {{ profile.profilename }}
    </v-card-subtitle>
    <v-card-text>
      <MDC class="markdown-body" :value="profile.profiletext" />
    </v-card-text>
    <v-card-actions>
      <v-btn style="color:green" :disabled="disablebuttons" @click="vote(true)">Yes </v-btn>
      <v-btn style="color:red" :disabled="disablebuttons" @click="vote(false)"> No</v-btn>

      <v-spacer></v-spacer>
      <row v-if="disablebuttons && nextprofileexists">
        <v-btn @click="next">Next Profile</v-btn>
      </row>
    </v-card-actions>
  </v-card>
  <!-- <v-img :src="`/assets/${profile.profileid}.jpg`"></v-img> -->

</template>