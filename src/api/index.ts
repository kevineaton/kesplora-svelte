import * as site from "./site";
import * as user from "./users";

const SiteAPI = new site.SiteAPI();
const UsersAPI = new user.UserAPI();

export { SiteAPI, UsersAPI };