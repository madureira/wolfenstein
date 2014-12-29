App.Exception = {

    throw: function(msg, e) {
        var title = '::Exception::';

        if (!App.Helpful.isNull(msg) && !App.Helpful.isNull(e)) {
            console.error(title + "\n\t Message: " + msg + "\n\t Cause: ", e);
        } else {
            console.error(title + "\n\t Message: " + msg);
        }
    }

};
