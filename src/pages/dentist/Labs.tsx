import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Search, SlidersHorizontal, MapPin, X, Star, Clock, BadgeCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MOCK_LABS } from "@/data/mockLabs"
import { cn } from "@/lib/utils"

const SERVICE_FILTERS = ['All', 'Crown', 'Bridge', 'Denture', 'Implant']

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'distance', label: 'Nearest First' },
  { value: 'turnaround', label: 'Fastest Delivery' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
]

const RATING_FILTERS = [
  { value: '0', label: 'All Ratings' },
  { value: '4.5', label: '4.5+ Stars' },
  { value: '4.7', label: '4.7+ Stars' },
  { value: '4.9', label: '4.9+ Stars' },
]

export function Labs() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  
  // Get filters from URL
  const showFilters = searchParams.get('filters') === 'open'
  const activeService = searchParams.get('service') || 'All'
  const sortBy = searchParams.get('sort') || 'rating'
  const minRating = parseFloat(searchParams.get('rating') || '0')
  
  const toggleFilters = () => {
    if (showFilters) {
      searchParams.delete('filters')
    } else {
      searchParams.set('filters', 'open')
    }
    setSearchParams(searchParams)
  }

  // Filter and sort labs
  const filteredLabs = useMemo(() => {
    let labs = MOCK_LABS.filter(lab => {
      const matchesSearch = searchQuery === '' || 
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.address.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesService = activeService === 'All' || 
        lab.services.some(s => s.toLowerCase() === activeService.toLowerCase())
      
      const matchesRating = lab.rating >= minRating
      
      return matchesSearch && matchesService && matchesRating
    })

    // Sort labs
    switch (sortBy) {
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
      case 'price-low':
        labs.sort((a, b) => a.priceRange.length - b.priceRange.length)
        break
      case 'price-high':
        labs.sort((a, b) => b.priceRange.length - a.priceRange.length)
        break
    }

    return labs
  }, [searchQuery, activeService, minRating, sortBy])

  // Handle filter changes
  const updateFilter = (key: string, value: string) => {
    if (value === 'All' || value === '0' || value === 'rating') {
      searchParams.delete(key)
    } else {
      searchParams.set(key, value)
    }
    setSearchParams(searchParams)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSearchParams({})
  }

  const hasActiveFilters = activeService !== 'All' || minRating > 0 || sortBy !== 'rating'

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
            onClick={toggleFilters}
          >
            <SlidersHorizontal className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
            )}
          </Button>
        </div>

        {/* Service Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {SERVICE_FILTERS.map((filter) => {
            const isActive = activeService === filter
            return (
              <button
                key={filter}
                type="button"
                onClick={() => updateFilter('service', filter)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card border border-border/50 text-white/70 hover:text-white hover:border-white/30"
                )}
              >
                {filter}
              </button>
            )
          })}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border/30"
          >
            <div className="px-5 py-4 space-y-4 bg-card/30">
              {/* Sort By */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Sort By</label>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('sort', option.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        sortBy === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/5 text-white/60 hover:text-white"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="text-xs text-white/50 uppercase tracking-wide mb-2 block">Minimum Rating</label>
                <div className="flex flex-wrap gap-2">
                  {RATING_FILTERS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateFilter('rating', option.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1",
                        minRating === parseFloat(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/5 text-white/60 hover:text-white"
                      )}
                    >
                      {option.value !== '0' && <Star className="w-3 h-3 fill-current" />}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
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
          {activeService !== 'All' && ` for "${activeService}"`}
          {minRating > 0 && ` with ${minRating}+ rating`}
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
                    {lab.services.slice(0, 4).map((service) => (
                      <Badge 
                        key={service} 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          activeService === service && "bg-primary/20 border-primary/50 text-primary"
                        )}
                      >
                        {service}
                      </Badge>
                    ))}
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
              onClick={clearAllFilters}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
