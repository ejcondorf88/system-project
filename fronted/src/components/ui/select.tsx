import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../../utils/cn"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
  placeholder?: string
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

interface SelectGroupProps {
  children: React.ReactNode
  className?: string
}

interface SelectLabelProps {
  children: React.ReactNode
  className?: string
}

interface SelectSeparatorProps {
  className?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}>({
  isOpen: false,
  setIsOpen: () => {},
  triggerRef: React.createRef(),
})

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ value, onValueChange, children, disabled, placeholder, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const triggerRef = React.useRef<HTMLButtonElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isOpen])

    return (
      <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, triggerRef }}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </div>
      </SelectContext.Provider>
    )
  }
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, setIsOpen, triggerRef, value } = React.useContext(SelectContext)
  
  React.useImperativeHandle(ref, () => triggerRef.current!)
  React.useImperativeHandle(triggerRef, () => triggerRef.current!)

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      <span className="truncate">
        {children || value || "Select an option..."}
      </span>
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = React.useContext(SelectContext)

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full z-50 mt-1 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      <div className="p-1 max-h-96 overflow-auto">
        {children}
      </div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  SelectItemProps
>(({ className, children, value, disabled, ...props }, ref) => {
  const { value: selectedValue, onValueChange, setIsOpen } = React.useContext(SelectContext)
  const isSelected = selectedValue === value

  const handleClick = () => {
    if (!disabled && onValueChange) {
      onValueChange(value)
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  )
)
SelectGroup.displayName = "SelectGroup"

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SelectLabel.displayName = "SelectLabel"

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
)
SelectSeparator.displayName = "SelectSeparator"

const SelectValue = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("", className)} {...props} />
  )
)
SelectValue.displayName = "SelectValue"

const SelectScrollUpButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </button>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </button>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} 