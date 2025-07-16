import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

interface LayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Layout({ children, activeView, onViewChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={onViewChange} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
