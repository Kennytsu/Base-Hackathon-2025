import React from 'react';
import { motion } from 'framer-motion';
import { formatEth } from '@/lib/utils';

interface HeroProps {
  piggyCount: number;
  totalPot: number;
}

export function Hero({ piggyCount, totalPot }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium">
            ⚡ Powered by Base
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Save Together,
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Win Together
            </span>
          </h1>
          
          <p className="text-blue-50 text-lg max-w-xl leading-relaxed">
            Create savings goals with friends. Stake ETH, set rules, and hold each other accountable. 
            The most disciplined wins the pot! 🐷💰
          </p>
          
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold shadow-lg">
              <span className="text-yellow-200 text-xl">{piggyCount}</span> Active Piggybanks
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold shadow-lg">
              <span className="text-green-200 text-xl">{formatEth(totalPot)} ETH</span> at Stake
            </div>
          </div>
        </div>
        
        <div className="relative h-64 md:h-80 flex items-center justify-center">
          <motion.div
            className="relative"
            initial={{ scale: 0.9, y: 10 }}
            animate={{ 
              scale: [0.9, 1, 0.9],
              y: [10, -10, 10] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4, 
              ease: "easeInOut" 
            }}
          >
            <div className="w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-8xl">🐷</span>
            </div>
            {/* Floating coins */}
            <motion.div
              className="absolute -top-4 -right-4 text-4xl"
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 360, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3, 
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              💰
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 text-3xl"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -360, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4, 
                ease: "easeInOut",
                delay: 1
              }}
            >
              ✨
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
