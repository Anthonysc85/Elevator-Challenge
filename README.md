# Elevator Challenge

Virtual elevator algorithm build with Javascript, Tailwind CSS, and HTML.

1. Ability to select floor 1 to 10 on a keypad.
2. There is a representation of an elevator and a building with 10 floors. This can be as simple as 10 blocks stacked on top of each other for the floors and a different colored block that represents the elevator.
3. A current floor display shows what floor the elevator is currently on.
4. Upon selecting a floor on the keypad
  - The selected floor button lights up
  - The elevator begins to move to the selected floor
  - The current floor display updates as the elevator moves past each floor
  - Once the elevator reaches the selected floor
    - The selected floor button on the keypad dims
    - The elevator waits for 3 seconds before returning to the lobby / 1st floor
5. If other floors are selected while the elevator is traveling to the initially selected floor
  - The elevator should stop at the newly selected floors only if it hasn't traveled beyond them yet. 
  - If the elevator has traveled beyond the newly selected floors, the elevator should first stop at the initially selected floor, pausing for 3 seconds, before continuing on to the newly selected floors. 
