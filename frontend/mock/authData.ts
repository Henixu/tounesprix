export type UserRole = "admin" | "user";

export type MockUser = {
  name: string;
  email: string;
  role: UserRole;
};

export const mockCurrentUser: MockUser = {
  name: "Salma El Heni",
  email: "salma.el.heni@medianet.com.tn",
  role: "admin",
};
