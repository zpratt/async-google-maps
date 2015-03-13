var sandbox;

function Promise(resolver) {
    this.reject = sandbox.spy();
    this.resolve = sandbox.spy();
    resolver(this.resolve, this.reject);
}

Promise.prototype.then = function () {

};

export default {
    Promise: Promise,
    setSandbox: function (suppliedSandbox) {
        sandbox = suppliedSandbox;
    },
    unsetSandbox: function () {
        sandbox = null;
    }
};
