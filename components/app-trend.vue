<template>
  <div>
    <div class="font-bold" :class="[color]">{{ title }}</div>
    <div class="text-2xl font-extrabold text-black dark:text-white">
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else>{{ currency }}</div>
    </div>
    <div>
      <USkeleton v-if="loading" class="h-6 w-full" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          class="w-6 h-6"
          :class="[trendingUp ? 'green' : 'red']"
          :name="icon"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Trend } from "~/types";
const props = defineProps<Trend & { loading?: boolean }>();
const { amount } = toRefs(props);

const trendingUp = computed(() => {
  return props.amount > props.lastAmount;
});
const icon = computed(() => {
  return trendingUp.value
    ? "heroicons:arrow-trending-up"
    : "heroicons:arrow-trending-down";
});

const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) {
    return "N/A";
  }
  const bigger = Math.max(props.amount, props.lastAmount);
  const lower = Math.min(props.amount, props.lastAmount);
  return `${(((bigger - lower) / lower) * 100).toFixed(2)}%`;
});

const { currency } = useCurrency(amount);
</script>
<style>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
