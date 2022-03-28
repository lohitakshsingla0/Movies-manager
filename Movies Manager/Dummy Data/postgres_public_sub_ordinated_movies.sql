INSERT INTO public.sub_ordinated_movies (parent_movie, child_movie) VALUES (Row('Julia',1997)::unique_movies, Row('Kal ho na ho 2',2001)::unique_movies);
INSERT INTO public.sub_ordinated_movies (parent_movie, child_movie) VALUES (Row('Julia',1997)::unique_movies, Row('Julia 2',1997));
INSERT INTO public.sub_ordinated_movies (parent_movie, child_movie) VALUES (Row('Harry potter ',2000)::unique_movies, Row('Harry potter 2 ',2001)::unique_movies);
INSERT INTO public.sub_ordinated_movies (parent_movie, child_movie) VALUES (Row('Harry potter ',2000)::unique_movies, Row('Harry potter 3',2005)::unique_movies);
INSERT INTO public.sub_ordinated_movies (parent_movie, child_movie) VALUES (Row('Harry potter ',2000)::unique_movies, Row('Harry potter 4 ',2007)::unique_movies);
