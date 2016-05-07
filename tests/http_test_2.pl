:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_cors)).

:- use_module(library(http/http_json)).

:- http_handler(root(.),handle,[]).


server(Port) :-
   http_server(http_dispatch,[port(Port)]).

handle(Request) :-
   cors_enable,
   format('Access-Control-Allow-Methods: GET, POST, PUT~n'), 
   format(user_output,"I'm heree~n",[]),
   http_read_json(Request, DictIn),
   format(user_output,"Request is: ~p~n",[Request]),
   format(user_output,"DictIn is: ~p~n",[DictIn]),
   DictOut=DictIn,
   reply_json(DictOut).