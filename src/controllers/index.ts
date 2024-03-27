import { Router } from "express";
import UsersController from "./users.controllers";

export default class Controllers {
  private router: Router;

  constructor() {
    this.router = Router();

    this.initControllers();
  }

  private initControllers() {
    this.initUsersController();
  }

  private initUsersController() {
    const usersController = new UsersController();
    this.router.use("/users", usersController.getRouter());
  }

  public getRoutes(): Router {
    return this.router;
  }
}
