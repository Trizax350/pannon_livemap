PGDMP         ,    
            z           pannon_livemap    14.2    14.2 %                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            !           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            "           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            #           1262    16474    pannon_livemap    DATABASE     n   CREATE DATABASE pannon_livemap WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Hungarian_Hungary.1250';
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
            public          postgres    false    213            �            1259    16483    data    TABLE     W  CREATE TABLE public.data (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "Vib" double precision NOT NULL,
    "Temp" double precision NOT NULL,
    "Steam" double precision NOT NULL,
    "Noise" double precision NOT NULL,
    "Time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "HRV" integer NOT NULL
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
            public          postgres    false    209            �            1259    33130    data_archiv    TABLE     ^  CREATE TABLE public.data_archiv (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "Vib" double precision NOT NULL,
    "Temp" double precision NOT NULL,
    "Steam" double precision NOT NULL,
    "Noise" double precision NOT NULL,
    "Time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "HRV" integer NOT NULL
);
    DROP TABLE public.data_archiv;
       public         heap    postgres    false            �            1259    16495    machines    TABLE     m  CREATE TABLE public.machines (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "Cycle_time" double precision NOT NULL,
    "Produced" integer NOT NULL,
    "Act_product" integer NOT NULL,
    "Status" integer NOT NULL,
    "Andon" integer NOT NULL,
    "Time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "Reader_ID" integer
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
            public          postgres    false    211            �            1259    24953    product    TABLE     ~  CREATE TABLE public.product (
    "ID" integer NOT NULL,
    "Tag_ID" integer NOT NULL,
    "RFID_ID" character varying NOT NULL,
    "Product_name" character varying NOT NULL,
    "Product_type" character varying NOT NULL,
    "Delivery_time" timestamp without time zone NOT NULL,
    "Produced_time" timestamp without time zone NOT NULL,
    "Asset" character varying NOT NULL
);
    DROP TABLE public.product;
       public         heap    postgres    false            �            1259    24960    product_ID_seq    SEQUENCE     �   ALTER TABLE public.product ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."product_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    215            �            1259    33136 
   zone_color    TABLE     X  CREATE TABLE public.zone_color (
    "ID" integer NOT NULL,
    "Machine_ID" integer NOT NULL,
    "Zone_ID" integer NOT NULL,
    "Machine_param" character varying NOT NULL,
    "Machine_value" double precision NOT NULL,
    "Type" character varying NOT NULL,
    "Color" character varying NOT NULL,
    "Status" character varying NOT NULL
);
    DROP TABLE public.zone_color;
       public         heap    postgres    false            �            1259    33143    zone_color_ID_seq    SEQUENCE     �   ALTER TABLE public.zone_color ALTER COLUMN "ID" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."zone_color_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218                      0    16645    conn_tag_sensor 
   TABLE DATA           C   COPY public.conn_tag_sensor ("ID", "Tag_ID", "Sensor") FROM stdin;
    public          postgres    false    213   �+                 0    16483    data 
   TABLE DATA           ^   COPY public.data ("ID", "Tag_ID", "Vib", "Temp", "Steam", "Noise", "Time", "HRV") FROM stdin;
    public          postgres    false    209   M,                 0    33130    data_archiv 
   TABLE DATA           e   COPY public.data_archiv ("ID", "Tag_ID", "Vib", "Temp", "Steam", "Noise", "Time", "HRV") FROM stdin;
    public          postgres    false    217   �,                 0    16495    machines 
   TABLE DATA           �   COPY public.machines ("ID", "Tag_ID", "Cycle_time", "Produced", "Act_product", "Status", "Andon", "Time", "Reader_ID") FROM stdin;
    public          postgres    false    211   -                 0    24953    product 
   TABLE DATA           �   COPY public.product ("ID", "Tag_ID", "RFID_ID", "Product_name", "Product_type", "Delivery_time", "Produced_time", "Asset") FROM stdin;
    public          postgres    false    215   .                 0    33136 
   zone_color 
   TABLE DATA           �   COPY public.zone_color ("ID", "Machine_ID", "Zone_ID", "Machine_param", "Machine_value", "Type", "Color", "Status") FROM stdin;
    public          postgres    false    218   �.       $           0    0    conn_tag_sensor_ID_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."conn_tag_sensor_ID_seq"', 11, true);
          public          postgres    false    214            %           0    0    data_ID_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public."data_ID_seq"', 9, true);
          public          postgres    false    210            &           0    0    machines_ID_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."machines_ID_seq"', 17, true);
          public          postgres    false    212            '           0    0    product_ID_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."product_ID_seq"', 6, true);
          public          postgres    false    216            (           0    0    zone_color_ID_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."zone_color_ID_seq"', 3, true);
          public          postgres    false    219                       2606    16651 $   conn_tag_sensor conn_tag_sensor_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.conn_tag_sensor
    ADD CONSTRAINT conn_tag_sensor_pkey PRIMARY KEY ("ID");
 N   ALTER TABLE ONLY public.conn_tag_sensor DROP CONSTRAINT conn_tag_sensor_pkey;
       public            postgres    false    213            �           2606    33135    data_archiv data_archiv_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.data_archiv
    ADD CONSTRAINT data_archiv_pkey PRIMARY KEY ("ID");
 F   ALTER TABLE ONLY public.data_archiv DROP CONSTRAINT data_archiv_pkey;
       public            postgres    false    217            x           2606    16487    data data_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.data
    ADD CONSTRAINT data_pkey PRIMARY KEY ("ID");
 8   ALTER TABLE ONLY public.data DROP CONSTRAINT data_pkey;
       public            postgres    false    209            }           2606    16499    machines machines_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_pkey PRIMARY KEY ("ID");
 @   ALTER TABLE ONLY public.machines DROP CONSTRAINT machines_pkey;
       public            postgres    false    211            �           2606    24959    product product_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY ("ID");
 >   ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;
       public            postgres    false    215            �           2606    33142    zone_color zone_color_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.zone_color
    ADD CONSTRAINT zone_color_pkey PRIMARY KEY ("ID");
 D   ALTER TABLE ONLY public.zone_color DROP CONSTRAINT zone_color_pkey;
       public            postgres    false    218            y           1259    16528    fki_data_fkey    INDEX     B   CREATE INDEX fki_data_fkey ON public.data USING btree ("Tag_ID");
 !   DROP INDEX public.fki_data_fkey;
       public            postgres    false    209            {           1259    16541    fki_machines_fkey    INDEX     J   CREATE INDEX fki_machines_fkey ON public.machines USING btree ("Tag_ID");
 %   DROP INDEX public.fki_machines_fkey;
       public            postgres    false    211            �           1259    24966    fki_product_tag_id_fkey    INDEX     O   CREATE INDEX fki_product_tag_id_fkey ON public.product USING btree ("Tag_ID");
 +   DROP INDEX public.fki_product_tag_id_fkey;
       public            postgres    false    215            �           1259    16657    fki_tag_id_fkey    INDEX     O   CREATE INDEX fki_tag_id_fkey ON public.conn_tag_sensor USING btree ("Tag_ID");
 #   DROP INDEX public.fki_tag_id_fkey;
       public            postgres    false    213            z           1259    16494    fki_tag_id_foreign    INDEX     G   CREATE INDEX fki_tag_id_foreign ON public.data USING btree ("Tag_ID");
 &   DROP INDEX public.fki_tag_id_foreign;
       public            postgres    false    209               A   x�3�4660�N�+�/2�2E�s�q�Z��@�&\��\S.NsC(׌�$k
�r��qqq m,�         �   x�u��!���"c��jI�uD9�'3�bm��	&����eyy��[�y���B��wDM��o�.h��y7��D�G���䁶W�� �*^��kl�_X9�d�쁮�� S��G����)���%��]�j7�^yJ�����?�            x������ � �         �   x����mC1�Tn���%��ʎ#6�ﲳ�B�̴���$d$,r�"/�6�&3*\@E�&��� �	߬�S���EV��{F�����7b�����p��#��'�hv��&d�����呑M���J�gX�B(�ŏ��n��U'�נ|����\���c�}��_�'��-������y��'��t�+�;������">����NՔj���5���1]         �   x�]��
1E뙯��ܙ$&���LX��F��b�ߛ]�%�0ܣ��A@e���r�'��A0b; ��s��E���ƹZ�j��~������~TR u�;�I���N|B�����5Y[�Iai�C��c��jL��㊙?�2E         j   x�E��
E@������Gd+Iwg!+%qb�we��[��_� ��kT����E�9z��D^4߶41H��o�1r�D(�cP���0{��P�b_��ǋ�����c��^�$�     