export function navigateTool(path: string) {
  return {
    success: true,

    data: {
      path,
    },

    message: `Navigate to ${path}`,
  };
}
