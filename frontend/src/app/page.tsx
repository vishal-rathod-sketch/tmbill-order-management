'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import {
  ArrowRight,
  Clock3,
  PackageCheck,
  ShoppingBag,
  Star,
  Truck,
  UtensilsCrossed,
  Leaf,
  ShieldCheck,
  ChefHat,
} from 'lucide-react';

const features = [
  {
    title: 'Real-Time Tracking',
    description:
      'Track your food orders live with instant delivery updates and accurate ETA.',
    icon: Truck,
  },
  {
    title: 'Smart Order Management',
    description:
      'Manage all customer orders from a modern and powerful dashboard.',
    icon: PackageCheck,
  },
  {
    title: 'Fast Delivery',
    description:
      'Lightning-fast delivery system with optimized food dispatch tracking.',
    icon: Clock3,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Background Blur */}
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-green-200/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-emerald-200/30 blur-3xl" />

      {/* HERO SECTION */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 py-20 lg:min-h-screen lg:flex-row">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{
            opacity: 0,
            x: -40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative z-10 max-w-2xl text-center lg:text-left"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-5 py-2 text-sm font-semibold text-green-700 shadow-sm backdrop-blur">
            <Leaf size={16} />

            Premium Food Delivery Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black leading-tight tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Fresh Food
            <span className="block bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Delivered Smarter
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600 lg:mx-0">
            Experience a next-generation food ordering platform with
            real-time tracking, lightning-fast delivery, and a beautifully
            designed management dashboard.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/create-order"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-green-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              Start Ordering

              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-green-100 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:border-green-300 hover:bg-green-50"
            >
              View Orders
            </Link>
          </div>

          {/* STATS */}
          <div className="mt-14 grid grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg backdrop-blur">
              <h3 className="text-3xl font-bold text-gray-900">
                15K+
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Orders Completed
              </p>
            </div>

            <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg backdrop-blur">
              <h3 className="text-3xl font-bold text-gray-900">
                98%
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Customer Happiness
              </p>
            </div>

            <div className="rounded-3xl border border-white bg-white/80 p-5 shadow-lg backdrop-blur">
              <h3 className="text-3xl font-bold text-gray-900">
                24/7
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Order Tracking
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{
            opacity: 0,
            x: 40,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          className="relative z-10"
        >
          {/* Main Card */}
          <div className="relative w-[360px] rounded-[40px] border border-white/70 bg-white/90 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Current Order
                </p>

                <h3 className="text-2xl font-bold text-gray-900">
                  Healthy Bowl Combo
                </h3>
              </div>

              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-100">
                <ChefHat
                  className="text-green-600"
                  size={30}
                />
              </div>
            </div>

            {/* Order Progress */}
            <div className="space-y-5">
              <div className="rounded-2xl bg-gray-50 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Order Preparation
                  </span>

                  <span className="text-sm font-bold text-green-600">
                    82%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: '82%',
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
              </div>

              {/* Delivery Status */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                    <Truck
                      className="text-green-600"
                      size={22}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-green-800">
                      Rider is Near You
                    </p>

                    <p className="text-sm text-green-600">
                      Estimated arrival in 12 mins
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-5 text-white">
                <div>
                  <p className="text-sm text-green-100">
                    Total Amount
                  </p>

                  <h4 className="text-3xl font-bold">
                    ₹499
                  </h4>
                </div>

                <ShoppingBag size={34} />
              </div>
            </div>
          </div>

          {/* Floating Delivery Card */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute -bottom-8 -left-10 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
                <PackageCheck
                  className="text-emerald-600"
                  size={24}
                />
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900">
                  320+
                </h4>

                <p className="text-sm text-gray-500">
                  Active Deliveries
                </p>
              </div>
            </div>
          </motion.div>

          {/* Floating Mini Card */}
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute -right-5 top-10 hidden rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur lg:block"
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed
                className="text-green-500"
                size={24}
              />

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Fresh & Healthy
                </p>

                <p className="text-xs text-gray-500">
                  Daily prepared meals
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
            <ShieldCheck size={16} />

            Why Customers Love Us
          </div>

          <h2 className="text-4xl font-black text-gray-900">
            Smart Features Built
            <span className="block text-green-600">
              For Modern Food Delivery
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-500">
            Designed to provide seamless ordering, fast tracking,
            and premium customer experience.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.15,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -6,
                }}
                className="group rounded-[32px] border border-green-100 bg-white/90 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] backdrop-blur transition-all duration-300 hover:border-green-200 hover:shadow-[0_20px_60px_rgba(34,197,94,0.15)]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100 transition-all duration-300 group-hover:scale-110">
                  <Icon
                    className="text-green-600"
                    size={28}
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}