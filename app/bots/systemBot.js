const systemBot = {

  // --- CONFIGURATION
  'prefix': 'system',
  'name': 'System',

  // --- ACTIONS
  'actions': [

    // --- CMD DEFAULT
    {
      'name': '_default',
      'run': () => {
        console.log('System');
      }
    },

    // --- CMD WELCOME
    {
      'name': 'welcome',
      'params': [
        'username'
      ],
      'run': (app, socket, params) => {
        const text = `Welcome ${params.username}`;

        return {
          'action': 'EMIT_MESSAGE_BOT',
          'target:': 'USER',
          'text': text
        };
      }
    }
  ]
};

export default systemBot;
