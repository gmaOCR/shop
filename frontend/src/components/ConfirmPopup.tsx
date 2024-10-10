import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog'
import CustomButton from './CustomButton'
import { TrashIcon } from '@radix-ui/react-icons'

interface ConfirmPopupProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  itemId: number
  itemName: string
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ onConfirm, itemName }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <CustomButton variant="outline" IconComponent={TrashIcon} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Supprimer l'item</DialogHeader>
        <DialogDescription>
          Êtes-vous sûr de vouloir supprimer l'item {itemName} de votre panier ?
        </DialogDescription>
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
