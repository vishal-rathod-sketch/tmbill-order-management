'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Truck,
  Clock3,
  Star,
  ArrowRight,
  ChefHat,
  PackageCheck,
  Utensils,
} from 'lucide-react';

const features = [
  {
    title: 'Fast Order Tracking',
    description: 'Track food orders in real-time with instant updates.',
    icon: Truck,
  },
  {
    title: 'Live Status Updates',
    description: 'Monitor orders from placed to delivered smoothly.',
    icon: Clock3,
  },
  {
    title: 'Smart Dashboard',
    description: 'Beautiful modern dashboard for managing all orders.',
    icon: PackageCheck,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-5 py-16 sm:px-6 lg:min-h-[calc(100vh-80px)] lg:flex-row lg:py-20">
        {/* Background Decorations */}
        <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-red-200/40 blur-3xl" />

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-2xl text-center lg:text-left"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm backdrop-blur">
            <Star size={16} />
            Modern Food Ordering Experience
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Delicious Food,
            <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Delivered Fast
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg lg:mx-0">
            Manage food orders, monitor delivery status, and track every order
            with a beautiful modern dashboard experience.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Link
              href="/create-order"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/30"
            >
              Order Food
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-50"
            >
              View Orders
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                10K+
              </h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Orders Delivered
              </p>
            </div>

            <div className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                99%
              </h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Satisfaction
              </p>
            </div>

            <div className="rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                24/7
              </h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Tracking
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-[390px]"
        >
          {/* Main Card */}
          <div className="relative mx-auto rounded-[40px] border border-white/70 bg-white/85 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Order</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  Burger Combo
                </h3>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-orange-100">
                <ChefHat className="text-orange-600" size={30} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Preparation
                  </span>
                  <span className="text-sm font-bold text-orange-600">
                    75%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <Truck className="text-green-600" size={22} />
                  <div>
                    <p className="font-semibold text-green-800">
                      Delivery On The Way
                    </p>
                    <p className="text-sm text-green-600">
                      Estimated 15 mins
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-gray-900 px-5 py-4 text-white">
                <div>
                  <p className="text-sm text-gray-400">Total Price</p>
                  <h4 className="text-2xl font-bold">₹499</h4>
                </div>
                <ShoppingBag size={30} />
              </div>
            </div>
          </div>

          {/* Floating Card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -bottom-8 left-4 rounded-3xl border border-white/70 bg-white p-4 shadow-2xl sm:-left-8 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
                <PackageCheck className="text-red-500" size={24} />
              </div>

              <div>
                <h4 className="font-bold text-gray-900">245+</h4>
                <p className="text-sm text-gray-500">Active Orders</p>
              </div>
            </div>
          </motion.div>

          {/* Small Floating Icon */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-2 -top-6 hidden h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-xl sm:flex"
          >
            <Utensils className="text-orange-500" size={26} />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-6">
        <div className="mb-14 text-center">
          <p className="mb-3 font-semibold text-orange-600">Our Features</p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Experience the smartest food ordering platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group rounded-[32px] border border-gray-200 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all hover:border-orange-200 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 transition-all group-hover:bg-orange-500">
                  <Icon
                    className="text-orange-600 transition-all group-hover:text-white"
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