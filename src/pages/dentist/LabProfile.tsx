import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  BadgeCheck,
  ChevronRight,
  IndianRupee
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/layout/Header"
import { getLabById } from "@/data/mockLabs"
import { cn } from "@/lib/utils"

export function LabProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lab = id ? getLabById(id) : null

  if (!lab) {
    return (
      <div className="min-h-full bg-atmosphere flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Lab not found</p>
          <Button variant="secondary" onClick={() => navigate('/labs')}>
            Back to Labs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      <Header showBack />

      {/* Hero */}
      <div className="relative h-48">
        <img
          src={lab.image}
          alt={lab.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-black/30" />
      </div>

      <div className="flex-1 px-5 -mt-12 relative space-y-4 pb-24">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gradient-accent">
            <CardContent className="p-5 pt-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-semibold text-xl text-white">{lab.name}</h1>
                    {lab.isVerified && <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/60 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{lab.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm bg-white/10 rounded-lg px-2 py-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-white">{lab.rating}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 divide-x divide-white/10 py-3 border-y border-white/10 mb-4">
                <div className="text-center px-2">
                  <p className="font-semibold text-white">{lab.reviewCount}</p>
                  <p className="text-xs text-white/50">Reviews</p>
                </div>
                <div className="text-center px-2">
                  <p className="font-semibold text-white">{lab.completedOrders}+</p>
                  <p className="text-xs text-white/50">Orders</p>
                </div>
                <div className="text-center px-2">
                  <p className="font-semibold text-white">{lab.distance}</p>
                  <p className="text-xs text-white/50">Away</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 gap-2">
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
                <Button variant="secondary" size="sm" className="flex-1 gap-2">
                  <MapPin className="w-4 h-4" />
                  Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Services - Detailed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <h3 className="font-medium text-white mb-3">Services & Pricing</h3>
              <div className="space-y-3">
                {lab.serviceDetails.map((service, index) => (
                  <div 
                    key={service.name} 
                    className={cn(
                      "py-3",
                      index > 0 && "border-t border-white/10"
                    )}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-white">{service.name}</h4>
                        <p className="text-xs text-white/50 mt-0.5">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-primary">
                        <IndianRupee className="w-3 h-3" />
                        <span className="text-sm font-medium">{service.price.replace('₹', '')}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        <span>{service.turnaround}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <h3 className="font-medium text-white mb-3">Lab Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Experience</span>
                  <span className="font-medium text-white">{lab.yearsInBusiness} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Avg. Turnaround</span>
                  <span className="font-medium text-white">{lab.turnaround}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Price Range</span>
                  <span className="font-medium text-white">{lab.priceRange}</span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <span className="text-white/60 text-xs">Specialties</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {lab.specialties.map((specialty) => (
                      <span 
                        key={specialty}
                        className="text-xs px-2 py-1 rounded-md bg-white/5 text-white/70"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gradient">
            <CardContent className="p-4 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">Reviews</h3>
                <button className="text-sm text-primary flex items-center gap-1">
                  See All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Dr. Suresh', rating: 5, text: 'Excellent work quality. Perfect fit.', time: '2 days ago' },
                  { name: 'Dr. Ramesh', rating: 4, text: 'Good turnaround time.', time: '1 week ago' },
                ].map((review, i) => (
                  <div key={i} className={cn("py-3", i > 0 && "border-t border-white/5")}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-xs font-medium text-white">
                          {review.name.split(' ')[1][0]}
                        </div>
                        <span className="text-sm font-medium text-white">{review.name}</span>
                      </div>
                      <span className="text-xs text-white/40">{review.time}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-1 ml-10">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={cn(
                            "w-3 h-3",
                            star <= review.rating ? "fill-amber-400 text-amber-400" : "text-white/20"
                          )} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-white/60 ml-10">{review.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-background/80 z-40">
        <Button 
          className="w-full"
          onClick={() => navigate('/new-order')}
        >
          Order from {lab.name}
        </Button>
      </div>
    </div>
  )
}
