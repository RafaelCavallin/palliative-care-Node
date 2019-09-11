import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import PatientController from './app/controllers/PatientController';
import AppointmentController from './app/controllers/AppointmentController';

import authMiddleware from './app/middleware/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/patients/:id', PatientController.show);
routes.get('/patients', PatientController.index);
routes.post('/patients', PatientController.store);
routes.put('/patients/:id', PatientController.update);
routes.delete('/patients/:id', PatientController.delete);

routes.get('/appointment', AppointmentController.index);
routes.post('/appointment', AppointmentController.store);
routes.put('/appointment/:id', AppointmentController.update);

export default routes;
