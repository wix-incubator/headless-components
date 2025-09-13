export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    try {
      return JSON.parse(error.message).message;
    } catch (e) {
      return error.message;
    }
  }

  return 'Unknown error';
};
