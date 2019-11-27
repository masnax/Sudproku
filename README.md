# Sudproku

- Run Prolog:
    - navigate to project directory
    - `swipl sudproku.pl N [r,h,x]`
        - where N is a number from 0-3 denoting the problem,
        - and r,h,x are signifiers to produce a solution for regular sudoku, hyper sudoku, or sudoku x, respectively.
- Run UI:
    - navigate to project directory
    - `npm i express`
    - `npm i socket.io`
    - `node server.js`
    - go to http://localhost:8181 in a browser
