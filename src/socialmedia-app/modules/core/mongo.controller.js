import { AuthController} from '../auth/controllers/auth.controller';
import { GuestController } from '../auth/controllers/guest.controller';


export default {
  AuthMapper: {
    AuthController,
  },
  GuestMapper: {
    GuestController,
  },

  AdminControllers:{
    CoreMapper : {

    },
    ComponentMapper: {
      UserMapper:{

      }
    }
  }
}
