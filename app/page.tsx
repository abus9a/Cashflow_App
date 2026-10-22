"use client";

import { useState, useEffect } from 'react';
import CashflowChart from '@/components/CashflowChart';
import TransactionForm from '@/components/TransactionForm';
import { transactions as initialData, initialBalance, Transaction } from '@/lib/data';
import { useAuth } from '@/context/AuthContext'; 

import { ArrowUpCircle, ArrowDownCircle, Wallet, LogOut, Lock, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cashflow_data');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions(initialData);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cashflow_data', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const handleAddTransaction = (newTx: Transaction) => {
    const updated = [...transactions, newTx].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setTransactions(updated);
  };

  const toggleStatus = (id: string) => {
    const updated = transactions.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'planned' ? 'paid' : 'planned' };
      }
      return t;
    });
    // @ts-ignore
    setTransactions(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this operation?')) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="mb-6 flex justify-center text-blue-600">
            <Lock size={48} />
          </div>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Login to Cashflow</h1>
          <div className="space-y-4">
            <button onClick={() => login('owner')} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium">
              Login as Owner
            </button>
            <button onClick={() => login('accountant')} className="w-full bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700 transition font-medium">
              Login as Accountant
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalPlannedIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'planned')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalPlannedExpense = transactions
    .filter(t => t.type === 'expense' && t.status === 'planned')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Panel</h1>
            <p className="text-sm text-gray-500">
              Role: <span className={`font-bold ${user.role === 'owner' ? 'text-blue-600' : 'text-emerald-600'}`}>
                {user.role === 'owner' ? 'Owner' : 'Accountant'}
              </span>
            </p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded transition">
            <LogOut size={16} /> Log out
          </button>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Wallet /></div>
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-2xl font-bold">{initialBalance.toLocaleString()} ₸</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600"><ArrowUpCircle /></div>
            <div>
              <p className="text-sm text-gray-500">Planned Income</p>
              <p className="text-2xl font-bold text-green-600">+{totalPlannedIncome.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600"><ArrowDownCircle /></div>
            <div>
              <p className="text-sm text-gray-500">Planned Expense</p>
              <p className="text-2xl font-bold text-red-600">-{totalPlannedExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>


        {user.role === 'owner' && (
          <div className="animate-fade-in">
            <CashflowChart transactions={transactions} />
          </div>
        )}

       
        {user.role === 'accountant' && (
          <div className="animate-fade-in">
            <TransactionForm onAdd={handleAddTransaction} />
          </div>
        )}


        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Operations Registry</h3>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">Total: {transactions.length}</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                {user.role === 'accountant' && <th className="p-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const isOverdue = new Date(t.date) < new Date() && t.status === 'planned';
                return (
                  <tr key={t.id} className="border-b hover:bg-gray-50 transition group">
                    <td className="p-4 flex items-center gap-2">
                      {isOverdue && <AlertCircle size={16} className="text-red-500" />}
                      <span className={isOverdue ? "text-red-600 font-medium" : ""}>{t.date}</span>
                    </td>
                    <td className="p-4 font-medium text-gray-700">{t.name}</td>
                    <td className={`p-4 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border flex w-fit items-center gap-1
                        ${t.status === 'planned' 
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                          : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {t.status === 'planned' ? '⏳ Planned' : 'Paid'}
                      </span>
                    </td>
                    
                    {user.role === 'accountant' && (
                      <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       
                        {t.status === 'planned' && (
                          <button 
                            onClick={() => toggleStatus(t.id)}
                            className="bg-emerald-100 text-emerald-700 p-2 rounded-lg hover:bg-emerald-200 transition"
                            title="Mark as Paid"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}

                        <button 
                            onClick={() => handleDelete(t.id)}
                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}