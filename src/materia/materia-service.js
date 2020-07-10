const xss = require("xss");
const Service = require("../base-service");

class MateriaService extends Service {
  constructor(table_name) {
    super(table_name);
  }

  serializeMateria(materia) {
    if (materia.skills !== null) {
      materia.cleanSkills = materia.skills.map((skill) => {
        return xss(skill);
      });
    }
    return {
      id: materia.id,
      name: xss(materia.name),
      type: xss(materia.type),
      description: xss(materia.description),
      skills: materia.cleanSkills,
      ap: materia.ap,
      mp: materia.mp,
      sell: materia.sell,
      location: xss(materia.location),
    };
  }
}
module.exports = new MateriaService("materia");
