:- use_module(library(clpfd)).

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
mapAtomList([], Vs, Vs, Map1Out, Map1In, Map2Out, Map2In, Map1Out, Map2Out).

%	Vs ins 1..10,
%	all_different(Vs),
%	sum(Vs, #=, S),
%	sum(Vs, #=, S),
%	label(Vs).
%	writeln(Vs),
%	!.

mapAtomList(Al,Vs,Map1,Map2,Map1out, Map2out):-
	N = 0,
	mapAtomList(Al,TempVs,Vs, TempMap1, Map1, TempMap2, Map2, N, Map1out, Map2out).

mapAtomList(List, TempVs, Vs, TempMap1, Map1, TempMap2, Map2, N, Map1out, Map2out):-
	(   N = 0 ->
	addToListIfInstantiated(Map1, TempMap1, TM1),
	addToListIfInstantiated(Map2, TempMap2, TM2),
	mapAtomList(List, TempVs, Vs, TM1, Map1, TM2, Map2, Map1out, Map2out);
	true ).


mapAtomList([AtomsH|AtomsT], TempVs, Vs, TempMap1, Map1, TempMap2, Map2, Map1out, Map2out):-

	atomToVariableMapper(AtomsH, R, Map1, Map2),
	(isAddingElementUnique([AtomsH], TempMap1)->
	addToList([AtomsH], TempMap1, TMP1),
	addToList(R, TempMap2, TMP2);
	addToList(TempMap1, TMP1),
	addToList(TempMap2, TMP2)),

	%list_to_set(BufTMP1, TMP1),


	addToList(R,NL),
	addToList(TempVs,NL,VSNL),
	mapAtomList(AtomsT, VSNL, Vs, TMP1, Map1, TMP2, Map2, Map1out, Map2out).

findAdjacentEdgesForVertexIncludingVertex(V, R):-
	findall(X, (edge(V,Y,X) ; edge(Y,V,X)), Z),
	append([V], Z, R).

edge(j,a,i).
edge(h,a,g).
edge(a,c,b).
edge(c,e,d).
edge(e,a,f).

findEdgesTest(F,Z):-
	findAdjacentEdgesForVertexIncludingVertex(F,Z),
	writeln(Z),
	len(Z,N),
	writeln("Length: "),
	writeln(N),
	mapAtomList(Z, Vs, Map1, Map2, Map1out, Map2out),
	writeln(Map1out),
	writeln(Map2out),
	writeln(Vs),
	!.


findEdges_TestThatFails(Z):-
       findAdjacentEdgesForVertexIncludingVertex(a,A),
       findAdjacentEdgesForVertexIncludingVertex(c,C),
       findAdjacentEdgesForVertexIncludingVertex(e,E),
       findAdjacentEdgesForVertexIncludingVertex(h,H),
       findAdjacentEdgesForVertexIncludingVertex(j,J),
       mapAtomList(A, Vs1, Map1in, Map2in, Map1out, Map2out),
       writeln(A),
       writeln(Vs1),
       mapAtomList(C, Vs2, Map1out, Map2out, Map3out, Map4out),
       writeln(C),
       writeln(Vs2),
       mapAtomList(E, Vs3, Map3out, Map4out, Map5out, Map6out),
       writeln(E),
       writeln(Vs3),
       mapAtomList(H, Vs4, Map5out, Map6out, Map7out, Map8out),
       writeln(H),
       writeln(Vs4),
       mapAtomList(J, Vs5, Map7out, Map8out, Map9out, Map10out), !,
       writeln(J),
       writeln(Vs5),
       writeln(Map10out),
       writeln(Map9out),
       len(Map10out,N),
       Map10out ins 1..N,
       all_different(Map10out),
       sum(Vs1, #=, S),
       sum(Vs2, #=, S),
       sum(Vs3, #=, S),
       sum(Vs4, #=, S),
       sum(Vs5, #=, S),
       label(Map10out),
       writeln(Map10out),
       !.


edge(z,y,x).
edge(y,w,q).
edge(w,z,r).

findEdges_TestThatPass(Z):-
       findAdjacentEdgesForVertexIncludingVertex(z,A),
       findAdjacentEdgesForVertexIncludingVertex(y,E),
       findAdjacentEdgesForVertexIncludingVertex(w,C),
       mapAtomList(A, Vs1, Map1in, Map2in, Map1out, Map2out),
       writeln(A),
       writeln(Vs1),
       mapAtomList(E, Vs2, Map1out, Map2out, Map3out, Map4out),
       writeln(E),
       writeln(Vs2),
       mapAtomList(C, Vs3, Map3out, Map4out, Map5out, Map6out),
       writeln(C),
       writeln(Vs3),
       writeln(Map6out),
       writeln(Map5out),
       len(Map6out,N),
       Map6out ins 1..N,
       all_different(Map6out),
       sum(Vs1, #=, S),
       sum(Vs2, #=, S),
       sum(Vs3, #=, S),
       label(Map6out),
       writeln(Map6out),
       writeln(S),
       !.

