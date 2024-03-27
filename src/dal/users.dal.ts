import { Users } from "../models/users.model";

export const create = async (payload: any): Promise<any> => {
  console.log(payload);
  const user = await Users.create(payload);
  return user;
};

export const getById = async (id: number): Promise<any> => {
  const user = await Users.findByPk(id);
  if (!user) {
    throw new Error("No encontrado");
  }
  return user;
};

export const getAll = async (filters = {}): Promise<any[]> => {
  return Users.findAll({
    where: {
      ...filters,
    },
  });
};

export const update = async (
  id: number,
  payload: Partial<any>
): Promise<any> => {
  const user = await Users.findByPk(id);
  if (!user) {
    throw new Error("No encontrado");
  }
  const updatedUsers = await user.update(payload);
  return updatedUsers;
};

export const deleteById = async (id: number): Promise<boolean> => {
  const deletedUsersCount = await Users.destroy({
    where: { id },
  });
  return !!deletedUsersCount;
};
