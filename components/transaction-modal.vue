<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ isEditing ? "Add" : "Edit" }} Transaction
      </template>
      <template #default>
        <UForm ref="form" :state="state" :schema="schema" @submit="save">
          <UFormGroup
            label="Transaction type"
            name="type"
            class="mb-4"
            :required="true"
          >
            <USelect
              v-model="state.type"
              placeholder="Category"
              :options="transactionTypes"
              :disabled="isEditing"
            />
          </UFormGroup>

          <UFormGroup label="Amount" required name="amount" class="mb-4">
            <UInput
              v-model.number="state.amount"
              type="number"
              placeholder="Amount"
            />
          </UFormGroup>
          <UFormGroup
            label="Transaction date"
            required
            name="created_at"
            class="mb-4"
          >
            <UInput
              v-model="state.created_at"
              type="date"
              icon="i-heroicons-calendar-days-20-solid"
            />
          </UFormGroup>
          <UFormGroup label="Description" name="description" class="mb-4">
            <UInput v-model="state.description" placeholder="Description" />
          </UFormGroup>
          <UFormGroup
            v-if="state.type === 'expense'"
            label="Category"
            name="category"
            class="mb-4"
            :required="true"
          >
            <USelect
              v-model="state.category"
              placeholder="Category"
              :options="categories"
            />
          </UFormGroup>
          <UButton
            type="submit"
            color="black"
            variant="solid"
            label="Save"
            :loading="isLoading"
            @click="save"
          />
        </UForm>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { categories, transactionTypes } from "~/constants";
import type { Transaction } from "~/types";
import { z } from "zod";

const isLoading = ref(false);

const props = defineProps<{ modelValue: boolean; transaction?: Transaction }>();
const emit = defineEmits(["update:modelValue", "saved"]);
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      resetForm();
    }
    emit("update:modelValue", value);
  },
});

const isEditing = computed(() => !!props.transaction);

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount needs to be more than 0"),
});
const incomeSchema = z.object({
  type: z.literal("income"),
});
const expenseSchema = z.object({
  type: z.literal("expense"),
  category: z.enum(categories),
});
const investmentSchema = z.object({
  type: z.literal("investment"),
});
const savingSchema = z.object({
  type: z.literal("saving"),
});
const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema,
);
const form = ref();
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();
const save = async () => {
  if (form.value.errors.length) return;
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .upsert({ ...state.value, id: props.transaction?.id });
    if (!error) {
      toastSuccess("Transaction saved");
      // emit('update:modelValue', false)
      isOpen.value = false;
      emit("saved");
      return;
    }
    throw error;
  } catch (error: unknown) {
    toastError("Transaction failed", error);

    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const initState: Transaction = isEditing.value
  ? {
      type: props?.transaction?.type || transactionTypes[0],
      amount: props?.transaction?.amount || 0,
      created_at:
        props?.transaction?.created_at.split("T")[0] ||
        new Date().toISOString().split("T")[0],
      description: props?.transaction?.description || "",
      category: props?.transaction?.category || "",
    }
  : {
      type: transactionTypes[0],
      amount: 0,
      created_at: new Date().toISOString().split("T")[0],
      description: "",
      category: categories[0],
    };

const state = ref({ ...initState });
const resetForm = () => {
  Object.assign(state.value, initState);
  form.value.clear();
};
</script>

<style scoped></style>
