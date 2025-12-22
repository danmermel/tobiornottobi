<script setup>
const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const displaybutton = ref(false)

async function startquiz() {
  await navigateTo('/profile/1')
}

//running inside a timer so that the page can render before all this happens
setTimeout(async function () {

  if (route.query.campaignid) {
    let r
    try {

      r = await useFetch(runtimeConfig.public.getCampaignFunctionUrl.value,
        {
          body: {
            'campaignid': route.query.campaignid
          },
          method: 'post'
        })
      if (!r.data.value) {
        throw new Error("Invalid campaignid")
      }
      // if you get here, the campaign is valid.. store it and then  fetch the profiles and put them in local storage as well 

      localStorage.setItem("campaignid", route.query.campaignid)

      r = await useFetch(runtimeConfig.public.getProfilesFunctionUrl.value,
        {
          method: 'post'
        })

      console.log(r.data.value)
      if (r.data.value.message.length === 0) {
        //no profiles
        throw new Error("No profiles available")
      }

      localStorage.setItem("profiles", JSON.stringify(r.data.value.message))

      //now check whether you already have a user on this device. If not, create a user and put it in local storage


      let userid

      userid = localStorage.getItem("userid")

      if (!userid) {
        //create a new one 
        userid = crypto.randomUUID()
        localStorage.setItem("userid", userid)
      }

      //now you have all the data.. can go to first profile to start voting!
      displaybutton.value = true

    } catch (e) {
      console.error('failed to fetch campaign', e)
      await navigateTo('/error')

    }
  }
  else {
    await navigateTo('/error')
  }

}, 10)

</script>

<template>
  <v-container>

    <v-row class="text-center">
      <v-col cols="6">
        <img src="/assets/careleaver.jpg" class="my-3" contain height="200" />
      </v-col>
      <v-col cols="6">
        <img src="/assets/miner.jpg" class="my-3" contain height="200" />
      </v-col>

      <v-spacer></v-spacer>

      <v-col class="mb-4">
        <h1 class="text-h3 font-weight-bold mb-3">To BI or not to BI</h1>

        <h2 class="subheading font-weight-regular">
          You decide who gets a Basic Income
        </h2>
        <v-expansion-panels variant="popout">
          <v-expansion-panel>
            <v-expansion-panel-title>
              What is a Basic Income?
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-left">
              The idea of a Basic Income is that every individual in society should get a regular (weekly or monthly),
              unconditional cash payment as a right of citizenship. What do you think? Is everyone "deserving" of a
              Basic Income? Take our quiz to find out!
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <p v-if="!displaybutton" class="subheading pt-4 font-weight-regular">
          Loading.. Please wait
          <v-progress-linear color="green" indeterminate></v-progress-linear>
        </p>
        <v-btn class="mt-4" v-if="displaybutton" @click="startquiz">Start the Quiz</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
