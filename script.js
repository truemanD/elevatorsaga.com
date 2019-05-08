{
    init: function (elevators, floors) {
        var upButtons = [];
        var downButtons = [];
        for (i = 0; i < elevators.length; i++) {
            let elevator = elevators[i];

            elevator.on("floor_button_pressed", function ( floorNum) {
                if (elevator.currentFloor() === 0) {
                    elevator.destinationQueue.push(floorNum);
                    elevator.destinationQueue.sort();
                }
                switchElevatorIndicator(elevator);
                elevator.checkDestinationQueue();
                console.log(elevator.toString()+": floor_button_pressed; elevator.destinationQueue: " + elevator.destinationQueue);
            });
            elevator.on("passing_floor", function ( floorNum, direction) {
                switchElevatorIndicator(elevator);
            });
            elevator.on("stopped_at_floor", function (floorNum) {
                switchElevatorIndicator(elevator);
                if (elevator.goingUpIndicator()) {
                    upButtons.splice(upButtons.indexOf(floorNum), 1);
                }
                if (elevator.goingDownIndicator()) {
                    downButtons.splice(downButtons.indexOf(floorNum), 1);
                }
//                elevator.checkDestinationQueue();
                console.log(elevator.toString()+": stopped_at_floor; elevator.destinationQueue: " + elevator.destinationQueue);
            });
            elevator.on("idle", function () {
                if (elevator.currentFloor() === 0) {
                    elevator.destinationQueue.unshift(upButtons);
                    elevator.destinationQueue.sort();
                } else {
                    if(elevator.loadFactor() > 0.6) {
                        elevator.destinationQueue.unshift(downButtons[0]);
                    } else {
                        elevator.destinationQueue = downButtons;
                           }
                    elevator.destinationQueue.push(elevator.getPressedFloors());
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                }
                switchElevatorIndicator(elevator);
                elevator.checkDestinationQueue();
                console.log(elevator.toString()+": idle; elevator.destinationQueue: " + elevator.destinationQueue);
            });
        }

        for (i = 0; i < floors.length; i++) {
            var floor = floors[i];
            floor.on("up_button_pressed", function (floor) {
                if (!upButtons.includes(floor.floorNum())) {
                    upButtons.push(floor.floorNum());
                }
                upButtons.sort();
            });
            floor.on("down_button_pressed", function (floor) {
                if (!downButtons.includes(floor.floorNum())) {
                    downButtons.push(floor.floorNum());
                }
                downButtons.sort().reverse();
            });
        }

        function switchElevatorIndicator(elevator) {
            if (elevator.currentFloor() === 0) {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            }
            if (elevator.currentFloor() === floors.length - 1) {
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            }
            if (elevator.currentFloor() < elevator.destinationQueue[0]) {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            }
            if (elevator.currentFloor() > elevator.destinationQueue[0]) {
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            }
        }
    },

        update: function (dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}
