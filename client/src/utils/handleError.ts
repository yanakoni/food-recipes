const handleError = (context: string, error: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`${context}: ${JSON.stringify(error)}`);
  }
};

export { handleError };
