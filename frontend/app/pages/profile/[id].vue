<script setup>
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
          'votevalue' : v
        },
        method: 'post'
      })
    if (!r.data.value) {
      throw new Error("Failed to register vote")
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


<template>
  <h1> {{ profile.profileheading }}</h1>
  <h2>{{ profile.profilename }}</h2>
  <h3>{{ profile.profiletext }}</h3>

  <v-btn :disabled="disablebuttons" @click="vote(true)">Yes </v-btn>
  <v-btn :disabled="disablebuttons" @click="vote(false)"> No</v-btn>

  <div v-if="disablebuttons && nextprofileexists">
    You have voted!
    <v-btn @click="next">Next Profile</v-btn>
  </div>
  <div v-if="disablebuttons && !nextprofileexists">
    Thank you! voting is done!
  </div>
</template>