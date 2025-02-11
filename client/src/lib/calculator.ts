import { evaluate } from "mathjs";

export type Operation = {
  type: 'number' | 'operator' | 'scientific' | 'memory';
  value: string;
};

export const formatDisplay = (value: string): string => {
  if (value === 'Error') return value;
  
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  
  if (Math.abs(num) < 0.000001 || Math.abs(num) > 999999999) {
    return num.toExponential(6);
  }
  
  const parts = value.split('.');
  if (parts[0].length > 9) {
    return num.toExponential(6);
  }
  
  return value;
};

export const evaluateExpression = (expression: string): string => {
  try {
    const result = evaluate(expression);
    return formatDisplay(String(result));
  } catch (error) {
    return 'Error';
  }
};

export const isValidOperation = (current: string, operation: Operation): boolean => {
  if (operation.type === 'number' && operation.value === '.' && current.includes('.')) {
    return false;
  }
  
  if (operation.type === 'operator' && current.length === 0) {
    return false;
  }
  
  return true;
};
