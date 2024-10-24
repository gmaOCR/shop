import React from 'react'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

const Menu = () => (
  <NavigationMenu className="">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
        <NavigationMenuContent className="flex flex-col">
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} pt-3 mx-3`}
            href="/"
          >
            Home
          </NavigationMenuLink>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} py-3 mx-3`}
            href="/login"
          >
            Login
          </NavigationMenuLink>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} py-3 mx-3`}
            href="/checkout"
          >
            Checkout
          </NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
)

export default Menu
