/**
 * Standard utility function for conditional class merging in shadcn/ui components.
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
