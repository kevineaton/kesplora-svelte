import * as block from "./blocks";
import * as module from "./modules";
import * as project from "./projects";
import * as site from "./site";
import * as user from "./users";

import { errorCodeToDisplayString } from "./errors";

const BlocksAPI = new block.BlocksAPI();
const ModulesAPI = new module.ModulesAPI();
const ProjectsAPI = new project.ProjectsAPI();
const SiteAPI = new site.SiteAPI();
const UsersAPI = new user.UserAPI();

export { BlocksAPI, ModulesAPI, ProjectsAPI, SiteAPI, UsersAPI };
export { errorCodeToDisplayString };