/**
 * Класс для простейших операций над таблицей, реализация CRUD
 */
export default class {
  /**
   * @param {import('./index').default} db База данных, через которую будут делаться запросы
   * @param {string} tableName Название таблицы
   */
  constructor(db, tableName) {
    this._db = db;
    this._name = tableName;
  }

  init() {
    // Создание таблицы. Реализация функции лежит на наследователях класса
  }

  /**
   * Чтение всех записей таблицы
   */
  async readItems() {
    const { rows } = await this._db.query(`select * from ${this._name}`);

    // Преобразование из Array-like в нормальный массив
    return Array.from(rows);
  }

  /**
   * Создание одной записи таблицы. Проверка данных не производится.
   * @param {any} data Исходные данные
   */
  async createItem(data = {}) {
    const [keys, values] = [
      Object.keys(data).join(', '),
      Object.values(data),
    ];
    const marks = values.map(() => '?').join(', ');

    const { insertId } = values.length
      // Если указаны какие-то данные, создаю с ними
      ? await this._db.query(
        `insert into ${this._name} (${keys}) values (${marks})`,
        values,
      )
      // Если ничего не указано, создаю с дефолтными значениями
      : await this._db.query(`insert into ${this._name} default values`);

    // Загружаю из БД созданную запись
    const { rows: [item] } = await this._db.query(
      `select * from ${this._name} where id = ?`,
      [insertId],
    );
    return item;
  }

  /**
   * Обновление записи в таблице. Проверка данных не производится.
   * 
   * @param {string|number} id id записи
   * @param {any} data Хэш обновлений
   */
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

  /**
   * Удаление записи в таблице по id
   * @param {string|number} id
   */
  async deleteItem(id) {
    await this._db.query(`delete from ${this._name} where id = ?`, [id]);
  }
}