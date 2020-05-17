import Todo from './Todo';
import Group from './Group';

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    this.db = openDatabase('db', '0.1', 'Db with todos', 2e5);

    this.todos = new Todo(this);
    this.groups = new Group(this);

    await this.groups.init();
    await this.todos.init();
  }

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
