import * as usersDal from "../dal/users.dal";

export default class UsersServices {
  constructor() {}

  static create(payload: any): Promise<any> {
    return usersDal.create(payload);
  }
  static update(id: number, payload: Partial<any>): Promise<any> {
    return usersDal.update(id, payload);
  }
  static getById(id: number): Promise<any> {
    return usersDal.getById(id);
  }
  static deleteById(id: number): Promise<boolean> {
    return usersDal.deleteById(id);
  }
  static getAll(filters?: any): Promise<any[]> {
    return usersDal.getAll(filters);
  }
}
