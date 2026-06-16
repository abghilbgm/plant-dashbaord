CREATE TABLE dashboards (
  id INTEGER PRIMARY KEY,
  name TEXT,
  machine_id INTEGER
);

CREATE TABLE parameters (
  id INTEGER PRIMARY KEY,
  dashboard_name TEXT,
  parameter_id INTEGER,
  display_name TEXT,
  unit TEXT,
  display_order INTEGER
);

INSERT INTO dashboards VALUES (1,'efficiency',18);

INSERT INTO parameters VALUES
(1,'efficiency',1448,'BX Factor','T/T',1),
(2,'efficiency',1449,'Steam','T/T',2),
(3,'efficiency',1450,'Hydrate Power','kWh/T',3);