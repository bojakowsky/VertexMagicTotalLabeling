:- use_module(library(clpfd)).
edge(j,a,i).
edge(h,a,g).
edge(a,c,b).
edge(c,e,d).
edge(e,a,f).

len([],0).
len([_|T],N)  :-  len(T,X),  N  is  X+1.

atomToVariableMapper(Var, R, Map1, Map2) :-
	nonvar(Map1)->
	assignNewVariableIfNotMember(Var, R, Map1, Map2);
	assignNewVariableIfNotMember(Var, R, [], []).


assignNewVariableIfNotMember(Var, R, Map1, Map2):-
	member(Var,Map1)->
	getAtomMapVariable(Var, Map1, Map2, R);
	R = [NewVariable].

getAtomMapVariable(Var, Map1, Map2, R):-
	nth0(Index, Map1, Var),
	getVariable(Index, Map2, R).

getVariable(Index, Map, Result):-
	N = 0,
	getVariable(Index, Map, Result, N).

getVariable(Index, [H|T], Result, N):-
	Index = N ->
	Result = [H];
	N1 is N+1,
	getVariable(Index, T, Result, N1).



addToList(L,NL):-
	append(L, [], NL).

addToList(L1, L2, NL):-
	append(L1, L2, NL).

isAddingElementUnique([H|_], L2):-
	member(H, L2)->
	false;
	true.

addToListIfInstantiated(L1, L2, NL):-
	nonvar(L1)->
	(   nonvar(L2)->
	    addToList(L2, L1, NL);
	    addToList(L1, NL)
	);
	addToList(L2,NL).

mapAtomList([], Vs, Vs, Map1, Map1, Map2, Map2).
mapAtomList([], Vs, Vs, Map1, Map2, Map3, Map4).

%	Vs ins 1..10,
%	all_different(Vs),
%	sum(Vs, #=, S),
%	sum(Vs, #=, S),
%	label(Vs).
%	write(Vs),
%	!.

mapAtomList(Al,Vs,Map1,Map2):-
	N = 0,
	mapAtomList(Al,TempVs,Vs, TempMap1, Map1, TempMap2, Map2, N).

mapAtomList(List, TempVs, Vs, TempMap1, Map1, TempMap2, Map2, N):-
	(   N = 0 ->
	addToListIfInstantiated(Map1, TempMap1, TM1),
	addToListIfInstantiated(Map2, TempMap2, TM2),
	mapAtomList(List, TempVs, Vs, TM1, Map1, TM2, Map2);
	true ).


mapAtomList([AtomsH|AtomsT], TempVs, Vs, TempMap1, Map1, TempMap2, Map2):-

	atomToVariableMapper(AtomsH, R, Map1, Map2),
	(isAddingElementUnique([AtomsH], TempMap1)->
	addToList([AtomsH], TempMap1, TMP1),
	addToList(R, TempMap2, TMP2);
	addToList(TempMap2, TMP2)),

	%list_to_set(BufTMP1, TMP1),


	addToList(R,NL),
	addToList(TempVs,NL,VSNL),
	mapAtomList(AtomsT, VSNL, Vs, TMP1, Map1, TMP2, Map2).

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
	mapAtomList(Z, Vs, Map1, Map2),
	write(Map1),
	write(Map2),
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
       mapAtomList(A, Vs1, Map1, Map2),
       mapAtomList(C, Vs2, Map1, Map2),
       mapAtomList(E, Vs3, Map1, Map2),
       mapAtomList(H, Vs4, Map1, Map2),
       mapAtomList(J, Vs5, Map1, Map2),

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
