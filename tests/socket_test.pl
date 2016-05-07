:- use_module(library(socket)).
:- use_module(library(streampool)).

server(PortNumber) :-
	setup_call_cleanup(tcp_socket(S),
			   (true; fail),
			   tcp_close_socket(S)),

	tcp_bind(S, PortNumber),
	tcp_listen(S, 5),
	server_loop(S).

server_loop(S) :-
	tcp_accept(S, S1, From),
	format('receiving traffic from: ~q~n', [From]),
	tcp_open_socket(S1, In, Out),
	format('Socket opened: ~q~n', [From]),
	write(Out,'Hello\n'),
	server_operation(In, Out),
	format('Server operation finished: ~q~n', [From]),
	server_loop(S).

	
server_operation(In, Out) :-
	format('Server operation: ~q~n', [In]),
	\+at_end_of_stream(In),
	read_pending_input(In, Codes, []),
	flush_output(Out),
	server_operation(In, Out).

server_operation(_In, _Out).



