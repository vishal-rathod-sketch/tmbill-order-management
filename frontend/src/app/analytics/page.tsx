"use client";

import { useState } from "react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  TrendingUp,
  Store,
  ShoppingBag,
  Package,
  Archive,
  Activity,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { api } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────

interface OrdersPerDay {
  day: string;
  total_orders: string;
}

interface RevenuePerStore {
  store_id: string;
  total_revenue: string;
  order_count: string;
}

interface TopItem {
  item_id: string;
  total_qty: string;
}

interface ArchiveResult {
  archived: number;
}

export default function AnalyticsPage() {
  const queryClient = useQueryClient();

  const [archiveMsg, setArchiveMsg] = useState<string | null>(null);

  const [showPopup, setShowPopup] = useState(false);

  // Orders per day
  const { data: ordersPerDay, isLoading: loadingOrders } = useQuery<
    OrdersPerDay[]
  >({
    queryKey: ["analytics", "orders-per-day"],

    queryFn: () => api.get("/analytics/orders-per-day").then((r) => r.data),
  });

  // Revenue per store
  const { data: revenuePerStore, isLoading: loadingRevenue } = useQuery<
    RevenuePerStore[]
  >({
    queryKey: ["analytics", "revenue-per-store"],

    queryFn: () => api.get("/analytics/revenue-per-store").then((r) => r.data),
  });

  // Top items
  const { data: topItems, isLoading: loadingItems } = useQuery<TopItem[]>({
    queryKey: ["analytics", "top-items"],

    queryFn: () => api.get("/analytics/top-items").then((r) => r.data),
  });

  // Archive mutation
  const archiveMutation = useMutation<ArchiveResult>({
    mutationFn: () => api.post("/archive-old-orders").then((r) => r.data),

    onSuccess: (data) => {
      setArchiveMsg(
        data.archived === 0
          ? "No orders older than 30 days found."
          : `Successfully archived ${data.archived} order(s).`,
      );

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      queryClient.invalidateQueries({
        queryKey: ["analytics"],
      });
    },

    onError: () => {
      setArchiveMsg("Archive failed. Check backend logs.");
    },
  });

  // Chart data
  const ordersChartData = (ordersPerDay ?? [])
    .slice()
    .reverse()
    .map((row) => ({
      day: new Date(row.day).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),

      orders: Number(row.total_orders),
    }));

  const revenueChartData = (revenuePerStore ?? []).map((row) => ({
    store: row.store_id,
    revenue: Number(row.total_revenue),
    orders: Number(row.order_count),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-10">
      {/* Popup */}
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
              <CheckCircle2 className="text-green-600" size={22} />

              <div>
                <p className="font-semibold text-gray-900">Archive Completed</p>

                <p className="text-sm text-gray-500">{archiveMsg}</p>
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
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50">
              <BarChart3 className="text-blue-600" size={30} />
            </div>

            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Analytics Dashboard
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Real-time order insights and revenue analytics.
              </p>
            </div>
          </div>

          {/* Archive Button */}
          <motion.button
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() => {
              setArchiveMsg(null);
              archiveMutation.mutate();
            }}
            disabled={archiveMutation.isPending}
            className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-700 shadow-sm transition-all hover:bg-red-100 disabled:opacity-50"
          >
            <Archive size={18} />

            {archiveMutation.isPending
              ? "Archiving..."
              : "Archive Orders > 30 days"}
          </motion.button>
        </div>

        <div className="mb-10 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Tracked Days",
              value: loadingOrders ? "..." : (ordersPerDay?.length ?? 0),
              icon: Activity,
              color: "bg-blue-50 text-blue-600",
            },

            {
              title: "Active Stores",
              value: loadingRevenue ? "..." : (revenuePerStore?.length ?? 0),
              icon: Store,
              color: "bg-green-50 text-green-600",
            },

            {
              title: "Items Sold",
              value: loadingItems ? "..." : (topItems?.length ?? 0),
              icon: Package,
              color: "bg-orange-50 text-orange-600",
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -4,
                }}
                className="rounded-[30px] border border-gray-200 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>

                    <h3 className="mt-2 text-4xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color}`}
                  >
                    <Icon size={26} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Orders per day */}
        <section className="mb-10 rounded-[32px] border border-gray-200 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={24} />

            <h2 className="text-2xl font-bold text-gray-900">Orders Per Day</h2>
          </div>

          {loadingOrders ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                <XAxis
                  dataKey="day"
                  tick={{
                    fill: "#374151",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#cbd5e1",
                  }}
                  tickLine={{
                    stroke: "#cbd5e1",
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#374151",
                    fontSize: 12,
                  }}
                  axisLine={{
                    stroke: "#cbd5e1",
                  }}
                  tickLine={{
                    stroke: "#cbd5e1",
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                  }}
                />

                <Bar dataKey="orders" fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* Revenue */}
        <section className="mb-10 rounded-[32px] border border-gray-200 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <Store className="text-green-600" size={24} />

            <h2 className="text-2xl font-bold text-gray-900">
              Revenue Per Store
            </h2>
          </div>

          {loadingRevenue ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={revenueChartData}
                  margin={{
                    top: 8,
                    right: 20,
                    bottom: 38,
                    left: 56,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                  <XAxis
                    dataKey="store"
                    tick={{
                      fill: "#374151",
                      fontSize: 12,
                    }}
                    axisLine={{
                      stroke: "#cbd5e1",
                    }}
                    tickLine={{
                      stroke: "#cbd5e1",
                    }}
                    label={{
                      value: "Store ID",
                      position: "insideBottom",
                      offset: -24,
                      fill: "#111827",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />

                  <YAxis
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    tick={{
                      fill: "#374151",
                      fontSize: 12,
                    }}
                    axisLine={{
                      stroke: "#cbd5e1",
                    }}
                    tickLine={{
                      stroke: "#cbd5e1",
                    }}
                    label={{
                      value: "Revenue",
                      angle: -90,
                      position: "insideLeft",
                      fill: "#111827",
                      fontSize: 13,
                      fontWeight: 600,
                      style: {
                        textAnchor: "middle",
                      },
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid #e5e7eb",
                    }}
                  />

                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>

              {/* Table */}
              <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-600">
                        Store
                      </th>

                      <th className="p-4 text-left font-semibold text-gray-600">
                        Revenue
                      </th>

                      <th className="p-4 text-left font-semibold text-gray-600">
                        Orders
                      </th>

                      <th className="p-4 text-left font-semibold text-gray-600">
                        Avg Value
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-gray-900">
                    {revenueChartData.map((row) => (
                      <tr
                        key={row.store}
                        className="border-t border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="p-4 font-mono text-xs text-gray-800">
                          {row.store}
                        </td>

                        <td className="p-4 font-semibold text-gray-900">
                          ₹{row.revenue.toLocaleString("en-IN")}
                        </td>

                        <td className="p-4 text-gray-900">{row.orders}</td>

                        <td className="p-4 text-gray-700">
                          ₹
                          {(row.revenue / row.orders).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Top Items */}
        <section className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <div className="mb-6 flex items-center gap-3">
            <ShoppingBag className="text-orange-600" size={24} />

            <h2 className="text-2xl font-bold text-gray-900">
              Top 5 Selling Items
            </h2>
          </div>

          {loadingItems ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              {topItems?.map((item, index) => {
                const maxQty = Number(topItems?.[0]?.total_qty || 1);

                const pct = Math.round((Number(item.total_qty) / maxQty) * 100);

                return (
                  <motion.div
                    key={item.item_id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.05,
                    }}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {index + 1}
                        </div>

                        <div>
                          <p className="font-mono text-sm font-semibold text-gray-900">
                            {item.item_id}
                          </p>

                          <p className="text-xs text-gray-500">
                            Top selling item
                          </p>
                        </div>
                      </div>

                      <span className="font-semibold text-gray-700">
                        {Number(item.total_qty).toLocaleString()} units
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${pct}%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </motion.div>
    </main>
  );
}
