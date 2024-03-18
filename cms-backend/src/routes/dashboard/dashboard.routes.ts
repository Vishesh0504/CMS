import { Router} from "express";
import { createConference, fetchConferences,fetchAllUsers, handleDeleteConference, handleEditConference} from "./dashboard.controllers";


const dashRouter = Router();

dashRouter.post('/createConference',createConference);

dashRouter.get('/fetchConferences',fetchConferences);
dashRouter.get('/fetchAllUsers',fetchAllUsers);

dashRouter.post('/deleteConference',handleDeleteConference);

dashRouter.put('/editConference',handleEditConference);



export default dashRouter;