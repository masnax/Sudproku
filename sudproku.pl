:- use_module(library(clpfd)).
:- use_module(library(lists)).

/*TODO: to visualize, import swish*/
sudoku(Rows) :-
        length(Rows, 9), maplist(same_length(Rows), Rows),
        append(Rows, Vs), Vs ins 1..9,
        maplist(all_distinct, Rows),
        transpose(Rows, Columns), maplist(all_distinct, Columns),
        Rows = [As,Bs,Cs,Ds,Es,Fs,Gs,Hs,Is],
        blocks(As, Bs, Cs), blocks(Ds, Es, Fs), blocks(Gs, Hs, Is).

hypersudoku(Rows) :-
        length(Rows, 9), maplist(same_length(Rows), Rows),
        append(Rows, Vs), Vs ins 1..9,
        maplist(all_distinct, Rows),
        transpose(Rows, Columns), maplist(all_distinct, Columns),
        Rows = [As,Bs,Cs,Ds,Es,Fs,Gs,Hs,Is],
        blocks(As, Bs, Cs), blocks(Ds, Es, Fs), blocks(Gs, Hs, Is),
        hyperblocks(Bs,Cs,Ds), hyperblocks(Fs,Gs,Hs).

sudokux(Rows) :-
        length(Rows, 9), maplist(same_length(Rows), Rows),
        append(Rows, Vs), Vs ins 1..9,
        maplist(all_distinct, Rows),
        transpose(Rows, Columns), maplist(all_distinct, Columns),
        Rows = [As,Bs,Cs,Ds,Es,Fs,Gs,Hs,Is],
        blocks(As, Bs, Cs), blocks(Ds, Es, Fs), blocks(Gs, Hs, Is),
        diagonal(As,Bs,Cs,Ds,Es,Fs,Gs,Hs,Is).

blocks([], [], []).
blocks([N1,N2,N3|Ns1], [N4,N5,N6|Ns2], [N7,N8,N9|Ns3]) :-
        all_distinct([N1,N2,N3,N4,N5,N6,N7,N8,N9]),
        blocks(Ns1, Ns2, Ns3).

hyperblocks([],[],[]).
hyperblocks([_],[_],[_]).
hyperblocks([_,N2,N3,N4,N5|Ns1], [_,N7,N8,N9,N10|Ns2], [_,N12,N13,N14,N15|Ns3]) :-
        all_distinct([N2,N3,N4,N7,N8,N9,N12,N13,N14]),
        hyperblocks([N5|Ns1], [N10|Ns2], [N15|Ns3]).

diagonal([],[],[],[],[],[],[],[],[]).
diagonal([N1a,_,_,_,_,_,_,_,N9a|_],[_,N2b,_,_,_,_,_,N8b|_],
[_,_,N3c,_,_,_,N7c|_],[_,_,_,N4d,_,N6d|_],[_,_,_,_,N5|_],
[_,_,_,N4f,_,N6f|_],[_,_,N3g,_,_,_,N7g|_],[_,N2h,_,_,_,_,_,N8h|_],
[N1i,_,_,_,_,_,_,_,N9i|_]) :-
all_distinct([N1a,N2b,N3c,N4d,N5,N6f,N7g,N8h,N9i]),
all_distinct([N1i,N2h,N3g,N4f,N5,N6d,N7c,N8b,N9a]).
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
   Sample problems.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/*solveable for sudoku*/
problem(1, P) :-
    P = [[1,_,_,8,_,4,_,_,_],
         [_,2,_,_,_,_,4,5,6],
         [_,_,3,2,_,5,_,_,_],
         [_,_,_,4,_,_,8,_,5],
         [7,8,9,_,5,_,_,_,_],
         [_,_,_,_,_,6,2,_,3],
         [8,_,1,_,_,_,7,_,_],
         [_,_,_,1,2,3,_,8,_],
         [2,_,5,_,_,_,_,_,9]].

/*solveable for hypersudoku, sudoku*/
problem(2,P) :-
    P = [[_,5,_,1,4,_,6,_,8],
         [_,_,4,_,_,6,_,_,_],
         [_,_,8,7,_,2,_,9,_],
         [_,2,_,5,_,7,8,_,_],
         [_,4,_,6,2,_,7,5,_],
         [8,_,5,_,_,1,_,6,9],
         [5,_,1,2,7,_,3,_,6],
         [_,3,_,_,1,_,9,7,_],
         [_,_,2,_,_,9,_,4,5]].

/*solveable for sudokux*/
problem(3,P) :-
    P = [[_,_,9,_,_,_,4,_,5],
         [7,_,_,_,_,3,_,1,_],
         [_,1,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,2,8],
         [2,_,3,_,_,_,_,_,_],
         [6,_,8,_,_,_,_,_,_],
         [3,4,_,1,_,_,2,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_]].

/*empty :) */
problem(4, P) :-
    P = [[_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_],
         [_,_,_,_,_,_,_,_,_]].

solve(1) :- problem(1, Rows), sudoku(Rows),
   maplist(labeling([ff]), Rows), maplist(portray_clause, Rows).
solve(2) :- problem(2, Rows), hypersudoku(Rows),
   maplist(labeling([ff]), Rows), maplist(portray_clause, Rows).
solve(3) :- problem(3, Rows), sudokux(Rows),
   maplist(labeling([ff]), Rows), maplist(portray_clause, Rows).
solve(_).

% this will parse an argument passed via the command line and run the appropriate sudoku game from above
:- current_prolog_flag(argv, Argv),atomic_list_concat(Argv,Atom),atom_to_term(Atom,Term,[]), solve(Term), halt.