export type NotifyOptions = {
  message: string;
  severity?: "success" | "info" | "warning" | "error";
  duration?: number;
};

type NotifyFn = (options: NotifyOptions | string) => void;

let handler: NotifyFn | null = null;

export function setNotificationHandler(fn: NotifyFn | null) {
  handler = fn;
}

/** Can be called from axios / non-React code */
export function notifyFromServer(options: NotifyOptions | string) {
  if (!handler) return;
  handler(options);
}
