export const useRedirectIfAuthenticated = (url: string = "/") => {
  const user = useSupabaseUser();

  watch(
    user,
    (user) => {
      if (user) {
          navigateTo(url);
      }
    },
    { immediate: true },
  );

  return { user };
};
