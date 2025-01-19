import { User } from "./user";
import { Project } from "./project";
import { Part } from "./part";
import { Inventory } from "./inventory";

Project.hasMany(Inventory);
Inventory.belongsTo(Project);
Part.hasMany(Inventory);
Inventory.belongsTo(Part);



export { User, Project, Part, Inventory }
