'use strict';

module.exports = function(indicatorMixin, accessor_ohlc, indicator_ema, indicator_atr) {  // Injected dependencies
  return function() { // Closure function
    var p = {},  // Container for private, direct access mixed in variables
      sdMultiplication = 2,
      ema = indicator_ema(),
      atr = indicator_atr();

    function indicator(data) {
      ema.accessor(p.accessor).period(p.period).init();
      atr.accessor(p.accessor).period(p.period).init();
      return data.map(function(d, i) {
        var middleBand = ema.average(p.accessor(d));
        if(i >= p.period) {
          var atr_value = atr.atr(d);
          var upperBand = middleBand + sdMultiplication * atr_value,
            lowerBand = middleBand - sdMultiplication * atr_value;
          return datum(p.accessor.d(d), middleBand, upperBand, lowerBand);
        }
        else return datum(p.accessor.d(d));

      }).filter(function(d) { return d.middleBand; });
    }

    indicator.sdMultiplication = function(_) {
      if (!arguments.length) return sdMultiplication;
        sdMultiplication = _;
      return indicator;
    };

    // Mixin 'superclass' methods and variables
    indicatorMixin(indicator, p).accessor(accessor_ohlc()).period(20);

    return indicator;
  };
};

function datum(date, middleBand, upperBand, lowerBand) {

  if(middleBand) return { date: date, middleBand: middleBand, upperBand: upperBand, lowerBand: lowerBand};
  else return { date: date, middleBand: null, upperBand: null, lowerBand: null};
}
