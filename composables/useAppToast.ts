export const useAppToast = () => {
  const toast = useToast();

  return {
    toastSuccess: (title: string, description?: string | undefined) => {
      toast.add({
        title,
        description,
        icon: "i-heroicons-check-circle",
        color: "green",
      });
    },
    toastError: (title: string, error?: unknown) => {
      const errorText = (
        error instanceof Error ? error.message : error
      ) as string;

      toast.add({
        title,
        description: errorText,
        icon: "i-heroicons-exclamation-circle",
        color: "red",
      });
    },
  };
};
