'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  ShoppingBag,
  Store,
  IndianRupee,
  Clock3,
  Search,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  ChefHat,
  Activity,
} from 'lucide-react';

import { api } from '@/lib/api';
import { useSocket } from '@/hooks/useSocket';

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    icon: any;
  }
> = {
  PLACED: {
    color:
      'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Clock3,
  },

  PREPARING: {
    color:
      'bg-blue-50 text-blue-700 border-blue-200',
    icon: ChefHat,
  },

  COMPLETED: {
    color:
      'bg-green-50 text-green-700 border-green-200',
    icon: PackageCheck,
  },
};

export default function OrdersPage() {
  const [storeId, setStoreId] = useState('');
  const [page, setPage] = useState(1);

  useSocket(storeId || undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['orders', storeId, page],

    queryFn: async () => {
      const res = await api.get('/orders', {
        params: {
          store_id: storeId || undefined,
          page,
          limit: 10,
        },
      });

      console.log('API RESPONSE:', res.data);

      return res.data;
    },
  }); // ✅ FIX 1: Closed the useQuery({ ... }) call — was missing });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-10">
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 shadow-sm">
              <ShoppingBag
                className="text-blue-600"
                size={30}
              />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Orders Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Monitor and manage all orders in
                real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
            <Activity
              size={18}
              className="animate-pulse text-green-600"
            />

            <span className="text-sm font-semibold text-green-700">
              Live Updates Active
            </span>
          </div>
        </div>

        {/* Filter Card */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
          }}
          className="mb-8 rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_10px_50px_rgba(0,0,0,0.06)]"
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Filter Orders
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search orders by store ID.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-black placeholder:text-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:shadow-lg"
                placeholder="Enter Store ID"
                value={storeId}
                onChange={(e) => {
                  setStoreId(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 h-5 w-48 rounded bg-gray-200" />

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="h-4 rounded bg-gray-100" />
                  <div className="h-4 rounded bg-gray-100" />
                  <div className="h-4 rounded bg-gray-100" />
                  <div className="h-4 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders */}
        {/* ✅ FIX 2: Added data?.data check to prevent "Cannot read properties of undefined" crash */}
        {data && data.data && (
          <>
            <div className="grid gap-5">
              <AnimatePresence>
                {data.data.map(
                  (order: any, index: number) => {
                    const config =
                      STATUS_CONFIG[
                        order.status
                      ];

                    const StatusIcon =
                      config?.icon || ShoppingBag;

                    return (
                      <motion.div
                        key={order.id}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                        }}
                        transition={{
                          delay: index * 0.05,
                        }}
                        whileHover={{
                          y: -3,
                        }}
                        className="group rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                          {/* Left */}
                          <div className="grid flex-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Order ID
                              </p>

                              <p className="font-mono text-sm font-semibold text-gray-900">
                                {order.id.slice(
                                  0,
                                  12
                                )}
                                ...
                              </p>
                            </div>

                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Store
                              </p>

                              <div className="flex items-center gap-2">
                                <Store
                                  size={16}
                                  className="text-gray-400"
                                />

                                <p className="font-semibold text-gray-900">
                                  {
                                    order.store_id
                                  }
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Amount
                              </p>

                              <div className="flex items-center gap-1">
                                <IndianRupee
                                  size={16}
                                  className="text-gray-400"
                                />

                                <p className="font-semibold text-gray-900">
                                  {
                                    order.total_amount
                                  }
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Created
                              </p>

                              <p className="text-sm font-medium text-gray-600">
                                {new Date(
                                  order.created_at
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Right */}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div
                              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${config?.color}`}
                            >
                              <StatusIcon
                                size={16}
                              />

                              {order.status}
                            </div>

                            <Link
                              href={`/orders/${encodeURIComponent(String(order.id))}`}
                              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                )}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {data.data.length === 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="rounded-[32px] border border-dashed border-gray-300 bg-white px-8 py-20 text-center shadow-sm"
              >
                <ShoppingBag
                  className="mx-auto mb-4 text-gray-300"
                  size={60}
                />

                <h3 className="text-2xl font-bold text-gray-800">
                  No Orders Found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try changing the store filter
                  or create a new order.
                </p>
              </motion.div>
            )}

            {/* Pagination */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-8 flex flex-col gap-4 rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Showing page{' '}
                  <span className="font-bold text-gray-900">
                    {page}
                  </span>{' '}
                  · Total Orders:{' '}
                  <span className="font-bold text-gray-900">
                    {data.pagination?.total ?? 0}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  disabled={page === 1}
                  onClick={() =>
                    setPage((p) => p - 1)
                  }
                  className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                  Prev
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  disabled={
                    page * 10 >=
                    (data.pagination?.total ?? 0)
                  }
                  onClick={() =>
                    setPage((p) => p + 1)
                  }
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-medium text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </main>
  );
}