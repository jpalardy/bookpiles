/************************************************************
Pipe (cat)

Mostly a base class.

Encapsulates the idea of holding a list which can be changed. It
provides an output of the list which is just a reference to the
input. Subclasses could filter, trim, sort, or modify the input to
produce any desired output. Pipes are meant to be stateful chains
of command-line pipes.

Properties:

- input    ; the list that was fed in
- output   ; the relevant transformation of the input

************************************************************/

this.Pipe = function() {
    if (! (this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }

    var self = this;
    self.init();
};

this.Pipe.prototype.init = function() {
    var self = this;
    self._input  = []; // lines coming in the pipe
    self._output = []; // lines coming out of pipe
};

// getter/setter
this.Pipe.prototype.input = function(lines) {
    var self = this;

    if(lines === undefined) {
        return self._input;
    } else {
        self.set("input", lines);
    }
};

// getter
this.Pipe.prototype.output = function() {
    var self = this;
    return self._output;
};

this.Pipe.prototype.set = function(field, value) {
    var self = this;

    var oldValue = self["_" + field];
    self["_" + field] = value;

    self.change(field, value, oldValue);
};

this.Pipe.prototype.change = function(field) {
    var self = this;

    // PASSTHROUGH
    self._output = self._input;

    if(self.onchange) {
        self.onchange(self._output);
    }
};

/************************************************************
Pager (less)

A sliding window over a list. Pages do not overlap.

Properties:

- input
- output
- size    ; the maximum length of the output
- page    ; the page

************************************************************/

this.Pager = function(size) {
    if (! (this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }

    var self = this;
    self.init(size);
};

this.Pager.prototype = new this.Pipe();

this.Pager.prototype.init = function(size) {
    var self = this;

    self._start = 0;
    self._size  = size || 10;
};

this.Pager.prototype.change = function(field) {
    var self = this;

    if(field == "input" || field == "size") {
        self.page(0);
        return;
    }

    self._output = self._input.slice(self._start, self._start + self._size);

    if(self.onchange) {
        self.onchange(self._output, self.page(), self._size);
    }
};

this.Pager.prototype.pages = function() {
    var self = this;
    return Math.ceil(self._input.length / self._size);
};

// getter/setter
this.Pager.prototype.page = function(i) {
    var self = this;

    if(i === undefined) {
        return Math.ceil(self._start / self._size);
    } else {
        var start = i * self._size;

        if(start === 0 || start > 0 && start < self._input.length) {
            self.set("start", start);
        }
    }
};

// getter/setter
this.Pager.prototype.size = function(n) {
    var self = this;

    if(n === undefined) {
        return self._size;
    } else {
        var size = n;

        if(size >= 0 && size <= self._input.length) {
            self.set("size", size);
        }
    }
};

this.Pager.prototype.first = function() {
    var self = this;
    self.page(0);
};

this.Pager.prototype.last = function() {
    var self = this;
    self.page(self.pages()-1);
};

this.Pager.prototype.prev = function() {
    var self = this;
    self.page(self.page()-1);
};

this.Pager.prototype.next = function() {
    var self = this;
    self.page(self.page()+1);
};

/************************************************************
Limiter (head -n)

A subset of the input, always from the beginning. Cap can
be turned on/off to become a passthrough.

Properties:

- input
- output
- size    ; the maximum length of the output
- cap     ; whether the size property is enforced

************************************************************/

this.Limiter = function(size) {
    if (! (this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }

    var self = this;
    self.init(size);
};

this.Limiter.prototype = new this.Pipe();

this.Limiter.prototype.init = function(size) {
    var self = this;

    self._size = size || 10;
    self._cap  = true;
};

this.Limiter.prototype.change = function(field) {
    var self = this;

    if(self._cap) {
        self._output = self._input.slice(0, self._size);
    } else {
        self._output = self._input;
    }

    if(self.onchange) {
        self.onchange(self._output, self._size, self._cap);
    }
};

// getter/setter
this.Limiter.prototype.size = function(size) {
    var self = this;

    if(size === undefined) {
        return self._size;
    } else {
        if(size >= 0) {
            self.set("size", size);
        }
    }
};

// getter/setter
this.Limiter.prototype.cap = function(cap) {
    var self = this;

    if(cap === undefined) {
        return self._cap;
    } else {
        self.set("cap", cap);
    }
};

/************************************************************
Filter (grep)

A selection of the input, based on arbitrary criteria.

Properties:

- input
- output
- filter   ; a predicate function to decide inclusion in the output
- criteria ; a hash passed to each iteration of the filter function

************************************************************/

this.Filter = function(f) {
    if (! (this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }

    var self = this;
    self.init(f);
};

this.Filter.prototype = new this.Pipe();

this.Filter.prototype.init = function(f) {
    var self = this;

    self._criteria = {};
    self._filter   = f || function() { return true; };
};

this.Filter.prototype.change = function(field) {
    var self = this;

    self._output = [];
    for(var i=0, n=self._input.length; i<n; i++) {
        if(self._filter(self._input[i], self._criteria)) {
            self._output.push(self._input[i]);
        }
    }

    if(self.onchange) {
        self.onchange(self._output, self._criteria);
    }
};

// getter/setter
this.Filter.prototype.criteria = function(criteria) {
    var self = this;

    if(criteria === undefined) {
        return self._criteria;
    } else {
        self.set("criteria", criteria);
    }
};

// getter/setter
this.Filter.prototype.filter = function(filter) {
    var self = this;

    if(filter === undefined) {
        return self._filter;
    } else {
        self.set("filter", filter);
    }
};

/************************************************************
Sorter (sort)

The sorted version of the input, sorted on arbitrary fields
and strategies.

Sorting by the same field twice toggles ascending.

Properties:

- input
- output
- ascending   ; reverses sorting order
- field       ; what function (key) to use to sort
- comparators ; hash of field -> function to use when sorting

************************************************************/

this.Sorter = function(field, comparators) {
    if (! (this instanceof arguments.callee)) {
        return new arguments.callee(arguments);
    }

    var self = this;
    self.init(field, comparators);
};

this.Sorter.prototype = new this.Pipe();

this.Sorter.prototype.init = function(field, comparators) {
    var self = this;

    self._ascending   = true;
    self._field       = field;
    self._comparators = comparators;
};

this.Sorter.prototype.change = function(field, value, oldValue) {
    var self = this;

    if(field == "field") {
        if(value == oldValue) {
            self.ascending(!self._ascending); // same field -> toggle
        } else {
            self.ascending(true);             // different field -> set
        }
        return;
    }

    self._output = self._input.concat();
    self._output.sort(function(a,b) {
        return (self._ascending ? 1 : -1) * self._comparators[self._field](a,b);
    });

    if(self.onchange) {
        self.onchange(self._output, self._field, self._ascending);
    }
};

// getter/setter
this.Sorter.prototype.field = function(field) {
    var self = this;

    if(field === undefined) {
        return self._field;
    } else {
        self.set("field", field);
    }
};

// getter/setter
this.Sorter.prototype.ascending = function(ascending) {
    var self = this;

    if(ascending === undefined) {
        return self._ascending;
    } else {
        self.set("ascending", ascending);
    }
};

// getter/setter
this.Sorter.prototype.comparators = function(comparators) {
    var self = this;

    if(comparators === undefined) {
        return self._field;
    } else {
        self.set("comparators", comparators);
    }
};

