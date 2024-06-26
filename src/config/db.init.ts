import { Users } from "../models/users.model";

const dbInit = async () => {
  const isDev = process.env.NODE_ENV === "development";
  await Users.sync({ alter: isDev });
};

export default dbInit;
