'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { motion } from 'framer-motion';

import {
  Home,
  ShoppingCart,
  ClipboardList,
  Sparkles,
  BarChart3,
} from 'lucide-react';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
  },

  {
    label: 'Create Order',
    href: '/create-order',
    icon: ShoppingCart,
  },

  {
    label: 'Orders',
    href: '/orders',
    icon: ClipboardList,
  },

  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          className="flex items-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <Sparkles
              size={22}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              TMBill
            </h1>

            <p className="text-xs text-gray-500">
              Smart Order Management
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href;

            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300
                  
                  ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 rounded-xl bg-white"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 28,
                      }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={18} />

                    <span className="hidden sm:block">
                      {item.label}
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>
    </header>
  );
}