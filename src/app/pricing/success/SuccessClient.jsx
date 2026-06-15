'use client'

import { Button } from '@heroui/react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function SuccessClient({ customerEmail }) {


  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-content1 shadow-2xl rounded-[2rem] p-8 text-center space-y-8 border border-default-200 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-success/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-success/10 p-5 rounded-full border border-success/20 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-success"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                />
                <motion.polyline
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                  points="22 4 12 14.01 9 11.01"
                />
              </svg>
            </div>
          </motion.div>
          
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-extrabold tracking-tight text-foreground"
            >
              Payment Successful!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-default-500 text-lg"
            >
              We appreciate your business. A receipt has been sent to{' '}
              <span className="font-semibold text-foreground">{customerEmail}</span>
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 bg-default-50 rounded-2xl p-5 text-sm text-default-600 border border-default-100"
        >
          <p>
            If you have any questions, please contact our support team at{' '}
            <a href="mailto:support@nexthire.com" className="text-primary hover:text-primary-600 transition-colors font-medium">
              support@nexthire.com
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 pt-2"
        >
          <Link
            href="/"
            color="primary"
            variant="shadow"
            className="w-full font-semibold text-md h-12 rounded-xl"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
