export const useAppToast = () => {
    const toast = useToast()

        return {
            toastSuccess: (title:string, description?:string|undefined) => {
                toast.add({title, description, icon:'i-heroicons-check-circle', color:'green'})
            },
            toastError: (title:string, description?:string|undefined) => {

                toast.add({title, description, icon:'i-heroicons-exclamation-circle', color:'red'})
            },

    }
}
