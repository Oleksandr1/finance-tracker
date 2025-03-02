export const useRedirectIfAuthenticated = (url: string = "/") => {
  const user = useSupabaseUser();

  console.log("user", user);
  watch(
    user,
    (user) => {
      if (user) {
        return navigateTo(url);
      }
    },
    { immediate: true },
  );

  return { user };
};
