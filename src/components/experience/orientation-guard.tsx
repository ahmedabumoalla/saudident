"use client";

import { RotateCcw } from "lucide-react";

export function OrientationGuard() {
  return (
    <div className="orientation-guard" role="status">
      <div className="orientation-icon"><RotateCcw /></div>
      <strong>لأفضل تجربة</strong>
      <p>يرجى تدوير الجهاز إلى الوضع الأفقي</p>
      <span>تجربة سعودي دنت التفاعلية</span>
    </div>
  );
}
