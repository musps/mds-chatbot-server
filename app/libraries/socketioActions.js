const actions = {

  'SYSTEM_WELCOME': (app, socket) => {
    const params = {
      'type': 'system',
      'data': {
        'username': 'System',
        'message': `Welcome <b>${socket.user.username}</b>, you are now logged in.`
      }
    };

    socket.emit('system::welcome', params);
  },
  'SYSTEM_ERROR_COMMAND': (socket, type) => {
    const errors = {
      'BOT_NOT_FOUND': 'The bot is not found.',
      'BOT_ACTION_NOT_FOUND': 'The bot action is not found.',
      'BOT_ACTION_PARAMS_NOT_VALID': 'The bot action parameters are not valid.'
    };
    const params = {
      'type': 'system',
      'data': {
        'username': 'System',
        'message': errors[type]
      }
    };

    socket.emit('system::errorCmd', params);
  },

  'EMIT_GLOBAL': (socket, obj) => {
    actions.EMIT_MESSAGE(socket, obj);
    actions.BROADCAST_MESSAGE(socket, obj);
  },
  'EMIT_MESSAGE': (socket, obj) => {
    const params = {
      'username': socket.user.username,
      'message': obj.message
    };

    socket.emit('user::newMessage::me', params);
  },
  'BROADCAST_MESSAGE': (socket, obj) => {
    const params = {
      'username': socket.user.username,
      'message': obj.message
    };

    socket.broadcast.emit('user::newMessage::all', params);
  },
  'COMMAND': (app, socket, cmd) => {
    cmd.action.run(app, socket, cmd.data.param);
  }
};

export default actions;

