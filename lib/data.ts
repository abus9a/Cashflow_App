import { addDays, format } from "date-fns";

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  status: "paid" | "planned";
  name: string;
};

export const initialBalance = 50000;


export const transactions: Transaction[] = [
  { id: "1", date: format(addDays(new Date(), 1), "yyyy-MM-dd"), amount: 20000, type: "income", status: "planned", name: "Client Payment A" },
  { id: "2", date: format(addDays(new Date(), 3), "yyyy-MM-dd"), amount: 15000, type: "expense", status: "planned", name: "Office Rent" },
  { id: "3", date: format(addDays(new Date(), 5), "yyyy-MM-dd"), amount: 80000, type: "expense", status: "planned", name: "Big Purchase (Gap here!)" },
  { id: "4", date: format(addDays(new Date(), 7), "yyyy-MM-dd"), amount: 40000, type: "income", status: "planned", name: "Weekly Revenue" },
];

export const calculateForecast = (currentTransactions: Transaction[]) => {
  let current = initialBalance;
  const forecast = [];
  
  for (let i = 0; i < 15; i++) {
    const dateStr = format(addDays(new Date(), i), "yyyy-MM-dd");
    
    const dailyTx = currentTransactions.filter(t => t.date === dateStr);
    
    dailyTx.forEach(t => {
      if (t.type === 'income') current += t.amount;
      else current -= t.amount;
    });

    forecast.push({
      date: dateStr,
      balance: current,
      isNegative: current < 0 
    });
  }
  return forecast;
};