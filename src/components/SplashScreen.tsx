import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Lottie from 'lottie-react'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export function SplashScreen({ onComplete, minDuration = 5500 }: SplashScreenProps) {
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
          className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative"
          style={{
            background: 'radial-gradient(ellipse 120% 80% at 50% 45%, #8DC4DB 0%, #6A9FC4 50%, #5889AD 100%)'
          }}
        >
          {/* Full-screen Lottie Animation as background */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ top: '-5%' }}>
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ 
                  width: '160%',
                  height: '160%',
                  minWidth: '600px'
                }}
              />
            )}
          </div>
          
          {/* Content overlay */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              damping: 15, 
              stiffness: 100,
              delay: 0.2 
            }}
            className="relative z-10 h-[45%]"
          />

          {/* App Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center relative z-10"
          >
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#1a3a4a' }}>
              Dent<span style={{ color: '#0d5c6e' }}>Connect</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm mt-2"
              style={{ color: '#1a3a4a99' }}
            >
              Seamless Dental Lab Orders
            </motion.p>
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute bottom-20 z-10"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: '#1a3a4a' }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4]
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
