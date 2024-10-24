const minLengthRule = (minLength) => {
  return (value) => {
    return (
      (value && value.length >= minLength) ||
      "password needs to be longer then 6 chars"
    );
  };
};

const requireRule = (v) => {
  return (v && v.trim() !== "") || "Must have a value";
};

export { requireRule, minLengthRule };
