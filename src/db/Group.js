import Model from './Model';

export default class extends Model {
  constructor(db) {
    super(db, 'groups');
  }

  async init() {
    await this._db.query(`
      create table if not exists groups (
        id integer primary key autoincrement,
        name text
      )
    `);
  }

  async deleteItem(id) {
    await super.deleteItem(id);

    // Делаю вручную ON DELETE SET NULL у todos, не работает автоматически почему-то
    await this._db.query('update todos set group_id = null where group_id = ?', [id]);
  }
}
