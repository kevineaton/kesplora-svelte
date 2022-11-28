import * as module from "./modules";
import * as project from "./projects";
import * as site from "./site";
import * as user from "./users";

import { errorCodeToDisplayString } from "./errors";

const ModulesAPI = new module.ModulesAPI();
const ProjectsAPI = new project.ProjectsAPI();
const SiteAPI = new site.SiteAPI();
const UsersAPI = new user.UserAPI();

export { ModulesAPI, ProjectsAPI, SiteAPI, UsersAPI };
export { errorCodeToDisplayString };