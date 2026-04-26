import * as React from "react"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@parent/frontend/src/lib/utils"
import { Slot } from "@parent/frontend/src/components/ui/slot"

type NavigationMenuContextValue = {
  openItem: string | null
  setOpenItem: (itemId: string | null) => void
  viewport: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
}

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null)

type NavigationMenuItemContextValue = {
  itemId: string
}

const NavigationMenuItemContext =
  React.createContext<NavigationMenuItemContextValue | null>(null)

function useNavigationMenuContext(componentName: string) {
  const context = React.useContext(NavigationMenuContext)
  if (!context) {
    throw new Error(`${componentName} must be used within <NavigationMenu>`)
  }
  return context
}

function useNavigationMenuItemContext(componentName: string) {
  const context = React.useContext(NavigationMenuItemContext)
  if (!context) {
    throw new Error(
      `${componentName} must be used within <NavigationMenuItem>`
    )
  }
  return context
}

function NavigationMenu({
  className,
  children,
  viewport = false,
  ...props
}: React.ComponentProps<"div"> & {
  viewport?: boolean
}) {
  const [openItem, setOpenItem] = React.useState<string | null>(null)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setOpenItem(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenItem(null)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <NavigationMenuContext.Provider
      value={{
        openItem,
        setOpenItem,
        viewport,
        containerRef,
      }}
    >
      <div
        ref={containerRef}
        data-slot="navigation-menu"
        data-viewport={viewport}
        className={cn(
          "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
        {viewport && <NavigationMenuViewport />}
      </div>
    </NavigationMenuContext.Provider>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  const itemId = React.useId()

  return (
    <NavigationMenuItemContext.Provider value={{ itemId }}>
      <li
        data-slot="navigation-menu-item"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
)

function NavigationMenuTrigger({
  className,
  children,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { openItem, setOpenItem } = useNavigationMenuContext(
    "NavigationMenuTrigger"
  )
  const { itemId } = useNavigationMenuItemContext("NavigationMenuTrigger")
  const isOpen = openItem === itemId

  return (
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      data-state={isOpen ? "open" : "closed"}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }
        setOpenItem(isOpen ? null : itemId)
      }}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </button>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { openItem } = useNavigationMenuContext("NavigationMenuContent")
  const { itemId } = useNavigationMenuItemContext("NavigationMenuContent")
  const isOpen = openItem === itemId

  if (!isOpen) {
    return null
  }

  return (
    <div
      data-slot="navigation-menu-content"
      data-state="open"
      className={cn(
        "data-[state=open]:animate-in absolute top-full left-0 z-50 mt-1.5 w-max min-w-48 overflow-hidden rounded-md border bg-popover p-2 pr-2.5 text-popover-foreground shadow duration-200",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { viewport } = useNavigationMenuContext("NavigationMenuViewport")

  if (!viewport) {
    return null
  }

  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <div
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground relative mt-1.5 h-px w-full overflow-hidden rounded-md border shadow md:w-px",
          className
        )}
        {...props}
      />
    </div>
  )
}

type NavigationMenuLinkProps = React.ComponentProps<"a"> & {
  asChild?: boolean
}

function NavigationMenuLink({
  className,
  asChild = false,
  ...props
}: NavigationMenuLinkProps) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </div>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
