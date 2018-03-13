import io from 'socket.io';
import faker from 'faker';
import actions from './socketioActions';

faker.local = 'en';

export default {
  'run': (app) => {
    io(app.server).on('connection', (socket) => {
      /**
        * Create a new fake user.
        */
      const user = app.users.create(socket.id, faker.name.findName());

      socket.user = user;
      actions.SYSTEM_WELCOME(app, socket);
      /**
        * End.
        */

      socket.on('user::message', (obj) => {
        const validator = app.chat.newMessage(obj);

        switch (true) {
          /**
            * Wrong object.
            */
          case Object.is(validator.isValidObject, false):
            break;
          /**
            * Normal message.
            */
          case Object.is(validator.isCommand, false):
            actions.EMIT_GLOBAL(socket, obj);
            break;
          /**
            * User command.
            */
          case Object.is(validator.isCommand, true):
            const cmdValidator = app.chat.bot.check(obj.message);

            switch (true) {
              /**
                * Error bot not found.
                */
              case Object.is(cmdValidator.isBotExist, false):
                actions.SYSTEM_ERROR_COMMAND(socket, 'BOT_NOT_FOUND');
                break;
              /**
                * Error bot action not found.
                */
              case Object.is(cmdValidator.isActionExist, false):
                actions.SYSTEM_ERROR_COMMAND(socket, 'BOT_ACTION_NOT_FOUND');
                break;
              /**
                * Error invalid bot action params.
                */
              case Object.is(cmdValidator.isValidParams, false):
                actions.SYSTEM_ERROR_COMMAND(socket, 'BOT_ACTION_PARAMS_NOT_VALID');
                break;
              /**
                * Execute the command.
                */
              default:
                actions.COMMAND(app, socket, cmdValidator);
                break;
            }
            break;
          /**
            * ???.
            */
          default:
            break;
        }
      });
      socket.on('disconnect', () => {
        app.users.remove(socket.id);
      });
    });
  }
};
