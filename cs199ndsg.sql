--
-- PostgreSQL database dump
--

-- Dumped from database version 11.12
-- Dumped by pg_dump version 11.12



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
-- Name: batches; Type: TABLE; Schema: public; Owner: cs199ndsg
--

CREATE TABLE public.batches (
    batch integer,
    route character varying,
    retired integer DEFAULT 0
);


ALTER TABLE public.batches OWNER TO cs199ndsg;


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
    "time" timestamp without time zone,
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
    stops."time",
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
        CASE
            WHEN (a.temp_number IS NULL) THEN (0)::numeric
            ELSE (a.temp_number)::numeric
        END AS temp_number
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
    resulting numeric,
    batch integer
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

--
-- PostgreSQL database dump complete
--

