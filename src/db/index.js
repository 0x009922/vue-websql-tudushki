function transaction(db, callback, { read = false } = {}) {
  return new Promise((resolve, reject) => {
    db[read ? 'readTransaction' : 'transaction'](callback, reject, resolve);
  });
}

function query(tx, sql, data = []) {
  return new Promise((resolve, reject) => {
    console.log(`[QUERY] Executing: "${sql}"\nReplacements:`, data)
    tx.executeSql(sql, data, (_tx, result) => resolve(result), (_tx, err) => reject(err));
  });
}

/**
 * Извлечение списка параметров из данных
 * @param {any} data Объект с данными
 * @param {string[]} params Список ключей, которые нужно извлечь
 * @returns {any} Объект только с извлечёнными ключами
 */
function extractParams(data, params) {
  return params.reduce((prev, val) => {
    if (val in (data || {})) {
      prev[val] = data[val];
    }
    return prev;
  }, {});
}

function valueToSql(val) {
  switch (typeof val) {
    case 'string': return `'${val}'`;
    default: return val;
  }
}

class Database {
  constructor() {
    this.db = null;
  }

  async init() {
    this.db = openDatabase('db', '0.1', 'Db with todos', 2e5);

    await transaction(this.db, async (tx) => {
      await query(tx, `
        create table if not exists groups (
          id integer primary key,
          name text
        )
      `);

      await query(tx, `
        create table if not exists todos (
          id integer primary key,
          note text,
          done Boolean,
          group_id integer,
          foreign key (group_id)
            references groups (id)
              on delete set null
              on update no action
        )
      `);
    });
  }
  
  // ToDos

  async readTodos() {
    let todos;

    await transaction(this.db, async (tx) => {
      const { rows } = await query(tx, `select * from todos`);
      todos = Array.from(rows)
        .map((row) => ({
          ...row,
          done: +row.done === 1,
        }));
    }, { read: true });

    return todos;
  }

  async createTodo({ note = '', done = false } = {}) {
    await transaction(this.db, async (tx) => {
      await query(tx, `insert into todos (note, done) values (?, ?)`, [note, done]);
    });
  }

  async updateTodo(id, changes) {
    const params = extractParams(changes, ['note', 'done', 'group_id']);
    const entries = Object.entries(params);
    if (entries.length) {
      const updates = entries.map(
        ([key, value]) => `${key} = ${valueToSql(value)}`,
      ).join(', ');
      await transaction(this.db, async (tx) => {
        await query(tx, `update todos set ${updates} where id = ?`, [id]);
      });
    }
  }

  async deleteTodo(id) {
    await transaction(this.db, async (tx) => {
      await query(tx, `delete from todos where id = ?`, [id]);
    });
  }

  // Groups

  async readGroups() {
    let groups;

    await transaction(this.db, async (tx) => {
      const { rows } = await query(tx, `select * from groups`);
      groups = Array.from(rows);
    }, { read: true });

    return groups;
  }

  async createGroup({ name = '' } = {}) {
    await transaction(this.db, async (tx) => {
      await query(tx, `insert into groups (name) values (?)`, [name]);
    });
  }

  async updateGroup(id, changes) {
    const params = extractParams(changes, ['name']);
    const entries = Object.entries(params);
    if (entries.length) {
      const updates = entries.map(
        ([key, value]) => `${key} = ${valueToSql(value)}`,
      ).join(', ');
      await transaction(this.db, async (tx) => {
        await query(tx, `update groups set ${updates} where id = ?`, [id]);
      });
    }
  }

  async deleteGroup(id) {
    await transaction(this.db, async (tx) => {
      await query(tx, `delete from groups where id = ?`, [id]);
    });
  }
}

export default new Database();
