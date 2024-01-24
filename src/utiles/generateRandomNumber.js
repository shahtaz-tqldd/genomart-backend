const generateId = () => {
  const alphanumericChars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const randomChars = Array.from(
    { length: 8 },
    () =>
      alphanumericChars[Math.floor(Math.random() * alphanumericChars.length)]
  );
  return `#${randomChars.join("")}`;
};

module.exports = generateId;
