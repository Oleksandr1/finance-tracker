<template>
  <UCard v-if="!success">
    <template #header> Sign-in to Finance Tracker </template>
    <form @submit.prevent="handleLogin">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        required
        help="You will recieve an email with the confirmation link"
      >
        <UInput
          v-model="email"
          type="email"
          placeholder="Email"
          required
          :loading="pending"
        />
      </UFormGroup>
      <UButton type="submit" variant="solid" color="black" label="Sign-in" />
    </form>
  </UCard>
  <UCard v-else>
    <template #header> Check your email </template>
    <div>
      <p>
        We have sent you an email to <strong>{{ email }}</strong> with a
        confirmation link. Please check your email and click on the link to
        sign-in.
      </p>
      <p><strong>Important:</strong>The Link will expire in 5 minutes</p>
    </div>
  </UCard>
</template>
<script lang="ts" setup>
import { useRedirectIfAuthenticated } from "~/composables/useRedirectIfAuthenticated";

const email = ref("");
const success = ref(false);
const pending = ref(false);
const { toastError } = useAppToast();
const supabase = useSupabaseClient();

const redirectUrl = useRuntimeConfig().public?.baseUrl
useRedirectIfAuthenticated();

const handleLogin = async () => {
  pending.value = true;
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${redirectUrl}/confirm`,
      },
    });

    if (error) {
      toastError("Error authentication", error);
    }
    success.value = true;
  } catch (error: unknown) {
    toastError("Error", error);
  } finally {
    pending.value = false;
  }
};
</script>
