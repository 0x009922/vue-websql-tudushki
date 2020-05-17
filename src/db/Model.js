export default class {
  constructor(db, tableName) {
    this._db = db;
    this._name = tableName;

  }

  init() {
    // Создание таблицы
  }

  async readItems() {
    const { rows } = await this._db.query(`select * from ${this._name}`);
    return Array.from(rows);
  }

  async createItem(data = {}) {
    const [keys, values] = [
      Object.keys(data).join(', '),
      Object.values(data),
    ];
    const marks = values.map(() => '?').join(', ');

    const { insertId } = values.length
      ? await this._db.query(
        `insert into ${this._name} (${keys}) values (${marks})`,
        values,
      )
      : await this._db.query(`insert into ${this._name} default values`);
    const { rows: [item] } = await this._db.query(`select * from ${this._name} where id = ?`, [insertId]);
    return item;
  }

  async updateItem(id, data) {
    console.log(id, data);
    const [keys, values] = [
      Object.keys(data).map((v) => `${v} = ?`).join(', '),
      Object.values(data),
    ];

    await this._db.query(
      `update ${this._name} set ${keys} where id = ?`,
      [...values, id],
    );

    const { rows: [item] } = await this._db.query(
      `select * from ${this._name} where id = ?`,
      [id]
    );
    return item;
  }

  async deleteItem(id) {
    await this._db.query(`delete from ${this._name} where id = ?`, [id]);
  }
}