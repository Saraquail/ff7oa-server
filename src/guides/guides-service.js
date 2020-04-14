const xss = require('xss')

const GuidesService = {
  getAllGuides(db, user_id) {
    return db
      .from('ff7oa_guides AS guide')
      .select(
        'guide.name',
        'guide.note',
        'guide.monster_id'
      )
      .where('guide.user_id', user_id)
  },

  serializeGuides(guide) {
    return {
      id: guide.id,
      user_id: guide.user_id,
      name: xss(guide.name),
      note: xss(guide.note),
      monster_id: guide.monster_id
    }
  },
}

module.exports = GuidesService