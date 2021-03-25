import { Router } from 'express';
import { mongoRoute ,initializeMongoRoutes } from './route.bootstrap';

const router = Router();

export class BaseRouter{
 constructor(){
   // this.coreRoutes = routes(router) || {};
   // this.postgresRoutes = pgRoutes(router) || {};
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
