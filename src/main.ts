import express, { Application, Request, Response } from "express";
import database from "./config/db.init";
import dotenv from "dotenv";
import Controllers from "./controllers";
import cors from 'cors';

export default class MainApplication {
  private app: Application = express();
  private port = 4020;

  constructor() {
    this.init();
  }

  private async init() {
    console.log("Iniciando Servicio");
    dotenv.config();

    this.app.use(cors()); 

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    await this.initDB()
    this.initRoutes();
    this.initServer();
  }

  private async initDB() {
    console.log("Iniciando Base de Datos");
    await database();
  }

  private initRoutes() {
    const profilesPictureDir = process.env.PROFILES_PICTURES || "/uploads";
    console.log("Iniciando Rutas y Controladores");

    this.app.use('/profilesF', express.static(profilesPictureDir));

    this.app.get("/", async (req: Request, res: Response) => {
      res.status(200).json({ message: 'API Para el servicio de XDevelop por José Manuel Landero González' });
    });

    const controllers = new Controllers();
    this.app.use("/api", controllers.getRoutes());
  }

  private initServer() {
    console.log("Iniciando Servidor");
    try {
        this.app.listen(this.port, () => {
        console.log(process.env.DB_NAME);
        console.log(`Servidor ejecutandose en http://localhost:${this.port}`);
      });
    } catch (error: any) {
      console.log(`Error occurred: ${error.message}`);
    }
  }
}