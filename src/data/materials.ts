export interface Material {
  id: string
  name: string
  description: string
  priceRange: string
  turnaround: string
  icon: string
  features: string[]
  category: 'crown' | 'bridge' | 'denture' | 'implant' | 'veneer' | 'inlay_onlay' | 'night_guard' | 'retainer' | 'waxup' | 'surgical_guide' | 'all_on_x' | 'bleaching_tray' | 'sports_guard' | 'clear_aligner' | 'provisional' | 'full_mouth_rehab'
}

export const MATERIALS: Record<string, Material[]> = {
  crown: [
    {
      id: 'zirconia-mono',
      name: 'Zirconia Monolithic',
      description: 'High strength, translucent, no chipping risk',
      priceRange: '₹5,000 - ₹8,000',
      turnaround: '5-7 days',
      icon: '💎',
      features: ['High Strength', 'Natural Look', 'Metal-Free'],
      category: 'crown'
    },
    {
      id: 'zirconia-layered',
      name: 'Zirconia Layered',
      description: 'Premium aesthetics with hand-layered ceramic',
      priceRange: '₹8,000 - ₹12,000',
      turnaround: '7-10 days',
      icon: '✨',
      features: ['Premium Aesthetics', 'Layered Ceramic', 'Best for Anterior'],
      category: 'crown'
    },
    {
      id: 'pfm',
      name: 'PFM (Porcelain Fused Metal)',
      description: 'Traditional reliable option with metal substructure',
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
      features: ['Best Aesthetics', 'Highly Translucent', 'Anterior Preferred'],
      category: 'crown'
    },
    {
      id: 'full-metal',
      name: 'Full Metal Crown',
      description: 'Durable metal restoration, ideal for molars',
      priceRange: '₹2,000 - ₹3,500',
      turnaround: '4-5 days',
      icon: '⚙️',
      features: ['Highly Durable', 'Economical', 'Posterior Only'],
      category: 'crown'
    },
    {
      id: 'gold',
      name: 'Gold Crown',
      description: 'Premium biocompatible metal with excellent margins',
      priceRange: '₹15,000 - ₹25,000',
      turnaround: '5-7 days',
      icon: '🥇',
      features: ['Biocompatible', 'Excellent Margins', 'Long Lasting'],
      category: 'crown'
    },
  ],
  bridge: [
    {
      id: 'zirconia-bridge',
      name: 'Zirconia Bridge',
      description: 'Strong full-arch restoration with excellent aesthetics',
      priceRange: '₹15,000 - ₹25,000',
      turnaround: '7-10 days',
      icon: '💎',
      features: ['High Strength', 'Natural Look', 'Full Arch'],
      category: 'bridge'
    },
    {
      id: 'zirconia-layered-bridge',
      name: 'Zirconia Layered Bridge',
      description: 'Premium aesthetics with ceramic layering',
      priceRange: '₹20,000 - ₹35,000',
      turnaround: '10-14 days',
      icon: '✨',
      features: ['Premium Aesthetics', 'Hand Layered', 'Best for Anterior'],
      category: 'bridge'
    },
    {
      id: 'pfm-bridge',
      name: 'PFM Bridge',
      description: 'Traditional metal-ceramic bridge option',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '5-7 days',
      icon: '🔩',
      features: ['Cost Effective', 'Reliable', 'Versatile'],
      category: 'bridge'
    },
    {
      id: 'maryland-bridge',
      name: 'Maryland Bridge',
      description: 'Conservative resin-bonded bridge',
      priceRange: '₹12,000 - ₹18,000',
      turnaround: '7-10 days',
      icon: '🌟',
      features: ['Minimally Invasive', 'Resin Bonded', 'Anterior Only'],
      category: 'bridge'
    },
    {
      id: 'emax-bridge',
      name: 'E.max Bridge',
      description: 'All-ceramic bridge for anterior (3-unit max)',
      priceRange: '₹25,000 - ₹40,000',
      turnaround: '7-10 days',
      icon: '💫',
      features: ['Best Aesthetics', 'Anterior Only', '3-Unit Max'],
      category: 'bridge'
    },
    {
      id: 'precision-attachment-bridge',
      name: 'Precision Attachment Bridge',
      description: 'Fixed crown with attachment for RPD',
      priceRange: '₹18,000 - ₹30,000',
      turnaround: '10-14 days',
      icon: '🔗',
      features: ['Hidden Connector', 'Fixed-Removable', 'Aesthetic'],
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
      name: 'Flexible Denture (Valplast)',
      description: 'Comfortable flexible nylon material',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '7-10 days',
      icon: '🌟',
      features: ['Comfortable', 'Flexible', 'Metal-Free'],
      category: 'denture'
    },
    {
      id: 'cast-partial',
      name: 'Cast Partial (Chrome-Cobalt)',
      description: 'Metal framework partial denture - durable and thin',
      priceRange: '₹10,000 - ₹18,000',
      turnaround: '10-14 days',
      icon: '⚙️',
      features: ['Durable', 'Thin Framework', 'Premium'],
      category: 'denture'
    },
    {
      id: 'bps-denture',
      name: 'BPS Denture (Ivoclar)',
      description: 'Premium biofunctional prosthetic system',
      priceRange: '₹18,000 - ₹30,000',
      turnaround: '14-21 days',
      icon: '✨',
      features: ['Premium Quality', 'Perfect Fit', 'Superior Aesthetics'],
      category: 'denture'
    },
    {
      id: 'immediate-denture',
      name: 'Immediate Denture',
      description: 'Placed immediately after extraction',
      priceRange: '₹6,000 - ₹12,000',
      turnaround: '5-7 days',
      icon: '⚡',
      features: ['Same Day', 'Transitional', 'Requires Reline'],
      category: 'denture'
    },
    {
      id: 'overdenture',
      name: 'Implant Overdenture',
      description: 'Implant-retained removable denture',
      priceRange: '₹15,000 - ₹25,000',
      turnaround: '10-14 days',
      icon: '🔧',
      features: ['Implant Retained', 'Superior Stability', 'Premium'],
      category: 'denture'
    },
  ],
  implant: [
    {
      id: 'implant-crown-zirconia',
      name: 'Implant Crown - Zirconia',
      description: 'Zirconia crown for implant abutment',
      priceRange: '₹12,000 - ₹18,000',
      turnaround: '7-10 days',
      icon: '💎',
      features: ['Custom Fit', 'Natural Look', 'Metal-Free'],
      category: 'implant'
    },
    {
      id: 'implant-crown-pfm',
      name: 'Implant Crown - PFM',
      description: 'PFM crown for implant abutment',
      priceRange: '₹8,000 - ₹12,000',
      turnaround: '5-7 days',
      icon: '🔩',
      features: ['Economical', 'Reliable', 'Versatile'],
      category: 'implant'
    },
    {
      id: 'custom-abutment',
      name: 'Custom Abutment + Crown',
      description: 'CAD/CAM custom abutment with crown',
      priceRange: '₹18,000 - ₹28,000',
      turnaround: '10-14 days',
      icon: '🔧',
      features: ['Custom Designed', 'Ideal Emergence', 'Premium'],
      category: 'implant'
    },
    {
      id: 'implant-bridge',
      name: 'Implant Bridge',
      description: 'Multi-unit implant-supported bridge',
      priceRange: '₹35,000 - ₹60,000',
      turnaround: '14-21 days',
      icon: '✨',
      features: ['Multiple Implants', 'Full Arch Option', 'Premium'],
      category: 'implant'
    },
    {
      id: 'screw-retained',
      name: 'Screw-Retained Crown',
      description: 'Retrievable screw-retained implant crown',
      priceRange: '₹15,000 - ₹22,000',
      turnaround: '7-10 days',
      icon: '🔩',
      features: ['Retrievable', 'No Cement', 'Easy Maintenance'],
      category: 'implant'
    },
  ],
  veneer: [
    {
      id: 'porcelain-veneer',
      name: 'Porcelain Veneer',
      description: 'Traditional feldspathic porcelain veneer',
      priceRange: '₹10,000 - ₹18,000',
      turnaround: '10-14 days',
      icon: '✨',
      features: ['Classic', 'Natural Translucency', 'Handcrafted'],
      category: 'veneer'
    },
    {
      id: 'emax-veneer',
      name: 'E.max Veneer',
      description: 'Lithium disilicate pressed ceramic veneer',
      priceRange: '₹12,000 - ₹20,000',
      turnaround: '7-10 days',
      icon: '💫',
      features: ['High Strength', 'Excellent Aesthetics', 'Durable'],
      category: 'veneer'
    },
    {
      id: 'minimal-prep-veneer',
      name: 'Minimal Prep Veneer',
      description: 'Ultra-thin veneer with minimal tooth reduction',
      priceRange: '₹15,000 - ₹25,000',
      turnaround: '10-14 days',
      icon: '🌟',
      features: ['Minimal Prep', 'Conservative', 'Reversible'],
      category: 'veneer'
    },
    {
      id: 'composite-veneer',
      name: 'Composite Veneer',
      description: 'Lab-processed composite veneer',
      priceRange: '₹4,000 - ₹8,000',
      turnaround: '5-7 days',
      icon: '🦷',
      features: ['Economical', 'Repairable', 'Quick Turnaround'],
      category: 'veneer'
    },
  ],
  inlay_onlay: [
    {
      id: 'ceramic-inlay',
      name: 'Ceramic Inlay/Onlay',
      description: 'Tooth-colored ceramic restoration',
      priceRange: '₹6,000 - ₹12,000',
      turnaround: '5-7 days',
      icon: '💎',
      features: ['Aesthetic', 'Conservative', 'Durable'],
      category: 'inlay_onlay'
    },
    {
      id: 'emax-inlay',
      name: 'E.max Inlay/Onlay',
      description: 'Premium lithium disilicate restoration',
      priceRange: '₹10,000 - ₹16,000',
      turnaround: '7-10 days',
      icon: '✨',
      features: ['Best Aesthetics', 'High Strength', 'Premium'],
      category: 'inlay_onlay'
    },
    {
      id: 'zirconia-inlay',
      name: 'Zirconia Inlay/Onlay',
      description: 'High-strength zirconia restoration',
      priceRange: '₹8,000 - ₹14,000',
      turnaround: '5-7 days',
      icon: '💫',
      features: ['High Strength', 'Durable', 'Posterior Ideal'],
      category: 'inlay_onlay'
    },
    {
      id: 'gold-inlay',
      name: 'Gold Inlay/Onlay',
      description: 'Premium gold restoration with excellent margins',
      priceRange: '₹12,000 - ₹20,000',
      turnaround: '5-7 days',
      icon: '🥇',
      features: ['Best Margins', 'Biocompatible', 'Long Lasting'],
      category: 'inlay_onlay'
    },
    {
      id: 'composite-inlay',
      name: 'Composite Inlay/Onlay',
      description: 'Lab-processed composite restoration',
      priceRange: '₹3,000 - ₹6,000',
      turnaround: '3-5 days',
      icon: '🦷',
      features: ['Economical', 'Quick', 'Repairable'],
      category: 'inlay_onlay'
    },
  ],
  night_guard: [
    {
      id: 'soft-guard',
      name: 'Soft Night Guard',
      description: 'Flexible EVA material for light bruxism',
      priceRange: '₹2,000 - ₹4,000',
      turnaround: '3-5 days',
      icon: '🌙',
      features: ['Comfortable', 'Light Bruxism', 'Economical'],
      category: 'night_guard'
    },
    {
      id: 'hard-guard',
      name: 'Hard Acrylic Splint',
      description: 'Rigid acrylic for moderate to severe bruxism',
      priceRange: '₹4,000 - ₹8,000',
      turnaround: '5-7 days',
      icon: '🛡️',
      features: ['Durable', 'TMJ Protection', 'Adjustable'],
      category: 'night_guard'
    },
    {
      id: 'dual-laminate',
      name: 'Dual Laminate Guard',
      description: 'Hard outer, soft inner - best of both',
      priceRange: '₹5,000 - ₹10,000',
      turnaround: '5-7 days',
      icon: '⭐',
      features: ['Comfortable', 'Durable', 'Premium'],
      category: 'night_guard'
    },
    {
      id: 'nti-splint',
      name: 'NTI-tss Splint',
      description: 'Anterior discluding splint for migraines/TMJ',
      priceRange: '₹6,000 - ₹12,000',
      turnaround: '5-7 days',
      icon: '🎯',
      features: ['Migraine Relief', 'TMJ Therapy', 'Minimal Coverage'],
      category: 'night_guard'
    },
    {
      id: 'sports-guard',
      name: 'Sports Mouth Guard',
      description: 'Custom athletic protection',
      priceRange: '₹3,000 - ₹6,000',
      turnaround: '3-5 days',
      icon: '🏆',
      features: ['Impact Protection', 'Custom Fit', 'Color Options'],
      category: 'night_guard'
    },
  ],
  retainer: [
    {
      id: 'hawley-retainer',
      name: 'Hawley Retainer',
      description: 'Traditional wire and acrylic retainer',
      priceRange: '₹2,500 - ₹5,000',
      turnaround: '5-7 days',
      icon: '🔄',
      features: ['Adjustable', 'Durable', 'Classic'],
      category: 'retainer'
    },
    {
      id: 'essix-retainer',
      name: 'Essix Retainer (Clear)',
      description: 'Clear vacuum-formed retainer',
      priceRange: '₹1,500 - ₹3,000',
      turnaround: '3-5 days',
      icon: '💎',
      features: ['Invisible', 'Comfortable', 'Economical'],
      category: 'retainer'
    },
    {
      id: 'vivera-retainer',
      name: 'Vivera Retainer',
      description: 'Premium clear retainer by Invisalign',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '7-14 days',
      icon: '✨',
      features: ['Premium Quality', '4-Pack', 'Most Durable'],
      category: 'retainer'
    },
    {
      id: 'fixed-retainer',
      name: 'Fixed/Bonded Retainer',
      description: 'Permanent wire bonded behind teeth',
      priceRange: '₹3,000 - ₹6,000',
      turnaround: '3-5 days',
      icon: '🔗',
      features: ['Permanent', 'No Compliance', 'Invisible'],
      category: 'retainer'
    },
  ],
  waxup: [
    {
      id: 'diagnostic-waxup',
      name: 'Diagnostic Wax-Up',
      description: 'Treatment planning and visualization',
      priceRange: '₹2,000 - ₹5,000',
      turnaround: '5-7 days',
      icon: '📋',
      features: ['Planning Tool', 'Patient Education', 'Essential'],
      category: 'waxup'
    },
    {
      id: 'provisional-template',
      name: 'Provisional Template',
      description: 'Silicone matrix for chair-side provisionals',
      priceRange: '₹3,000 - ₹6,000',
      turnaround: '5-7 days',
      icon: '🧪',
      features: ['Quick Provisionals', 'Accurate', 'Time Saver'],
      category: 'waxup'
    },
    {
      id: 'smile-design',
      name: 'Digital Smile Design',
      description: 'Digital mockup with 3D visualization',
      priceRange: '₹5,000 - ₹12,000',
      turnaround: '3-5 days',
      icon: '💻',
      features: ['3D Preview', 'Patient Approval', 'Digital'],
      category: 'waxup'
    },
    {
      id: 'study-model',
      name: 'Study Models',
      description: 'Mounted diagnostic study models',
      priceRange: '₹1,500 - ₹3,000',
      turnaround: '3-5 days',
      icon: '📊',
      features: ['Articulated', 'Diagnostic', 'Record Keeping'],
      category: 'waxup'
    },
  ],
  surgical_guide: [
    {
      id: 'resin-guide',
      name: 'Resin Surgical Guide',
      description: '3D printed resin surgical guide',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '5-7 days',
      icon: '🎯',
      features: ['3D Printed', 'Digital Planning', 'Accurate'],
      category: 'surgical_guide'
    },
    {
      id: 'metal-sleeve-guide',
      name: 'Metal Sleeve Guide',
      description: 'Resin guide with titanium sleeves',
      priceRange: '₹12,000 - ₹20,000',
      turnaround: '7-10 days',
      icon: '⚙️',
      features: ['Titanium Sleeves', 'Durable', 'Multiple Surgeries'],
      category: 'surgical_guide'
    },
    {
      id: 'stackable-guide',
      name: 'Stackable Guide System',
      description: 'Progressive drilling guide system',
      priceRange: '₹15,000 - ₹25,000',
      turnaround: '7-10 days',
      icon: '📚',
      features: ['Progressive Drilling', 'Full Control', 'Premium'],
      category: 'surgical_guide'
    },
  ],
  all_on_x: [
    {
      id: 'pmma-hybrid',
      name: 'PMMA Hybrid Prosthesis',
      description: 'Acrylic provisional full-arch restoration',
      priceRange: '₹30,000 - ₹50,000',
      turnaround: '7-10 days',
      icon: '🦷',
      features: ['Economical', 'Immediate Load', 'Adjustable'],
      category: 'all_on_x'
    },
    {
      id: 'zirconia-hybrid',
      name: 'Zirconia Hybrid',
      description: 'Monolithic zirconia full-arch prosthesis',
      priceRange: '₹1,50,000 - ₹2,50,000',
      turnaround: '14-21 days',
      icon: '💎',
      features: ['Premium', 'Stain Resistant', 'Long Lasting'],
      category: 'all_on_x'
    },
    {
      id: 'ti-bar-acrylic',
      name: 'Ti-Bar with Acrylic',
      description: 'Titanium bar framework with acrylic teeth',
      priceRange: '₹80,000 - ₹1,20,000',
      turnaround: '14-21 days',
      icon: '⚙️',
      features: ['Strong Framework', 'Repairable Teeth', 'Classic'],
      category: 'all_on_x'
    },
    {
      id: 'peek-hybrid',
      name: 'PEEK Hybrid',
      description: 'PEEK framework full-arch prosthesis',
      priceRange: '₹1,00,000 - ₹1,50,000',
      turnaround: '14-21 days',
      icon: '🔧',
      features: ['Lightweight', 'Shock Absorbing', 'Metal-Free'],
      category: 'all_on_x'
    },
  ],
  bleaching_tray: [
    {
      id: 'standard-bleaching',
      name: 'Standard Bleaching Tray',
      description: 'Custom vacuum-formed whitening tray',
      priceRange: '₹2,000 - ₹4,000',
      turnaround: '3-5 days',
      icon: '✨',
      features: ['Custom Fit', 'With Reservoirs', 'Durable'],
      category: 'bleaching_tray'
    },
    {
      id: 'scalloped-bleaching',
      name: 'Scalloped Bleaching Tray',
      description: 'Gingival-contoured whitening tray',
      priceRange: '₹3,000 - ₹5,000',
      turnaround: '3-5 days',
      icon: '🌟',
      features: ['Gingival Margin', 'Less Irritation', 'Precise'],
      category: 'bleaching_tray'
    },
  ],
  sports_guard: [
    {
      id: 'single-layer-guard',
      name: 'Single Layer Guard',
      description: 'Standard EVA sports mouthguard',
      priceRange: '₹2,000 - ₹4,000',
      turnaround: '3-5 days',
      icon: '🛡️',
      features: ['Low Risk Sports', 'Comfortable', 'Economical'],
      category: 'sports_guard'
    },
    {
      id: 'multi-layer-guard',
      name: 'Multi-Layer Guard',
      description: 'Pressure-laminated protection',
      priceRange: '₹4,000 - ₹8,000',
      turnaround: '5-7 days',
      icon: '🏆',
      features: ['High Impact', 'Contact Sports', 'Durable'],
      category: 'sports_guard'
    },
    {
      id: 'pro-guard',
      name: 'Professional Guard',
      description: 'Maximum protection for combat sports',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '7-10 days',
      icon: '🥊',
      features: ['Combat Sports', 'Maximum Protection', 'Custom Design'],
      category: 'sports_guard'
    },
  ],
  clear_aligner: [
    {
      id: 'aligner-set',
      name: 'Aligner Set',
      description: 'Set of clear aligners based on treatment plan',
      priceRange: '₹15,000 - ₹30,000',
      turnaround: '10-14 days',
      icon: '💎',
      features: ['Clear', 'Removable', 'Custom'],
      category: 'clear_aligner'
    },
    {
      id: 'refinement-aligners',
      name: 'Refinement Aligners',
      description: 'Additional aligners for fine-tuning',
      priceRange: '₹8,000 - ₹15,000',
      turnaround: '7-10 days',
      icon: '🔄',
      features: ['Mid-course', 'Correction', 'Fine Tuning'],
      category: 'clear_aligner'
    },
    {
      id: 'retainer-aligners',
      name: 'Retention Aligners',
      description: 'Post-treatment retention aligners',
      priceRange: '₹5,000 - ₹10,000',
      turnaround: '5-7 days',
      icon: '✅',
      features: ['Post Treatment', 'Maintenance', 'Long Term'],
      category: 'clear_aligner'
    },
  ],
  provisional: [
    {
      id: 'pmma-provisional',
      name: 'PMMA Provisional',
      description: 'CAD/CAM milled PMMA temporary',
      priceRange: '₹3,000 - ₹6,000',
      turnaround: '3-5 days',
      icon: '🔧',
      features: ['Milled', 'Durable', 'Long Term'],
      category: 'provisional'
    },
    {
      id: 'composite-provisional',
      name: 'Composite Provisional',
      description: 'Lab-processed composite temporary',
      priceRange: '₹2,000 - ₹4,000',
      turnaround: '3-5 days',
      icon: '🦷',
      features: ['Aesthetic', 'Economical', 'Quick'],
      category: 'provisional'
    },
    {
      id: 'full-arch-provisional',
      name: 'Full Arch Provisional',
      description: 'Complete arch temporary prosthesis',
      priceRange: '₹15,000 - ₹30,000',
      turnaround: '5-7 days',
      icon: '✨',
      features: ['Full Arch', 'Long Term', 'Aesthetic'],
      category: 'provisional'
    },
  ],
  full_mouth_rehab: [
    {
      id: 'diagnostic-phase',
      name: 'Diagnostic Phase',
      description: 'Wax-up, mock-up, and treatment planning',
      priceRange: '₹10,000 - ₹20,000',
      turnaround: '7-10 days',
      icon: '📋',
      features: ['Planning', 'Visualization', 'Patient Approval'],
      category: 'full_mouth_rehab'
    },
    {
      id: 'provisional-phase',
      name: 'Provisional Phase',
      description: 'Full mouth PMMA provisionals',
      priceRange: '₹30,000 - ₹60,000',
      turnaround: '7-14 days',
      icon: '🔧',
      features: ['Full Mouth', 'Test Drive', 'Adjustable'],
      category: 'full_mouth_rehab'
    },
    {
      id: 'final-zirconia',
      name: 'Final - Zirconia',
      description: 'Full mouth zirconia restorations',
      priceRange: '₹2,00,000 - ₹4,00,000',
      turnaround: '21-30 days',
      icon: '💎',
      features: ['Premium', 'Durable', 'Aesthetic'],
      category: 'full_mouth_rehab'
    },
    {
      id: 'final-emax',
      name: 'Final - E.max',
      description: 'Full mouth E.max restorations',
      priceRange: '₹3,00,000 - ₹5,00,000',
      turnaround: '21-30 days',
      icon: '✨',
      features: ['Best Aesthetics', 'Translucent', 'Premium'],
      category: 'full_mouth_rehab'
    },
  ],
}

export const getMaterialsByCategory = (category: string): Material[] => {
  return MATERIALS[category] || []
}

export const getMaterialById = (id: string): Material | undefined => {
  return Object.values(MATERIALS).flat().find(m => m.id === id)
}
