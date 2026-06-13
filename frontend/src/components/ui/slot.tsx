"use client"

import * as React from "react"

import { cn } from "@utils/cn"

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
}

function isEventHandler(
  propName: string,
  value: unknown
): value is (...args: unknown[]) => void {
  return /^on[A-Z]/.test(propName) && typeof value === "function"
}

function composeEventHandlers(
  slotHandler: ((...args: unknown[]) => void) | undefined,
  childHandler: ((...args: unknown[]) => void) | undefined
) {
  if (!slotHandler) {
    return childHandler
  }

  if (!childHandler) {
    return slotHandler
  }

  return (...args: unknown[]) => {
    childHandler(...args)
    slotHandler(...args)
  }
}

function Slot({ children, ...slotProps }: SlotProps) {
  if (!React.isValidElement(children)) {
    return null
  }

  const child = children as React.ReactElement<Record<string, unknown>>
  const childProps = (child.props ?? {}) as Record<string, unknown>
  const mergedProps: Record<string, unknown> = { ...slotProps, ...childProps }

  if (slotProps.className || typeof childProps.className === "string") {
    mergedProps.className = cn(
      typeof slotProps.className === "string" ? slotProps.className : undefined,
      typeof childProps.className === "string" ? childProps.className : undefined
    )
  }

  if (slotProps.style || childProps.style) {
    mergedProps.style = {
      ...(slotProps.style as React.CSSProperties | undefined),
      ...(childProps.style as React.CSSProperties | undefined),
    }
  }

  for (const [propName, slotValue] of Object.entries(slotProps)) {
    const childValue = childProps[propName]
    if (isEventHandler(propName, slotValue) || isEventHandler(propName, childValue)) {
      mergedProps[propName] = composeEventHandlers(
        typeof slotValue === "function"
          ? (slotValue as (...args: unknown[]) => void)
          : undefined,
        typeof childValue === "function"
          ? (childValue as (...args: unknown[]) => void)
          : undefined
      )
    }
  }

  return React.cloneElement(child, mergedProps)
}

export { Slot }