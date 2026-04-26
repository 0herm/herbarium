"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@parent/frontend/src/lib/utils"
import { buttonVariants } from "@parent/frontend/src/components/ui/button"
import { Slot } from "@parent/frontend/src/components/ui/slot"

type AlertDialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
  descriptionId: string
}

const AlertDialogContext =
  React.createContext<AlertDialogContextValue | null>(null)

function useAlertDialogContext(componentName: string) {
  const context = React.useContext(AlertDialogContext)
  if (!context) {
    throw new Error(`${componentName} must be used within <AlertDialog>`)
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

type AlertDialogProps = {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function AlertDialog({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
}: AlertDialogProps) {
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
    <AlertDialogContext.Provider
      value={{
        open: currentOpen,
        setOpen,
        titleId,
        descriptionId,
      }}
    >
      <div data-slot="alert-dialog">{children}</div>
    </AlertDialogContext.Provider>
  )
}

type AlertDialogTriggerProps = React.ComponentProps<"button"> & {
  asChild?: boolean
}

function AlertDialogTrigger({
  asChild = false,
  onClick,
  ...props
}: AlertDialogTriggerProps) {
  const { setOpen } = useAlertDialogContext("AlertDialogTrigger")
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="alert-dialog-trigger"
      onClick={composeEventHandlers(onClick, () => setOpen(true))}
      {...props}
    />
  )
}

function AlertDialogPortal({
  children,
}: {
  children?: React.ReactNode
}) {
  if (typeof document === "undefined") {
    return null
  }
  return createPortal(children, document.body)
}

function AlertDialogOverlay({
  className,
  onClick,
  ...props
}: React.ComponentProps<"div">) {
  const { open, setOpen } = useAlertDialogContext("AlertDialogOverlay")

  if (!open) {
    return null
  }

  return (
    <div
      data-slot="alert-dialog-overlay"
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

function AlertDialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { open, titleId, descriptionId } = useAlertDialogContext(
    "AlertDialogContent"
  )

  if (!open) {
    return null
  }

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        data-slot="alert-dialog-content"
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
      </div>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  const { titleId } = useAlertDialogContext("AlertDialogTitle")

  return (
    <h2
      id={titleId}
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { descriptionId } = useAlertDialogContext("AlertDialogDescription")

  return (
    <p
      id={descriptionId}
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  onClick,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
}) {
  const { setOpen } = useAlertDialogContext("AlertDialogAction")
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="alert-dialog-action"
      className={cn(buttonVariants(), className)}
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  onClick,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
}) {
  const { setOpen } = useAlertDialogContext("AlertDialogCancel")
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="alert-dialog-cancel"
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={composeEventHandlers(onClick, () => setOpen(false))}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
