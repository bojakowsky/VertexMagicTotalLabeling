:- use_module(library(clpfd)).
edge(j,a,i).
edge(h,a,g).
edge(a,c,b).
edge(c,e,d).
edge(e,a,f).

len([],0).
len([_|T],N)  :-  len(T,X),  N  is  X+1.

atomToVariableMapper(Var,R,Map):-
	atomToVariableMapper(Var,R,Map,Map).
atomToVariableMapper(Var, R, Map, MapBuf) :-
	nth0(Index, MapBuf, Var),
	Index < 1, R = [NewVariable].
atomToVariableMapper(b, R) :- R = [B].
atomToVariableMapper(c, R) :- R = [C].
atomToVariableMapper(d, R) :- R = [D].
atomToVariableMapper(e, R) :- R = [E].
atomToVariableMapper(f, R) :- R = [F].
atomToVariableMapper(g, R) :- R = [G].
atomToVariableMapper(h, R) :- R = [H].
atomToVariableMapper(i, R) :- R = [I].
atomToVariableMapper(j, R) :- R = [J].
atomToVariableMapper(k, R) :- R = [K].
atomToVariableMapper(l, R) :- R = [L].
atomToVariableMapper(m, R) :- R = [M].
atomToVariableMapper(n, R) :- R = [N].
atomToVariableMapper(o, R) :- R = [O].
atomToVariableMapper(p, R) :- R = [P].
atomToVariableMapper(q, R) :- R = [Q].
atomToVariableMapper(r, R) :- R = [R].
atomToVariableMapper(s, R) :- R = [S].
atomToVariableMapper(t, R) :- R = [T].
atomToVariableMapper(u, R) :- R = [U].
atomToVariableMapper(v, R) :- R = [V].
atomToVariableMapper(w, R) :- R = [W].
atomToVariableMapper(x, R) :- R = [X].
atomToVariableMapper(y, R) :- R = [Y].
atomToVariableMapper(z, R) :- R = [Z].

addToList(L,NL):-
	append(L, [], NL).
addToList(L1, L2, NL):-
	append(L1, L2, NL).

mapAtomList([],Vs,Map,Vs,Map).

%	Vs ins 1..10,
%	all_different(Vs),
%	sum(Vs, #=, S),
%	sum(Vs, #=, S),
%	label(Vs).
%	write(Vs),
%	!.

mapAtomList(Al,Vs,Map):- mapAtomList(Al,TempVs,TempMap,Vs,Map).

mapAtomList([AtomsH|AtomsT],TempVs,TempMap,Vs,Map):-
	atomToVariableMapper(AtomsH,R,Map),
	addToList([AtomsH],R, AR),
	addToList(TempMap,AR,MapTAR),
	addToList(R,NL),
	addToList(TempVs,NL,VSNL),
	mapAtomList(AtomsT,VSNL,MapTAR,Vs,Map).

findAdjacentEdgesForVertexIncludingVertex(V, R):-
	findall(X, (edge(V,Y,X) ; edge(Y,V,X)), Z),
	append([V], Z, R).


findEdges(F,Z):-
	findAdjacentEdgesForVertexIncludingVertex(F,Z),
	write(Z),
	len(Z,N),
	write("\n Length: "),
	write(N),
	write("\n"),
	mapAtomList(Z, Vs,Map),
	write(Vs),
	!.

findEdgesTest(Z):-
       findAdjacentEdgesForVertexIncludingVertex(a,A),
       findAdjacentEdgesForVertexIncludingVertex(c,C),
       findAdjacentEdgesForVertexIncludingVertex(e,E),
       findAdjacentEdgesForVertexIncludingVertex(h,H),
       findAdjacentEdgesForVertexIncludingVertex(j,J),
       write(A),
       write(C),
       write(E),
       write(H),
       write(J),
       mapAtomList(A,Vs1,Map),
       mapAtomList(C,Vs2,Map),
       mapAtomList(E,Vs3,Map),
       mapAtomList(H,Vs4,Map),
       mapAtomList(J,Vs5,Map),

       append(Vs1,Vs2, T1),
       append(Vs3, Vs4, T2),
       append(T1, T2, T3),
       append(Vs5, T3, Test),
       len(Test,N),
       Test ins 1..N,
       all_different(Test),
       sum(Vs1, #=, S),
       sum(Vs2, #=, S),
       sum(Vs3, #=, S),
       sum(Vs4, #=, S),
       sum(Vs5, #=, S),
       label(Test),
       write(Test),
       !.

dlugosc(Lst,Dlugosc) :- dlugosc(Lst,0,Dlugosc).
dlugosc([],A,A).
dlugosc([_|T],A,Dlugosc) :-
   A1 is A + 1,
   dlugosc(T,A1,Dlugosc).

test(Lst):-
	dlugosc(Lst,Dlugosc),
	write(Dlugosc).
