export const formatStatusToSentenceCase = (status) => {
  if (!status) return "N/A";
  return status.charAt(0) + status.slice(1).toLowerCase();
};

const formatUtils = { formatStatusToSentenceCase };
export default formatUtils;
