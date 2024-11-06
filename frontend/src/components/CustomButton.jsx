import React, { forwardRef } from 'react'
import { Button } from '@/components/ui/button'

const CustomButton = forwardRef(
  (
    {
      onClick,
      IconComponent,
      variant,
      disabled,
      texte,
      'aria-label': ariaLabel,
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className="flex justify-center items-center transform transition-transform duration-200 active:scale-110"
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {texte}
        {IconComponent && <IconComponent className="h-6 w-6" />}
      </Button>
    )
  },
)

export default CustomButton
