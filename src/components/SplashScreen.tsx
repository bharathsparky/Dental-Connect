import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Lottie from 'lottie-react'

interface SplashScreenProps {
  onComplete: () => void
  minDuration?: number
}

export function SplashScreen({ onComplete, minDuration = 5500 }: SplashScreenProps) {
  const [animationData, setAnimationData] = useState<object | null>(null)
  const [isExiting, setIsExiting] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Load the Lottie animation
    fetch('/teeth.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(console.error)

    // Play background music
    audioRef.current = new Audio('/shin.wav')
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => {
      // Autoplay might be blocked, that's okay
      console.log('Audio autoplay blocked')
    })

    // Start exit animation after minimum duration
    const timer = setTimeout(() => {
      setIsExiting(true)
    }, minDuration)

    return () => {
      clearTimeout(timer)
      // Fade out and stop audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [minDuration])

  useEffect(() => {
    if (isExiting) {
      // Fade out audio
      if (audioRef.current) {
        const audio = audioRef.current
        const fadeOut = setInterval(() => {
          if (audio.volume > 0.1) {
            audio.volume -= 0.1
          } else {
            audio.pause()
            clearInterval(fadeOut)
          }
        }, 50)
      }
      
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
            background: 'linear-gradient(180deg, #0a0a0f 0%, #0d1117 50%, #0a0a0f 100%)'
          }}
        >
          {/* Lottie Animation (now transparent) */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring', 
              damping: 15, 
              stiffness: 100,
              delay: 0.2 
            }}
            className="relative z-10 w-[90%] max-w-[320px] mb-2"
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
            className="text-center relative z-10"
          >
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Dent<span className="text-primary">Connect</span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm mt-2 text-white/50"
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
                  className="w-2.5 h-2.5 rounded-full bg-primary"
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
