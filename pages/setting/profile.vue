<template>
  <UForm :state="state" :schema="schema" :pending="pending">
    <UFormGroup class="mb-4" label="Full Name" name="name" >
      <UInput v-model="state.name" />
    </UFormGroup>
    <UFormGroup class="mb-4" label="Email" name="email">
      <UInput type="email"  v-model="state.email" />
    </UFormGroup>

    <UButton type="submit" color="black" variant="solid" label="Save" :loading="pending" @click="handleSubmit" :disabled="pending"></UButton>

  </UForm>
</template>
<script setup lang="ts">
import { z } from 'zod'
import type {UserData} from "~/types";

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {toastSuccess, toastError} = useAppToast()
const pending = ref(false)

const state = ref({
  name: user.value?.user_metadata?.full_name,
  email: user.value?.email
})

const schema = z.object({
  name: z.string().min(2).optional(),
  email:z.string().email()
})

const handleSubmit = async ()=>{
  pending.value = true
  const data = {
    data: {
      full_name: state.value.name,
    }
  } as UserData
  try {
    if(state.value.email !== user.value?.email){
      data.email = state.value.email
    }
    const { error } = await supabase.auth.updateUser(data)

    toastSuccess('Profile updated', 'Your profile has been updated')

  } catch (error:unknown){
    const errorText = ((error instanceof Error)?error.message : error) as string

    toastError('Error update profile', errorText)

  } finally {
    pending.value = false
  }
}
</script>
