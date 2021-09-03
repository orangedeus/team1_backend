--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12
-- Dumped by pg_dump version 11.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: bool_xand_finalfunc(boolean); Type: FUNCTION; Schema: public; Owner: cs199ndsg
--

CREATE FUNCTION public.bool_xand_finalfunc(agg_state boolean) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
begin
return agg_state;
end;
$$;


ALTER FUNCTION public.bool_xand_finalfunc(agg_state boolean) OWNER TO cs199ndsg;

--
-- Name: bool_xand_sfunc(boolean, boolean); Type: FUNCTION; Schema: public; Owner: cs199ndsg
--

CREATE FUNCTION public.bool_xand_sfunc(agg_state boolean, current boolean) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
begin
if agg_state is NULL then
return current;

else
return agg_state = current;
end if;
end;
$$;


ALTER FUNCTION public.bool_xand_sfunc(agg_state boolean, current boolean) OWNER TO cs199ndsg;

--
-- Name: hashpoint(point); Type: FUNCTION; Schema: public; Owner: cs199ndsg
--

CREATE FUNCTION public.hashpoint(point) RETURNS integer
    LANGUAGE sql IMMUTABLE
    AS $_$SELECT hashfloat8($1[0]) # hashfloat8($1[1])$_$;


ALTER FUNCTION public.hashpoint(point) OWNER TO cs199ndsg;

--
-- Name: bool_xand(boolean); Type: AGGREGATE; Schema: public; Owner: cs199ndsg
--

CREATE AGGREGATE public.bool_xand(boolean) (
    SFUNC = public.bool_xand_sfunc,
    STYPE = boolean,
    FINALFUNC = public.bool_xand_finalfunc
);


ALTER AGGREGATE public.bool_xand(boolean) OWNER TO cs199ndsg;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.annotations OWNER TO cs199ndsg;

--
-- Name: auto10_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto10_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto10_annotations OWNER TO cs199ndsg;

--
-- Name: auto10_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto10_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto10_routes OWNER TO cs199ndsg;

--
-- Name: auto10_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto10_stops (
    location point,
    people integer,
    url character varying,
    route character varying,
    duration numeric
);


ALTER TABLE public.auto10_stops OWNER TO cs199ndsg;

--
-- Name: auto1_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto1_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto1_annotations OWNER TO cs199ndsg;

--
-- Name: auto1_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto1_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto1_routes OWNER TO cs199ndsg;

--
-- Name: auto1_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto1_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto1_stops OWNER TO cs199ndsg;

--
-- Name: auto2_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto2_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto2_annotations OWNER TO cs199ndsg;

--
-- Name: auto2_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto2_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto2_routes OWNER TO cs199ndsg;

--
-- Name: auto2_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto2_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto2_stops OWNER TO cs199ndsg;

--
-- Name: auto3_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto3_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto3_annotations OWNER TO cs199ndsg;

--
-- Name: auto3_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto3_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto3_routes OWNER TO cs199ndsg;

--
-- Name: auto3_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto3_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto3_stops OWNER TO cs199ndsg;

--
-- Name: auto4_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto4_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto4_annotations OWNER TO cs199ndsg;

--
-- Name: auto4_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto4_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto4_routes OWNER TO cs199ndsg;

--
-- Name: auto4_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto4_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto4_stops OWNER TO cs199ndsg;

--
-- Name: auto5_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto5_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto5_annotations OWNER TO cs199ndsg;

--
-- Name: auto5_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto5_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto5_routes OWNER TO cs199ndsg;

--
-- Name: auto5_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto5_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto5_stops OWNER TO cs199ndsg;

--
-- Name: auto6_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto6_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto6_annotations OWNER TO cs199ndsg;

--
-- Name: auto6_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto6_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto6_routes OWNER TO cs199ndsg;

--
-- Name: auto6_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto6_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto6_stops OWNER TO cs199ndsg;

--
-- Name: auto7_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto7_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto7_annotations OWNER TO cs199ndsg;

--
-- Name: auto7_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto7_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto7_routes OWNER TO cs199ndsg;

--
-- Name: auto7_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto7_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto7_stops OWNER TO cs199ndsg;

--
-- Name: auto8_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto8_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.auto8_annotations OWNER TO cs199ndsg;

--
-- Name: auto8_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto8_routes (
    id integer,
    route character varying
);


ALTER TABLE public.auto8_routes OWNER TO cs199ndsg;

--
-- Name: auto8_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.auto8_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.auto8_stops OWNER TO cs199ndsg;

--
-- Name: backups; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.backups (
    id integer NOT NULL,
    backup character varying
);


ALTER TABLE public.backups OWNER TO cs199ndsg;

--
-- Name: backups_id_seq; Type: SEQUENCE; Schema: public; Owner: cs199ndsg
--

CREATE SEQUENCE public.backups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.backups_id_seq OWNER TO cs199ndsg;

--
-- Name: backups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cs199ndsg
--

ALTER SEQUENCE public.backups_id_seq OWNED BY public.backups.id;


--
-- Name: beta_test_codes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.beta_test_codes (
    code character varying,
    admin boolean,
    accessed timestamp without time zone,
    surveyed boolean
);


ALTER TABLE public.beta_test_codes OWNER TO cs199ndsg;

--
-- Name: beta_test_survey; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.beta_test_survey (
    code character varying,
    name character varying,
    age integer,
    sex character varying,
    education character varying
);


ALTER TABLE public.beta_test_survey OWNER TO cs199ndsg;

--
-- Name: codes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.codes (
    code character varying NOT NULL,
    admin boolean DEFAULT false,
    accessed timestamp without time zone,
    surveyed boolean,
    route character varying(512),
    batch integer,
    threshold integer,
    CONSTRAINT codes_batch_check CHECK ((batch >= 0)),
    CONSTRAINT codes_threshold_check CHECK ((threshold > 0))
);


ALTER TABLE public.codes OWNER TO cs199ndsg;

--
-- Name: stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.stops (
    location point,
    people integer,
    url character varying,
    route character varying,
    duration numeric,
    batch integer,
    source_file character varying(512),
    number_of_annotations integer,
    CONSTRAINT stops_batch_check CHECK ((batch > 0))
);


ALTER TABLE public.stops OWNER TO cs199ndsg;

--
-- Name: complete_stops; Type: VIEW; Schema: public; Owner: cs199ndsg
--

CREATE VIEW public.complete_stops AS
 SELECT stops.location,
    stops.people,
    stops.url,
    stops.duration,
    stops.route,
    stops.batch,
        CASE
            WHEN (a.annotated IS NULL) THEN (0)::numeric
            ELSE a.annotated
        END AS annotated,
        CASE
            WHEN (a.boarding IS NULL) THEN (0)::numeric
            ELSE a.boarding
        END AS boarding,
        CASE
            WHEN (a.alighting IS NULL) THEN (0)::numeric
            ELSE a.alighting
        END AS alighting,
    a.following,
    a.temp_number
   FROM (public.stops
     FULL JOIN ( SELECT annotations.url,
            avg(annotations.annotated) AS annotated,
            avg(annotations.boarding) AS boarding,
            avg(annotations.alighting) AS alighting,
            count(*) AS temp_number,
            bool_and(annotations.following) AS following
           FROM public.annotations
          GROUP BY annotations.url) a ON (((a.url)::text = (stops.url)::text)));


ALTER TABLE public.complete_stops OWNER TO cs199ndsg;

--
-- Name: tracking; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.tracking (
    id integer NOT NULL,
    filename character varying,
    status character varying,
    route character varying,
    splices integer,
    duration numeric,
    resulting numeric
);


ALTER TABLE public.tracking OWNER TO cs199ndsg;

--
-- Name: dashboard; Type: VIEW; Schema: public; Owner: cs199ndsg
--

CREATE VIEW public.dashboard AS
 SELECT a.stops,
    b.codes,
    c.annotations,
    d.uploaded_videos
   FROM (((( SELECT count(stops.*) AS stops
           FROM public.stops) a
     FULL JOIN ( SELECT count(codes.*) AS codes
           FROM public.codes) b ON (true))
     FULL JOIN ( SELECT count(annotations.*) AS annotations
           FROM public.annotations) c ON (true))
     FULL JOIN ( SELECT count(DISTINCT tracking.filename) AS uploaded_videos
           FROM public.tracking
          WHERE ((tracking.status)::text = 'Done!'::text)) d ON (true));


ALTER TABLE public.dashboard OWNER TO cs199ndsg;

--
-- Name: duplicates; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.duplicates (
    main character varying,
    duplicate character varying
);


ALTER TABLE public.duplicates OWNER TO cs199ndsg;

--
-- Name: instrumentation; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.instrumentation (
    code character varying,
    file character varying,
    "time" numeric,
    duration numeric
);


ALTER TABLE public.instrumentation OWNER TO cs199ndsg;

--
-- Name: mcu_divi_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.mcu_divi_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.mcu_divi_annotations OWNER TO cs199ndsg;

--
-- Name: mcu_divi_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.mcu_divi_routes (
    id integer,
    route character varying
);


ALTER TABLE public.mcu_divi_routes OWNER TO cs199ndsg;

--
-- Name: mcu_divi_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.mcu_divi_stops (
    location point,
    people integer,
    url character varying,
    route character varying,
    duration numeric
);


ALTER TABLE public.mcu_divi_stops OWNER TO cs199ndsg;

--
-- Name: monument_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.monument_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.monument_annotations OWNER TO cs199ndsg;

--
-- Name: monument_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.monument_routes (
    id integer,
    route character varying
);


ALTER TABLE public.monument_routes OWNER TO cs199ndsg;

--
-- Name: monument_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.monument_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.monument_stops OWNER TO cs199ndsg;

--
-- Name: new_codes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.new_codes (
    code character varying,
    admin boolean,
    accessed timestamp without time zone,
    surveyed boolean,
    route character varying(100),
    batch integer,
    threshold integer,
    CONSTRAINT batch CHECK ((batch > 0)),
    CONSTRAINT new_codes_threshold_check CHECK ((threshold > 0))
);


ALTER TABLE public.new_codes OWNER TO cs199ndsg;

--
-- Name: new_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.new_stops (
    location point,
    people integer,
    url character varying,
    route character varying,
    duration numeric,
    batch integer,
    number_of_annotations integer,
    source_file character varying(512),
    CONSTRAINT new_stops_batch_check CHECK ((batch > 0))
);


ALTER TABLE public.new_stops OWNER TO cs199ndsg;

--
-- Name: new_test_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.new_test_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.new_test_annotations OWNER TO cs199ndsg;

--
-- Name: new_test_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.new_test_routes (
    id integer,
    route character varying
);


ALTER TABLE public.new_test_routes OWNER TO cs199ndsg;

--
-- Name: new_test_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.new_test_stops (
    location point,
    people integer,
    url character varying,
    route character varying,
    duration numeric
);


ALTER TABLE public.new_test_stops OWNER TO cs199ndsg;

--
-- Name: routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.routes (
    id integer NOT NULL,
    route character varying
);


ALTER TABLE public.routes OWNER TO cs199ndsg;

--
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: cs199ndsg
--

CREATE SEQUENCE public.routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.routes_id_seq OWNER TO cs199ndsg;

--
-- Name: routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cs199ndsg
--

ALTER SEQUENCE public.routes_id_seq OWNED BY public.routes.id;


--
-- Name: survey; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.survey (
    code character varying,
    name character varying,
    age integer,
    sex character varying,
    education character varying
);


ALTER TABLE public.survey OWNER TO cs199ndsg;

--
-- Name: test; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.test (
    message character varying
);


ALTER TABLE public.test OWNER TO cs199ndsg;

--
-- Name: test001_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.test001_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.test001_annotations OWNER TO cs199ndsg;

--
-- Name: test001_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.test001_routes (
    id integer,
    route character varying
);


ALTER TABLE public.test001_routes OWNER TO cs199ndsg;

--
-- Name: test001_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.test001_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.test001_stops OWNER TO cs199ndsg;

--
-- Name: test5_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.test5_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.test5_annotations OWNER TO cs199ndsg;

--
-- Name: test5_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.test5_routes (
    id integer,
    route character varying
);


ALTER TABLE public.test5_routes OWNER TO cs199ndsg;

--
-- Name: test5_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.test5_stops (
    location point,
    people integer,
    url character varying,
    route character varying
);


ALTER TABLE public.test5_stops OWNER TO cs199ndsg;

--
-- Name: testmcu_annotations; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.testmcu_annotations (
    annotated integer,
    boarding integer,
    alighting integer,
    following boolean,
    url character varying,
    code character varying
);


ALTER TABLE public.testmcu_annotations OWNER TO cs199ndsg;

--
-- Name: testmcu_routes; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.testmcu_routes (
    id integer,
    route character varying
);


ALTER TABLE public.testmcu_routes OWNER TO cs199ndsg;

--
-- Name: testmcu_stops; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.testmcu_stops (
    location point,
    people integer,
    url character varying,
    route character varying,
    duration numeric
);


ALTER TABLE public.testmcu_stops OWNER TO cs199ndsg;

--
-- Name: tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: cs199ndsg
--

CREATE SEQUENCE public.tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tracking_id_seq OWNER TO cs199ndsg;

--
-- Name: tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cs199ndsg
--

ALTER SEQUENCE public.tracking_id_seq OWNED BY public.tracking.id;


--
-- Name: valid; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.valid (
    code character varying
);


ALTER TABLE public.valid OWNER TO cs199ndsg;

--
-- Name: variables; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.variables (
    var_name character varying(50) NOT NULL,
    var_value character varying(100)
);


ALTER TABLE public.variables OWNER TO cs199ndsg;

--
-- Name: xand_test; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.xand_test (
    id integer NOT NULL,
    state boolean
);


ALTER TABLE public.xand_test OWNER TO cs199ndsg;

--
-- Name: xand_test_id_seq; Type: SEQUENCE; Schema: public; Owner: cs199ndsg
--

CREATE SEQUENCE public.xand_test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.xand_test_id_seq OWNER TO cs199ndsg;

--
-- Name: xand_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: cs199ndsg
--

ALTER SEQUENCE public.xand_test_id_seq OWNED BY public.xand_test.id;


--
-- Name: backups id; Type: DEFAULT; Schema: public; Owner: cs199ndsg
--

ALTER TABLE ONLY public.backups ALTER COLUMN id SET DEFAULT nextval('public.backups_id_seq'::regclass);


--
-- Name: routes id; Type: DEFAULT; Schema: public; Owner: cs199ndsg
--

ALTER TABLE ONLY public.routes ALTER COLUMN id SET DEFAULT nextval('public.routes_id_seq'::regclass);


--
-- Name: tracking id; Type: DEFAULT; Schema: public; Owner: cs199ndsg
--

ALTER TABLE ONLY public.tracking ALTER COLUMN id SET DEFAULT nextval('public.tracking_id_seq'::regclass);


--
-- Name: xand_test id; Type: DEFAULT; Schema: public; Owner: cs199ndsg
--

ALTER TABLE ONLY public.xand_test ALTER COLUMN id SET DEFAULT nextval('public.xand_test_id_seq'::regclass);


--
-- Name: annotations uniquectm_const; Type: CONSTRAINT; Schema: public; Owner: cs199ndsg
--

ALTER TABLE ONLY public.annotations
    ADD CONSTRAINT uniquectm_const UNIQUE (code, url);


--
-- Name: variables variables_pkey; Type: CONSTRAINT; Schema: public; Owner: cs199ndsg
--

ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_pkey PRIMARY KEY (var_name);


--
-- PostgreSQL database dump complete
--

