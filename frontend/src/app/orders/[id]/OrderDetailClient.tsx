'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { AxiosError } from 'axios';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  PackageCheck,
  ChefHat,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { api } from '@/lib/api';

const STATUSES = [
  'PLACED',
  'PREPARING',
  'COMPLETED',
] as const;

type OrderStatus = (typeof STATUSES)[number];

type OrderItem = {
  item_id: string;
  qty: number;
};

type Order = {
  id: string;
  store_id: string;
  items: OrderItem[] | string;
  total_amount: string | number;
  status: OrderStatus | string;
  created_at: string;
};

type OrdersResponse = {
  data?: Order[];
  pagination?: unknown;
};

const statusConfig: Record<
  OrderStatus,
  {
    icon: LucideIcon;
    color: string;
  }
> = {
  PLACED: {
    icon: Clock3,
    color:
      'bg-yellow-50 text-yellow-700 border-yellow-200',
  },

  PREPARING: {
    icon: ChefHat,
    color:
      'bg-blue-50 text-blue-700 border-blue-200',
  },

  COMPLETED: {
    icon: PackageCheck,
    color:
      'bg-green-50 text-green-700 border-green-200',
  },
};

const fallbackStatus = {
  icon: ShoppingBag,
  color:
    'bg-gray-50 text-gray-700 border-gray-200',
};

function findOrderInCache(
  queryClient: QueryClient,
  id: string
) {
  const orderLists =
    queryClient.getQueriesData<OrdersResponse>({
      queryKey: ['orders'],
    });

  for (const [, list] of orderLists) {
    const match = list?.data?.find(
      (order) => order.id === id
    );

    if (match) return match;
  }

  return undefined;
}

function parseItems(items: Order['items'] | undefined) {
  if (!items) return [];

  if (Array.isArray(items)) return items;

  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatAmount(value: string | number) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return `Rs. ${value}`;

  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  });
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function StateCard({
  title,
  message,
  tone = 'red',
  onRetry,
}: {
  title: string;
  message: string;
  tone?: 'red' | 'blue';
  onRetry?: () => void;
}) {
  const color =
    tone === 'blue'
      ? 'border-blue-200 text-blue-600'
      : 'border-red-200 text-red-600';

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white px-8 py-10 text-center shadow-xl">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border ${color}`}
        >
          <AlertCircle size={26} />
        </div>

        <p className="text-lg font-semibold text-gray-900">
          {title}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {message}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Orders
          </Link>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export function OrderDetailClient({
  id,
}: {
  id: string;
}) {
  const queryClient = useQueryClient();

  const [showPopup, setShowPopup] =
    useState(false);

  const {
    data: order,
    error,
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useQuery<Order | null, AxiosError>({
    queryKey: ['order', id],
    enabled: Boolean(id),
    initialData: () =>
      findOrderInCache(queryClient, id),
    retry: (failureCount, queryError) =>
      queryError.response?.status !== 404 &&
      failureCount < 2,

    queryFn: async () => {
      try {
        const response = await api.get<Order>(
          `/orders/${encodeURIComponent(id)}`
        );

        return response.data ?? null;
      } catch (queryError) {
        const status = (queryError as AxiosError)
          .response?.status;

        if (status === 404) return null;

        throw queryError;
      }
    },
  });

  const orderItems = useMemo(
    () => parseItems(order?.items),
    [order?.items]
  );

  const mutation = useMutation<
    Order,
    AxiosError,
    OrderStatus
  >({
    mutationFn: async (status) => {
      const response = await api.patch<Order>(
        `/orders/${encodeURIComponent(id)}/status`,
        { status }
      );

      return response.data;
    },

    onSuccess: (updatedOrder) => {
      queryClient.setQueryData(
        ['order', id],
        updatedOrder
      );

      queryClient.setQueriesData<OrdersResponse>(
        { queryKey: ['orders'] },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((cachedOrder) =>
              cachedOrder.id === updatedOrder.id
                ? updatedOrder
                : cachedOrder
            ),
          };
        }
      );

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="mx-auto max-w-3xl animate-pulse rounded-[30px] border border-gray-200 bg-white p-8 shadow-xl">
          <div className="mb-6 h-8 w-52 rounded bg-gray-200" />

          <div className="space-y-4">
            <div className="h-16 rounded-2xl bg-gray-100" />
            <div className="h-16 rounded-2xl bg-gray-100" />
            <div className="h-16 rounded-2xl bg-gray-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!id) {
    return (
      <StateCard
        title="Invalid order link"
        message="The order id is missing from this page."
        tone="blue"
      />
    );
  }

  if (isError && !order) {
    const status = error.response?.status;

    return (
      <StateCard
        title="Could not load order"
        message={
          status
            ? `The API returned status ${status}.`
            : 'Check that the backend is running on port 4000.'
        }
        onRetry={() => void refetch()}
      />
    );
  }

  if (!order) {
    return (
      <StateCard
        title="Order not found"
        message="This order is not available in the active orders table."
      />
    );
  }

  const currentStatus =
    statusConfig[order.status as OrderStatus] ??
    fallbackStatus;

  const CurrentStatusIcon = currentStatus.icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-10">
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{
              opacity: 0,
              y: -30,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="fixed right-5 top-5 z-50"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-white px-5 py-4 shadow-2xl">
              <CheckCircle2
                className="text-green-600"
                size={22}
              />

              <div>
                <p className="font-semibold text-gray-900">
                  Status Updated
                </p>

                <p className="text-sm text-gray-500">
                  Order updated successfully.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="mx-auto max-w-3xl"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Orders
          </Link>

          {isFetching && (
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600">
              <RefreshCw
                size={14}
                className="animate-spin"
              />
              Syncing
            </span>
          )}
        </div>

        <div className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[0_10px_50px_rgba(0,0,0,0.08)]">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <ShoppingBag
                className="text-blue-600"
                size={30}
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and update order status.
              </p>
            </div>
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 rounded-3xl border border-gray-200 bg-gray-50 p-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Order ID
                </p>

                <p className="break-all font-semibold text-gray-900">
                  {order.id}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Store ID
                </p>

                <p className="font-semibold text-gray-900">
                  {order.store_id}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Total Amount
                </p>

                <p className="font-semibold text-gray-900">
                  {formatAmount(order.total_amount)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Created
                </p>

                <p className="font-semibold text-gray-900">
                  {formatDate(order.created_at)}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-gray-500">
                  Current Status
                </p>

                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${currentStatus.color}`}
                >
                  <CurrentStatusIcon size={16} />

                  {order.status}
                </div>
              </div>
            </div>
          </motion.div>

          {orderItems.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Items
              </h2>

              <div className="overflow-hidden rounded-2xl border border-gray-200">
                {orderItems.map((item, index) => (
                  <div
                    key={`${item.item_id}-${index}`}
                    className="flex items-center justify-between border-b border-gray-100 px-5 py-4 last:border-b-0"
                  >
                    <span className="font-semibold text-gray-900">
                      {item.item_id}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
                      Qty {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Update Status
            </h2>

            {mutation.isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                Could not update order status.
              </div>
            )}

            {STATUSES.map((status, index) => {
              const config = statusConfig[status];
              const Icon = config.icon;

              const isCurrent =
                order.status === status;

              return (
                <motion.button
                  key={status}
                  type="button"
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  whileHover={{
                    scale: isCurrent ? 1 : 1.02,
                  }}
                  whileTap={{
                    scale: isCurrent ? 1 : 0.98,
                  }}
                  onClick={() =>
                    mutation.mutate(status)
                  }
                  disabled={
                    mutation.isPending || isCurrent
                  }
                  className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-all
                  
                  ${
                    isCurrent
                      ? `${config.color} cursor-default`
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isCurrent
                          ? 'bg-white/60'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="text-left">
                      <p className="font-semibold">
                        {status}
                      </p>

                      <p className="text-sm text-gray-500">
                        Set order as {status}
                      </p>
                    </div>
                  </div>

                  {mutation.isPending &&
                  mutation.variables === status ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  ) : isCurrent ? (
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold">
                      Current
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-blue-600">
                      Update
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
