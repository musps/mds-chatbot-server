export default class Bot {
  constructor () {
    this.bots = [];
    this.config = {
      'cmdStartWith': '/',
      'defaultAction': '_default'
    };
  }

  add (bot) {
    this.bots.push(bot);
  }

  getBot (prefix) {
    for (let bot of this.bots) {
      if (bot.prefix === prefix) {
        return bot;
      }
    }
    return false;
  }

  isCommand (str) {
    return str.startsWith(this.config.cmdStartWith);
  }

  isStartsWithPrefix (str, prefix) {
    return str.startsWith(this.config.cmdStartWith + prefix);
  }

  isStartsWithAction (str, prefix, action) {
    return str.startsWith(this.config.cmdStartWith + prefix + ' ' + action);
  }

  isDefaultAction (str, prefix) {
    return str === this.config.cmdStartWith + prefix;
  }

  getRegexParams (params) {
    return new RegExp('(--(' + params.join('|') + ')+)', 'g');
  }

  getStrData (str, prefix, action = '') {
    let res = str.split(this.config.cmdStartWith + prefix + ' ' + action)[1].trim();

    return res;
  }

  checkParams (str, params) {
    let exp = this.getRegexParams(params);
    let res = [];
    let match;

    while (match = exp.exec(str)) {
      const value = {
        'name': match[2],
        'start': match.index,
        'end': exp.lastIndex,
        'text': ''
      };

      res.push(value);
    }

    for (let index in res) {
      let curIndex = parseInt(index, 10);
      let nextIndex = parseInt(index, 10) + parseInt(1, 10);
      let words;

      if (typeof res[nextIndex] === 'undefined') {
        words = str.slice(res[curIndex].end).trim();
      } else {
        words = str.slice(res[curIndex].end, res[nextIndex].start).trim();
      }
      res[curIndex].text = words;
    }

    return res;
  }

  bindParams (params) {
    let data = [];

    for (let param of params) {
      data[param.name] = param.text;
    }
    return data;
  }

  getBotDesc (bot) {
    return {
      'prefix': bot.prefix,
      'name': bot.name
    };
  }

  check (str) {
    const res = {
      'isBotExist': false,
      'isValidParams': false,
      'isActionExist': false,
      'str': null,
      'action': null,
      'tmpParams': null,
      'params': null,
      'botDesc': null
    };

    if (this.bots.length === 0) {
      return false;
    }

    for (let bot of this.bots) {
      if (this.isStartsWithPrefix(str, bot.prefix)) {
        res.isBotExist = true;
        res.botDesc = this.getBotDesc(bot);

        // --- match found.
        for (let action of bot.actions) {
          if (this.isDefaultAction(str, bot.prefix) && action.name === this.config.defaultAction) {
            res.isActionExist = true;
            res.action = action;
            break;
          }

          if (this.isStartsWithAction(str, bot.prefix, action.name)) {
            // --- match action.
            res.isActionExist = true;
            res.str = this.getStrData(str, bot.prefix, action.name);
            res.action = action;

            if (typeof action.params === 'object' && action.params.length > 0) {
              // --- check params.
              res.tmpParams = this.checkParams(res.str, action.params);
              if (action.params.length === res.tmpParams.length) {
                res.isValidParams = true;
                res.params = this.bindParams(res.tmpParams);
              }
            } else {
              res.isValidParams = true;
            }
          }
        }
        break;
      }
    }

    return {
      'isBotExist': res.isBotExist,
      'isActionExist': res.isActionExist,
      'isValidParams': res.isValidParams,
      'action': res.action,
      'botDesc': res.botDesc,
      'data': {
        'text': res.str,
        'param': res.params
      }
    };
  }
}

