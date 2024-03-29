import * as block from "./blocks";
import * as file from "./files";
import * as module from "./modules";
import * as project from "./projects";
import * as report from "./reports";
import * as site from "./site";
import * as user from "./users";

const BlocksAPI = new block.BlocksAPI();
const FilesAPI = new file.FilesAPI();
const ModulesAPI = new module.ModulesAPI();
const ProjectsAPI = new project.ProjectsAPI();
const ReportsAPI = new report.ReportsAPI();
const SiteAPI = new site.SiteAPI();
const UsersAPI = new user.UsersAPI();

export { BlocksAPI, FilesAPI, ModulesAPI, ProjectsAPI, ReportsAPI, SiteAPI, UsersAPI };