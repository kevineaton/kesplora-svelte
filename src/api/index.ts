// we will import everything in this order: all, admin, participants
import * as site from "./site";
import * as user from "./users";
import * as note from "./notes";

import { 
  BlocksAPI as AdminBlocksAPI,
  ModulesAPI as AdminModulesAPI,
  ProjectsAPI as AdminProjectsAPI,
} from "./admin";

import { errorCodeToDisplayString } from "./errors";

// general endpoints available to all
const NotesAPI = new note.NotesAPI();
const SiteAPI = new site.SiteAPI();
const UsersAPI = new user.UserAPI();

export { NotesAPI, SiteAPI, UsersAPI };

// admin endpoints
export { AdminBlocksAPI, AdminModulesAPI, AdminProjectsAPI };

// participant only endpoints

export { errorCodeToDisplayString };