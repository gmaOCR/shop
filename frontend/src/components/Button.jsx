import { Button } from '@/components/ui/button'

function CustomButton({ onClick, IconComponent, disabled }) {
  return (
    <Button
      variant="outline"
      className="flex justify-center items-center transform transition-transform duration-200 active:scale-110"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
    >
      {IconComponent && <IconComponent className="h-6 w-6" />}
    </Button>
  )
}

export default CustomButton
