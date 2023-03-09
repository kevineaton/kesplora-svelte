import * as block from "./blocks";
import * as file from "./files";
import * as module from "./modules";
import * as project from "./projects";

const BlocksAPI = new block.BlocksAPI();
const FilesAPI = new file.FilesAPI();
const ModulesAPI = new module.ModulesAPI();
const ProjectsAPI = new project.ProjectsAPI();

export { BlocksAPI, FilesAPI, ModulesAPI, ProjectsAPI };