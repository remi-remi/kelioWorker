export const errorToString = (error: unknown) =>
   error instanceof Error ? error.message : JSON.stringify(error)
