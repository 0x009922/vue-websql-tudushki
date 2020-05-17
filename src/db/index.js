import Todo from './Todo';
import Group from './Group';

/**
 * Класс для работы с Web SQL.
 * Соединяется с базой данных, создаёт модели двух таблиц и предоставляет им
 * интерфейс запросов через себя
 */
class Database {
  constructor() {
    this.db = null;
  }

  /**
   * Инициализация. Подключение к БД и создание таблиц, если их нет
   */
  async init() {
    this.db = openDatabase('db', '0.1', 'Db with todos', 2e5);

    this.todos = new Todo(this);
    this.groups = new Group(this);

    await this.groups.init();
    await this.todos.init();
  }

  /**
   * Запрос к бд. Для упрощения все запросы делаются в отдельных
   * транзакциях
   *
   * @param {string} sql SQL-запрос
   * @param {Array<any>} params Список параметров запроса, которые подставятся вместо "?".
   * Пример:
   *   SQL:       "select * from todos where id = ?"
   *   Параметры: [1]
   *   Результат: "select * from todos where id = 1"
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx) => {
        console.log(`[SQL] Executing: "${sql}"\nParams:`, params);
        tx.executeSql(sql, params, (_tx, result) => resolve(result), (_tx, err) => reject(err));
      }, null, reject);
    });
  }
}

export default new Database();
