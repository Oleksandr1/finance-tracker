import type {TimePeriod, Transaction, TransactionsByDate} from "~/types";
import type {ComputedRef} from "vue";

export const useFetchTransactions = (period:globalThis.Ref<TimePeriod>) => {
    const supabase = useSupabaseClient()
    const transactions = ref<Transaction[]>([]);
    const pending = ref(false)

    const income = computed(() => transactions.value.filter(t => t.type === 'income'))
    const expense = computed(() => transactions.value.filter(t => t.type === 'expense'))
    const incomeCount = computed(() => income.value.length)
    const expenseCount = computed(() => expense.value.length)

    const incomeTotal = computed(() => income.value.reduce((acc, t) => acc + t.amount, 0))
    const expenseTotal = computed(() => expense.value.reduce((acc, t) => acc + t.amount, 0))
    const fetchTransactions = async (): Promise<Transaction[]> => {
        pending.value = true
        try {
            const {data} = await useAsyncData<Array<Transaction>>(`transitions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,async (): Promise<Transaction[]> => {
                const {
                    data,
                    error
                } = await supabase.from('transactions')
                    .select()
                    .gte('created_at', period.value.from.toISOString())
                    .lte('created_at', period.value.to.toISOString())
                    .order('created_at', {ascending: false})
                if (error) {
                    return []
                }
                return data as Transaction[]
            })
            transactions.value = data.value || [];
            return data.value || []

        } catch (error) {

        } finally {
            pending.value = false
        }
        return [] as Transaction[]
    }
    const refresh = async () => {
        transactions.value = await fetchTransactions()
    }

    const transactionsGroupedByDate: ComputedRef<TransactionsByDate> = computed(() => {
        let grouped: TransactionsByDate = {}
        for (const transaction of transactions.value) {
            const date = transaction.created_at.split('T')[0] // new Date(transaction.created_at).toISOString().split('T')[0]
            if (!grouped[date]) {
                grouped[date] = []
            }
            grouped[date].push(transaction)
        }
        return grouped
    })

    watch(period, async ()=>await refresh())

    return {
        transactions: {
            all: transactions,
            grouped: {
                byDate: transactionsGroupedByDate
            },
            income,
            expense,
            incomeTotal,
            expenseTotal,
            incomeCount,
            expenseCount
        },
        refresh,
        pending
    }
}
