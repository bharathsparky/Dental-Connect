export interface Material {
  id: string
  name: string
  description: string
  priceRange: string
  turnaround: string
  icon: string
  features: string[]
  category: 'crown' | 'bridge' | 'denture' | 'implant'
}

export const MATERIALS: Record<string, Material[]> = {
  crown: [
    {
      id: 'zirconia-mono',
      name: 'Zirconia Monolithic',
      description: 'High strength, translucent, no chipping',
      priceRange: '₹5,000 - ₹8,000',
      turnaround: '5-7 days',
      icon: '💎',
      features: ['High Strength', 'Natural Look', 'Metal-Free'],
      category: 'crown'
    },
    {
      id: 'zirconia-layered',
      name: 'Zirconia Layered',
      description: 'Premium aesthetics with ceramic layering',
      priceRange: '₹8,000 - ₹12,000',
      turnaround: '7-10 days',
      icon: '✨',
      features: ['Premium Aesthetics', 'Layered Ceramic', 'Best for Anterior'],
      category: 'crown'
    },
    {
      id: 'pfm',
      name: 'PFM (Porcelain Fused Metal)',
      description: 'Traditional reliable option',
      priceRange: '₹2,500 - ₹4,000',
      turnaround: '5-7 days',
      icon: '🔩',
      features: ['Proven Track Record', 'Economical', 'Strong'],
      category: 'crown'
    },
    {
      id: 'emax',
      name: 'E.max (Lithium Disilicate)',
      description: 'Superior aesthetics for anterior teeth',
      priceRange: '₹10,000 - ₹15,000',
      turnaround: '7-10 days',
      icon: '💫',
      features: ['Best Aesthetics', 'Highly Translucent', 'Anterior Only'],
      category: 'crown'
    },
    {
      id: 'full-metal',
      name: 'Full Metal Crown',
      description: 'Durable metal restoration',
      priceRange: '₹2,000 - ₹3,500',
      turnaround: '4-5 days',
      icon: '⚙️',
      features: ['Highly Durable', 'Economical', 'Posterior Only'],
      category: 'crown'
    },
  ],
  bridge: [
    {
      id: 'zirconia-bridge',
      name: 'Zirconia Bridge',
      description: 'Strong full-arch restoration',
      priceRange: '₹15,000 - ₹25,000',
      turnaround: '7-10 days',
      icon: '💎',
      features: ['High Strength', 'Natural Look', 'Full Arch'],
      category: 'bridge'
    },
    {
      id: 'pfm-bridge',
      name: 'PFM Bridge',
      description: 'Traditional bridge option',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '5-7 days',
      icon: '🔩',
      features: ['Cost Effective', 'Reliable', 'Versatile'],
      category: 'bridge'
    },
  ],
  denture: [
    {
      id: 'acrylic-denture',
      name: 'Acrylic Denture',
      description: 'Standard complete or partial denture',
      priceRange: '₹4,000 - ₹8,000',
      turnaround: '7-10 days',
      icon: '🦷',
      features: ['Economical', 'Easy Repair', 'Standard Option'],
      category: 'denture'
    },
    {
      id: 'flexible-denture',
      name: 'Flexible Denture',
      description: 'Comfortable flexible material',
      priceRange: '₹6,000 - ₹12,000',
      turnaround: '7-10 days',
      icon: '🌟',
      features: ['Comfortable', 'Flexible', 'Metal-Free'],
      category: 'denture'
    },
    {
      id: 'cast-partial',
      name: 'Cast Partial Denture',
      description: 'Metal framework partial denture',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '10-14 days',
      icon: '⚙️',
      features: ['Durable', 'Thin Framework', 'Premium'],
      category: 'denture'
    },
  ],
  implant: [
    {
      id: 'implant-crown',
      name: 'Implant Crown',
      description: 'Crown for implant abutment',
      priceRange: '₹12,000 - ₹20,000',
      turnaround: '7-10 days',
      icon: '🔧',
      features: ['Custom Fit', 'Implant Compatible', 'Premium'],
      category: 'implant'
    },
  ],
}

export const getMaterialsByCategory = (category: string): Material[] => {
  return MATERIALS[category] || []
}

export const getMaterialById = (id: string): Material | undefined => {
  return Object.values(MATERIALS).flat().find(m => m.id === id)
}
