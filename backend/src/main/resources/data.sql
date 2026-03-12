-- Users (3 tuples)
INSERT INTO users (username, password, role) VALUES ('receptionist', 'dental123', 'receptionist');
INSERT INTO users (username, password, role) VALUES ('dentist', 'dental456', 'dentist');
INSERT INTO users (username, password, role) VALUES ('admin', 'dental789', 'admin');

-- Patients (10 tuples)
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Alice', 'Johnson', '1990-05-14', 'Female', '416-555-0101', 'alice.j@email.com', '123 Queen St W, Toronto', 'No known allergies', '2025-01-10');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Bob', 'Smith', '1985-11-22', 'Male', '416-555-0102', 'bob.smith@email.com', '456 King St E, Toronto', 'Penicillin allergy', '2025-01-15');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Carol', 'Williams', '1978-03-08', 'Female', '416-555-0103', 'carol.w@email.com', '789 Bloor St, Toronto', 'Diabetes Type 2', '2025-02-01');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('David', 'Brown', '2000-07-30', 'Male', '416-555-0104', 'david.b@email.com', '321 Yonge St, Toronto', 'None', '2025-02-10');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Emily', 'Davis', '1995-12-01', 'Female', '416-555-0105', 'emily.d@email.com', '654 Dundas St, Toronto', 'Asthma', '2025-02-20');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Frank', 'Garcia', '1988-09-17', 'Male', '416-555-0106', 'frank.g@email.com', '111 Bay St, Toronto', 'Latex allergy', '2025-03-01');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Grace', 'Martinez', '1972-01-25', 'Female', '416-555-0107', 'grace.m@email.com', '222 College St, Toronto', 'Hypertension, on blood thinners', '2025-03-05');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Henry', 'Lee', '2002-06-11', 'Male', '416-555-0108', 'henry.l@email.com', '333 Spadina Ave, Toronto', 'None', '2025-03-10');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('Isabella', 'Wilson', '1993-04-03', 'Female', '416-555-0109', 'isabella.w@email.com', '444 Bathurst St, Toronto', 'Anxiety disorder', '2025-03-15');
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, medical_history, registration_date) VALUES
('James', 'Taylor', '1980-08-19', 'Male', '416-555-0110', 'james.t@email.com', '555 St Clair Ave, Toronto', 'Previous jaw surgery (2018)', '2025-03-20');

-- Dentists (4 tuples)
INSERT INTO dentist (first_name, last_name, specialization, phone, email, working_days) VALUES
('Sarah', 'Chen', 'General Dentistry', '416-555-0201', 'dr.chen@dentalclinic.com', 'Monday,Tuesday,Wednesday,Thursday,Friday');
INSERT INTO dentist (first_name, last_name, specialization, phone, email, working_days) VALUES
('Michael', 'Patel', 'Orthodontics', '416-555-0202', 'dr.patel@dentalclinic.com', 'Monday,Wednesday,Friday');
INSERT INTO dentist (first_name, last_name, specialization, phone, email, working_days) VALUES
('Lisa', 'Nguyen', 'Periodontics', '416-555-0203', 'dr.nguyen@dentalclinic.com', 'Tuesday,Thursday,Friday');
INSERT INTO dentist (first_name, last_name, specialization, phone, email, working_days) VALUES
('Robert', 'Kim', 'Endodontics', '416-555-0204', 'dr.kim@dentalclinic.com', 'Monday,Tuesday,Thursday');

-- Appointments (10 tuples)
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(1, 1, '2026-03-06', '09:00:00', 30, 'Scheduled', 'Routine checkup');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(2, 1, '2026-03-06', '10:00:00', 45, 'Scheduled', 'Crown fitting follow-up');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(3, 2, '2026-03-06', '09:30:00', 60, 'Scheduled', 'Braces adjustment');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(4, 3, '2026-03-07', '11:00:00', 30, 'Scheduled', 'Gum assessment');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(5, 1, '2026-03-07', '14:00:00', 45, 'Scheduled', 'Tooth extraction consultation');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(1, 2, '2026-02-20', '10:00:00', 30, 'Completed', 'Orthodontic consultation');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(6, 4, '2026-02-25', '09:00:00', 60, 'Completed', 'Root canal treatment');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(7, 1, '2026-02-28', '15:00:00', 30, 'Completed', 'Routine cleaning');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(8, 3, '2026-03-01', '10:30:00', 45, 'Cancelled', 'Deep cleaning - patient cancelled');
INSERT INTO appointment (patient_id, dentist_id, appointment_date, appointment_time, duration, status, notes) VALUES
(9, 2, '2026-03-10', '13:00:00', 30, 'Scheduled', 'Retainer fitting');

-- Inventory (10 tuples)
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Disposable Gloves (Box)', 'PPE', 45, 12.99, 20, 'MedSupply Inc.', '2026-02-15');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Face Masks (Box)', 'PPE', 30, 15.99, 15, 'MedSupply Inc.', '2026-02-15');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Dental Composite Resin', 'Restorative', 8, 89.99, 10, 'DentalDirect', '2026-01-20');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Anesthetic Cartridges (Box)', 'Anesthesia', 5, 45.00, 8, 'PharmaPlus', '2026-02-01');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Dental Mirrors', 'Instruments', 25, 8.50, 10, 'DentalDirect', '2026-02-10');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('X-Ray Film (Pack)', 'Imaging', 12, 35.00, 5, 'ImagingPro', '2026-01-25');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Fluoride Varnish', 'Preventive', 3, 55.00, 5, 'PharmaPlus', '2026-01-10');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Orthodontic Brackets (Set)', 'Orthodontic', 15, 120.00, 5, 'OrthoSupply', '2026-02-20');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Impression Material', 'Prosthetics', 6, 42.00, 8, 'DentalDirect', '2026-02-05');
INSERT INTO inventory (item_name, category, quantity, unit_price, reorder_level, supplier, last_restocked) VALUES
('Sterilization Pouches (Box)', 'Sterilization', 20, 18.50, 10, 'MedSupply Inc.', '2026-02-18');

-- Billing (8 tuples)
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(1, 6, 150.00, 150.00, 'Credit Card', 'Paid', '2026-02-20');
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(6, 7, 850.00, 850.00, 'Insurance', 'Paid', '2026-02-25');
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(7, 8, 120.00, 120.00, 'Debit Card', 'Paid', '2026-02-28');
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(3, NULL, 200.00, 0.00, NULL, 'Pending', '2026-03-01');
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(5, NULL, 350.00, 0.00, NULL, 'Pending', '2026-02-05');
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(2, NULL, 175.00, 100.00, 'Cash', 'Pending', '2026-01-15');
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(4, NULL, 95.00, 0.00, NULL, 'Overdue', '2026-01-01');
INSERT INTO billing (patient_id, appointment_id, total_amount, amount_paid, payment_method, payment_status, billing_date) VALUES
(9, NULL, 280.00, 0.00, NULL, 'Pending', '2026-03-02');

-- Visits (4 tuples)
INSERT INTO visit (appointment_id, chief_complaint, findings, diagnosis, treatment_plan, created_at) VALUES
(6, 'Teeth misalignment concerns', 'Mild crowding upper arch', 'Malocclusion Class I', 'Recommend Invisalign treatment plan', '2026-02-20 10:30:00');
INSERT INTO visit (appointment_id, chief_complaint, findings, diagnosis, treatment_plan, created_at) VALUES
(7, 'Severe toothache lower right', 'Pulp necrosis tooth #30', 'Irreversible pulpitis', 'Root canal therapy completed', '2026-02-25 10:00:00');
INSERT INTO visit (appointment_id, chief_complaint, findings, diagnosis, treatment_plan, created_at) VALUES
(8, 'Routine cleaning', 'Mild calculus buildup', 'Gingivitis', 'Professional cleaning completed, recommend flossing daily', '2026-02-28 15:30:00');

-- Services (5 tuples)
INSERT INTO clinic_service (visit_id, service_name, description, unit_cost, quantity, linked_inventory_item_id) VALUES
(1, 'Consultation', 'Orthodontic evaluation and imaging', 150.00, 1, NULL);
INSERT INTO clinic_service (visit_id, service_name, description, unit_cost, quantity, linked_inventory_item_id) VALUES
(2, 'Root Canal', 'Root canal therapy on tooth #30', 650.00, 1, 4);
INSERT INTO clinic_service (visit_id, service_name, description, unit_cost, quantity, linked_inventory_item_id) VALUES
(2, 'Dental X-Ray', 'Periapical radiograph', 75.00, 2, 6);
INSERT INTO clinic_service (visit_id, service_name, description, unit_cost, quantity, linked_inventory_item_id) VALUES
(2, 'Anesthesia', 'Local anesthesia administration', 50.00, 1, 4);
INSERT INTO clinic_service (visit_id, service_name, description, unit_cost, quantity, linked_inventory_item_id) VALUES
(3, 'Dental Cleaning', 'Professional prophylaxis', 120.00, 1, NULL);

-- Inventory Log (5 tuples)
INSERT INTO inventory_log (item_id, change_type, quantity_changed, previous_qty, new_qty, reason, changed_at) VALUES
(1, 'Restock', 30, 15, 45, 'Monthly restock', '2026-02-15 09:00:00');
INSERT INTO inventory_log (item_id, change_type, quantity_changed, previous_qty, new_qty, reason, changed_at) VALUES
(3, 'Consume', 2, 10, 8, 'Treatment Use', '2026-02-18 14:00:00');
INSERT INTO inventory_log (item_id, change_type, quantity_changed, previous_qty, new_qty, reason, changed_at) VALUES
(4, 'Auto-Deducted by Visit', 1, 6, 5, 'Service usage auto-deduction', '2026-02-25 10:00:00');
INSERT INTO inventory_log (item_id, change_type, quantity_changed, previous_qty, new_qty, reason, changed_at) VALUES
(7, 'Consume', 2, 5, 3, 'Expired stock removed', '2026-02-20 11:00:00');
INSERT INTO inventory_log (item_id, change_type, quantity_changed, previous_qty, new_qty, reason, changed_at) VALUES
(9, 'Restock', 6, 0, 6, 'New stock arrival', '2026-02-05 08:30:00');
