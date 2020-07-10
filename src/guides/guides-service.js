const xss = require('xss')
const Service = require('../base-service');


class GuidesService extends Service {

  constructor(table_name) {
    super(table_name);
  }


  getAllGuides(db, user_id) {
    return db
      .from('guides')
      .select(
        'guides.id',
        'guides.name',
        'guides.note',
        'guides.walkthrough_id'
      )
      .where('guides.user_id', user_id)
  }

  serializeGuides(guide) {
    return {
      id: guide.id,
      name: xss(guide.name),
      note: xss(guide.note),
      walkthrough_id: guide.walkthrough_id
    }
  }

  insertGuide(db, newGuide) {
    return db
      .insert(newGuide)
      .into('guides')
      .returning('*')
      .then(([guide]) => guide)
  }
  
  deleteGuide(db, id) {
    return db('guides')
      .where({ id })
      .first()
      .delete()
  }
}

module.exports = new GuidesService('guides')