-- Drop existing tables
DROP TABLE IF EXISTS dashboards;
DROP TABLE IF EXISTS parameters;

-- Dashboards Configuration
CREATE TABLE dashboards (
  id INTEGER PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  machine_id INTEGER,
  description TEXT
);

-- Parameters
CREATE TABLE parameters (
  id INTEGER PRIMARY KEY,
  dashboard_name TEXT,
  parameter_id INTEGER,
  display_name TEXT,
  unit TEXT,
  display_order INTEGER,
  category TEXT
);

-- Insert 15 Dashboards
INSERT INTO dashboards (id, name, machine_id, description) VALUES
(1, 'efficiency', 18, 'Key Efficiencies & Hydrate Quality'),
(2, 'digestion', 18, 'Digestion Reactor Operations'),
(3, 'clarification', 18, 'Mud Clarification & Decantation'),
(4, 'precipitation', 18, 'Precipitation Tank & Seeding Train'),
(5, 'calcination', 18, 'Fluidized Bed Alumina Calciner'),
(6, 'bauxite_quality', 18, 'Bauxite Raw Material Quality'),
(7, 'liquor_flow', 18, 'Mixed Liquor Circulation flows'),
(8, 'steam_power', 18, 'Steam Generation & Cogen Power House'),
(9, 'water_condensate', 18, 'Water Intake, Recirculation & Recovery'),
(10, 'caustic_makeup', 18, 'Caustic Storage & Soda Loss Makeup'),
(11, 'red_mud', 18, 'Red Mud Slurry Settler Washers'),
(12, 'dispatch', 18, 'Alumina Dispatch & Evacuation Silos'),
(13, 'shift_kpis', 18, 'Shift-wise Operating Target Summary'),
(14, 'vibration_monitoring', 18, 'Critical Equipment Vibration Analytics'),
(15, 'environmental', 18, 'Carbon Emissions & Heat Sustainability');

-- Insert Parameters for Dashboard 1 (efficiency) - MATCHES PFA IMAGE
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('efficiency', 1441, 'PSD +100', '%', 1, 'Feed Hydrate Quality'),
('efficiency', 1442, 'PSD +200', '%', 2, 'Feed Hydrate Quality'),
('efficiency', 1448, 'PSD +325', '%', 3, 'Feed Hydrate Quality'),
('efficiency', 1449, 'SODA', '%', 4, 'Feed Hydrate Quality'),
('efficiency', 1443, 'PSD D50', 'micron', 5, 'Feed Hydrate Quality'),

('efficiency', 1444, 'Hydrate Production', 'T', 1, 'Hydrate and Evacuation - Production (T)'),
('efficiency', 1445, 'Evacuation', 'T', 2, 'Hydrate and Evacuation - Production (T)'),

('efficiency', 1446, 'Bx Factor', 'T/T', 1, 'Key Efficiencies'),
('efficiency', 1447, 'Total Steam', 'T/T', 2, 'Key Efficiencies'),
('efficiency', 1450, 'Hydrate Power', 'kWh/T', 3, 'Key Efficiencies'),
('efficiency', 1451, 'Caustic Soda Loss with Residue', 'kg/T', 4, 'Key Efficiencies'),
('efficiency', 1452, 'Last Wash Soda', 'gpl', 5, 'Key Efficiencies'),

('efficiency', 1453, 'THA', '%', 1, 'Bauxite Quality'),
('efficiency', 1454, 'K Silica', '%', 2, 'Bauxite Quality'),
('efficiency', 1455, 'Slurry Density', 'gm/cc', 3, 'Bauxite Quality'),
('efficiency', 1456, 'Slurry Charge', 'm3/h', 4, 'Bauxite Quality'),

('efficiency', 1457, 'Total Mixed Liq Flow', 'm3/h', 1, 'Mixed Liquor Flow'),
('efficiency', 1458, 'PGL Flow', 'm3/h', 2, 'Mixed Liquor Flow');

-- Insert Parameters for Dashboard 2 (digestion)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('digestion', 1501, 'Autoclave 1 Temp', '°C', 1, 'Temperature Profile'),
('digestion', 1502, 'Autoclave 2 Temp', '°C', 2, 'Temperature Profile'),
('digestion', 1503, 'Autoclave 3 Temp', '°C', 3, 'Temperature Profile'),
('digestion', 1504, 'Reactor 1 Pressure', 'MPa', 1, 'Pressure & Density'),
('digestion', 1505, 'Digestion Feed Density', 'g/L', 2, 'Pressure & Density'),
('digestion', 1506, 'Caustic Strength', 'g/L', 3, 'Pressure & Density'),
('digestion', 1507, 'Steam Supply Flow', 't/h', 1, 'Steam & Heat Recovery'),
('digestion', 1508, 'Flash Steam Recovery', 't/h', 2, 'Steam & Heat Recovery');

-- Insert Parameters for Dashboard 3 (clarification)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('clarification', 1511, 'Thickener Slurry Feed', 'm3/h', 1, 'Flow Rates'),
('clarification', 1512, 'Overflow Clear Liquor', 'm3/h', 2, 'Flow Rates'),
('clarification', 1513, 'Underflow Mud Flow', 'm3/h', 3, 'Flow Rates'),
('clarification', 1514, 'Flocculant Feed Rate', 'kg/h', 1, 'Chemical Dosing'),
('clarification', 1515, 'Dilution Wash Water', 'L/s', 2, 'Chemical Dosing'),
('clarification', 1516, 'Mud Bed Level Height', 'm', 1, 'Settler Bed Telemetry'),
('clarification', 1517, 'Rake Drive Torque', '%', 2, 'Settler Bed Telemetry'),
('clarification', 1518, 'Overflow Turbidity', 'NTU', 3, 'Settler Bed Telemetry');

-- Insert Parameters for Dashboard 4 (precipitation)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('precipitation', 1521, 'Precipitator Tank A Temp', '°C', 1, 'Temperature Train'),
('precipitation', 1522, 'Precipitator Tank B Temp', '°C', 2, 'Temperature Train'),
('precipitation', 1523, 'Precipitator Tank C Temp', '°C', 3, 'Temperature Train'),
('precipitation', 1524, 'Active Seeding Charge', 'kg/m3', 1, 'Seeding & Yield'),
('precipitation', 1525, 'Crystallization Yield', '%', 2, 'Seeding & Yield'),
('precipitation', 1526, 'Hydrate Mean Size (D50)', 'µm', 1, 'Hydrate Quality'),
('precipitation', 1527, 'Hydrate Fines Fraction', '%', 2, 'Hydrate Quality');

-- Insert Parameters for Dashboard 5 (calcination)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('calcination', 1531, 'Furnace Chamber Temp', '°C', 1, 'Burner Thermodynamics'),
('calcination', 1532, 'Burner Fuel Gas Flow', 'Nm3/h', 2, 'Burner Thermodynamics'),
('calcination', 1533, 'Primary Combustion Air', 'm3/h', 3, 'Burner Thermodynamics'),
('calcination', 1534, 'Preheater Cyclone Temp', '°C', 1, 'Product & Gas Cooling'),
('calcination', 1535, 'Alumina Cooler Exit Temp', '°C', 2, 'Product & Gas Cooling'),
('calcination', 1536, 'Loss on Ignition (LOI)', '%', 1, 'Quality Analytics'),
('calcination', 1537, 'Specific Gas Consumed', 'Nm3/t', 2, 'Quality Analytics'),
('calcination', 1538, 'Electrostatic Precip (ESP)', 'kV', 3, 'Quality Analytics');

-- Insert Parameters for Dashboard 6 (bauxite_quality)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('bauxite_quality', 1541, 'Trihydrate Alumina (THA)', '%', 1, 'Bauxite Composition'),
('bauxite_quality', 1542, 'Reactive Silica', '%', 2, 'Bauxite Composition'),
('bauxite_quality', 1543, 'Total Available Alumina', '%', 3, 'Bauxite Composition'),
('bauxite_quality', 1544, 'Slurry Density', 'gm/cc', 1, 'Feed Preparation'),
('bauxite_quality', 1545, 'Grinding Mill RPM', 'rpm', 2, 'Feed Preparation'),
('bauxite_quality', 1546, 'Bauxite Slurry Charge', 'm3/h', 3, 'Feed Preparation');

-- Insert Parameters for Dashboard 7 (liquor_flow)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('liquor_flow', 1551, 'Total Mixed Liq Flow', 'm3/h', 1, 'Liquor Balance'),
('liquor_flow', 1552, 'Pregnanat Liquor (PGL)', 'm3/h', 2, 'Liquor Balance'),
('liquor_flow', 1553, 'Spent Liquor (SPL)', 'm3/h', 3, 'Liquor Balance'),
('liquor_flow', 1554, 'Caustic Soda Flow', 'm3/h', 4, 'Liquor Balance'),
('liquor_flow', 1555, 'Liquor Charge Density', 'gm/cc', 1, 'Chemical Analytics');

-- Insert Parameters for Dashboard 8 (steam_power)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('steam_power', 1561, 'HP Steam Flow', 't/h', 1, 'Steam House'),
('steam_power', 1562, 'MP Steam Flow', 't/h', 2, 'Steam House'),
('steam_power', 1563, 'LP Steam Flow', 't/h', 3, 'Steam House'),
('steam_power', 1564, 'Cogen Turbine Generator', 'MW', 1, 'Electricity Cogeneration'),
('steam_power', 1565, 'Grid Power Export', 'MW', 2, 'Electricity Cogeneration'),
('steam_power', 1566, 'Boiler Thermal Efficiency', '%', 3, 'Electricity Cogeneration');

-- Insert Parameters for Dashboard 9 (water_condensate)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('water_condensate', 1571, 'Raw Water Intake', 'm3/h', 1, 'Water Balance'),
('water_condensate', 1572, 'Process Water Flow', 'm3/h', 2, 'Water Balance'),
('water_condensate', 1573, 'Condensate Return Flow', 'm3/h', 1, 'Condensate Loop'),
('water_condensate', 1574, 'Condensate Recovery Ratio', '%', 2, 'Condensate Loop');

-- Insert Parameters for Dashboard 10 (caustic_makeup)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('caustic_makeup', 1581, 'Caustic Soda Makeup', 't/d', 1, 'Chemical Inventory'),
('caustic_makeup', 1582, 'Caustic Tank Level', 'm', 2, 'Chemical Inventory'),
('caustic_makeup', 1583, 'Caustic Losses with Residue', 'kg/t', 1, 'Residue Loss Control'),
('caustic_makeup', 1584, 'Last Wash Soda Loss', 'gpl', 2, 'Residue Loss Control');

-- Insert Parameters for Dashboard 11 (red_mud)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('red_mud', 1591, 'Red Mud Slurry Flow', 'm3/h', 1, 'Mud Wash Train'),
('red_mud', 1592, 'Wash Decanter 1 Underflow', 'g/L', 2, 'Mud Wash Train'),
('red_mud', 1593, 'Wash Decanter 2 Underflow', 'g/L', 3, 'Mud Wash Train'),
('red_mud', 1594, 'Flocculant Consumption', 'kg/t', 1, 'Mud Wash Train');

-- Insert Parameters for Dashboard 12 (dispatch)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('dispatch', 1601, 'Finished Alumina Silo A', 'T', 1, 'Silo Levels'),
('dispatch', 1602, 'Finished Alumina Silo B', 'T', 2, 'Silo Levels'),
('dispatch', 1603, 'Silo Discharging Flow', 't/h', 1, 'Evacuation Rates'),
('dispatch', 1604, 'Hydrate Dispatch Flow', 't/h', 2, 'Evacuation Rates');

-- Insert Parameters for Dashboard 13 (shift_kpis)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('shift_kpis', 1611, 'Shift Product Output Target', 'T', 1, 'Operational Targets'),
('shift_kpis', 1612, 'Shift Steam Consumption Limit', 't/h', 2, 'Operational Targets'),
('shift_kpis', 1613, 'Shift Target Health Score', '%', 3, 'Operational Targets');

-- Insert Parameters for Dashboard 14 (vibration_monitoring)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('vibration_monitoring', 1621, 'Digestion Slurry Pump 1 Vibration', 'mm/s', 1, 'Vibration Readings'),
('vibration_monitoring', 1622, 'Calciner Exhaust Fan Bearing', 'mm/s', 2, 'Vibration Readings'),
('vibration_monitoring', 1623, 'High Pressure Steam Pump Shaft', 'mm/s', 3, 'Vibration Readings');

-- Insert Parameters for Dashboard 15 (environmental)
INSERT INTO parameters (dashboard_name, parameter_id, display_name, unit, display_order, category) VALUES
('environmental', 1631, 'Flue Gas CO2 Mass Flow', 't/h', 1, 'Carbon & Emissions'),
('environmental', 1632, 'Specific CO2 Intensity', 't/t', 2, 'Carbon & Emissions'),
('environmental', 1633, 'Solar Thermal Steam Collectors', 't/h', 1, 'Green Power Recovery'),
('environmental', 1634, 'Cogeneration Heat Recovered', 'MW', 2, 'Green Power Recovery');