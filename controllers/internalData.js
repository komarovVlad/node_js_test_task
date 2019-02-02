const getRandomNumberInRange = getUtil('getRandomNumberInRange');
const MIN = 1;
const MAX = 6;

const setRandomVariable = function() {
    let payload = this.ctx.request.body || {};
    return {
        ...payload,
        a: getRandomNumberInRange(MIN, MAX)
    };
};

module.exports = {
    setRandomVariable
};