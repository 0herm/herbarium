"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { XIcon } from "lucide-react"

import { cn } from "@utils/cn"
import { Slot } from "@parent/frontend/src/components/ui/slot"

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
  descriptionId: string
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext(componentName: string) {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error(`${componentName} must be used within <Dialog>`)
  }
  return context
}

function composeEventHandlers<E>(
  userHandler: ((event: E) => void) | undefined,
  internalHandler: (event: E) => void
) {
  return (event: E) => {
    userHandler?.(event)
    const defaultPrevented =
      (event as unknown as { defaultPrevented?: boolean }).defaultPrevented ??
      false
    if (!defaultPrevented) {
      internalHandler(event)
    }
  }
}

type DialogProps = {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function Dialog({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: DialogProps) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const titleId = React.useId()
  const descriptionId = React.useId()
  const currentOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  React.useEffect(() => {
    if (!currentOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleEscape)
    }
  }, [currentOpen, setOpen])

  return (
    <DialogContext.Provider
      value={{ open: currentOpen, setOpen, titleId, descriptionId }}
    >
      <div data-slot="dialog">{children}</div>
    </DialogContext.Provider>
  )
}

type DialogTriggerProps = React.ComponentProps<"button"> & {
  asChild?: boolean
}

function DialogTrigger({
  asChild = false,
  onClick,
  ...props
}: DialogTriggerProps) {
  const { setOpen } = useDialogContext("DialogTrigger")
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="dialog-trigger"
      onClick={composeEventHandlers(onClick, () => setOpen(true))}
      {...props}
    />
  )
}

function DialogPortal({
  children,
}: {
  children?: React.ReactNode
}) {
  if (typeof document === "undefined") {
    return null
  }
  return createPortal(children, document.body)
}

type DialogCloseProps = React.ComponentProps<"button"> & {
  asChild?: boolean
}

function DialogClose({
  asChild = false,
  onClick,
  ...props
}: DialogCloseProps) {
  const { setOpen } = useDialogContext("DialogClose")
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="dialog-close"
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...props}
    />
  )
}

function DialogOverlay({
  className,
  onClick,
  ...props
}: React.ComponentProps<"div">) {
  const { open, setOpen } = useDialogContext("DialogOverlay")

  if (!open) {
    return null
  }

  return (
    <div
      data-slot="dialog-overlay"
      data-state="open"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const { open, titleId, descriptionId, setOpen } = useDialogContext(
    "DialogContent"
  )

  if (!open) {
    return null
  }

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-slot="dialog-content"
        data-state="open"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        onClick={(event) => {
          event.stopPropagation()
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            type="button"
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            onClick={() => setOpen(false)}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  const { titleId } = useDialogContext("DialogTitle")

  return (
    <h2
      id={titleId}
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { descriptionId } = useDialogContext("DialogDescription")

  return (
    <p
      id={descriptionId}
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
