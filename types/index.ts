import {categories, transactionTypes, transactionViewOptions} from "../constants";
export type TransactionViewOptionsType =
  (typeof transactionViewOptions)[number];

export type Trend = {
    title: string;
    amount: number;
    lastAmount: number;
    color: string;
}

export type ContextMenuItem = {
    label: string,
    icon: string,
    click: () => void
}

export type TransactionType = (typeof  transactionTypes)[number];
export type TransactionCategory =  (typeof categories)[number];

export type Transaction = {
    id?: string;
    created_at: string;
    amount: number;
    type: TransactionType;
    description?: string;
    category?: string;
    user_id?: string;
}
export type TransactionsByDate = {
    [key: string]: Transaction[];
};

export type TimePeriod = {
    from: Date;
    to: Date;
}

export type UserData = {
    id?: string;
    email?: string;
    user_metadata?: {
        full_name: string;
        transaction_view: string;
    }
}
