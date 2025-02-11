import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="border-b">
      <div className="flex h-14 items-center px-4 justify-between">
        <div className="font-semibold">Scientific Calculator</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </nav>
  );
}
