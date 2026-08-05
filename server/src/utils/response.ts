export const ok = <T>(data: T, message = 'Success') => ({
  success: true,
  message,
  data,
});

export const fail = (message: string, status = 400) => ({
  success: false,
  message,
  status,
});
