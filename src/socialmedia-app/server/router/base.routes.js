import { Router } from 'express';
import { mongoRoute ,initializeMongoRoutes } from './route.bootstrap';

const router = Router();

export class BaseRouter{
 constructor(){
   //IF YOU HAVE GOT MICROSERVICES ADD THEM FOR  DIFFERENT DATABASES ROUTES
   this.mongoRoutes = mongoRoute(router) || {};
   // console.log(this.mongoRoutes)
 }

 init(){
    initializeMongoRoutes(this.mongoRoutes)
 }

 getRouter(){
   return router;
 }


}
