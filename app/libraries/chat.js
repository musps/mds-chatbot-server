import Bot from './bot';

class Chat {
  constructor () {
    this.bot = new Bot();
  }

  isValidObject (obj) {
    if (typeof obj !== 'object' || typeof obj.message === 'undefined') {
      return false;
    }
    return true;
  }

  isEmptyMessage (message) {
    if (typeof message === 'undefined' || message === '') {
      return true;
    }
    return false;
  }

  newMessage (obj) {
    const res = {
      'isValidObject': false,
      'isEmptyMessage': true,
      'isCommand': false
    };

    if (this.isValidObject(obj)) {
      res.isValidObject = true;
      if (! this.isEmptyMessage(obj.message)) {
        res.isEmptyMessage = false;
        if (this.bot.isCommand(obj.message)) {
          res.isCommand = true;
        }
      }
    }

    return res;
  }
}

export default Chat;
