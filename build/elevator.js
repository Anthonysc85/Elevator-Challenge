var ElevatorControl = (function() {
    /*
     Constructor.  Takes an array of the names of the floor levels, from bottom
     to top.
     */
    function ElevatorControl(levels) {
        this.levels = levels.map(function(lv) { return lv.toString(); });
        this.travelTime = 1500;     // milliseconds from floor to floor
        this.currentIndex = 0;
        this.queue = [];
        this.callbacks = [];    
        this.elevator = {
            motion: 0,              // -1 = Downward, 0 = Stopped; +1 = Upward
            currentLevel: this.levels[0]
        };
    }

    /*
     Registers a function to be called when an event occurs,
     returns this object
     
     The callback will be called with two parameters.  The first
     parameter is the elevator state, which is an object with
     attributes named "motion" (+1, 0, or -1) and "currentLevel".
     The second parameter is a string describing the event type:
     "up", "down", "arrived", or "level".
     */
    ElevatorControl.prototype.addCallback = function(callback) {
        this.callbacks.push(callback);
        return this;
    };

    ElevatorControl.prototype.removeCallback = function(callback) {
        for (var i = this.callbacks.length - 1; i >= 0; i--) {
            if (this.callbacks[i] === callback) {
                this.callbacks.splice(i, 1);
            }
        }
        return this;
    };
  
    /*
      Informs callbacks of the current state by sending them a "level"
      event.
     */
    ElevatorControl.prototype.refresh = function() {
        fireEvent(this, 'level');
        return this;
    };

    ElevatorControl.prototype.press = function(level) {
      
        var index = this.levels.indexOf(level.toString());
        if (index < 0) return;      // Ignore invalid presses
        this.queue.push(index);   
        
        react(this);
        return this;
    };

    function react(ctrl) {
        if (ctrl.queue.length == 0) return;

       if (ctrl.currentIndex == ctrl.queue[1]) {
        
        fireEvent(ctrl, "arrived");
        
       }
       
        if (ctrl.currentIndex == ctrl.queue[0]) { 
            ctrl.elevator.motion = 0;     
            ctrl.queue.shift();
            ctrl.queue.splice(0, 1);
            fireEvent(ctrl, "arrived");
            window.clearInterval(ctrl.interval);
            ctrl.interval = null;
             // Returns to first floor after 3 seconds
             if (ctrl.queue.length == 0) {
                 setTimeout(ctrl.queue.push(0), 3000);
             } 
            
            
        
        }
      
        

        if (ctrl.elevator.motion) {
            ctrl.elevator.currentLevel = ctrl.levels[ctrl.currentIndex += ctrl.elevator.motion];
            fireEvent(ctrl, "level");
            return;
        }
      
        if (ctrl.currentIndex < ctrl.queue[0]) {
            ctrl.elevator.motion = +1;
            fireEvent(ctrl, "up");
        } else if (ctrl.currentIndex > ctrl.queue[0]) {
            ctrl.elevator.motion = -1;
            fireEvent(ctrl, "down");
        } 
        
        if (!ctrl.interval) {
            ctrl.interval = window.setInterval(function() { react(ctrl); }, ctrl.travelTime);
        }
    }

    function fireEvent(ctrl, event) {
        for (var i = 0; i < ctrl.callbacks.length; i++) {
            ctrl.callbacks[i](ctrl.elevator, event);
        }
    }

    return ElevatorControl;
})();



var elev = new ElevatorControl([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);


// Assigns current index to HTML "level"

elev.addCallback(function buttonPanelCallback(ctrl, event) {
    if (event === "arrived") {
        $('button[value="' + ctrl.currentLevel + '"].lit').removeClass('lit');
        
    }
}).addCallback(function levelNumberCallback(ctrl, event) {
    if (event === "level") {
        $('#floor-number').text(ctrl.currentLevel);
         
    }
});


$(function init() {
    $('.panel button').click(function() {
        $(this).addClass('lit');
        elev.press($(this).val());
    });
    elev.refresh();
});

