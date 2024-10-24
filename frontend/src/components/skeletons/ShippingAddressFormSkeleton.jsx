import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const ShippingAddressFormSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-1/2 h-6" />
    </div>
  )
}
