PGDMP         
                z           pannon_livemap    14.2    14.2 $               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16474    pannon_livemap    DATABASE     n   CREATE DATABASE pannon_livemap WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Hungarian_Hungary.1250';
    DROP DATABASE pannon_livemap;
                postgres    false            �            1259    16645    conn_tag_sensor    TABLE     �   CREATE TABLE public.conn_tag_sensor (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "Sensor" character varying NOT NULL
);
 #   DROP TABLE public.conn_tag_sensor;
       public         heap    postgres    false            �            1259    16658    conn_tag_sensor_ID_seq    SEQUENCE     �   ALTER TABLE public.conn_tag_sensor ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."conn_tag_sensor_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    216            �            1259    16483    data    TABLE     ;  CREATE TABLE public.data (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "Vib" double precision NOT NULL,
    "Temp" double precision NOT NULL,
    "Steam" double precision NOT NULL,
    "Noise" double precision NOT NULL,
    "Time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.data;
       public         heap    postgres    false            �            1259    16488    data_ID_seq    SEQUENCE     �   ALTER TABLE public.data ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."data_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    211            �            1259    16495    machines    TABLE     T  CREATE TABLE public.machines (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "Cycle_time" double precision NOT NULL,
    "Produced" integer NOT NULL,
    "Act_product" integer NOT NULL,
    "Status" integer NOT NULL,
    "Andon" integer NOT NULL,
    "Time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.machines;
       public         heap    postgres    false            �            1259    16500    machines_ID_seq    SEQUENCE     �   ALTER TABLE public.machines ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."machines_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    213            �            1259    16475    position    TABLE       CREATE TABLE public."position" (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "Pos_x" double precision NOT NULL,
    "Pos_y" double precision NOT NULL,
    "Pos_z" double precision NOT NULL,
    "Time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public."position";
       public         heap    postgres    false            �            1259    16482    position_ID_seq    SEQUENCE     �   ALTER TABLE public."position" ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."position_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    209            �            1259    16517    tag    TABLE     Y   CREATE TABLE public.tag (
    "Tag_ID" integer NOT NULL,
    "Name" character varying
);
    DROP TABLE public.tag;
       public         heap    postgres    false                      0    16645    conn_tag_sensor 
   TABLE DATA           C   COPY public.conn_tag_sensor ("ID", "Tag_ID", "Sensor") FROM stdin;
    public          postgres    false    216   �(                 0    16483    data 
   TABLE DATA           W   COPY public.data ("ID", "Tag_ID", "Vib", "Temp", "Steam", "Noise", "Time") FROM stdin;
    public          postgres    false    211   5)                 0    16495    machines 
   TABLE DATA           v   COPY public.machines ("ID", "Tag_ID", "Cycle_time", "Produced", "Act_product", "Status", "Andon", "Time") FROM stdin;
    public          postgres    false    213   �)                 0    16475    position 
   TABLE DATA           W   COPY public."position" ("ID", "Tag_ID", "Pos_x", "Pos_y", "Pos_z", "Time") FROM stdin;
    public          postgres    false    209   ]*                 0    16517    tag 
   TABLE DATA           /   COPY public.tag ("Tag_ID", "Name") FROM stdin;
    public          postgres    false    215   �*                  0    0    conn_tag_sensor_ID_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."conn_tag_sensor_ID_seq"', 8, true);
          public          postgres    false    217                        0    0    data_ID_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."data_ID_seq"', 9, true);
          public          postgres    false    212            !           0    0    machines_ID_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."machines_ID_seq"', 13, true);
          public          postgres    false    214            "           0    0    position_ID_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."position_ID_seq"', 20, true);
          public          postgres    false    210                       2606    16651 $   conn_tag_sensor conn_tag_sensor_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.conn_tag_sensor
    ADD CONSTRAINT conn_tag_sensor_pkey PRIMARY KEY ("ID");
 N   ALTER TABLE ONLY public.conn_tag_sensor DROP CONSTRAINT conn_tag_sensor_pkey;
       public            postgres    false    216            v           2606    16487    data data_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.data
    ADD CONSTRAINT data_pkey PRIMARY KEY ("ID");
 8   ALTER TABLE ONLY public.data DROP CONSTRAINT data_pkey;
       public            postgres    false    211            {           2606    16499    machines machines_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_pkey PRIMARY KEY ("ID");
 @   ALTER TABLE ONLY public.machines DROP CONSTRAINT machines_pkey;
       public            postgres    false    213            t           2606    16479    position position_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."position"
    ADD CONSTRAINT position_pkey PRIMARY KEY ("ID");
 B   ALTER TABLE ONLY public."position" DROP CONSTRAINT position_pkey;
       public            postgres    false    209            }           2606    16530    tag tag_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY ("Tag_ID");
 6   ALTER TABLE ONLY public.tag DROP CONSTRAINT tag_pkey;
       public            postgres    false    215            w           1259    16528    fki_data_fkey    INDEX     B   CREATE INDEX fki_data_fkey ON public.data USING btree ("Tag_ID");
 !   DROP INDEX public.fki_data_fkey;
       public            postgres    false    211            y           1259    16541    fki_machines_fkey    INDEX     J   CREATE INDEX fki_machines_fkey ON public.machines USING btree ("Tag_ID");
 %   DROP INDEX public.fki_machines_fkey;
       public            postgres    false    213            r           1259    16547    fki_position_fkey    INDEX     L   CREATE INDEX fki_position_fkey ON public."position" USING btree ("Tag_ID");
 %   DROP INDEX public.fki_position_fkey;
       public            postgres    false    209            �           1259    16657    fki_tag_id_fkey    INDEX     O   CREATE INDEX fki_tag_id_fkey ON public.conn_tag_sensor USING btree ("Tag_ID");
 #   DROP INDEX public.fki_tag_id_fkey;
       public            postgres    false    216            x           1259    16494    fki_tag_id_foreign    INDEX     G   CREATE INDEX fki_tag_id_foreign ON public.data USING btree ("Tag_ID");
 &   DROP INDEX public.fki_tag_id_foreign;
       public            postgres    false    211            �           2606    16531    data data_fkey    FK CONSTRAINT     |   ALTER TABLE ONLY public.data
    ADD CONSTRAINT data_fkey FOREIGN KEY ("Tag_ID") REFERENCES public.tag("Tag_ID") NOT VALID;
 8   ALTER TABLE ONLY public.data DROP CONSTRAINT data_fkey;
       public          postgres    false    3197    211    215            �           2606    16536    machines machines_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_fkey FOREIGN KEY ("Tag_ID") REFERENCES public.tag("Tag_ID") NOT VALID;
 @   ALTER TABLE ONLY public.machines DROP CONSTRAINT machines_fkey;
       public          postgres    false    3197    215    213            �           2606    16542    position position_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."position"
    ADD CONSTRAINT position_fkey FOREIGN KEY ("Tag_ID") REFERENCES public.tag("Tag_ID") NOT VALID;
 B   ALTER TABLE ONLY public."position" DROP CONSTRAINT position_fkey;
       public          postgres    false    209    3197    215            �           2606    16652    conn_tag_sensor tag_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.conn_tag_sensor
    ADD CONSTRAINT tag_id_fkey FOREIGN KEY ("Tag_ID") REFERENCES public.tag("Tag_ID") NOT VALID;
 E   ALTER TABLE ONLY public.conn_tag_sensor DROP CONSTRAINT tag_id_fkey;
       public          postgres    false    215    216    3197               4   x�3�4�N�+�/2�2����L�lc.3N#(ۄ��6��4��͸b���� <�         ~   x�u��� D��RE�F+@�kI�ud��r����/���c�����Ά��-�l�����[�	��BK�N���bC�f��A��=uj��^�m�o�I0ޯiV��H)����䯵�~�6�         �   x�����0�3T�ly��Ƶ��:�d%v�(� �'�@V;�4g'i"�iA?0��jVCc��xҸ���-1rs�g{�y�}� }�"���I컾ҋ��ܗYm.�wʹ�G��Q��P�+���k�w�C���� �C�         �   x����!�&�M 䶹fb����f��H$��] 01���YV�����VMu�J�3����=��`�C<����|�|�k���W�퀕�mA;{E��#ԭ$��%�&����:iX��*ٛ�؃�[�pⳘT��=%���c         "   x�3�t�H�-�I50�2������lc�=... ��     