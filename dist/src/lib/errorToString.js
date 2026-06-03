export const errorToString = (error) => error instanceof Error ? error.message : JSON.stringify(error);
