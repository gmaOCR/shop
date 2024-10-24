import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export const CartItemSkeleton = () => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-6 h-6 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-16 h-6 rounded" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
    </div>
  )
}
