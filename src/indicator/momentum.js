'use strict';

module.exports = function(indicatorMixin, accessor_ohcl) {  // Injected dependencies
  return function() { // Closure function
    var p = {};  // Container for private, direct access mixed in variables

    function indicator(data) {
      return data.map(function(d, i) {
        if(i >= p.period) {
          var momentum = (p.accessor.c(d) / p.accessor.c(data[i - p.period])) * 100;
          return datum(p.accessor.d(d), momentum);
        }
        else return datum(p.accessor.d(d));

      }).filter(function(d) { return d.value; });
    }

    // Mixin 'superclass' methods and variables
    indicatorMixin(indicator, p).accessor(accessor_ohcl()).period(12);

    return indicator;
  };
};

function datum(date, momentum) {
  if (momentum) {
    return { date: date, value: momentum, zero: 100};
  }
  else {
    return { date: date, value: null, zero: null};
  }
}
