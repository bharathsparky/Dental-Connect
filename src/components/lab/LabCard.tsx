import { Star, Clock, MapPin, BadgeCheck, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Lab } from "@/data/mockLabs"

interface LabCardProps {
  lab: Lab
  onClick: () => void
}

export function LabCard({ lab, onClick }: LabCardProps) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative h-32">
          <img
            src={lab.image}
            alt={lab.name}
            className="w-full h-full object-cover rounded-t-xl"
          />
          {lab.isVerified && (
            <div className="absolute top-2 left-2">
              <Badge className="gap-1 bg-white/90 text-foreground backdrop-blur-sm">
                <BadgeCheck className="w-3 h-3 text-primary" />
                Verified
              </Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
              {lab.priceRange}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{lab.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{lab.address}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{lab.rating}</span>
              <span className="text-muted-foreground">({lab.reviewCount})</span>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5">
            {lab.services.slice(0, 3).map((service) => (
              <Badge key={service} variant="outline" className="text-xs">
                {service}
              </Badge>
            ))}
            {lab.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{lab.services.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lab.turnaround}
              </span>
              <span>{lab.distance}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact variant for selection in order flow
export function LabCardCompact({ lab, onClick, isSelected }: LabCardProps & { isSelected?: boolean }) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <img
            src={lab.image}
            alt={lab.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-sm truncate">{lab.name}</h3>
              {lab.isVerified && (
                <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {lab.rating}
              </span>
              <span>·</span>
              <span>{lab.distance}</span>
              <span>·</span>
              <span>{lab.turnaround}</span>
            </div>
          </div>
          
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
