const { writeFile, readFile } = require('fs/promises');
const { join } = require('path');

const databaseFolder = join(__dirname, '../', '../', 'database');

class BaseRepository {
  constructor({ file }) {
    this.file = join(databaseFolder, `${file}.json`);
  }

  async create (item) {
    try {
      const content = await this.findAll();
      content.push({ ...item });
      await writeFile(join(this.file), JSON.stringify(content));

      return item;
    } catch {
      return item;
    }
  }

  async update (item) {
    try {
      const content = await this.findAll();
      const index = content.findIndex((i) => i.id === item.id);

      if (index === -1) return null;

      content[index] = { ...item };
      await writeFile(join(this.file), JSON.stringify(content));

      return item;
    } catch {
      return null;
    }
  }

  async delete (id) {
    try {
      const content = await this.findAll();
      const index = content.findIndex((item) => id === item.id);

      if (index === -1) return;

      content.splice(index, 1);
      await writeFile(join(this.file), JSON.stringify(content));
    } catch {
      return;
    }
  }

  async findById(id) {
    try {
      const content = JSON.parse(await readFile(this.file));
      if (!id) return null;

      const item =  content.find((item) => id === item.id);
      return item || null;
    } catch {
      return null;
    }
  }

  async findAll() {
    try {
      const content = JSON.parse(await readFile(this.file));
      return content;
    } catch {
      return [];
    }
  }

  async bulkCreate(items) {
    try {
      const content = await this.findAll();
      const newContent = content.concat(items);

      await writeFile(join(this.file), JSON.stringify(newContent));
      return newContent;
    } catch (error) {
      await writeFile(join(this.file), JSON.stringify(items));
      return items;
    }
  }
}

module.exports = BaseRepository;
