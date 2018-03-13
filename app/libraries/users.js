import User from './user';

export default class Users {
  constructor () {
    this.nextId = 0;
    this.list = [];
  }

  create (socketId, username) {
    const user = new User(this.nextId, socketId, username);

    this.list.push(user);
    this.nextId ++;
    return user;
  }

  remove (socketId) {
    const findIndex = item => {
      return item.socketId === socketId;
    };
    const id = this.list.findIndex(findIndex);

    if (id !== - 1) {
      this.list.splice(id, 1);
    }
  }
}
