"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@parent/frontend/src/lib/utils"
type SelectContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  value: string
  setValue: (value: string) => void
  labels: Record<string, string>
  registerLabel: (value: string, label: string) => void
  disabled: boolean
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext(componentName: string) {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error(`${componentName} must be used within <Select>`)
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

type SelectProps = {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
}

function Select({
  children,
  value,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
}: SelectProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "")
  const [open, setOpen] = React.useState(false)
  const [labels, setLabels] = React.useState<Record<string, string>>({})
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onValueChange?.(nextValue)
    },
    [isControlled, onValueChange]
  )

  const registerLabel = React.useCallback((itemValue: string, label: string) => {
    setLabels((previous) => {
      if (previous[itemValue] === label) {
        return previous
      }
      return {
        ...previous,
        [itemValue]: label,
      }
    })
  }, [])

  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return
      }
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
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
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        value: currentValue,
        setValue,
        labels,
        registerLabel,
        disabled,
      }}
    >
      <div ref={containerRef} data-slot="select" className="relative">
        {children}
        {name && <input type="hidden" name={name} value={currentValue} />}
      </div>
    </SelectContext.Provider>
  )
}

function SelectGroup({ ...props }: React.ComponentProps<"div">) {
  return <div data-slot="select-group" {...props} />
}

type SelectValueProps = React.ComponentProps<"span"> & {
  placeholder?: string
}

function SelectValue({ placeholder, className, ...props }: SelectValueProps) {
  const { value, labels } = useSelectContext("SelectValue")

  return (
    <span
      data-slot="select-value"
      className={cn(!value && "text-muted-foreground", className)}
      {...props}
    >
      {value ? labels[value] ?? value : placeholder}
    </span>
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<"button"> & {
  size?: "sm" | "default"
}) {
  const { open, setOpen, disabled } = useSelectContext("SelectTrigger")

  return (
    <button
      type="button"
      data-slot="select-trigger"
      data-size={size}
      data-state={open ? "open" : "closed"}
      aria-haspopup="listbox"
      aria-expanded={open}
      className={cn(
        "border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      disabled={disabled || props.disabled}
      onClick={composeEventHandlers(props.onClick, () => setOpen(!open))}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 opacity-50" />
    </button>
  )
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  position?: "popper" | "item-aligned"
}) {
  const { open } = useSelectContext("SelectContent")

  if (!open) {
    return null
  }

  return (
    <div
      data-slot="select-content"
      data-state="open"
      role="listbox"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in absolute top-full left-0 z-50 mt-1 max-h-72 min-w-full overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <div className="p-1">{children}</div>
      <SelectScrollDownButton />
    </div>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map((child) => getNodeText(child)).join("")
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children)
  }

  return ""
}

type SelectItemProps = React.ComponentProps<"button"> & {
  value: string
}

function SelectItem({
  className,
  children,
  ...props
}: SelectItemProps) {
  const { value: selectedValue, setValue, setOpen, registerLabel } =
    useSelectContext("SelectItem")
  const isSelected = selectedValue === props.value

  React.useEffect(() => {
    registerLabel(props.value, getNodeText(children).trim())
  }, [children, props.value, registerLabel])

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      data-slot="select-item"
      data-state={isSelected ? "checked" : "unchecked"}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      onClick={composeEventHandlers(props.onClick, () => {
        setValue(props.value)
        setOpen(false)
      })}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
      <span>{children}</span>
    </button>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
