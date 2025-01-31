<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelect :options="transactionViewOptions" v-model="viewSelected" />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { transactionViewOptions } from "~/constants";
import type { TransactionViewOptionsType } from "~/types/index";
const viewSelected = ref<TransactionViewOptionsType>(transactionViewOptions[1]);
</script>
