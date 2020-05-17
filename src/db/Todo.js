import Model from './Model';

/**
 * Модель, отвечающая за особенности работы с таблицей todos
 */
export default class extends Model {
  constructor(db) {
    super(db, 'todos');
  }

  /**
   * Инициализация таблицы, если ещё нет
   */
  async init() {
    await this._db.query(`
      create table if not exists todos (
        id integer primary key autoincrement,
        title text,
        description text,
        done Boolean,
        group_id integer,
        foreign key (group_id)
          references groups (id)
            on delete set null
            on update no action
      )
    `);
  }

  /**
   * Перегрузка чтения записей. Нужна для обработки boolean-значения из SQLite
   */
  async readItems() {
    const items = await super.readItems();
    return items.map((item) => ({
      ...item,
      done: !!item.done,
    }));
  }

  /**
   * Перегрузка обновления элемента. Нужна для обработки boolean-поля done
   * @param {*} id 
   * @param {*} data 
   */
  async updateItem(id, data) {
    if ('done' in data) {
      data.done = data.done ? 1 : 0;
    }
    const item = await super.updateItem(id, data);
    return {
      ...item,
      done: !!item.done,
    };
  }
}
