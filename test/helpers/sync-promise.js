var sandbox;

function Promise(resolver) {
    var thenCallbacks = [],
        resolved;

    this.reject = sandbox.spy();
    this.resolve = sandbox.spy(function () {
        resolved = true;
    });

    this.then = function (callback) {
        thenCallbacks.push(callback);

        if (resolved) {
            callback();
        }
    };

    resolver(this.resolve, this.reject);
}

module.exports = {
    Promise: Promise,
    setSandbox: function (suppliedSandbox) {
        sandbox = suppliedSandbox;
    },
    unsetSandbox: function () {
        sandbox = null;
    }
};
