"use client";
import { useState } from "react";
import { Transaction } from "@/lib/data";

export default function TransactionForm({ onAdd }: { onAdd: (t: Transaction) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    type: "expense",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      amount: Number(formData.amount),
      type: formData.type as "income" | "expense",
      date: formData.date,
      status: "planned",
      id: Math.random().toString(),
    });
    setFormData({ name: "", amount: "", type: "expense", date: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border mb-8">
      <h3 className="font-bold mb-4 text-gray-700">Add New Operation</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          required
          type="date"
          className="border p-2 rounded"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <input
          required
          placeholder="Description"
          className="border p-2 rounded col-span-2"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="Amount"
          className="border p-2 rounded"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <select
          className="border p-2 rounded"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 w-full md:w-auto">
        Add to Plan
      </button>
    </form>
  );
}