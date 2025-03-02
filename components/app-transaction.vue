<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="iconColor" />
        <div>{{ transaction.description }}</div>
      </div>

      <div>
        <UBadge v-if="transaction.category" color="white">{{
          transaction.category
        }}</UBadge>
      </div>
    </div>

    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            variant="ghost"
            color="white"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />
          <TransactionModal
            v-model="isOpen"
            :transaction="transaction"
            @saved="emit('edit', $event)"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ContextMenuItem, Transaction } from "~/types";

const props = defineProps<{
  transaction: Transaction;
}>();
const emit = defineEmits(["delete", "edit"]);

const isIncome = computed(() => {
  return props.transaction.type === "income";
});
const icon = computed(() => {
  return isIncome.value
    ? "i-heroicons-arrow-up-right"
    : "i-heroicons-arrow-down-left";
});
const iconColor = computed(() => {
  return isIncome.value ? "text-green-600" : "text-red-600";
});

const isOpen = ref(false);

const { currency } = useCurrency(props.transaction.amount);

const isLoading = ref(false);
const { toastSuccess, toastError } = useAppToast();

const supabase = useSupabaseClient();

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    await supabase
      .from("transactions")
      .delete()
      .eq("id", props.transaction?.id as string);
    toastSuccess("Transaction deleted");
    emit("delete", props.transaction.id);
  } catch (error) {
    toastError("Transaction is not deleted", error);
  } finally {
    isLoading.value = false;
  }
};
const items: ContextMenuItem[][] = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => (isOpen.value = true),
    },
    {
      label: "Delele",
      icon: "i-heroicons-trash-20-solid",
      click: deleteTransaction,
    },
  ],
];
</script>
