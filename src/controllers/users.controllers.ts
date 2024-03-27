import { Router, Request, Response } from "express";
import UsersServices from "./../services/users.service";
import multer, { Multer } from "multer";
import fs from "fs";

export default class UserController {
  private usersRouter: Router;
  private uploadFiles?: Multer;
  private uploadDirectory = process.env.PROFILES_PICTURES || "/uploads";

  constructor() {
    this.usersRouter = Router();
    this.configFolderFiles();
    this.routes();
  }

  private configFolderFiles() {

    if (!fs.existsSync(this.uploadDirectory)) {
      fs.mkdirSync(this.uploadDirectory);
    }
    const tUd = this.uploadDirectory;
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, tUd);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    this.uploadFiles = multer({ storage: storage });
  }

  private routes() {
    this.usersRouter.get("/", async (req: Request, res: Response) => {
      const result = await UsersServices.getAll();
      return res.status(200).send(result);
    });

    this.usersRouter.get("/:id", async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const result = await UsersServices.getById(id);
        return res.status(200).send(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener el usuario." });
      }
    });

    this.usersRouter.put(
      "/:id",
      this.uploadFiles!.single("imagen"),
      async (req: Request, res: Response) => {
        try {
          console.log('update')
          // Leer otros datos del formulario
          const nombre = req.body.nombre;
          const apellido = req.body.apellido;
          const correo = req.body.correo;
          const contrasena = req.body.contrasena;

          const newData: any = {};
          newData.name = nombre;
          newData.lastname = apellido;
          newData.email = correo;
          if(!!contrasena){
            newData.password = contrasena;
          }

          const id = Number(req.params.id);

          const getDataCurrent = await UsersServices.getById(id);
          const imagen = req.file;

          if (fs.existsSync(this.uploadDirectory+getDataCurrent.picture)) {
            newData.picture = null;
          }
          
          if(imagen){
            newData.picture =  imagen?.filename
          }

          const result = await UsersServices.update(id, newData);
          console.log(result)
          if(!!result){
            console.log(this.uploadDirectory+getDataCurrent.picture)
            if (fs.existsSync(this.uploadDirectory+getDataCurrent.picture)) {
              fs.unlinkSync(this.uploadDirectory+getDataCurrent.picture)
            }
          }
          return res.status(200).send(result);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Error al obtener el usuario." });
        }
      }
    );

    this.usersRouter.delete("/:id", async (req: Request, res: Response) => {
      try {
        const id = Number(req.params.id);
        const result = await UsersServices.deleteById(id);
        return res.status(200).send(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener el usuario." });
      }
    });

    this.usersRouter.post(
      "/",
      this.uploadFiles!.single("imagen"),
      async (req: Request, res: Response) => {
        try {
          // Leer otros datos del formulario
          const nombre = req.body.nombre;
          const apellido = req.body.apellido;
          const correo = req.body.correo;
          const contrasena = req.body.contrasena;

          // Archivo enviado
          const imagen = req.file;
          const user = await UsersServices.create({
            picture: imagen?.filename,
            name: nombre,
            lastname: apellido,
            email: correo,
            password: contrasena,
          });
          res.json(user);
        } catch (error) {
          res.status(500).json({ message: "Error al crear el usuario." });
        }
      }
    );
  }

  public getRouter(): Router {
    return this.usersRouter;
  }
}
