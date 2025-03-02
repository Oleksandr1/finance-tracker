export const useAvatarUrl = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();
  const fileName = computed(() => user.value?.user_metadata?.avatar);

  const getPublicUrl = () => {
    if (!fileName.value) return;
    const { data } = supabase.storage
      .from("avatar")
      .getPublicUrl(fileName.value);
    return data.publicUrl;
  };
  const url = ref(getPublicUrl());

  watch(user, () => (url.value = getPublicUrl()), {
    immediate: true,
    deep: true,
  });

  return { url };
};
