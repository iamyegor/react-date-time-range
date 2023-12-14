export const hours12 = Array.from({ length: 12 }, (_, i) =>
  String(i === 0 ? 12 : i).padStart(2, "0")
);

export const hours24 = Array.from({ length: 23 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

export const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
