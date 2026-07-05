import { toast } from 'sonner'

export function useToast() {
  return {
    success: (message: string, description?: string) =>
      toast.success(message, description ? { description } : {}),
    error: (message: string, description?: string) =>
      toast.error(message, description ? { description } : {}),
    loading: (message: string) => toast.loading(message),
    promise: <T,>(promise: Promise<T>, messages: { loading: string; success: string; error: string }) =>
      toast.promise(promise, messages),
    message: (message: string) => toast.message(message),
  }
}
