import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import CustomButton from './CustomButton'
import { TrashIcon } from '@radix-ui/react-icons'

interface ConfirmPopupProps {
  onConfirm: () => void
  itemId?: number
  textUser: string
  triggerIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  textButton?: string
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  onConfirm,
  textUser,
  triggerIcon = TrashIcon,
  textButton,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {textButton ? (
          <CustomButton variant="outline" texte={textButton} />
        ) : (
          <CustomButton variant="outline" IconComponent={triggerIcon} />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'élément</DialogTitle>
        </DialogHeader>
        <DialogDescription>{textUser}</DialogDescription>
        <DialogFooter>
          <CustomButton
            onClick={onConfirm}
            variant="destructive"
            IconComponent={TrashIcon}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmPopup
