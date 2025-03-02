<template>
  <UCard v-if="!success">
    <template #header>
      Sign-in to Finance Tracker
    </template>
    <form @submit.prevent="handleLogin">
      <UFormGroup label="Email" name="email" class="mb-4" required help="You will recieve an email with the confirmation link">
        <UInput type="email" placeholder="Email" required v-model="email" :loading="pending"/>

      </UFormGroup>
      <UButton type="submit" variant="solid" color="black" label="Sign-in"/>
    </form>
  </UCard>
  <UCard v-else>
    <template #header>
      Check your email
    </template>
    <div>
      <p>We have sent you an email to <strong>{{email}}</strong> with a confirmation link. Please check your email and click on the link to sign-in.</p>
      <p><strong>Important:</strong>The Link will expire in 5 minutes</p>
    </div>
  </UCard>
</template>
<script lang="ts" setup>
import {useRedirectIfAuthenticated} from "~/composables/useRedirectIfAuthenticated";
import {undefined} from "zod";

const email = ref('')
const success = ref(false)
const pending = ref(false)
const { toastError } = useAppToast()
const supabase = useSupabaseClient()

useRedirectIfAuthenticated()

const handleLogin = async () => {
  pending.value = true
  try{
    const {error} = await supabase.auth.signInWithOtp({email:email.value, options: {
      emailRedirectTo:'http://localhost:3000/confirm'
      }
    })

    if(error) {
      toastError('Error authentication', error.message)
    }
    success.value = true
  } catch (error:unknown) {
    const errorText = ((error instanceof Error)?error.message : error) as string
    toastError('Error', errorText)
  } finally {
    pending.value = false
  }
}
</script>
