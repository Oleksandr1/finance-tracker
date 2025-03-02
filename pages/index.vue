<template>
  <div>
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelect :options="transactionViewOptions" v-model="viewSelected" />
      </div>
    </section>
    <section
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 sm:gap-16 mb-10"
    >

      <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="previousIncomeCount" :loading="pending" />
      <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="previousExpenseCount" :loading="pending" />
<!--      <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="pending" />-->
<!--      <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="pending" />-->
    </section>
    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
        </div>
      </div>
      <div>
        <TransactionModal v-model="isOpen" @saved="refresh"/>
        <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen=!isOpen" />
      </div>

    </section>
    <section v-if="!pending">
      <div v-for="(transactionsOnDate, date) in byDate" :key="date">
        <DailyTransactionsSummary :date="date" :transactions="transactionsOnDate"  />
              <Transaction v-for="transaction in transactionsOnDate" :key="transaction.id" :transaction="transaction" @delete="refresh()" @edit="refresh"/>
      </div>
    </section>
    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i"/>
    </section>

  </div>
</template>
<script lang="ts" setup>
import { transactionViewOptions } from "~/constants";
import type {Transaction, TransactionsByDate, TransactionViewOptionsType} from "~/types";
import {useSelectedTimePeriod} from "~/composables/useSelectedTimePeriod";

const user = useSupabaseUser()
const viewSelected = ref<TransactionViewOptionsType>(user.value?.user_metadata.transaction_view || transactionViewOptions[1]);
const isOpen = ref(false)

const {current, previous} = useSelectedTimePeriod(viewSelected)

const { pending, refresh, transactions: {
  incomeCount,
  expenseCount,
  incomeTotal,
  expenseTotal,
  grouped: {
    byDate
  }
} } = useFetchTransactions(current)

await  refresh()
const {refresh: prevRefresh,  transactions: {
  incomeCount: previousIncomeCount,
  expenseCount: previousExpenseCount,

} } = useFetchTransactions(previous)

await prevRefresh()

</script>
