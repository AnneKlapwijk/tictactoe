
Boxes = new Mongo.Collection('boxes');

if (Meteor.isClient) {

  Session.set('player', 'X');

  Template.box.events({
    click: function(){
      var boxFilled = this.player;
      if(boxFilled || hasWon()) {
        return; //do nothing
      }
      //otherwise, update the collection
      var sessionPlayer = Session.get('player');
      Boxes.update(this._id, { $set: { player: sessionPlayer } });
      if(hasWon()) {
        console.log("Player", Session.get('player'),"has won");
      } else {
        console.log('Player', Session.get('player'),'has NOT won');
        setNextPlayer();
      }
    }
  });

  Template.gameboard.events({
    'click .reset-game': function() {
      resetGame();
    }
  });

  Template.gameboard.helpers({
    boxes: function(){
      return Boxes.find({});
    },
    player: function() {
      return Session.get('player');
    },
    hasWon: function() {
      return hasWon();
    },
    winner: function() {
      return Session.get('player');
    }
  });

  Template.box.helpers({
    disabled: function () {
      //if the box is filled, we cannot click there anymore
      return this.player;
    }
  });

  var setNextPlayer = function(){
    if(Session.get('player') == 'X') {
      Session.set('player', 'O');
    } else {
      Session.set('player', 'X');
    }
  }

  var hasWon = function() {
    var boxes = Boxes.find().fetch();
    var player = Session.get('player');
    if(boxes[0] && boxes[0].player) {
      // horizontal
      if (boxes[0].player == player && boxes[1].player == player && boxes[2].player == player) return true;
      if (boxes[3].player == player && boxes[4].player == player && boxes[5].player == player) return true;
      if (boxes[6].player == player && boxes[7].player == player && boxes[8].player == player) return true;
      // vertical
      if (boxes[0].player == player && boxes[3].player == player && boxes[6].player == player) return true;
      if (boxes[1].player == player && boxes[4].player == player && boxes[7].player == player) return true;
      if (boxes[2].player == player && boxes[5].player == player && boxes[8].player == player) return true;
      // diagonal
      if (boxes[0].player == player && boxes[4].player == player && boxes[8].player == player) return true;
      if (boxes[6].player == player && boxes[4].player == player && boxes[2].player == player) return true;
    }
    return false;
  };

  var resetGame = function() {
    console.log(' reset ');
    boxes = Boxes.find().fetch();
    for(var i = 0; i < boxes.length; i++) {
      Boxes.update({_id:boxes[i]._id}, { $set: { player: null } });
    }
    Session.set('player', 'X');
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    //just to be sure, we want to begin with a new collection
    Boxes.remove({});
    //and fill it with 9 boxes
    if(Boxes.find({}).count() === 0) {
      for(var i = 0; i < 9; i++){
        Boxes.insert({});
        console.log('inserted box with index', i);
      }
    }

  });
}
