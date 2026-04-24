-- ============================================================
-- STLMS Seed Data
-- 3 intersections, 6 traffic lights, 10 historical transitions
-- ============================================================

-- Intersections
INSERT INTO intersections (id, name, location, district) VALUES
(1, 'Cruce Central', 'Av. Reforma y Paseo de la Reforma', 'Centro Histórico'),
(2, 'Glorieta Norte', 'Blvd. Norte y Calle 5 de Mayo', 'Zona Norte'),
(3, 'Esquina Sur', 'Av. Insurgentes y Calle Morelos', 'Zona Sur');

-- Traffic Lights (2 per intersection, different states)
INSERT INTO traffic_lights (id, name, street_address, current_state, previous_state, intersection_id) VALUES
(1, 'Semáforo A1', 'Av. Reforma #100', 'RED',            'GREEN',         1),
(2, 'Semáforo A2', 'Paseo de la Reforma #200', 'GREEN',  'YELLOW',        1),
(3, 'Semáforo B1', 'Blvd. Norte #50',  'YELLOW',         'GREEN',         2),
(4, 'Semáforo B2', 'Calle 5 de Mayo #10', 'FLASHING_YELLOW', 'RED',       2),
(5, 'Semáforo C1', 'Av. Insurgentes #300', 'EMERGENCY',  'RED',           3),
(6, 'Semáforo C2', 'Calle Morelos #75', 'OUT_OF_SERVICE', 'GREEN',        3);

-- Historical state transitions (10 records for demo)
INSERT INTO state_transitions (id, traffic_light_id, traffic_light_name, from_state, to_state, transition_time, reason, triggered_by) VALUES
(1,  1, 'Semáforo A1', 'GREEN',         'YELLOW',        DATEADD('HOUR', -2, NOW()), 'Normal cycle: GREEN → YELLOW',       'SYSTEM'),
(2,  1, 'Semáforo A1', 'YELLOW',        'RED',           DATEADD('HOUR', -2, NOW()), 'Normal cycle: YELLOW → RED',         'SYSTEM'),
(3,  2, 'Semáforo A2', 'RED',           'GREEN',         DATEADD('HOUR', -1, NOW()), 'Normal cycle: RED → GREEN',          'SYSTEM'),
(4,  3, 'Semáforo B1', 'RED',           'GREEN',         DATEADD('MINUTE', -90, NOW()), 'Normal cycle: RED → GREEN',       'SYSTEM'),
(5,  3, 'Semáforo B1', 'GREEN',         'YELLOW',        DATEADD('MINUTE', -45, NOW()), 'Normal cycle: GREEN → YELLOW',    'SYSTEM'),
(6,  4, 'Semáforo B2', 'RED',           'FLASHING_YELLOW', DATEADD('MINUTE', -30, NOW()), 'Modo nocturno activado',        'OPERATOR'),
(7,  5, 'Semáforo C1', 'GREEN',         'EMERGENCY',     DATEADD('MINUTE', -20, NOW()), 'Vehículo de emergencia detectado', 'EMERGENCY_SYSTEM'),
(8,  6, 'Semáforo C2', 'GREEN',         'OUT_OF_SERVICE', DATEADD('MINUTE', -15, NOW()), 'Mantenimiento programado',       'OPERATOR'),
(9,  1, 'Semáforo A1', 'GREEN',         'RED',           DATEADD('MINUTE', -10, NOW()), 'Normal cycle: GREEN → RED',       'SYSTEM'),
(10, 2, 'Semáforo A2', 'YELLOW',        'GREEN',         DATEADD('MINUTE', -5, NOW()),  'Normal cycle: YELLOW → GREEN',    'SYSTEM');
