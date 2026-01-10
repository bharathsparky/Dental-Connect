import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom"
import { Search, SlidersHorizontal, MapPin, X, Star, Clock, BadgeCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_LABS } from "@/data/mockLabs"
import { cn } from "@/lib/utils"

const LAB_SERVICE_FILTERS = [
  { id: 'crown', label: 'Crown' },
  { id: 'bridge', label: 'Bridge' },
  { id: 'denture', label: 'Denture' },
  { id: 'implant', label: 'Implant' },
  { id: 'veneer', label: 'Veneer' },
  { id: 'night_guard', label: 'Night Guard' },
  { id: 'surgical_guide', label: 'Surgical Guide' },
]

const LAB_SORT_OPTIONS = [
  { id: 'rating', label: 'Top Rated' },
  { id: 'distance', label: 'Nearest' },
  { id: 'turnaround', label: 'Fastest' },
]

const LAB_RATING_OPTIONS = [
  { value: 4.5, label: '4.5+' },
  { value: 4.0, label: '4.0+' },
  { value: 3.5, label: '3.5+' },
]

const LAB_DELIVERY_OPTIONS = [
  { value: '3-5 days', label: '3-5 days' },
  { value: '5-7 days', label: '5-7 days' },
  { value: '7-10 days', label: '7-10 days' },
]

export function Labs() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showLabFilters, setShowLabFilters] = useState(false)
  const [labServiceFilter, setLabServiceFilter] = useState<string[]>([])
  const [labSortBy, setLabSortBy] = useState('rating')
  const [labMinRating, setLabMinRating] = useState<number | null>(null)
  const [labMaxDelivery, setLabMaxDelivery] = useState<string | null>(null)

  // Filter and sort labs
  const filteredLabs = useMemo(() => {
    let labs = MOCK_LABS.filter(lab => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.address.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Service filter
      const matchesService = labServiceFilter.length === 0 || 
        labServiceFilter.some(filter => 
          lab.services.some(s => s.toLowerCase() === filter.toLowerCase())
        )
      
      // Rating filter
      const matchesRating = labMinRating === null || lab.rating >= labMinRating
      
      // Delivery time filter
      const matchesDelivery = labMaxDelivery === null || 
        lab.turnaround.includes(labMaxDelivery.split('-')[0]) ||
        lab.turnaround.includes(labMaxDelivery.split('-')[1]?.trim())
      
      return matchesSearch && matchesService && matchesRating && matchesDelivery
    })

    // Sort labs
    switch (labSortBy) {
      case 'rating':
        labs.sort((a, b) => b.rating - a.rating)
        break
      case 'distance':
        labs.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        break
      case 'turnaround':
        labs.sort((a, b) => {
          const getMinDays = (t: string) => parseInt(t.split('-')[0])
          return getMinDays(a.turnaround) - getMinDays(b.turnaround)
        })
        break
    }

    return labs
  }, [searchQuery, labServiceFilter, labMinRating, labMaxDelivery, labSortBy])

  const hasActiveFilters = labServiceFilter.length > 0 || labMinRating !== null || labMaxDelivery !== null || labSortBy !== 'rating'

  return (
    <div className="min-h-full bg-atmosphere flex flex-col">
      {/* Search & Filters */}
      <div className="px-5 pt-2 pb-3 space-y-3">
        <h1 className="text-xl font-semibold text-white">Find Labs</h1>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search labs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 bg-card border-border/50 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-white/40" />
              </button>
            )}
          </div>
          <Button 
            variant="secondary" 
            size="icon" 
            className={cn(
              "h-11 w-11 relative",
              hasActiveFilters && "border-primary"
            )}
            onClick={() => setShowLabFilters(true)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
            )}
          </Button>
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {labServiceFilter.map((service) => (
              <Badge
                key={service}
                variant="outline"
                className="bg-primary/20 border-primary/50 text-primary text-xs"
              >
                {LAB_SERVICE_FILTERS.find(s => s.id === service)?.label || service}
                <button
                  onClick={() => setLabServiceFilter(labServiceFilter.filter(s => s !== service))}
                  className="ml-1.5 hover:text-primary/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {labMinRating !== null && (
              <Badge
                variant="outline"
                className="bg-primary/20 border-primary/50 text-primary text-xs"
              >
                {labMinRating}+ Rating
                <button
                  onClick={() => setLabMinRating(null)}
                  className="ml-1.5 hover:text-primary/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {labMaxDelivery !== null && (
              <Badge
                variant="outline"
                className="bg-primary/20 border-primary/50 text-primary text-xs"
              >
                Max {labMaxDelivery}
                <button
                  onClick={() => setLabMaxDelivery(null)}
                  className="ml-1.5 hover:text-primary/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Lab Filters Modal */}
      <AnimatePresence>
        {showLabFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
            onClick={() => setShowLabFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-[390px] bg-card rounded-t-3xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50">
                <h2 className="text-lg font-semibold text-white">Filter & Sort</h2>
                <button
                  onClick={() => {
                    setLabServiceFilter([])
                    setLabMinRating(null)
                    setLabMaxDelivery(null)
                    setLabSortBy('rating')
                  }}
                  className="text-sm text-primary"
                >
                  Reset
                </button>
              </div>

              <div className="p-5 space-y-6 overflow-auto max-h-[60vh]">
                {/* Services */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {LAB_SERVICE_FILTERS.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => {
                          if (labServiceFilter.includes(filter.id)) {
                            setLabServiceFilter(labServiceFilter.filter(f => f !== filter.id))
                          } else {
                            setLabServiceFilter([...labServiceFilter, filter.id])
                          }
                        }}
                        className={cn(
                          "px-3 py-2 rounded-xl text-sm font-medium transition-all",
                          labServiceFilter.includes(filter.id)
                            ? "bg-primary text-primary-foreground"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Minimum Rating
                  </h3>
                  <div className="flex gap-2">
                    {LAB_RATING_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLabMinRating(labMinRating === option.value ? null : option.value)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                          labMinRating === option.value
                            ? "bg-amber-500/20 border border-amber-500/50 text-amber-400"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Time */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Maximum Delivery Time
                  </h3>
                  <div className="flex gap-2">
                    {LAB_DELIVERY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLabMaxDelivery(labMaxDelivery === option.value ? null : option.value)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                          labMaxDelivery === option.value
                            ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Sort By</h3>
                  <div className="flex gap-2">
                    {LAB_SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setLabSortBy(option.id)}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                          labSortBy === option.id
                            ? "bg-primary/20 border border-primary/50 text-primary"
                            : "bg-white/5 text-white/70 hover:text-white border border-border/50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setShowLabFilters(false)}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location */}
      <div className="px-5 py-2 flex items-center gap-2 text-sm text-white/50">
        <MapPin className="w-4 h-4" />
        <span>Near <span className="text-white">Anna Nagar, Chennai</span></span>
      </div>

      {/* Results count */}
      <div className="px-5 pb-2">
        <p className="text-xs text-white/40">
          {filteredLabs.length} {filteredLabs.length === 1 ? 'lab' : 'labs'} found
          {labServiceFilter.length > 0 && ` for ${labServiceFilter.map(s => LAB_SERVICE_FILTERS.find(f => f.id === s)?.label).join(', ')}`}
          {labMinRating !== null && ` with ${labMinRating}+ rating`}
        </p>
      </div>

      {/* Labs list */}
      <div className="flex-1 px-5 pb-4 space-y-4">
        {filteredLabs.map((lab, i) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              variant="gradient"
              className="cursor-pointer overflow-hidden"
              onClick={() => navigate(`/labs/${lab.id}`)}
            >
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative h-32">
                  <img
                    src={lab.image}
                    alt={lab.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                  
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-black/40 backdrop-blur-sm border-white/20 text-white">
                      {lab.priceRange}
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-white">{lab.name}</h3>
                      {lab.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-primary fill-primary/20" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/70 mt-1">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {lab.rating}
                      </span>
                      <span>{lab.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {lab.services.slice(0, 4).map((service) => {
                      const serviceId = LAB_SERVICE_FILTERS.find(f => f.label.toLowerCase() === service.toLowerCase())?.id
                      const isFiltered = serviceId && labServiceFilter.includes(serviceId)
                      return (
                        <Badge 
                          key={service} 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            isFiltered && "bg-primary/20 border-primary/50 text-primary"
                          )}
                        >
                          {service}
                        </Badge>
                      )
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Clock className="w-4 h-4" />
                    <span>{lab.turnaround}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filteredLabs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-card mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-white/30" />
            </div>
            <p className="text-white/50 mb-2">No labs found</p>
            <p className="text-white/30 text-sm mb-4">
              Try adjusting your filters
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setLabServiceFilter([])
                setLabMinRating(null)
                setLabMaxDelivery(null)
                setLabSortBy('rating')
                setSearchQuery('')
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
