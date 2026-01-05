"use client";

import Image from "next/image";

export function DashboardPreview() {
  return (
    <div className="w-[calc(100vw-32px)] md:w-[1160px]">
      <div className="bg-primary/10 rounded-2xl p-2 shadow-2xl border border-primary/20">
        {/* Placeholder for demo image - replace src with actual image */}
        <div className="w-full aspect-[16/10] bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-800">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground text-sm">Demo Image</div>
            <div className="text-muted-foreground/50 text-xs">
              Replace with dashboard screenshot
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
