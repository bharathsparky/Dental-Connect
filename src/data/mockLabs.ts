export interface ServiceDetail {
  name: string
  description: string
  price: string
  turnaround: string
}

export interface Lab {
  id: string
  name: string
  address: string
  distance: string
  rating: number
  reviewCount: number
  turnaround: string
  priceRange: string
  services: string[]
  serviceDetails: ServiceDetail[]
  image: string
  isVerified: boolean
  yearsInBusiness: number
  specialties: string[]
  completedOrders: number
  isFavorite?: boolean
}

export const MOCK_LABS: Lab[] = [
  {
    id: 'lab-1',
    name: 'Precision Dental Lab',
    address: 'Anna Nagar, Chennai',
    distance: '2.3 km',
    rating: 4.8,
    reviewCount: 234,
    turnaround: '5-7 days',
    priceRange: '₹₹',
    services: ['Crown', 'Bridge', 'Denture', 'Implant'],
    serviceDetails: [
      { name: 'Crown', description: 'PFM, Zirconia, E.max options', price: '₹2,500 - ₹8,000', turnaround: '5-7 days' },
      { name: 'Bridge', description: '3-unit to full arch restorations', price: '₹7,500 - ₹25,000', turnaround: '7-10 days' },
      { name: 'Denture', description: 'Complete & partial dentures', price: '₹5,000 - ₹15,000', turnaround: '10-14 days' },
      { name: 'Implant', description: 'Abutments & implant crowns', price: '₹8,000 - ₹12,000', turnaround: '7-10 days' },
    ],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&h=300&fit=crop',
    isVerified: true,
    yearsInBusiness: 15,
    specialties: ['Zirconia', 'E.max', 'CAD/CAM'],
    completedOrders: 1250,
    isFavorite: true,
  },
  {
    id: 'lab-2',
    name: 'Elite Prosthodontics',
    address: 'T. Nagar, Chennai',
    distance: '4.1 km',
    rating: 4.6,
    reviewCount: 189,
    turnaround: '4-6 days',
    priceRange: '₹₹₹',
    services: ['Crown', 'Bridge', 'Implant'],
    serviceDetails: [
      { name: 'Crown', description: 'Premium zirconia & lithium disilicate', price: '₹4,000 - ₹12,000', turnaround: '4-6 days' },
      { name: 'Bridge', description: 'High-strength ceramic bridges', price: '₹12,000 - ₹40,000', turnaround: '6-8 days' },
      { name: 'Implant', description: 'Custom abutments & screw-retained crowns', price: '₹10,000 - ₹18,000', turnaround: '5-7 days' },
    ],
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400&h=300&fit=crop',
    isVerified: true,
    yearsInBusiness: 12,
    specialties: ['Implant Prosthetics', 'Full Mouth Rehab'],
    completedOrders: 890,
    isFavorite: false,
  },
  {
    id: 'lab-3',
    name: 'Smile Crafters Lab',
    address: 'Adyar, Chennai',
    distance: '5.8 km',
    rating: 4.9,
    reviewCount: 312,
    turnaround: '6-8 days',
    priceRange: '₹₹',
    services: ['Crown', 'Bridge', 'Denture', 'Ortho'],
    serviceDetails: [
      { name: 'Crown', description: 'All-ceramic & metal-ceramic options', price: '₹2,000 - ₹7,500', turnaround: '6-8 days' },
      { name: 'Bridge', description: 'Conventional & Maryland bridges', price: '₹6,000 - ₹22,000', turnaround: '8-10 days' },
      { name: 'Denture', description: 'Acrylic & flexible dentures', price: '₹4,500 - ₹18,000', turnaround: '12-15 days' },
      { name: 'Ortho', description: 'Retainers, aligners & appliances', price: '₹3,000 - ₹25,000', turnaround: '7-14 days' },
    ],
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop',
    isVerified: true,
    yearsInBusiness: 20,
    specialties: ['Aesthetic Dentistry', 'Orthodontic Appliances'],
    completedOrders: 2100,
    isFavorite: true,
  },
  {
    id: 'lab-4',
    name: 'Digital Dental Works',
    address: 'Velachery, Chennai',
    distance: '7.2 km',
    rating: 4.5,
    reviewCount: 156,
    turnaround: '3-5 days',
    priceRange: '₹₹₹',
    services: ['Crown', 'Bridge', 'Implant'],
    serviceDetails: [
      { name: 'Crown', description: 'Same-day CEREC & milled crowns', price: '₹5,000 - ₹15,000', turnaround: '1-3 days' },
      { name: 'Bridge', description: 'Digital workflow bridges', price: '₹15,000 - ₹45,000', turnaround: '3-5 days' },
      { name: 'Implant', description: 'Guided surgery components', price: '₹12,000 - ₹20,000', turnaround: '3-5 days' },
    ],
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=300&fit=crop',
    isVerified: true,
    yearsInBusiness: 8,
    specialties: ['Digital Workflow', '3D Printing', 'Same-Day Crowns'],
    completedOrders: 540,
    isFavorite: false,
  },
  {
    id: 'lab-5',
    name: 'Heritage Dental Lab',
    address: 'Mylapore, Chennai',
    distance: '3.5 km',
    rating: 4.7,
    reviewCount: 278,
    turnaround: '5-7 days',
    priceRange: '₹',
    services: ['Crown', 'Bridge', 'Denture'],
    serviceDetails: [
      { name: 'Crown', description: 'PFM & metal crowns', price: '₹1,500 - ₹4,000', turnaround: '5-7 days' },
      { name: 'Bridge', description: 'Traditional metal-ceramic bridges', price: '₹4,500 - ₹12,000', turnaround: '7-10 days' },
      { name: 'Denture', description: 'Complete & partial acrylic dentures', price: '₹3,500 - ₹10,000', turnaround: '10-14 days' },
    ],
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&h=300&fit=crop',
    isVerified: false,
    yearsInBusiness: 25,
    specialties: ['Traditional Craftsmanship', 'Dentures', 'PFM'],
    completedOrders: 3200,
    isFavorite: false,
  },
]

export const getLabById = (id: string): Lab | undefined => {
  return MOCK_LABS.find(lab => lab.id === id)
}
