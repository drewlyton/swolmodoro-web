export const getRedirectURL = (response: Response) => {
  return response.headers.get("Location");
};
