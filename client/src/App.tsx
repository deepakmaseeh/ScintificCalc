import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import Calculator from "@/pages/Calculator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Calculator} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="calculator-theme">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;