<template>
  <header class="flex justify-between items-center mt-5">
    <NuxtLink to="/">Finance Tracker</NuxtLink>
    <div>
      <UDropdown
        v-if="user"
        :items="items"
        mode="click"
        :ui="{ item: { disabled: 'cursor-text select-text' }, width: 'w-64' }"
      >
        <UAvatar :src="url" alt="Avatar" />
        <template #account="{}">
          <div class="text-left">
            <p>Signed in as</p>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ user.email }}
            </p>
          </div>
        </template>

        <template #item="{ item }">
          <span class="truncate">{{ item.label }}</span>

          <UIcon
            :name="item.icon"
            class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
          />
        </template>
      </UDropdown>
    </div>
  </header>
</template>
<script lang="ts" setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { url } = useAvatarUrl();
const items = [
  [
    {
      label: user.value?.email,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      click: () => navigateTo("/setting/profile"),
    },
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: async () => {
        console.log("CLICK");
        await supabase.auth.signOut();
        return navigateTo("/login");
      },
    },
  ],
];
</script>
