"use client"

import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer"

export default function Demo() {
  // w-full matters: 21st centres demos in a flex wrapper, and a flex item
  // left at width:auto shrinks the canvas to 0px wide.
  return (
    <div className="w-full">
      <HalftoneWordmarkFooter
        wordmark="leqad"
        label="Leqad CAD"
        meta="©2026 · In-Workflow CAD Education"
        palette={{
          background: "#0E2943",
          ink: "#F5EFE7",
          warm: "#B74B21",
        }}
        columns={[
          {
            title: "Product",
            links: [
              { label: "Overview", href: "#/" },
              { label: "Your First Sketch", href: "#/demo" },
              { label: "In-Workflow Guide", href: "#/demo" },
            ],
          },
          {
            title: "Curriculum",
            links: [
              { label: "Parametric Intent", href: "#/demo" },
              { label: "Constraint Logic", href: "#/demo" },
              { label: "Watertight Profiles", href: "#/demo" },
            ],
          },
          {
            title: "Collaboration",
            links: [
              { label: "Platform Alignment", href: "#/partners" },
              { label: "Educational Pilots", href: "#/partners" },
              { label: "Start Conversation", href: "#/partners" },
            ],
          },
        ]}
      />
    </div>
  )
}
