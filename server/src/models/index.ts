import { User } from "./user";
import { Project } from "./project";
import { Part } from "./part";
import { Inventory } from "./inventory";

Project.hasMany(Inventory);
Inventory.belongsTo(Project);
Inventory.belongsTo(Part);
Part.hasMany(Inventory);



export { User, Project, Part, Inventory }
