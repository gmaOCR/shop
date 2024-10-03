import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from 'components/ui/button'

function AddButton({ onClick }) {
  return (
    <Button
      variant="outline"
      className="flex justify-center items-center"
      onClick={onClick}
    >
      <PlusCircledIcon className="h-6 w-6" />
    </Button>
  )
}

export default AddButton
