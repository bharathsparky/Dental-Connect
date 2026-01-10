import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Lottie from 'lottie-react'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export function SplashScreen({ onComplete, minDuration = 2500 }: SplashScreenProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Load the Lottie animation
    fetch('/teeth.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(console.error)

    // Start exit animation after minimum duration
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, minDuration)

    return () => clearTimeout(timer)
  }, [minDuration])

  useEffect(() => {
    if (isExiting) {
      // Give time for exit animation
      const exitTimer = setTimeout(() => {
        onComplete()
      }, 600)
      return () => clearTimeout(exitTimer)
    }
  }, [isExiting, onComplete])

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)'
          }}
        >
          {/* Ambient glow */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(94, 187, 189, 0.15) 0%, transparent 60%)'
            }}
          />

          {/* Lottie Animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              damping: 15, 
              stiffness: 100,
              delay: 0.2 
            }}
            className="relative w-48 h-48 mb-6"
          >
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                className="w-full h-full"
              />
            )}
          </motion.div>

          {/* App Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Dent<span className="text-primary">Connect</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm text-white/50 mt-2"
            >
              Seamless Dental Lab Orders
            </motion.p>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-20"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
