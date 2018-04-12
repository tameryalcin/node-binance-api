/* ============================================================
 * node-binance-api
 * https://github.com/jaggedsoft/node-binance-api
 * ============================================================
 * Copyright 2017-, Jon Eyrick
 * Released under the MIT License
 * ============================================================ */

'use strict';

const WARN_SHOULD_BE_OBJ = 'should be an object';
const WARN_SHOULD_BE_NULL = 'should be null';
const WARN_SHOULD_BE_NOT_NULL = 'should not be null';
const WARN_SHOULD_HAVE_KEY = 'should have key ';
const WARN_SHOULD_NOT_HAVE_KEY = 'should not have key ';
const WARN_SHOULD_BE_UNDEFINED = 'should be undefined';
const WARN_SHOULD_BE_TYPE = 'should be a string ';
const TIMEOUT = 5000;

let chai = require( 'chai' );
let assert = chai.assert;

let path = require( 'path' );
let binance = require( path.resolve( __dirname, 'node-binance-api.js' ) );
let util = require( 'util' );
let num_pairs = 299;
let num_currencies = 156;
let logger = {
  log: function (msg){
    let logLineDetails = ((new Error().stack).split('at ')[3]).trim();
    let logLineNum = logLineDetails.split(':');
    console.log('DEBUG', logLineNum[1] + ':' + logLineNum[2], msg);
  }
}
let debug = function( x ) {
  if ( typeof ( process.env.node_binance_api ) === 'undefined' ) {
    return;
  }
  logger.log( typeof ( x ) );
  logger.log( util.inspect( x ) );
}
let stopSockets = function() {
  let endpoints = binance.websockets.subscriptions();
  for ( let endpoint in endpoints ) {
    console.log('Terminated ws endpoint' + endpoint);
    binance.websockets.terminate(endpoint);
  }
}
debug( 'Begin' );
describe( 'Construct', function() {
  it( 'Construct the binance object', function( done ) {
    binance.options( {
      APIKEY: 'z5RQZ9n8JcS3HLDQmPpfLQIGGQN6TTs5pCP5CTnn4nYk2ImFcew49v4ZrmP3MGl5',
      APISECRET: 'ZqePF1DcLb6Oa0CfcLWH0Tva59y8qBBIqu789JEY27jq0RkOKXpNl9992By1PN9Z',
      useServerTime: true,
      reconnect: false,
      verbose: true
    } );
    debug( binance.getOptions() );
    assert( typeof ( binance ) === 'object', 'Binance is not an object' );
    done();
  } ).timeout( TIMEOUT );
} );

/*global describe*/
/*eslint no-undef: "error"*/
describe( 'Depth cache', function() {
  /*global it*/
  /*eslint no-undef: "error"*/
  it( 'Attempt to get depthcache of a symbol', function( done ) {

    //binance.websockets.depthCache(['BNBBTC'], (symbol, depth) => {
      //debug( depth );
      stopSockets();
    //});

    //debug( 'todo' );

    /*
    var dc_true = binance.depthCache( "BNBBTC" );
    var dc_false = binance.depthCache( "ABCDEF" );

    //debug( dc_true );

    // true cases
    assert( typeof( dc_true ) == "object" , "Should be an object" );
    assert.notDeepEqual( dc_true , {bids: {}, asks: {}}, "should not be blank object with asks and bids keys only" );
    assert( object.Keys( dc_true ).length == 2 );
    assert( dc_true.hasOwnProperty( "asks" ), "missing asks property" );
    assert( dc_true.hasOwnProperty( "bids" ), "missing bids property" );
    assert( Object.keys( dc_true.asks ).length != 0, "should not be 0" );
    assert( Object.keys( dc_true.bids ).length != 0, "should not be 0" );

    // false cases
    assert( typeof( dc_false ) == "object" , "Should be an object" );
    assert.deepEqual( dc_false, {bids: {}, asks: {}}, "should be blank object with asks and bids keys" );
    assert( object.Keys( dc_false ).length == 2 );
    assert( dc_false.hasOwnProperty( "asks" ), "missing asks property" );
    assert( dc_false.hasOwnProperty( "bids" ), "missing bids property" );
    assert( Object.keys( dc_false.asks ).length = 0, "should be 0" );
    assert( Object.keys( dc_false.bids ).length = 0, "should be 0" );
    */
    done();
  }).timeout( TIMEOUT );
});

describe( 'Prices', function() {
  it( 'Checks the price of BNBBTC', function( done ) {
    binance.prices( 'BNBBTC', ( error, ticker ) => {
      //debug( error );
      //debug( ticker );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( ticker ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call(ticker, 'BNBBTC' ), WARN_SHOULD_HAVE_KEY + 'BNBBTC' );
      assert( Object.prototype.hasOwnProperty.call(ticker, 'ETHBTC' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'ETHBTC' );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'All Prices', function() {
  it( 'Checks the prices of coin pairs', function( done ) {
    binance.prices( ( error, ticker ) => {
      //debug( error );
      //debug( ticker );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( ticker ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call(ticker, 'BNBBTC' ), WARN_SHOULD_HAVE_KEY + 'BNBBTC' );
      assert( Object.keys( ticker ).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?' );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Balances', function() {
  it( 'Get the balances in the account', function( done ) {
    binance.balance( ( error, balances ) => {
      //debug( error );
      //debug( balances );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( balances !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( balances );
      assert( Object.prototype.hasOwnProperty.call(balances, 'BNB' ), WARN_SHOULD_HAVE_KEY + 'BNB' );
      assert( Object.prototype.hasOwnProperty.call(balances.BNB, 'available' ), WARN_SHOULD_HAVE_KEY + 'available' );
      assert( Object.prototype.hasOwnProperty.call(balances.BNB, 'onOrder' ), WARN_SHOULD_HAVE_KEY + 'onOrder' );
      assert( Object.keys( balances ).length >= num_currencies, 'should at least ' + num_currencies + 'currencies?' );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Book Ticker', function() {
  it( 'Get the BNB book ticker', function( done ) {
    binance.bookTickers( 'BNBBTC', ( error, ticker ) => {
      //debug( error );
      //debug( ticker );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( ticker );

      let members = ['symbol', 'bidPrice', 'bidQty', 'askPrice', 'askQty'];
      members.forEach( function( value ) {
        assert( Object.prototype.hasOwnProperty.call(ticker, value ), WARN_SHOULD_HAVE_KEY + value );
      });
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Booker Tickers', function() {
  it( 'Get the tickers for all pairs', function( done ) {
    binance.bookTickers( ( error, ticker ) => {
      //debug( error );
      //debug( ticker );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( ticker ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( ticker !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.keys( ticker ).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?' );

      let members = ['symbol', 'bidPrice', 'bidQty', 'askPrice', 'askQty'];
      ticker.forEach( function( obj) {
        members.forEach( function( member ) {
          assert( Object.prototype.hasOwnProperty.call( obj, member ), WARN_SHOULD_HAVE_KEY + member );
        });
      });
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Market', function() {
  it( 'Get the market base symbol of a symbol pair', function( done ) {
    let tocheck = ['TRXBNB', 'BNBBTC', 'BNBETH', 'BNBUSDT'];
    tocheck.forEach( function(element) {
      let mark = binance.getMarket(element);
      assert( typeof ( mark ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( element.endsWith( mark ), 'should end with: ' + mark );
    });

    assert.isNotOk( binance.getMarket('ABCDEFG' ), WARN_SHOULD_BE_UNDEFINED );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Depth chart BNB', function() {
  it( 'Get the depth chart information for BNBBTC', function( done ) {
    binance.depth( 'BNBBTC', ( error, depth, symbol ) => {
      //debug( error );
      //debug( depth );
      //debug( symbol );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( depth !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( typeof ( symbol ) === 'string', 'should be type of string' );
      assert( symbol === 'BNBBTC', 'should be BNBBTC' );
      assert( typeof ( depth ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( Object.keys( depth ).length === 3, 'should have length 3' );

      let members = ['lastUpdateId', 'asks', 'bids'];
      members.forEach( function( value ) {
        assert( Object.prototype.hasOwnProperty.call( depth, value ), WARN_SHOULD_HAVE_KEY + value );
      });
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Buy', function() {
  it( 'Attempt to buy ETH', function( done ) {
    let quantity = 1;
    let price = 0.069;
    assert( typeof ( binance.buy( 'ETHBTC', quantity, price ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout( TIMEOUT );
});

describe( 'Sell', function() {
  it( 'Attempt to sell ETH', function( done ) {
    let quantity = 1;
    let price = 0.069;
    assert( typeof ( binance.sell( 'ETHBTC', quantity, price ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout( TIMEOUT );
});

describe( 'MarketiBuy', function() {
  it( 'Attempt to buy ETH at market price', function( done ) {
    let quantity = 1;
    assert( typeof ( binance.marketBuy( 'BNBBTC', quantity ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout( TIMEOUT );
});

describe( 'MarketSell', function() {
  it( 'Attempt to sell ETH at market price', function( done ) {
    let quantity = 1;
    assert( typeof ( binance.marketSell( 'ETHBTC', quantity ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout( TIMEOUT );
});

describe( 'Buy order advanced', function() {
  it( 'Attempt to buy BNB specifying order type', function( done ) {
    let quantity = 1;
    let price = 0.069;
    binance.buy( 'BNBETH', quantity, price, { type: 'LIMIT' }, ( error, response ) => {
      //debug( error );
      //debug( response );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( response !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( error.body === '{"code":-2010,"msg":"Account has insufficient balance for requested action."}' );
      assert( typeof ( response.orderId ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
      assert( Object.keys( response ).length === 0 );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Sell Stop loess', function() {
  it( 'Attempt to create a stop loss order', function( done ) {
    let type = 'STOP_LOSS';
    let quantity = 1;
    let price = 0.069;
    let stopPrice = 0.068;
    assert( typeof ( binance.sell( 'ETHBTC', quantity, price, { stopPrice: stopPrice, type: type } ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout( TIMEOUT );
});

describe( 'Iceberg sell order', function() {
  it( 'Attempt to create a sell order', function( done ) {
    let quantity = 1;
    let price = 0.069;
    assert( typeof ( binance.sell( 'ETHBTC', quantity, price, { icebergQty: 10 } ) ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
    done();
  }).timeout( TIMEOUT );
});

describe( 'Cancel order', function() {
  it( 'Attempt to cancel an order', function( done ) {
    let orderid = '7610385';
    binance.cancel( 'ETHBTC', orderid, ( error, response, symbol ) => {
      //debug( error );
      //debug( response );
      //debug( symbol );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'ETHBTC' );
      assert( error !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( response !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( error.body === '{"code":-2011,"msg":"UNKNOWN_ORDER"}' );
      assert( typeof ( response.orderId ) === 'undefined', WARN_SHOULD_BE_UNDEFINED);
      assert( Object.keys( response ).length === 0 );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Cancel orders', function() {
  it( 'Attempt to cancel all orders given a symbol', function( done ) {
    binance.cancelOrders( 'XMRBTC', ( error, response, symbol ) => {
      //debug( error );
      //debug( response );
      //debug( symbol );
      assert( typeof ( error ) === 'string', WARN_SHOULD_BE_OBJ );
      assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'XMRBTC' );
      assert( error !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( error === 'No orders present for this symbol', WARN_SHOULD_BE_TYPE + 'string' );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Open Orders', function() {
  it( 'Attempt to show all orders to ETHBTC', function( done ) {
    binance.openOrders( 'ETHBTC', ( error, openOrders, symbol ) => {
      //debug( error );
      //debug( openOrders );
      //debug( symbol );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( openOrders ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'ETHBTC' );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( openOrders !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.keys( openOrders ).length === 0 );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Open Orders', function() {
  it( 'Attempt to show all orders for all symbols', function( done ) {
    binance.openOrders( false, ( error, openOrders ) => {
      //debug( error );
      //debug( openOrders );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( openOrders ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( openOrders !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.keys( openOrders ).length === 0 );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Order status', function() {
  it( 'Attempt to get the order status for a given order id', function( done ) {
    binance.orderStatus( 'ETHBTC', '1234567890', ( error, orderStatus, symbol ) => {
      //debug( error );
      //debug( orderStatus );
      //debug( symbol );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( orderStatus ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'ETHBTC' );
      assert( error !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( orderStatus !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( error.body === '{"code":-2013,"msg":"Order does not exist."}' );
      assert( Object.keys( orderStatus ).length === 0 );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'trades', function() {
  it( 'Attempt get all trade history for given symbol', function( done ) {
    binance.trades( 'SNMBTC', ( error, trades, symbol ) => {
      //debug( error );
      //debug( trades );
      //debug( symbol );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( trades ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'SNMBTC' );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( trades !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.keys( trades ).length === 0 );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Orders', function() {
  it( 'Attempt get all orders for given symbol', function( done ) {
    binance.allOrders( 'ETHBTC', ( error, orders, symbol ) => {
      //debug( error );
      //debug( orders );
      //debug( symbol );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( orders ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'ETHBTC' );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( orders !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.keys( orders ).length === 0 );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Prevday all symbols', function() {
  it( 'Attempt get prevday trade status for all symbols', function( done ) {
    binance.prevDay( false, ( error, prevDay ) => {
      //debug( error );
      //debug( prevDay );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( prevDay ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( prevDay !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.keys( prevDay ).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?' );

      let members = [
        'symbol', 'priceChange', 'priceChangePercent', 'weightedAvgPrice', 'prevClosePrice',
        'lastPrice', 'lastQty', 'bidPrice', 'bidQty', 'askQty', 'openPrice', 'highPrice', 'lowPrice',
        'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstId', 'lastId', 'count'
      ];
      prevDay.forEach( function( obj ) {
        members.forEach( function( key ) {
          assert( Object.prototype.hasOwnProperty.call( obj, key ), WARN_SHOULD_HAVE_KEY + key );
        } );
      } );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Prevday', function() {
  it( 'Attempt get prevday trade status for given symbol', function( done ) {
    binance.prevDay( 'BNBBTC', ( error, prevDay, symbol ) => {
      //debug( error );
      //debug( prevDay );
      //debug( symbol );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( prevDay ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'BNBBTC', 'Should be BNBBTC' );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( prevDay !== null, WARN_SHOULD_BE_NOT_NULL );

      let members = [
        'symbol', 'priceChange', 'priceChangePercent', 'weightedAvgPrice', 'prevClosePrice',
        'lastPrice', 'lastQty', 'bidPrice', 'bidQty', 'askQty', 'openPrice', 'highPrice', 'lowPrice',
        'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstId', 'lastId', 'count'
      ];
      members.forEach( function( key ) {
        assert( Object.prototype.hasOwnProperty.call( prevDay, key ), WARN_SHOULD_HAVE_KEY + key );
      } );
      done();
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Candle sticks', function() {
  it( 'Attempt get candlesticks for a given symbol', function( done ) {
    binance.candlesticks( 'BNBBTC', '5m', ( error, ticks, symbol ) => {
      //debug( error );
      //debug( ticks );
      //debug( symbol );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( ticks ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_TYPE + 'string' );
      assert( symbol === 'BNBBTC', 'Should be BNBBTC' );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( ticks !== null, WARN_SHOULD_BE_NOT_NULL );

      ticks.forEach( function( tick ) {
        assert( tick.length === 12 );
      } );
      done();
    }, {
      limit: 500,
      endTime: 1514764800000
    } );
  } ).timeout( TIMEOUT );
} );

describe( 'Object keys', function() {
  describe( 'First', function() {
    it( 'Gets the first key', function( done ) {
      let first = binance.first( { first: '1', second: '2', third: '3' } );assert.strictEqual( 'first', first, 'should be first' );
      done();
    }).timeout( TIMEOUT );
  });

  describe( 'Last', function() {
    it( 'Gets the last key', function( done ) {
      let last = binance.last( { first: '1', second: '2', third: '3' } );assert.strictEqual( 'third', last, 'should be third' );
      done();
    }).timeout( TIMEOUT );
  });

  describe( 'slice', function() {
    it( 'Gets slice of the object keys', function( done ) {
      let slice = binance.slice( { first: '1', second: '2', third: '3' }, 2 );
      assert.deepEqual( ['third'], slice, 'should be ian array with the third' );
      done();
    }).timeout( TIMEOUT );
  });

  describe( 'Min', function() {
    it( 'Gets the math min of object', function( done ) {
      //debug( 'todo' );
      done();
    }).timeout( TIMEOUT );
  });

  describe( 'Max', function() {
    it( 'Gets the math max of object', function( done ) {
      //debug( 'todo' );
      done();
    }).timeout( TIMEOUT );
  });
});

describe( 'Set/Get options', function() {
  it( 'Sets/Gets option to specified value', function( done ) {
    binance.setOption( 'test', 'value' );
    assert.equal( binance.getOption( 'test' ), 'value', 'should be value' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Get options', function() {
  it( 'Gets all options', function( done ) {
    assert( typeof ( binance.getOptions() ) === 'object' , 'should be object' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Percent', function() {
  it( 'Get Percentage of two values', function( done ) {
    assert( binance.percent( 25, 100 ) === 25 , 'should be 25 percent' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Sum', function() {
  it( 'Get sum of array of values', function( done ) {
    assert( binance.sum( [1, 2, 3] ) === 6 , 'should be 6' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Reverse', function() {
  it( 'Reverse the keys in an object', function( done ) {
    assert( binance.reverse( { '3': 3, '2': 2, '1': 1 } ).toString() === {'1': 1, '2': 2, '3': 3 }.toString(), 'should be {\'1\': 1, \'2\': 2, \'3\': 3 }' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Array', function() {
  it( 'Convert object to an array', function( done ) {
    let actual = binance.array( { 'a': 1, 'b': 2,'c': 3 } );
    let expected = [[NaN, 1], [NaN, 2], [NaN, 3]];
    assert.isArray( actual, 'should be an array' );
    assert( actual.length === 3, 'should be of lenght 3' );
    assert.deepEqual( actual, expected, 'should be both arrays with same vlaues' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'sortBids', function() {
  it( 'Sorts symbols bids and returns an object', function( done ) {
    /* let actual = binance.sortBids( 'BNBBTC' );
       //debug( actual ); */
    //debug( 'todo' );
    done();
  });
});

describe( 'sortAsks', function() {
  it( 'Sorts symbols asks and returns an object', function( done ) {
    //let actual = binance.sortBids( 'BNBBTC' );
    //debug( actual ); */
    //debug( 'todo' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Exchange Info', function() {
  let async_error;
  let async_data;
  /*global beforeEach*/
  /*eslint no-undef: "error"*/
  beforeEach(function (done) {
    binance.exchangeInfo(function(error, data) {
      async_error = error;
      async_data = data;
      done( error );
    })
  });

  it( 'Gets the exchange info as an object', function() {
    assert( typeof ( async_error ) === 'object', 'error should be object' );
    assert( async_error === null, 'Error should be null' );
    assert( typeof ( async_data ) === 'object', 'data should be object' );
    assert( async_data !== null, 'data should not be null' );
    assert( Object.prototype.hasOwnProperty.call( async_data, 'symbols' ), 'data should have property \'symbols\'' );

    let symbolMembers = ['status', 'orderTypes', 'icebergAllowed', 'baseAsset', 'baseAssetPrecision', 'quoteAsset', 'quotePrecision'];
    async_data.symbols.forEach( function( symbol ) {
      symbolMembers.forEach( function( member ) {
        assert( Object.prototype.hasOwnProperty.call( symbol, member ), WARN_SHOULD_HAVE_KEY + member );
      });
    });
  }).timeout( TIMEOUT );
});

describe( 'System status', function() {
  let async_error;
  let async_data;
  /*global beforeEach*/
  beforeEach(function (done) {
    binance.systemStatus(function(error, data) {
      async_error = error;
      async_data = data;
      done( error );
    })
  });

  it( 'Gets the system status info as an object', function() {
    //debug( async_error );
    //debug( async_data );
    assert( typeof ( async_error ) === 'object', 'error should be object' );
    assert( async_error === null, 'Error should be null' );
    assert( typeof ( async_data ) === 'object', 'data should be object' );
    assert( async_data !== null, 'data should not be null' );
    assert( Object.prototype.hasOwnProperty.call( async_data, 'msg' ), WARN_SHOULD_HAVE_KEY + 'msg' );
    assert( Object.prototype.hasOwnProperty.call( async_data, 'status' ), WARN_SHOULD_HAVE_KEY + 'status' );

    let members = ['msg', 'status'];
    members.forEach( function( member ) {
      assert( Object.prototype.hasOwnProperty.call( async_data, member ), WARN_SHOULD_HAVE_KEY + member );
    });
  }).timeout( TIMEOUT );
});

describe( 'Withdraw', function() {
  it( 'Attempt to withdraw BNB to another address', function( done ) {
    binance.withdraw( 'BNBBTC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '5', false, ( error, result ) => {
      //debug( error );
      //debug( result );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( result, 'msg' ), WARN_SHOULD_HAVE_KEY + 'msg' );
      assert( result.msg === 'You don\'t have permission.' );
      assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
      assert( result.success === false );
      done();
    });
  }).timeout( TIMEOUT );

  it( 'Attempt to withdraw BNB to another address with address tag', function( done ) {
    binance.withdraw( 'BNBBTC', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '5', 'AQSWDEFRGT', ( error, result ) => {
      //debug( error );
      //debug( result );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( result, 'msg' ), WARN_SHOULD_HAVE_KEY + 'msg' );
      assert( result.msg === 'You don\'t have permission.' );
      assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
      assert( result.success === false );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Withdraw history', function() {
  it( 'Attempt to get withdraw history for BTC', function( done ) {
    binance.withdrawHistory( ( error, result ) => {
      //debug( error );
      //debug( result );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( result, 'withdrawList' ), WARN_SHOULD_HAVE_KEY + 'withdrawList' );
      assert( Array.isArray( result.withdrawList ) );
      assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
      assert( result.success === true );
      done();
    }, 'BTC' );
  }).timeout( TIMEOUT );

  it( 'Attempt to get withdraw history for all assets', function( done ) {
    binance.withdrawHistory( ( error, result ) => {
      //debug( error );
      //debug( result );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( result, 'withdrawList' ), WARN_SHOULD_HAVE_KEY + 'withdrawList' );
      assert( Array.isArray( result.withdrawList ) );
      assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
      assert( result.success === true );
      done();
    });
  }).timeout( TIMEOUT );
});


describe( 'Deposit history', function() {
  it( 'Attempt to get deposit history for all assets', function( done ) {
    binance.depositHistory( ( error, result ) => {
      //debug( error );
      //debug( result );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( result, 'depositList' ), WARN_SHOULD_HAVE_KEY + 'depositList' );
      assert( Array.isArray( result.depositList ) );
      assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
      assert( result.success === true );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Deposit address', function() {
  it( 'Attempt to get deposit address for BNB', function( done ) {
    binance.depositAddress( 'BTC', ( error, result ) => {
      //debug( error );
      //debug( result );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( result, 'address' ), WARN_SHOULD_HAVE_KEY + 'address' );
      assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_HAVE_KEY + 'success' );
      assert( Object.prototype.hasOwnProperty.call( result, 'addressTag' ), WARN_SHOULD_HAVE_KEY + 'addressTag' );
      assert( Object.prototype.hasOwnProperty.call( result, 'asset' ), WARN_SHOULD_HAVE_KEY + 'asset' );
      assert( result.asset === 'BTC' );
      assert( result.success === true );
      done();
    });
  }).timeout( TIMEOUT );

  it( 'Attempt to get deposit address for XYZ', function( done ) {
    binance.depositAddress( 'XYZ', ( error, result ) => {
      //debug( error );
      //debug( result );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( result ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( result !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( result, 'address' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'address' );
      assert( Object.prototype.hasOwnProperty.call( result, 'success' ), WARN_SHOULD_NOT_HAVE_KEY + 'success' );
      assert( Object.prototype.hasOwnProperty.call( result, 'addressTag' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'addressTag' );
      assert( Object.prototype.hasOwnProperty.call( result, 'asset' ) === false, WARN_SHOULD_NOT_HAVE_KEY + 'asset' );
      assert( result.success === false );
      done();
    });
  }).timeout( TIMEOUT );
});

describe( 'Account status', function() {
  it( 'Attempt to get account status', function( done ) {
    binance.accountStatus( ( error, data ) => {
      //debug( error );
      //debug( data );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
      done();
    } );
  } ).timeout( TIMEOUT );
});

describe( 'Account', function() {
  it( 'Attempt to get account information', function( done ) {
    binance.account( ( error, data ) => {
      //debug( error );
      //debug( data );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
      done();
    } );
  } ).timeout( TIMEOUT );
});

describe( 'Use Server Time', function() {
  it( 'Gets the server time and sets it ass the offset for http connections', function( done ) {
    //binance.useServerTime( ( error, data ) => {
      // debug( data );
      done();
    //});
  }).timeout( TIMEOUT );
});

describe( 'Time', function() {
  it( 'Attempt to get server time', function( done ) {
    binance.time( ( error, data ) => {
      //debug( error );
      //debug( data );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( Object.prototype.hasOwnProperty.call( data, 'serverTime' ), WARN_SHOULD_HAVE_KEY + 'serverTime' );
      done();
    } );
  } ).timeout( TIMEOUT );
});

describe( 'Aggtrades', function() {
  it( 'Todo', function( done ) {
    //debug( 'todo' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Recent Trades', function() {
  it( 'Attempt get recent Trades for a given symbol', function( done ) {
    binance.recentTrades( 'BNBBTC', ( error, data ) => {
      //debug( error );
      //debug( data );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( data.length > 0 );
      data.forEach(function(obj) {
        assert( Object.prototype.hasOwnProperty.call( obj, 'id' ), WARN_SHOULD_HAVE_KEY + 'id' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'price' ), WARN_SHOULD_HAVE_KEY + 'price' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'qty' ), WARN_SHOULD_HAVE_KEY + 'qty' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'time' ), WARN_SHOULD_HAVE_KEY + 'time' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'isBuyerMaker' ), WARN_SHOULD_HAVE_KEY + 'isBuyerMaker' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'isBestMatch' ), WARN_SHOULD_HAVE_KEY + 'isBestMatch' );
      });
      done();
    } );
  } ).timeout( TIMEOUT );
});

describe( 'Historical Trades', function() {
  it( 'Attempt get Historical Trades for a given symbol', function( done ) {
    binance.historicalTrades( 'BNBBTC', ( error, data ) => {
      //debug( error );
      //debug( data );
      assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( typeof ( data ) === 'object', WARN_SHOULD_BE_OBJ );
      assert( error === null, WARN_SHOULD_BE_NULL );
      assert( data !== null, WARN_SHOULD_BE_NOT_NULL );
      assert( data.length > 0 );
      data.forEach(function(obj) {
        assert( Object.prototype.hasOwnProperty.call( obj, 'id' ), WARN_SHOULD_HAVE_KEY + 'id' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'price' ), WARN_SHOULD_HAVE_KEY + 'price' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'qty' ), WARN_SHOULD_HAVE_KEY + 'qty' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'time' ), WARN_SHOULD_HAVE_KEY + 'time' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'isBuyerMaker' ), WARN_SHOULD_HAVE_KEY + 'isBuyerMaker' );
        assert( Object.prototype.hasOwnProperty.call( obj, 'isBestMatch' ), WARN_SHOULD_HAVE_KEY + 'isBestMatch' );
      });
      done();
    } );
  } ).timeout( TIMEOUT );
});

describe( 'Highstock', function() {
  it( 'Todo', function( done ) {
    //debug( 'todo' );
    done();
  }).timeout( TIMEOUT );
});

describe( 'Ohlc', function() {
  it( 'Todo', function( done ) {
    //debug( 'todo' );
    done();
  }).timeout( TIMEOUT );
});


describe( 'Websockets miniticker', function() {
  let markets;
  /*global beforeEach*/
  beforeEach(function (done) {
    binance.websockets.miniTicker( tick => {
      markets = tick;
      stopSockets();
      done();
    });
  });

  it( 'Calls miniticker websocket', function() {
    assert( typeof ( markets ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( markets !== null, WARN_SHOULD_BE_NOT_NULL );
    assert( Object.keys( markets ).length >= 0, 'should at least 1 currency pairs?' );

    Object.keys( markets ).forEach(function(symbol) {
      assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'close' ), WARN_SHOULD_HAVE_KEY + 'close' );
      assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'open' ), WARN_SHOULD_HAVE_KEY + 'open' );
      assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'high' ), WARN_SHOULD_HAVE_KEY + 'high' );
      assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'low' ), WARN_SHOULD_HAVE_KEY + 'low' );
      assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'volume' ), WARN_SHOULD_HAVE_KEY + 'volume' );
      assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'quoteVolume' ), WARN_SHOULD_HAVE_KEY + 'quoteVolume' );
      assert( Object.prototype.hasOwnProperty.call( markets[symbol], 'eventTime' ), WARN_SHOULD_HAVE_KEY + 'eventTime' );
    });
  });
});

/*
describe( 'Websockets prevDay', function() {
  let error;
  let response;
  beforeEach(function (done) {
    binance.websockets.prevDay( false, (a_error, a_response) => {
      stopSockets();
      error = a_error;
      response = a_response;
      done();
    })
  });

  it( 'Calls prevDay websocketi for symbol', function() {
    assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( error === null, WARN_SHOULD_BE_NULL );
    assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( response !== null, WARN_SHOULD_BE_NOT_NULL );
    //assert( Object.keys( response ).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?' );

    let keys = [
'eventType', 'eventTime', 'symbol', 'priceChange', 'percentChange', 'averagePrice', 'prevClose',
'close', 'closeQty', 'bestBid', 'bestBidQty', 'bestAsk', 'bestAskQty', 'open', 'high',
'low', 'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstTradeId', 'lastTradeId', 'numTrades'
];
    response.forEach(function(obj) {
      keys.forEach(function(key) {
        assert( Object.prototype.hasOwnProperty.call( obj, key ), WARN_SHOULD_HAVE_KEY + key );
      });
    });
  });

  beforeEach(function (done) {
    binance.websockets.prevDay( false, (a_error, a_response) => {
      stopSockets();
      error = a_error;
      response = a_response;
      done();
    })
  });

  it( 'Calls prevDay websocket for all symbols', function() {
    assert( typeof ( error ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( error === null, WARN_SHOULD_BE_NULL );
    assert( typeof ( response ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( response !== null, WARN_SHOULD_BE_NOT_NULL );
    //assert( Object.keys( response ).length >= num_pairs, 'should at least ' + num_pairs + 'currency pairs?' );

    let keys = [
'eventType', 'eventTime', 'symbol', 'priceChange', 'percentChange', 'averagePrice', 'prevClose',
'close', 'closeQty', 'bestBid', 'bestBidQty', 'bestAsk', 'bestAskQty', 'open', 'high',
'low', 'volume', 'quoteVolume', 'openTime', 'closeTime', 'firstTradeId', 'lastTradeId', 'numTrades'
];
    keys.forEach(function(key) {
      assert( Object.prototype.hasOwnProperty.call( response, key ), WARN_SHOULD_HAVE_KEY + key );
    });
  });
});
*/

describe( 'Websockets candlesticks', function() {
  let candlesticks;
  /*global beforeEach*/
  beforeEach(function (done) {
    this.timeout( TIMEOUT );
    binance.websockets.candlesticks(['BNBBTC'], '1m', a_candlesticks => {
      candlesticks = a_candlesticks;
      stopSockets();
      done();
    });
  });

  it( 'Calls candlesticks websocket', function() {
    assert( typeof ( candlesticks ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( candlesticks !== null, WARN_SHOULD_BE_NOT_NULL );
    assert( Object.keys( candlesticks ).length >= 0, 'should at least 1 currency pairs?' );

    let keys = ['t', 'T', 's', 'i', 'f', 'L', 'o', 'c', 'h', 'l', 'v', 'n', 'x', 'q', 'V', 'Q', 'B'];
    assert( Object.prototype.hasOwnProperty.call( candlesticks, 'e' ), WARN_SHOULD_HAVE_KEY + 'e' );
    assert( Object.prototype.hasOwnProperty.call( candlesticks, 'E' ), WARN_SHOULD_HAVE_KEY + 'E' );
    assert( Object.prototype.hasOwnProperty.call( candlesticks, 's' ), WARN_SHOULD_HAVE_KEY + 's' );
    assert( Object.prototype.hasOwnProperty.call( candlesticks, 's' ), WARN_SHOULD_HAVE_KEY + 'k' );

    keys.forEach(function(key) {
      assert( Object.prototype.hasOwnProperty.call( candlesticks.k, key ), WARN_SHOULD_HAVE_KEY + key );
    });
  });
});

describe( 'Websockets chart', function() {
  let chart;
  let interval;
  let symbol;
  /*global beforeEach*/
  beforeEach(function (done) {
    this.timeout( TIMEOUT );
    binance.websockets.chart('BNBBTC', '1m', (a_symbol, a_interval, a_chart) => {
      chart = a_chart;
      interval = a_interval;
      symbol = a_symbol;
      stopSockets();
      done();
    });
  });

  it( 'Calls chart websocket', function() {
    assert( typeof ( chart ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
    assert( typeof ( interval ) === 'string', WARN_SHOULD_BE_OBJ );
    assert( chart !== null, WARN_SHOULD_BE_NOT_NULL );
    assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );
    assert( interval !== null, WARN_SHOULD_BE_NOT_NULL );

    let keys = ['open', 'high', 'open', 'close', 'volume'];
    assert( Object.keys( chart ).length > 0, 'Should not be empty' );

    Object.keys(chart).forEach(function(c) {
      keys.forEach(function(key) {
        assert( Object.prototype.hasOwnProperty.call( chart[c], key ), WARN_SHOULD_HAVE_KEY + key );
      });
    });
  });
});

/*
describe( 'Websockets depth', function() {
  let symbol;
  let bids;
  let asks;
  beforeEach(function (done) {
    this.timeout( TIMEOUT );
    binance.websockets.depthCache(['BNBBTC'], (a_symbol, a_depth) => {
      stopSockets();
      bids = binance.sortBids(depth.bids);
      asks = binance.sortAsks(depth.asks);
      symbol = a_symbol;
      done();
    });
  });

  it( 'Calls depth websocket', function() {
    assert( typeof ( bids ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( typeof ( asks ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( typeof ( symbol ) === 'string', WARN_SHOULD_BE_OBJ );
    assert( bids !== null, WARN_SHOULD_BE_NOT_NULL );
    assert( asks !== null, WARN_SHOULD_BE_NOT_NULL );
    assert( symbol !== null, WARN_SHOULD_BE_NOT_NULL );

    debug(bids);
    debug(asks);
  });
});
*/

describe( 'Websockets trades', function() {
  let trades;
  /*global beforeEach*/
  beforeEach(function (done) {
    this.timeout( TIMEOUT );
    binance.websockets.trades(['BNBBTC', 'ETHBTC'], (e_trades) => {
      trades = e_trades;
      stopSockets();
      done();
    });
  });

  it( 'Calls trades websocket', function() {
    assert( typeof ( trades ) === 'object', WARN_SHOULD_BE_OBJ );
    assert( trades !== null, WARN_SHOULD_BE_NOT_NULL );
  });
});