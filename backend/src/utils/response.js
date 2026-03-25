export const success = (res, data, message = 'Success') => {
  res.json({ code: 200, message, data });
};

export const error = (res, message, code = 500) => {
  res.status(code).json({ code, message });
};