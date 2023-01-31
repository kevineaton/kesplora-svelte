import * as block from "./blocks";
import * as module from "./modules";
import * as project from "./projects";

const BlocksAPI = new block.BlocksAPI();
const ModulesAPI = new module.ModulesAPI();
const ProjectsAPI = new project.ProjectsAPI();

export { BlocksAPI, ModulesAPI, ProjectsAPI };