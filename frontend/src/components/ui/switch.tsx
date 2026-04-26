"use client"

import * as React from "react"

import { cn } from "@parent/frontend/src/lib/utils"

type SwitchProps = Omit<React.ComponentProps<"button">, "onChange"> & {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Switch({
  className,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  onClick,
  ...props
}: SwitchProps) {
  const isControlled = checked !== undefined
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(
    defaultChecked ?? false
  )
  const isChecked = isControlled ? checked : uncontrolledChecked

  const setChecked = React.useCallback(
    (nextChecked: boolean) => {
      if (!isControlled) {
        setUncontrolledChecked(nextChecked)
      }
      onCheckedChange?.(nextChecked)
    },
    [isControlled, onCheckedChange]
  )

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || disabled) {
        return
      }
      setChecked(!isChecked)
    },
    [disabled, isChecked, onClick, setChecked]
  )

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        data-state={isChecked ? "checked" : "unchecked"}
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </button>
  )
}

export { Switch }
