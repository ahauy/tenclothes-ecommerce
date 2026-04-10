export const getInputClassName = (hasError: boolean) =>
  `outline-none py-2.5 px-3 border w-full rounded transition-all duration-200 ${
    hasError
      ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-900"
      : "border-gray-300 focus:border-gray-800 hover:border-gray-400"
  }`;