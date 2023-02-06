const handleError = (context: string, error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`${context}: ${error}`);
  }
};

export { handleError };
