"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface NotificationProps {
  title?: string
  message: string
}

export function Banner({ title, message }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return null
  }

  return (
    <div className="max-w-xs w-full rounded-md shadow-lg border">
      <div className="p-4">
        <div className="flex justify-between items-start">
          {title && <div className="text-sm">{title}</div>}
          <button onClick={() => setIsVisible(false)} className="hover:text-primary transition-colors">
            <X size={16} />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="mt-1 text-primary text-sm">{message}</div>
      </div>
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { ArrowRightIcon, Eclipse, XIcon } from "lucide-react"

// import { Button } from "@/components/ui/button"

// export default function Banner() {
//   const [isVisible, setIsVisible] = useState(true)
//   if (!isVisible) return null

//   return (
//     <div className="dark bg-muted text-foreground px-4 py-3">
//       <div className="flex gap-2">
//         <div className="flex grow gap-3">
//           <Eclipse
//             className="mt-0.5 shrink-0 opacity-60"
//             size={16}
//             aria-hidden="true"
//           />
//           <div className="flex grow flex-col justify-between gap-2 md:flex-row">
//             <p className="text-sm">
//               Friday is still in beta so it can make mistakes.
//             </p>
//             <a href="#" className="group text-sm font-medium whitespace-nowrap">
//               Learn more
//               <ArrowRightIcon
//                 className="ms-1 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
//                 size={16}
//                 aria-hidden="true"
//               />
//             </a>
//           </div>
//         </div>
//         <Button
//           variant="ghost"
//           className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
//           onClick={() => setIsVisible(false)}
//           aria-label="Close banner"
//         >
//           <XIcon
//             size={16}
//             className="opacity-60 transition-opacity group-hover:opacity-100"
//             aria-hidden="true"
//           />
//         </Button>
//       </div>
//     </div>
//   )
// }
