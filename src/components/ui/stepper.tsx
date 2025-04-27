import * as React from "react"
import { createContext, useContext } from "react"

import { cn } from "@/lib/utils"

type StepsContextValue = {
  value: number
  onChange: (value: number) => void
  steps: number
}

const StepsContext = createContext<StepsContextValue | null>(null)

function useStepsContext() {
  const context = useContext(StepsContext)

  if (!context) {
    throw new Error("useStepsContext must be used within a Steps provider")
  }

  return context
}

interface StepsProps {
  value: number
  onChange?: (value: number) => void
  className?: string
  children?: React.ReactNode
}

const Steps = React.forwardRef<HTMLDivElement, StepsProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>>(
  ({ value, onChange, children, className, ...props }, ref) => {
    const [items, setItems] = React.useState<number[]>([])

    const registerItem = React.useCallback((item: number) => {
      setItems((prev) => [...prev, item])
    }, [])

    React.useEffect(() => {
      if (children) {
        const count = React.Children.count(children)
        setItems(Array.from({ length: count }, (_, i) => i))
      }
    }, [children])

    const handleChange = (value: number) => {
      onChange?.(value)
    }

    return (
      <StepsContext.Provider
        value={{
          value,
          onChange: handleChange,
          steps: items.length,
        }}
      >
        <div
          ref={ref}
          data-orientation="vertical"
          className={className}
          {...props}
        >
          {children}
        </div>
      </StepsContext.Provider>
    )
  }
)
Steps.displayName = "Steps"

const StepperRoot = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "relative space-y-6",
      className
    )}
    {...props}
  />
))
StepperRoot.displayName = "StepperRoot"

interface StepperItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: number
}

const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { value: currentValue } = useStepsContext()
    const isActive = value === currentValue
    const isCompleted = value < currentValue

    return (
      <li
        ref={ref}
        data-state={isActive ? "active" : isCompleted ? "completed" : "inactive"}
        className={cn("relative pb-6", className)}
        {...props}
      >
        {children}
      </li>
    )
  }
)
StepperItem.displayName = "StepperItem"

const StepperItemIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
StepperItemIndicator.displayName = "StepperItemIndicator"

const StepperItemText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-4 -mt-8 font-medium", className)}
    {...props}
  />
))
StepperItemText.displayName = "StepperItemText"

const StepperItemDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-4 text-sm text-gray-500", className)}
    {...props}
  />
))
StepperItemDescription.displayName = "StepperItemDescription"

const StepperConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute left-4 top-8 -ml-[0.5px] h-full w-0.5 bg-gray-200",
      className
    )}
    {...props}
  />
))
StepperConnector.displayName = "StepperConnector"

export {
  Steps,
  StepperRoot,
  StepperItem,
  StepperItemIndicator,
  StepperItemText,
  StepperItemDescription,
  StepperConnector,
}
