import { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const scientificButtons = [
  { label: "sin", fn: "sin" },
  { label: "cos", fn: "cos" },
  { label: "tan", fn: "tan" },
  { label: "log", fn: "log10" },
  { label: "ln", fn: "log" },
  { label: "π", fn: "pi" },
  { label: "e", fn: "e" },
  { label: "^", fn: "^" },
  { label: "√", fn: "sqrt" },
  { label: "(", fn: "(" },
  { label: ")", fn: ")" },
] as const;

const numericButtons = [
  "7", "8", "9", "×",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "=", "÷"
] as const;

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState<string | null>(null);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch calculation history
  const { data: history } = useQuery<Array<{ expression: string; result: string }>>({
    queryKey: ["/api/history"],
  });

  // Mutation for saving calculations
  const saveCalculation = useMutation({
    mutationFn: async (calculation: { expression: string; result: string }) => {
      await apiRequest("POST", "/api/history", calculation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save calculation",
        variant: "destructive",
      });
    },
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    if (/[0-9.]/.test(key)) {
      handleNumeric(key);
    } else if (['+', '-', '*', '/', '(', ')', '^'].includes(key)) {
      handleOperator(key);
    } else if (key === 'Enter') {
      calculate();
    } else if (key === 'Backspace') {
      clearDisplay();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]);

  const handleNumeric = (value: string) => {
    setDisplay(prev => {
      if (prev === "0" && value !== ".") return value;
      if (prev.includes(".") && value === ".") return prev;
      return prev + value;
    });
  };

  const handleOperator = (operator: string) => {
    let displayOperator = operator;
    if (operator === "×") displayOperator = "*";
    if (operator === "÷") displayOperator = "/";
    setDisplay(prev => prev + displayOperator);
  };

  const handleScientific = (fn: string) => {
    if (["pi", "e"].includes(fn)) {
      const value = evaluate(fn);
      setDisplay(prev => prev === "0" ? String(value) : prev + value);
    } else {
      setDisplay(prev => prev === "0" ? fn + "(" : prev + fn + "(");
    }
  };

  const clearDisplay = () => {
    setDisplay("0");
    setLastOperation(null);
  };

  const calculate = () => {
    try {
      const result = evaluate(display);
      setLastOperation(display);
      setDisplay(String(result));

      // Save calculation to history
      saveCalculation.mutate({
        expression: display,
        result: String(result),
      });
    } catch (error) {
      setDisplay("Error");
      setTimeout(() => setDisplay("0"), 1000);
    }
  };

  const handleMemory = (action: 'store' | 'recall' | 'clear') => {
    switch (action) {
      case 'store':
        setMemory(display);
        break;
      case 'recall':
        if (memory) setDisplay(memory);
        break;
      case 'clear':
        setMemory(null);
        break;
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card p-6 rounded-lg shadow-xl">
        <div className="mb-4 bg-amber-200 dark:bg-amber-300 p-4 rounded font-mono text-right min-h-[80px] flex flex-col justify-between text-black">
          {lastOperation && (
            <div className="text-sm text-slate-600 break-all">{lastOperation}</div>
          )}
          <div className="text-2xl break-all">{display}</div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Memory and Clear buttons */}
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all"
            onClick={() => clearDisplay()}
          >
            C
          </Button>
          <Button 
            className="shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all"
            onClick={() => handleMemory('store')}
          >
            MS
          </Button>
          <Button 
            className="shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all"
            onClick={() => handleMemory('recall')}
          >
            MR
          </Button>
          <Button 
            className="shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all"
            onClick={() => handleMemory('clear')}
          >
            MC
          </Button>

          {/* Scientific functions */}
          {scientificButtons.map(({ label, fn }) => (
            <Button
              key={label}
              className="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all"
              onClick={() => handleScientific(fn)}
            >
              {label}
            </Button>
          ))}

          {/* Numeric keypad */}
          {numericButtons.map((btn) => (
            <Button
              key={btn}
              className={`${
                ['×', '-', '+', '÷'].includes(btn)
                  ? 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-700 text-white'
                  : btn === '='
                  ? 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                  : /[0-9.]/.test(btn)
                  ? 'bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-100 font-semibold'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-foreground'
              } shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] active:translate-y-0.5 transition-all`}
              onClick={() => {
                if (btn === '=') calculate();
                else if (['×', '-', '+', '÷'].includes(btn)) handleOperator(btn);
                else handleNumeric(btn);
              }}
            >
              {btn}
            </Button>
          ))}
        </div>

        {/* History Section */}
        {history && history.length > 0 && (
          <div className="mt-4 p-2 bg-slate-100 dark:bg-slate-800 rounded">
            <h3 className="text-foreground mb-2 text-sm">Recent Calculations</h3>
            <div className="space-y-1">
              {history.slice(-3).map((calc, index) => (
                <div key={index} className="text-xs text-muted-foreground">
                  {calc.expression} = {calc.result}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}