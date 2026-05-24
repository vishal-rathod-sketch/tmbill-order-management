'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ShoppingBag, IndianRupee, Store, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Item {
  item_id: string;
  qty: number;
}

export default function CreateOrderPage() {
  const queryClient = useQueryClient();

  const [storeId, setStoreId] = useState('');
  const [items, setItems] = useState<Item[]>([
    { item_id: '', qty: 1 },
  ]);
  const [totalAmount, setTotalAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: any) =>
      api.post('/orders', payload).then((r) => r.data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });

      setShowSuccess(true);

      setStoreId('');
      setItems([{ item_id: '', qty: 1 }]);
      setTotalAmount('');

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    },
  });

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        item_id: '',
        qty: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutation.mutate({
      store_id: storeId,
      items,
      total_amount: parseFloat(totalAmount),
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-10">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-white px-5 py-4 shadow-2xl">
              <CheckCircle2 className="text-green-600" size={22} />
              <div>
                <p className="font-semibold text-gray-900">
                  Order Created Successfully
                </p>
                <p className="text-sm text-gray-500">
                  Your order has been added.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[0_10px_50px_rgba(0,0,0,0.08)]">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
              <ShoppingBag className="text-blue-600" size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Create Order
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Add order details with a clean modern experience.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-gray-700">
                Store ID
              </label>

              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg">
                <Store size={18} className="text-gray-400" />

                <input
                  className="w-full bg-transparent px-3 py-4 text-black placeholder:text-gray-400 outline-none"
                  placeholder="Enter store ID"
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Order Items
                </label>

                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-all hover:scale-105 hover:bg-blue-100"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="grid gap-4 md:grid-cols-[1fr_120px_auto]">
                        <input
                          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition-all focus:border-blue-500 focus:shadow-md"
                          placeholder="Item ID"
                          value={item.item_id}
                          onChange={(e) =>
                            updateItem(i, 'item_id', e.target.value)
                          }
                          required
                        />

                        <input
                          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none transition-all focus:border-blue-500 focus:shadow-md"
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(i, 'qty', (() => {
                              const parsedQty = Number.parseInt(
                                e.target.value,
                                10
                              );
                              return Number.isNaN(parsedQty)
                                ? 1
                                : parsedQty;
                            })())
                          }
                          required
                        />

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(i)}
                            className="rounded-xl border border-red-200 px-4 py-3 font-medium text-red-500 transition-all hover:bg-red-50"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="space-y-2"
            >
              <label className="text-sm font-semibold text-gray-700">
                Total Amount
              </label>

              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-lg">
                <IndianRupee size={18} className="text-gray-400" />

                <input
                  className="w-full bg-transparent px-3 py-4 text-black placeholder:text-gray-400 outline-none"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base font-semibold text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating Order...
                </div>
              ) : (
                'Create Order'
              )}
            </motion.button>

            <AnimatePresence>
              {mutation.isError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  Failed to create order. Please try again.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
