:- Dynamic a/2.

main(A,B) :-
    assert(a(a,b)),
    assert(a(b,a)),
	open('assertTest.txt', read, Str),
    read_file(Str,Lines),
    close(Str),
    write(Lines), nl,
	add(Lines), !,
	a(A,B).

add([H|T]):-
	assert(H).

read_file(Stream,[]) :-
    at_end_of_stream(Stream).

read_file(Stream,[X|L]) :-
    \+ at_end_of_stream(Stream),
    read(Stream,X),
    read_file(Stream,L).
